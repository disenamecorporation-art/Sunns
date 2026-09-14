/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, Award, MapPin, Receipt, Gift, Crown, HelpCircle, 
  Lock, Mail, Eye, EyeOff, User as UserIcon, Plus, Trash2, Edit3, Save, Check, FolderPlus, ArrowLeft, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, Subcategory, User } from '../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

export default function AccountModal({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  products,
  setProducts,
  categories,
  setCategories,
}: AccountModalProps) {
  // Authentication UI Mode: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  
  // Auth Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // User Dashboard Tabs: 'profile' | 'orders' | 'security'
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'security'>('profile');
  
  // Security Form Inputs
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ text: '', type: 'success' as 'success' | 'error' });

  // Admin Panel Tab: 'products' | 'categories'
  const [adminTab, setAdminTab] = useState<'products' | 'categories'>('products');

  // Admin Products management state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    id: '',
    name: '',
    price: 150,
    category: '',
    subcategory: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
    colors: [{ name: 'Negro', value: '#1A1A1A' }],
    inStock: true,
    featured: false,
  });

  // Admin Categories management state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catFormName, setCatFormName] = useState('');
  const [newSubcatName, setNewSubcatName] = useState('');

  // Mock initial users in localStorage if not exists
  useEffect(() => {
    const savedUsers = localStorage.getItem('sunns_registered_users');
    if (!savedUsers) {
      const initialUsers = [
        { email: 'admin@sunnsshop.com', password: 'admin123', role: 'admin' },
        { email: 'user@sunnsshop.com', password: 'password123', role: 'user' }
      ];
      localStorage.setItem('sunns_registered_users', JSON.stringify(initialUsers));
    }
  }, []);

  // Sync state helpers
  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('sunns_registered_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveRegisteredUsers = (usersList: any[]) => {
    localStorage.setItem('sunns_registered_users', JSON.stringify(usersList));
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email || !password) {
      setAuthError('Por favor complete todos los campos.');
      return;
    }

    const users = getRegisteredUsers();
    const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!found || found.password !== password) {
      setAuthError('Credenciales incorrectas. Intente de nuevo.');
      return;
    }

    // Success login
    const loggedUser: User = { email: found.email, role: found.role };
    setCurrentUser(loggedUser);
    setAuthSuccess('¡Inicio de sesión exitoso!');
    setEmail('');
    setPassword('');
    // reset tab
    setActiveTab('profile');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email || !password || !confirmPassword) {
      setAuthError('Por favor complete todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Las contraseñas no coinciden.');
      return;
    }

    const users = getRegisteredUsers();
    const exists = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      setAuthError('Este correo ya se encuentra registrado.');
      return;
    }

    // Add new user
    const newUser = { email: email.toLowerCase(), password, role: 'user' as const };
    users.push(newUser);
    saveRegisteredUsers(users);

    setAuthSuccess('¡Registro completado! Ya puede iniciar sesión.');
    setAuthMode('login');
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email) {
      setAuthError('Por favor introduce tu dirección de correo.');
      return;
    }

    setAuthSuccess('Se ha enviado un enlace de recuperación a ' + email);
    setTimeout(() => {
      setAuthMode('login');
      setAuthSuccess('');
    }, 4000);
  };

  // Dashboard normal user handlers
  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg({ text: '', type: 'success' });

    if (!newEmail) {
      setSecurityMsg({ text: 'Por favor introduce un correo válido.', type: 'error' });
      return;
    }

    const users = getRegisteredUsers();
    const userIdx = users.findIndex((u: any) => u.email.toLowerCase() === currentUser?.email.toLowerCase());

    if (userIdx > -1) {
      users[userIdx].email = newEmail.toLowerCase();
      saveRegisteredUsers(users);
      setCurrentUser({ ...currentUser!, email: newEmail.toLowerCase() });
      setSecurityMsg({ text: '¡Correo electrónico actualizado con éxito!', type: 'success' });
      setNewEmail('');
    } else {
      setSecurityMsg({ text: 'Error al actualizar el correo.', type: 'error' });
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg({ text: '', type: 'success' });

    if (!newPassword || !confirmNewPassword) {
      setSecurityMsg({ text: 'Por favor rellene todos los campos.', type: 'error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSecurityMsg({ text: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }

    const users = getRegisteredUsers();
    const userIdx = users.findIndex((u: any) => u.email.toLowerCase() === currentUser?.email.toLowerCase());

    if (userIdx > -1) {
      users[userIdx].password = newPassword;
      saveRegisteredUsers(users);
      setSecurityMsg({ text: '¡Contraseña actualizada con éxito!', type: 'success' });
      setNewPassword('');
      setConfirmNewPassword('');
    } else {
      setSecurityMsg({ text: 'Error al actualizar la contraseña.', type: 'error' });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onClose();
  };

  // Admin Products functions
  const resetProdForm = () => {
    setEditingProductId(null);
    setProdForm({
      id: '',
      name: '',
      price: 150,
      category: categories[0]?.name || 'Sol',
      subcategory: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
      colors: [{ name: 'Negro', value: '#1A1A1A' }],
      inStock: true,
      featured: false,
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.category) {
      alert('Por favor introduzca el nombre y categoría.');
      return;
    }

    if (editingProductId) {
      // Edit
      const updated = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: prodForm.name,
            price: Number(prodForm.price),
            category: prodForm.category,
            subcategory: prodForm.subcategory || undefined,
            description: prodForm.description,
            image: prodForm.image,
            images: [prodForm.image],
            inStock: prodForm.inStock,
            featured: prodForm.featured,
          };
        }
        return p;
      });
      setProducts(updated);
    } else {
      // Add new
      const newId = 'prod-' + Math.random().toString(36).substr(2, 9);
      const newProduct: Product = {
        id: newId,
        name: prodForm.name,
        price: Number(prodForm.price),
        category: prodForm.category,
        subcategory: prodForm.subcategory || undefined,
        description: prodForm.description,
        details: [
          'Protección 100% UVA/UVB (Filtro UV400)',
          'Acetato premium pulido artesanalmente',
          'Bisagras reforzadas de alta gama',
          'Estuche protector de cuero rígido Sunns'
        ],
        image: prodForm.image,
        images: [prodForm.image],
        colors: prodForm.colors,
        inStock: prodForm.inStock,
        featured: prodForm.featured,
        rating: 4.8,
        reviewsCount: 1,
      };
      setProducts([newProduct, ...products]);
    }
    resetProdForm();
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta pieza premium?')) {
      setProducts(products.filter((p) => p.id !== prodId));
    }
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdForm({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      subcategory: p.subcategory || '',
      description: p.description,
      image: p.image,
      colors: p.colors,
      inStock: p.inStock,
      featured: p.featured,
    });
  };

  // Admin Categories functions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim()) return;

    const catId = 'cat-' + Date.now();
    const newCat: Category = {
      id: catId,
      name: catFormName.trim(),
      subcategories: [],
    };

    setCategories([...categories, newCat]);
    setCatFormName('');
  };

  const handleEditCategoryName = (catId: string, newName: string) => {
    if (!newName.trim()) return;
    setCategories(
      categories.map((c) => (c.id === catId ? { ...c, name: newName.trim() } : c))
    );
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('¿Desea eliminar esta categoría? También afectará a las piezas asociadas.')) {
      setCategories(categories.filter((c) => c.id !== catId));
    }
  };

  const handleAddSubcategory = (catId: string) => {
    if (!newSubcatName.trim()) return;
    const subId = 'sub-' + Date.now();
    const newSub: Subcategory = { id: subId, name: newSubcatName.trim() };

    setCategories(
      categories.map((c) => {
        if (c.id === catId) {
          return { ...c, subcategories: [...c.subcategories, newSub] };
        }
        return c;
      })
    );
    setNewSubcatName('');
  };

  const handleDeleteSubcategory = (catId: string, subId: string) => {
    setCategories(
      categories.map((c) => {
        if (c.id === catId) {
          return { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) };
        }
        return c;
      })
    );
  };

  // Dummy order history for VIP badge display
  const ordersHistory = [
    {
      id: 'SUNNS-482015',
      date: '10 de Julio, 2026',
      total: 380,
      status: 'Entregado',
      items: '2x Nox Minimal (Negro Carbón)',
    },
    {
      id: 'SUNNS-127593',
      date: '24 de Febrero, 2026',
      total: 210,
      status: 'Entregado',
      items: '1x Aurelia Vintage (Oro Pulido)',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#0f0907]/75 backdrop-blur-md flex items-center justify-center p-4">
          
          {/* Glass Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl border border-white/40 flex flex-col max-h-[90vh] text-[#1a120e]"
            id="account-modal-card"
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#efeae0]/60 flex items-center justify-between bg-[#faf9f6]/80">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#1a120e]" />
                <h2 className="font-serif-elegant text-base font-bold text-[#1a120e] tracking-wide">
                  {currentUser 
                    ? currentUser.role === 'admin' ? 'Boutique Manager (Panel Admin)' : 'Club Sunns Privé'
                    : 'Acceso Socios Club Sunns'
                  }
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[#efeae0] text-[#1a120e] transition-colors focus:outline-none cursor-pointer"
                id="close-account-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* IF NOT LOGGED IN: SHOW BEAUTIFUL ANIMATED GLASS LOGIN/REGISTRATION */}
            {!currentUser ? (
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {authMode === 'login' && (
                    <motion.div
                      key="login-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 max-w-md mx-auto w-full"
                    >
                      <div className="text-center space-y-2">
                        <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#1a120e]/60">Socio VIP</span>
                        <h3 className="font-serif-elegant text-2xl font-bold">Identificación</h3>
                        <p className="text-[11px] text-[#1a120e]/50 font-light">Inicie sesión para acceder a su perfil prestige y gestionar pedidos.</p>
                      </div>

                      {authError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-3 rounded-lg text-xs font-light text-center">
                          {authError}
                        </div>
                      )}
                      {authSuccess && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-700 p-3 rounded-lg text-xs font-light text-center">
                          {authSuccess}
                        </div>
                      )}

                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="socio@sunnsshop.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/60 border border-[#efeae0] rounded-xl px-4 py-3 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] focus:bg-white transition-all shadow-inner"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1.5">
                              <Lock className="w-3.5 h-3.5" /> Contraseña
                            </label>
                            <button
                              type="button"
                              onClick={() => setAuthMode('forgot')}
                              className="text-[10px] text-[#1a120e]/50 hover:text-black transition-colors"
                            >
                              ¿Olvidaste tu contraseña?
                            </button>
                          </div>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white/60 border border-[#efeae0] rounded-xl pl-4 pr-10 py-3 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] focus:bg-white transition-all shadow-inner"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#1a120e]/40 hover:text-black cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#000000' }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-[#1a120e] text-[#f5f0e6] text-xs font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow-lg shadow-[#1a120e]/10 mt-2 transition-all flex items-center justify-center gap-2"
                        >
                          <Crown className="w-4 h-4 shrink-0" />
                          Ingresar al Club Privé
                        </motion.button>
                      </form>

                      <div className="pt-4 border-t border-[#efeae0]/60 text-center">
                        <p className="text-[11px] text-[#1a120e]/60 font-light">
                          ¿No es miembro de Club Sunns?{' '}
                          <button
                            onClick={() => { setAuthMode('register'); setAuthError(''); setAuthSuccess(''); }}
                            className="font-bold underline text-[#1a120e] cursor-pointer"
                          >
                            Registrarse ahora
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {authMode === 'register' && (
                    <motion.div
                      key="register-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 max-w-md mx-auto w-full"
                    >
                      <div className="text-center space-y-2">
                        <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-[#1a120e]/60">VIP Registro</span>
                        <h3 className="font-serif-elegant text-2xl font-bold">Unirse al Club</h3>
                        <p className="text-[11px] text-[#1a120e]/50 font-light">Cree su cuenta prestige para recibir estuches exclusivos de cortesía.</p>
                      </div>

                      {authError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-3 rounded-lg text-xs font-light text-center">
                          {authError}
                        </div>
                      )}

                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Correo Electrónico
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="ejemplo@icloud.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/60 border border-[#efeae0] rounded-xl px-4 py-3 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] focus:bg-white transition-all shadow-inner"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Contraseña
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/60 border border-[#efeae0] rounded-xl px-4 py-3 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] focus:bg-white transition-all shadow-inner"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Confirmar Contraseña
                          </label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-white/60 border border-[#efeae0] rounded-xl px-4 py-3 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] focus:bg-white transition-all shadow-inner"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#000000' }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-[#1a120e] text-[#f5f0e6] text-xs font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow-lg shadow-[#1a120e]/10 mt-2 transition-all"
                        >
                          Crear Cuenta Prestige
                        </motion.button>
                      </form>

                      <div className="pt-4 border-t border-[#efeae0]/60 text-center">
                        <p className="text-[11px] text-[#1a120e]/60 font-light">
                          ¿Ya tiene una cuenta de socio?{' '}
                          <button
                            onClick={() => { setAuthMode('login'); setAuthError(''); setAuthSuccess(''); }}
                            className="font-bold underline text-[#1a120e] cursor-pointer"
                          >
                            Iniciar sesión
                          </button>
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {authMode === 'forgot' && (
                    <motion.div
                      key="forgot-form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 max-w-md mx-auto w-full"
                    >
                      <button
                        onClick={() => setAuthMode('login')}
                        className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1 hover:text-black mb-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Login
                      </button>

                      <div className="text-center space-y-2">
                        <h3 className="font-serif-elegant text-2xl font-bold">Restablecer Acceso</h3>
                        <p className="text-[11px] text-[#1a120e]/50 font-light">Suministre su correo corporativo o personal para recibir las instrucciones de restablecimiento de contraseña.</p>
                      </div>

                      {authError && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-3 rounded-lg text-xs font-light text-center">
                          {authError}
                        </div>
                      )}
                      {authSuccess && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-700 p-3 rounded-lg text-xs font-light text-center">
                          {authSuccess}
                        </div>
                      )}

                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-[#1a120e]/60 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Correo Electrónico de Registro
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="socio@sunnsshop.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/60 border border-[#efeae0] rounded-xl px-4 py-3 text-xs text-[#1a120e] focus:outline-none focus:border-[#1a120e] focus:bg-white transition-all shadow-inner"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: '#000000' }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="w-full bg-[#1a120e] text-[#f5f0e6] text-xs font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow-lg shadow-[#1a120e]/10 mt-2 transition-all flex items-center justify-center gap-2"
                        >
                          <KeyRound className="w-4 h-4" />
                          Enviar Instrucciones
                        </motion.button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* IF USER IS LOGGED IN: SHOW DASHBOARD */
              <div className="flex-grow flex flex-col overflow-hidden">
                
                {/* ADMIN TABS VS USER TABS */}
                {currentUser.role === 'admin' ? (
                  <div className="flex border-b border-[#efeae0]/60 text-xs bg-[#faf9f6]/40">
                    <button
                      onClick={() => setAdminTab('products')}
                      className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold transition-all focus:outline-none cursor-pointer ${
                        adminTab === 'products'
                          ? 'border-b-2 border-[#1a120e] text-[#1a120e] font-bold'
                          : 'text-[#1a120e]/40 hover:text-[#1a120e]/80'
                      }`}
                    >
                      Gestionar Piezas (${products.length})
                    </button>
                    <button
                      onClick={() => setAdminTab('categories')}
                      className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold transition-all focus:outline-none cursor-pointer ${
                        adminTab === 'categories'
                          ? 'border-b-2 border-[#1a120e] text-[#1a120e] font-bold'
                          : 'text-[#1a120e]/40 hover:text-[#1a120e]/80'
                      }`}
                    >
                      Categorías y Subcategorías
                    </button>
                  </div>
                ) : (
                  <div className="flex border-b border-[#efeae0]/60 text-xs bg-[#faf9f6]/40">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold transition-all focus:outline-none cursor-pointer ${
                        activeTab === 'profile'
                          ? 'border-b-2 border-[#1a120e] text-[#1a120e] font-bold'
                          : 'text-[#1a120e]/40 hover:text-[#1a120e]/80'
                      }`}
                    >
                      Mi Perfil VIP
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold transition-all focus:outline-none cursor-pointer ${
                        activeTab === 'orders'
                          ? 'border-b-2 border-[#1a120e] text-[#1a120e] font-bold'
                          : 'text-[#1a120e]/40 hover:text-[#1a120e]/80'
                      }`}
                    >
                      Historial Órdenes
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex-1 py-3 text-center uppercase tracking-wider font-semibold transition-all focus:outline-none cursor-pointer ${
                        activeTab === 'security'
                          ? 'border-b-2 border-[#1a120e] text-[#1a120e] font-bold'
                          : 'text-[#1a120e]/40 hover:text-[#1a120e]/80'
                      }`}
                    >
                      Seguridad y Datos
                    </button>
                  </div>
                )}

                {/* MODAL MAIN CONTENT FOR LOGGED USERS */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs">
                  
                  {/* ====== REGULAR USER VIEWS ====== */}
                  {currentUser.role !== 'admin' && (
                    <>
                      {/* 1. PROFILE VIEW */}
                      {activeTab === 'profile' && (
                        <div className="space-y-6">
                          {/* VIP Badge */}
                          <div className="bg-gradient-to-br from-[#1c120e] to-[#0f0907] p-5 rounded-xl text-[#f5f0e6] relative overflow-hidden flex items-center gap-4 shadow-md">
                            <div className="bg-white/10 p-3 rounded-full border border-white/25 shrink-0">
                              <Award className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] tracking-widest text-white/90 font-bold uppercase">Miembro Prestige Elite</span>
                                <Crown className="w-3.5 h-3.5 text-white fill-white" />
                              </div>
                              <h3 className="font-serif-elegant text-base font-bold text-white">{currentUser.email.split('@')[0].toUpperCase()}</h3>
                              <p className="text-[10px] text-[#f5f0e6]/50">ID de Afiliado: #773-MIA</p>
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-7xl font-serif-elegant font-bold text-white/3 select-none pointer-events-none">
                              SUNNS
                            </div>
                          </div>

                          {/* VIP benefits list */}
                          <div className="space-y-3.5">
                            <h4 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#efeae0] pb-1.5">
                              Mis Beneficios Privé
                            </h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-start gap-2.5 p-3 bg-[#faf9f6] border border-[#efeae0] rounded-lg">
                                <Gift className="w-4 h-4 text-[#1a120e] shrink-0 mt-0.5" />
                                <div>
                                  <h5 className="font-semibold text-[#1a120e]">Regalos Exclusivos</h5>
                                  <p className="text-[10px] text-[#1a120e]/60 font-light mt-0.5 leading-snug">
                                    Acceso prioritario a paños de edición de artista y kits de limpieza premium de cortesía.
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2.5 p-3 bg-[#faf9f6] border border-[#efeae0] rounded-lg">
                                <MapPin className="w-4 h-4 text-[#1a120e] shrink-0 mt-0.5" />
                                <div>
                                  <h5 className="font-semibold text-[#1a120e]">Miami Showroom</h5>
                                  <p className="text-[10px] text-[#1a120e]/60 font-light mt-0.5 leading-snug">
                                    Reserva preferente con estilistas ópticos en nuestra nueva boutique de Miami.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Account Summary Data */}
                          <div className="bg-[#faf9f6] border border-[#efeae0] p-4 rounded-xl space-y-3">
                            <h4 className="text-[9px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#efeae0]/60 pb-1">Datos Principales</h4>
                            <div className="grid grid-cols-2 gap-4 font-light text-[#1a120e]/70">
                              <div>
                                <span className="text-[9px] tracking-widest text-[#1a120e]/45 uppercase font-bold block">Socio</span>
                                <span className="font-semibold text-[#1a120e] truncate block">{currentUser.email}</span>
                              </div>
                              <div>
                                <span className="text-[9px] tracking-widest text-[#1a120e]/45 uppercase font-bold block">Teléfono de Enlace</span>
                                <span className="font-semibold text-[#1a120e]">+1 (786) 825-9355</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. ORDERS TAB */}
                      {activeTab === 'orders' && (
                        <div className="space-y-4">
                          <h4 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#efeae0] pb-1.5">
                            Historial de Órdenes Prestige
                          </h4>

                          {ordersHistory.map((order) => (
                            <div
                              key={order.id}
                              className="bg-white border border-[#efeae0] rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 hover:border-[#1a120e]/30 transition-all"
                              id={`order-card-${order.id}`}
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-serif-elegant font-bold text-sm text-[#1a120e]">{order.id}</span>
                                  <span className="bg-green-500/10 text-green-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {order.status}
                                  </span>
                                </div>
                                <p className="text-[#1a120e]/50 font-light text-[10px]">Realizado el {order.date}</p>
                                <p className="text-[#1a120e]/80 font-medium">{order.items}</p>
                              </div>
                              <div className="sm:text-right flex sm:flex-col justify-between items-end shrink-0">
                                <div>
                                  <span className="text-[8px] uppercase text-[#1a120e]/40 block font-bold">Importe Total</span>
                                  <span className="font-serif-elegant text-base font-bold text-black">${order.total}.00 USD</span>
                                </div>
                                <span className="text-[10px] text-[#1a120e]/60 font-light flex items-center gap-1">
                                  <Receipt className="w-3.5 h-3.5" /> Recibo Digital
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 3. SECURITY & SETTINGS TAB */}
                      {activeTab === 'security' && (
                        <div className="space-y-6">
                          <h4 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#efeae0] pb-1.5">
                            Modificar Datos de Acceso
                          </h4>

                          {securityMsg.text && (
                            <div className={`p-3 rounded-lg text-xs text-center font-light ${
                              securityMsg.type === 'success' 
                                ? 'bg-green-500/10 border border-green-500/30 text-green-700' 
                                : 'bg-red-500/10 border border-red-500/30 text-red-700'
                            }`}>
                              {securityMsg.text}
                            </div>
                          )}

                          {/* Email Form */}
                          <form onSubmit={handleUpdateEmail} className="bg-[#faf9f6] p-4 rounded-xl border border-[#efeae0] space-y-3.5">
                            <h5 className="font-semibold text-xs text-[#1a120e] uppercase tracking-wide">Cambiar Email</h5>
                            <div className="space-y-1.5">
                              <label className="text-[9px] uppercase font-bold text-[#1a120e]/60">Nuevo Correo Electrónico</label>
                              <input
                                type="email"
                                required
                                placeholder="ejemplo.nuevo@icloud.com"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs"
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type="submit"
                              className="bg-[#1a120e] text-[#f5f0e6] font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg cursor-pointer hover:bg-black transition-colors"
                            >
                              Guardar Nuevo Email
                            </motion.button>
                          </form>

                          {/* Password Form */}
                          <form onSubmit={handleUpdatePassword} className="bg-[#faf9f6] p-4 rounded-xl border border-[#efeae0] space-y-3.5">
                            <h5 className="font-semibold text-xs text-[#1a120e] uppercase tracking-wide">Cambiar Contraseña</h5>
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase font-bold text-[#1a120e]/60">Nueva Contraseña</label>
                                <input
                                  type="password"
                                  required
                                  placeholder="Mínimo 6 caracteres"
                                  value={newPassword}
                                  onChange={(e) => setNewPassword(e.target.value)}
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[9px] uppercase font-bold text-[#1a120e]/60">Confirmar Nueva Contraseña</label>
                                <input
                                  type="password"
                                  required
                                  placeholder="Repita la nueva contraseña"
                                  value={confirmNewPassword}
                                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs"
                                />
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type="submit"
                              className="bg-[#1a120e] text-[#f5f0e6] font-semibold text-[10px] uppercase tracking-widest px-4 py-2 rounded-lg cursor-pointer hover:bg-black transition-colors"
                            >
                              Actualizar Contraseña
                            </motion.button>
                          </form>
                        </div>
                      )}
                    </>
                  )}


                  {/* ====== ADMIN EXCLUSIVE VIEWS ====== */}
                  {currentUser.role === 'admin' && (
                    <>
                      {/* A. MANAGE PRODUCTS PANEL */}
                      {adminTab === 'products' && (
                        <div className="space-y-6">
                          
                          {/* Product editing or creation Form */}
                          <div className="bg-[#faf9f6] p-5 rounded-xl border border-[#efeae0] space-y-4">
                            <div className="flex justify-between items-center border-b border-[#efeae0]/60 pb-2">
                              <h4 className="font-serif-elegant font-bold text-sm text-[#1a120e]">
                                {editingProductId ? `Editar Gafas Premium (ID: ${editingProductId})` : 'Añadir Nueva Gafas de Sol/Ópticas'}
                              </h4>
                              {editingProductId && (
                                <button onClick={resetProdForm} className="text-[10px] text-red-600 hover:underline">
                                  Cancelar Edición
                                </button>
                              )}
                            </div>

                            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-[#1a120e]/60">Nombre del Producto</label>
                                <input
                                  type="text"
                                  required
                                  value={prodForm.name}
                                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                                  placeholder="Ej. Aviador Sovereign"
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-[#1a120e]/60">Precio (USD)</label>
                                <input
                                  type="number"
                                  required
                                  value={prodForm.price}
                                  onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-[#1a120e]/60">Categoría Principal</label>
                                <select
                                  value={prodForm.category}
                                  onChange={(e) => {
                                    const cat = categories.find(c => c.name === e.target.value);
                                    setProdForm({ 
                                      ...prodForm, 
                                      category: e.target.value,
                                      subcategory: cat?.subcategories[0]?.name || ''
                                    });
                                  }}
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                                >
                                  {categories.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-[#1a120e]/60">Subcategoría</label>
                                <select
                                  value={prodForm.subcategory}
                                  onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                                >
                                  <option value="">Ninguna</option>
                                  {categories
                                    .find((c) => c.name === prodForm.category)
                                    ?.subcategories.map((sub) => (
                                      <option key={sub.id} value={sub.name}>{sub.name}</option>
                                    ))
                                  }
                                </select>
                              </div>

                              <div className="col-span-1 sm:col-span-2 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-[#1a120e]/60">URL de Imagen Principal</label>
                                <input
                                  type="text"
                                  required
                                  value={prodForm.image}
                                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                                  placeholder="https://images.unsplash.com/..."
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                                />
                              </div>

                              <div className="col-span-1 sm:col-span-2 space-y-1">
                                <label className="text-[9px] font-bold uppercase text-[#1a120e]/60">Descripción de Lujo</label>
                                <textarea
                                  required
                                  rows={2}
                                  value={prodForm.description}
                                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                                  placeholder="Describe los acabados, materiales y estética..."
                                  className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                                />
                              </div>

                              <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={prodForm.inStock}
                                    onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                                    className="rounded text-[#1a120e]"
                                  />
                                  <span className="text-[10px] font-medium uppercase text-[#1a120e]">¿En Stock?</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={prodForm.featured}
                                    onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                                    className="rounded text-[#1a120e]"
                                  />
                                  <span className="text-[10px] font-medium uppercase text-[#1a120e]">Destacado (Home)</span>
                                </label>
                              </div>

                              <div className="col-span-1 sm:col-span-2 pt-2">
                                <motion.button
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  type="submit"
                                  className="w-full bg-[#1a120e] text-[#f5f0e6] font-bold text-xs uppercase tracking-widest py-3 rounded-lg cursor-pointer hover:bg-black shadow-md"
                                >
                                  {editingProductId ? 'Guardar Cambios de Gafas' : 'Añadir al Catálogo'}
                                </motion.button>
                              </div>
                            </form>
                          </div>

                          {/* Products List for Quick Edit / Delete */}
                          <div className="space-y-3">
                            <h4 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#efeae0] pb-1">
                              Catálogo Actual ({products.length} productos)
                            </h4>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {products.map((p) => (
                                <div
                                  key={p.id}
                                  className="bg-white border border-[#efeae0] p-3 rounded-xl flex items-center justify-between gap-4 hover:border-[#1a120e]/40 transition-colors"
                                  id={`admin-prod-${p.id}`}
                                >
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-12 h-12 bg-[#faf9f6] rounded-lg flex items-center justify-center p-1 shrink-0">
                                      <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" referrerPolicy="no-referrer" />
                                    </div>
                                    <div className="overflow-hidden">
                                      <h5 className="font-semibold text-xs text-[#1a120e] truncate">{p.name}</h5>
                                      <p className="text-[9px] text-[#1a120e]/50">
                                        {p.category} {p.subcategory ? `> ${p.subcategory}` : ''} | <span className="font-semibold text-[#1a120e]">${p.price}</span>
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      onClick={() => startEditProduct(p)}
                                      className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-700 transition-colors cursor-pointer"
                                      title="Editar"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p.id)}
                                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                                      title="Eliminar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* B. MANAGE CATEGORIES PANEL */}
                      {adminTab === 'categories' && (
                        <div className="space-y-6">
                          
                          {/* Add Category Form */}
                          <form onSubmit={handleAddCategory} className="bg-[#faf9f6] p-4 rounded-xl border border-[#efeae0] flex gap-3 items-end">
                            <div className="flex-1 space-y-1">
                              <label className="text-[9px] font-bold uppercase text-[#1a120e]/60 flex items-center gap-1.5">
                                <FolderPlus className="w-3.5 h-3.5" /> Nueva Categoría
                              </label>
                              <input
                                type="text"
                                required
                                value={catFormName}
                                onChange={(e) => setCatFormName(e.target.value)}
                                placeholder="Ej. Lujo Italiano, Retro"
                                className="w-full bg-white border border-[#efeae0] rounded-lg px-3 py-2 text-xs text-[#1a120e]"
                              />
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="submit"
                              className="bg-[#1a120e] text-[#f5f0e6] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg cursor-pointer hover:bg-black shrink-0"
                            >
                              Crear
                            </motion.button>
                          </form>

                          {/* Categories List with Subcategories Add/Edit/Delete */}
                          <div className="space-y-4">
                            <h4 className="text-[10px] tracking-widest text-[#1a120e] font-bold uppercase border-b border-[#efeae0] pb-1">
                              Listado de Categorías
                            </h4>

                            <div className="space-y-3.5">
                              {categories.map((cat) => (
                                <div key={cat.id} className="bg-white border border-[#efeae0] rounded-xl p-4 space-y-3">
                                  {/* Header: Category info and name editing */}
                                  <div className="flex items-center justify-between border-b border-[#efeae0]/40 pb-2 gap-4">
                                    {editingCategoryId === cat.id ? (
                                      <input
                                        type="text"
                                        defaultValue={cat.name}
                                        onBlur={(e) => {
                                          handleEditCategoryName(cat.id, e.target.value);
                                          setEditingCategoryId(null);
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            handleEditCategoryName(cat.id, (e.target as HTMLInputElement).value);
                                            setEditingCategoryId(null);
                                          }
                                        }}
                                        className="bg-white border border-[#efeae0] rounded px-2 py-1 text-xs text-[#1a120e] font-bold"
                                        autoFocus
                                      />
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-bold text-xs text-[#1a120e] uppercase tracking-wide">
                                          {cat.name}
                                        </h5>
                                        <button
                                          onClick={() => setEditingCategoryId(cat.id)}
                                          className="text-[#1a120e]/40 hover:text-black cursor-pointer"
                                          title="Editar nombre"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}

                                    <button
                                      onClick={() => handleDeleteCategory(cat.id)}
                                      className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[10px] uppercase tracking-wider"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" /> Eliminar Categoría
                                    </button>
                                  </div>

                                  {/* Subcategories list */}
                                  <div className="space-y-2">
                                    <span className="text-[9px] uppercase font-bold text-[#1a120e]/40">Subcategorías:</span>
                                    <div className="flex flex-wrap gap-2">
                                      {cat.subcategories.length === 0 ? (
                                        <span className="text-[10px] text-[#1a120e]/40 font-light italic">Sin subcategorías</span>
                                      ) : (
                                        cat.subcategories.map((sub) => (
                                          <span
                                            key={sub.id}
                                            className="inline-flex items-center gap-1.5 bg-[#faf9f6] border border-[#efeae0] rounded-full pl-3 pr-1.5 py-1 text-[10px] text-[#1a120e]/80"
                                          >
                                            {sub.name}
                                            <button
                                              onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                              className="p-0.5 rounded-full hover:bg-red-50 hover:text-red-600 text-[#1a120e]/40 transition-all cursor-pointer"
                                              title="Eliminar Subcategoría"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </span>
                                        ))
                                      )}
                                    </div>
                                  </div>

                                  {/* Add Subcategory input */}
                                  <div className="pt-2 flex gap-2 items-center">
                                    <input
                                      type="text"
                                      placeholder="Nueva subcategoría..."
                                      value={newSubcatName}
                                      onChange={(e) => setNewSubcatName(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleAddSubcategory(cat.id);
                                        }
                                      }}
                                      className="flex-grow max-w-[200px] bg-[#faf9f6] border border-[#efeae0] rounded-lg px-2.5 py-1.5 text-[10px] text-[#1a120e]"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddSubcategory(cat.id)}
                                      className="bg-[#1a120e] text-white px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold cursor-pointer"
                                    >
                                      Añadir Sub
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}


                  {/* LOGOUT FOOTER ACTION FOR LOGGED USERS */}
                  <div className="pt-6 border-t border-[#efeae0]/60 flex justify-between items-center bg-[#faf9f6]/30 -mx-6 -mb-6 px-6 pb-6 pt-4 rounded-b-2xl shrink-0">
                    <span className="text-[10px] text-[#1a120e]/45 font-light">
                      Sesión activa: <span className="font-semibold text-[#1a120e]">{currentUser.email}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 font-bold text-[10px] uppercase tracking-wider underline cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
