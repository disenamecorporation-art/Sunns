/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, User as UserIcon, Phone, 
  ArrowLeft, Eye, EyeOff, CheckCircle2, 
  AlertCircle, LogIn, UserPlus, KeyRound, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';
import { 
  authenticateUser, registerNewUser, 
  requestPasswordReset, resetPasswordWithCode 
} from '../../lib/userService';

interface AuthFormsProps {
  onLoginSuccess: (user: User) => void;
  initialMode?: 'login' | 'register' | 'forgot';
  initialEmail?: string;
  activeCoupon?: { code: string; discountPercent: number; description: string } | null;
}

export default function AuthForms({ 
  onLoginSuccess, 
  initialMode = 'login', 
  initialEmail = '',
  activeCoupon 
}: AuthFormsProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'reset_code'>(initialMode);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState(initialEmail);
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState(initialEmail);
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Forgot / Reset Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialMode) setAuthMode(initialMode);
    if (initialEmail) {
      setLoginEmail(initialEmail);
      setRegEmail(initialEmail);
      setForgotEmail(initialEmail);
    }
  }, [initialMode, initialEmail]);

  // 1. Iniciar Sesión
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await authenticateUser(loginEmail.trim(), loginPassword);
    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMsg('¡Bienvenido!');
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 300);
    } else {
      setErrorMsg(res.error || 'Correo o contraseña incorrectos.');
    }
  };

  // 2. Registro
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    const res = await registerNewUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      setSuccessMsg('¡Cuenta creada exitosamente!');
      setTimeout(() => {
        onLoginSuccess(res.user!);
      }, 350);
    } else {
      setErrorMsg(res.error || 'No se pudo crear la cuenta.');
    }
  };

  // 3. Olvidé contraseña - Enviar código
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await requestPasswordReset(forgotEmail.trim());
    setIsLoading(false);

    if (res.success) {
      setSimulatedCode(res.code || null);
      setSuccessMsg('Código generado para tu cuenta.');
      setAuthMode('reset_code');
    } else {
      setErrorMsg(res.error || 'Correo no encontrado.');
    }
  };

  // 4. Resetear contraseña con código
  const handleResetCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    const res = await resetPasswordWithCode(forgotEmail.trim(), resetCode.trim(), newPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('¡Contraseña actualizada correctamente!');
      setTimeout(async () => {
        const loginRes = await authenticateUser(forgotEmail.trim(), newPassword);
        if (loginRes.success && loginRes.user) {
          onLoginSuccess(loginRes.user);
        } else {
          setAuthMode('login');
        }
      }, 600);
    } else {
      setErrorMsg(res.error || 'Error al actualizar contraseña.');
    }
  };

  return (
    <div className="w-full relative font-['Montserrat',sans-serif]">
      
      {/* Super Dark Glass Pop-up Card - Pure Monochrome Luxury */}
      <div className="relative rounded-3xl p-7 sm:p-10 bg-neutral-950/80 backdrop-blur-2xl border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white overflow-hidden">
        
        {/* Top internal glass reflection */}
        <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Tab Switcher (Glass Tabs - Minimalist Monochrome) */}
        {(authMode === 'login' || authMode === 'register') && (
          <div className="flex bg-white/5 backdrop-blur-xl p-1 rounded-2xl mb-8 border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-light rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-neutral-950 shadow-md font-normal'
                  : 'text-neutral-400 hover:text-white font-extralight hover:bg-white/5'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Iniciar Sesión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-light rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-neutral-950 shadow-md font-normal'
                  : 'text-neutral-400 hover:text-white font-extralight hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Registrarse</span>
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-3.5 rounded-2xl text-xs font-light flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 stroke-[1.5]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMsg && (
          <div className="mb-6 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-200 p-3.5 rounded-2xl text-xs font-light flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 stroke-[1.5]" />
            <span>{successMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          
          {/* ===================== VIEW 1: LOGIN ===================== */}
          {authMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-[0.15em] text-white uppercase">
                  Iniciar Sesión
                </h2>
                <p className="text-xs font-light tracking-wide text-neutral-400">
                  Ingresa con tu correo y contraseña
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 focus:ring-1 focus:ring-white/30 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                      Contraseña
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(loginEmail);
                        setAuthMode('forgot');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[11px] font-light tracking-wider text-neutral-400 hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <input
                      type={showLoginPass ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 focus:ring-1 focus:ring-white/30 rounded-2xl pl-11 pr-11 py-3.5 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-white cursor-pointer transition-colors"
                    >
                      {showLoginPass ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-950 py-4 rounded-2xl font-light uppercase tracking-[0.25em] text-xs transition-all shadow-lg hover:shadow-white/10 cursor-pointer flex items-center justify-center gap-2 mt-6 disabled:opacity-60 hover:scale-[1.01]"
                >
                  <LogIn className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>{isLoading ? 'Iniciando...' : 'Iniciar Sesión'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* ===================== VIEW 2: REGISTER ===================== */}
          {authMode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-[0.15em] text-white uppercase">
                  Crear Cuenta
                </h2>
                <p className="text-xs font-light tracking-wide text-neutral-400">
                  Regístrate para gestionar tus pedidos y recetas
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <UserIcon className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre y apellido"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Mail className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="tu@correo.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl pl-10 pr-3 py-3 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                      Teléfono (Opcional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Phone className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <input
                        type="tel"
                        placeholder="+1 000 000 0000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl pl-10 pr-3 py-3 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Lock className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl pl-10 pr-8 py-3 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                      >
                        {showRegPass ? <EyeOff className="w-3.5 h-3.5 stroke-[1.5]" /> : <Eye className="w-3.5 h-3.5 stroke-[1.5]" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                      Confirmar
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                        <Lock className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <input
                        type={showRegPass ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl pl-10 pr-3 py-3 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-950 py-4 rounded-2xl font-light uppercase tracking-[0.25em] text-xs transition-all shadow-lg hover:shadow-white/10 cursor-pointer flex items-center justify-center gap-2 mt-5 disabled:opacity-60 hover:scale-[1.01]"
                >
                  <UserPlus className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>{isLoading ? 'Registrando...' : 'Crear Cuenta'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* ===================== VIEW 3: FORGOT PASSWORD ===================== */}
          {authMode === 'forgot' && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="inline-flex items-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Volver al login</span>
              </button>

              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-[0.15em] text-white uppercase">
                  Recuperar Clave
                </h2>
                <p className="text-xs font-light tracking-wide text-neutral-400">
                  Te enviaremos un código de verificación
                </p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                      <Mail className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-light text-white placeholder:text-neutral-600 transition-all outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-950 py-4 rounded-2xl font-light uppercase tracking-[0.25em] text-xs transition-all shadow-lg hover:shadow-white/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01]"
                >
                  <KeyRound className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>{isLoading ? 'Enviando...' : 'Enviar Código'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* ===================== VIEW 4: RESET CODE ===================== */}
          {authMode === 'reset_code' && (
            <motion.div
              key="reset_code"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <button
                type="button"
                onClick={() => setAuthMode('forgot')}
                className="inline-flex items-center gap-2 text-[11px] font-light uppercase tracking-[0.2em] text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>Cambiar correo</span>
              </button>

              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extralight tracking-[0.15em] text-white uppercase">
                  Ingresar Código
                </h2>
                <p className="text-xs font-light tracking-wide text-neutral-400">
                  Para: <strong className="text-white font-normal">{forgotEmail}</strong>
                </p>
              </div>

              {simulatedCode && (
                <div className="bg-white/5 backdrop-blur-md border border-white/15 text-white p-3.5 rounded-2xl text-center space-y-1">
                  <span className="text-[10px] font-light uppercase tracking-[0.2em] block text-neutral-400">
                    Código de verificación
                  </span>
                  <div className="text-2xl font-mono font-light tracking-[0.3em] text-white">
                    {simulatedCode}
                  </div>
                </div>
              )}

              <form onSubmit={handleResetCodeSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                    Código
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="888888"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl px-4 py-3 text-center font-mono text-xl font-light text-white tracking-[0.3em] transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl px-4 py-3 text-sm font-light text-white transition-all outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-light uppercase tracking-[0.18em] text-neutral-300">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repite la contraseña"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/15 focus:border-white focus:bg-white/10 rounded-2xl px-4 py-3 text-sm font-light text-white transition-all outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-neutral-100 text-neutral-950 py-4 rounded-2xl font-light uppercase tracking-[0.25em] text-xs transition-all shadow-lg hover:shadow-white/10 cursor-pointer flex items-center justify-center gap-2 mt-5 disabled:opacity-60 hover:scale-[1.01]"
                >
                  <KeyRound className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>{isLoading ? 'Actualizando...' : 'Restablecer Clave'}</span>
                </button>
              </form>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
