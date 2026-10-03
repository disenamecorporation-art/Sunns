/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, Mail, KeyRound, 
  CheckCircle2, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';
import { changeUserEmail, changeUserPassword } from '../../lib/userService';

interface SecurityTabProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export default function SecurityTab({ currentUser, onUpdateUser }: SecurityTabProps) {
  // Email Form
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPass, setEmailCurrentPass] = useState('');
  const [emailMsg, setEmailMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Password Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Password Strength Meter
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Vacía', color: 'bg-neutral-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Débil', color: 'bg-red-500' };
    if (score === 2) return { score: 50, label: 'Media', color: 'bg-neutral-500' };
    if (score === 3) return { score: 75, label: 'Fuerte', color: 'bg-neutral-800' };
    return { score: 100, label: 'Excelente', color: 'bg-green-600' };
  };

  const strength = getPasswordStrength(newPass);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);

    if (!newEmail || !emailCurrentPass) {
      setEmailMsg({ text: 'Por favor complete todos los campos.', type: 'error' });
      return;
    }

    setIsUpdatingEmail(true);
    const res = await changeUserEmail(currentUser.id, newEmail, emailCurrentPass);
    setIsUpdatingEmail(false);

    if (res.success && res.user) {
      onUpdateUser(res.user);
      setEmailMsg({ text: '¡Correo electrónico actualizado con éxito!', type: 'success' });
      setNewEmail('');
      setEmailCurrentPass('');
    } else {
      setEmailMsg({ text: res.error || 'Error al actualizar el correo.', type: 'error' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    if (!currentPass || !newPass || !confirmNewPass) {
      setPassMsg({ text: 'Por favor complete todos los campos de contraseña.', type: 'error' });
      return;
    }

    if (newPass.length < 6) {
      setPassMsg({ text: 'La nueva contraseña debe tener al menos 6 caracteres.', type: 'error' });
      return;
    }

    if (newPass !== confirmNewPass) {
      setPassMsg({ text: 'Las nuevas contraseñas no coinciden.', type: 'error' });
      return;
    }

    setIsUpdatingPass(true);
    const res = await changeUserPassword(currentUser.id, currentPass, newPass);
    setIsUpdatingPass(false);

    if (res.success) {
      setPassMsg({ text: '¡Contraseña actualizada exitosamente!', type: 'success' });
      setCurrentPass('');
      setNewPass('');
      setConfirmNewPass('');
    } else {
      setPassMsg({ text: res.error || 'Error al actualizar la contraseña.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 text-black">
      
      {/* Header */}
      <div className="border-b border-neutral-300 pb-4">
        <h3 className="text-xl font-bold text-black flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-black stroke-[2]" />
          Seguridad y Credenciales
        </h3>
        <p className="text-xs font-semibold text-black mt-0.5">
          Modifica tu dirección de correo electrónico y clave de acceso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Change Email Form */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
            <Mail className="w-4 h-4 text-black stroke-[2]" />
            <h4 className="font-bold text-sm text-black">Actualizar Correo Electrónico</h4>
          </div>

          <div className="text-xs text-neutral-800 font-medium">
            Correo actual: <strong className="text-black font-mono font-bold">{currentUser.email}</strong>
          </div>

          {emailMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-semibold ${
              emailMsg.type === 'success' 
                ? 'bg-green-50 border border-green-300 text-green-900' 
                : 'bg-red-50 border border-red-300 text-red-800'
            }`}>
              {emailMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-green-700 stroke-[2]" /> : <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />}
              <span>{emailMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-black">Nuevo Correo Electrónico</label>
              <input
                type="email"
                required
                placeholder="nuevo.email@ejemplo.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-black">Contraseña Actual para Confirmar</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={emailCurrentPass}
                onChange={(e) => setEmailCurrentPass(e.target.value)}
                className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingEmail}
              className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-900 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isUpdatingEmail ? 'Actualizando...' : 'Guardar Nuevo Correo'}
            </button>
          </form>
        </div>

        {/* 2. Change Password Form */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
            <KeyRound className="w-4 h-4 text-black stroke-[2]" />
            <h4 className="font-bold text-sm text-black">Modificar Contraseña</h4>
          </div>

          {passMsg && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 font-semibold ${
              passMsg.type === 'success' 
                ? 'bg-green-50 border border-green-300 text-green-900' 
                : 'bg-red-50 border border-red-300 text-red-800'
            }`}>
              {passMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-green-700 stroke-[2]" /> : <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />}
              <span>{passMsg.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-black">Contraseña Actual</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-black">Nueva Contraseña</label>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-xs text-black font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5 stroke-[2]" /> : <Eye className="w-3.5 h-3.5 stroke-[2]" />}
                  <span>{showPass ? 'Ocultar' : 'Mostrar'}</span>
                </button>
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
              />

              {/* Password strength meter */}
              {newPass && (
                <div className="pt-1 space-y-1">
                  <div className="flex justify-between text-[10px] text-black font-semibold">
                    <span>Seguridad: <strong>{strength.label}</strong></span>
                    <span>{strength.score}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: `${strength.score}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-black">Confirmar Nueva Contraseña</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Repita la nueva contraseña"
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
                className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPass}
              className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-900 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {isUpdatingPass ? 'Guardando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
