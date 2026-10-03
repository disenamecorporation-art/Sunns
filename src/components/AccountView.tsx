/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, LogOut, Package, CreditCard, 
  MapPin, ShieldCheck, Eye, LayoutDashboard, 
  ArrowLeft, Sparkles, User as UserIcon, Lock, CheckCircle2, ChevronRight, LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, User, Order } from '../types';
import { logoutUser, getUserOrders } from '../lib/userService';

import OverviewTab from './dashboard/OverviewTab';
import OrdersTab from './dashboard/OrdersTab';
import PaymentsTab from './dashboard/PaymentsTab';
import AddressesTab from './dashboard/AddressesTab';
import SecurityTab from './dashboard/SecurityTab';
import PrescriptionTab from './dashboard/PrescriptionTab';
import CasheaTab from './dashboard/CasheaTab';

interface AccountViewProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onOpenAdminPanel?: () => void;
  onOpenAuthModal?: () => void;
}

export default function AccountView({
  currentUser,
  setCurrentUser,
  products,
  setProducts,
  categories,
  setCategories,
  onNavigateHome,
  onNavigateShop,
  onOpenAdminPanel,
  onOpenAuthModal,
}: AccountViewProps) {
  type DashboardTab = 'overview' | 'orders' | 'payments' | 'addresses' | 'security' | 'prescription' | 'cashea';
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Orders list for current user
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Load orders when user changes
  useEffect(() => {
    if (currentUser) {
      getUserOrders(currentUser.id).then((orders) => {
        setUserOrders(orders);
      });
    }
  }, [currentUser]);

  // Handle Logout
  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setActiveTab('overview');
  };

  const navTabs = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'orders', label: 'Mis Pedidos', icon: Package, badge: userOrders.length > 0 ? userOrders.length : undefined },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'payments', label: 'Métodos de Pago', icon: CreditCard },
    { id: 'cashea', label: 'Financiamiento Cashea', icon: Sparkles, badge: 'Pronto' },
    { id: 'prescription', label: 'Receta Óptica', icon: Eye },
    { id: 'security', label: 'Seguridad', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-neutral-900 font-['Montserrat',sans-serif]">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="text-xs font-light uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Inicio</span>
            </button>
            <span className="text-neutral-300">/</span>
            <button
              onClick={onNavigateShop}
              className="text-xs font-light uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors cursor-pointer"
            >
              Tienda
            </button>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-light uppercase tracking-[0.2em] text-neutral-950">
              {currentUser ? 'Mi Cuenta' : 'Acceso Requerido'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser?.role === 'admin' && onOpenAdminPanel && (
              <button
                onClick={onOpenAdminPanel}
                className="inline-flex items-center gap-2 bg-neutral-950 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-light uppercase tracking-[0.2em] shadow-md transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5] text-white" />
                <span>Panel de Administración</span>
              </button>
            )}

            {currentUser && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 border border-neutral-300 hover:border-neutral-900 bg-white px-3.5 py-2 rounded-xl text-xs font-light uppercase tracking-[0.2em] text-neutral-900 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 stroke-[1.5] text-neutral-600" />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        </div>

        {/* ==================== 1. UNLOGGED VIEW: PROMPT TO OPEN SUPER GLASS POPUP ==================== */}
        {!currentUser ? (
          <div className="py-20 text-center max-w-md mx-auto space-y-7">
            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-950 text-white flex items-center justify-center shadow-xl border border-white/20">
              <UserIcon className="w-7 h-7 stroke-[1.5]" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extralight tracking-[0.15em] text-neutral-950 uppercase">
                Acceso a Mi Cuenta
              </h1>
              <p className="text-xs font-light tracking-wide text-neutral-500 leading-relaxed">
                Inicia sesión o regístrate para consultar tus pedidos y guardar tus recetas ópticas.
              </p>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2.5 bg-neutral-950 hover:bg-neutral-800 text-white px-8 py-4 rounded-full font-light uppercase tracking-[0.25em] text-xs transition-all shadow-xl hover:shadow-2xl cursor-pointer hover:scale-[1.02]"
            >
              <LogIn className="w-4 h-4 stroke-[1.5] text-white" />
              <span>Iniciar Sesión / Registro</span>
            </button>
          </div>
        ) : (
          /* ==================== 2. LOGGED IN VIEW: FULL PAGE DASHBOARD ==================== */
          <div className="space-y-8">
            
            {/* Top User Status Header Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-neutral-950 p-6 sm:p-8 text-white shadow-2xl border border-neutral-800">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-xl font-light text-white shadow-xl">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white text-black p-1 rounded-lg shadow-lg">
                      <Crown className="w-3.5 h-3.5 stroke-[1.5]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-200">
                        {currentUser.tier}
                      </span>
                      <span className="text-[10px] font-semibold bg-white/15 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {currentUser.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-[0.05em]">
                      {currentUser.name}
                    </h2>

                    <p className="text-xs font-normal text-neutral-300">
                      {currentUser.email} {currentUser.phone && `• ${currentUser.phone}`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-300 block">
                      Puntos Acumulados
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {currentUser.loyaltyPoints.toLocaleString()} <span className="text-xs text-neutral-300 font-medium">PTS</span>
                    </span>
                  </div>

                  <div className="h-10 w-[1px] bg-white/15 hidden sm:block" />

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-300 block">
                      Pedidos Totales
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {userOrders.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Layout: Tabs + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              
              {/* Left Navigation Sidebar */}
              <div className="lg:col-span-1 bg-white border border-neutral-300 rounded-3xl p-3 sm:p-4 shadow-sm space-y-1 sticky top-28">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black px-3 py-2 block">
                  Panel de Navegación
                </span>

                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as DashboardTab)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-medium uppercase tracking-[0.16em] transition-all cursor-pointer ${
                        isActive
                          ? 'bg-black text-white shadow-md font-semibold'
                          : 'text-black hover:text-black hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? 'text-white' : 'text-black'}`} />
                        <span className={isActive ? 'text-white' : 'text-black'}>{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-black'
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                {currentUser?.role === 'admin' && onOpenAdminPanel && (
                  <div className="pt-2 pb-1">
                    <button
                      onClick={onOpenAdminPanel}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.16em] bg-amber-400 hover:bg-amber-300 text-black shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 stroke-[2] text-black" />
                        <span>Panel Admin</span>
                      </div>
                      <span className="text-[9px] bg-black text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        HUB
                      </span>
                    </button>
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-[0.16em] text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 stroke-[1.8] text-red-600" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>

              {/* Right Main Content Area */}
              <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                
                {activeTab === 'overview' && (
                  <OverviewTab
                    currentUser={currentUser}
                    orders={userOrders}
                    onNavigateTab={(tab) => setActiveTab(tab)}
                    onViewOrderDetails={(order) => {
                      setSelectedOrderForModal(order);
                      setActiveTab('orders');
                    }}
                    onOpenShop={onNavigateShop}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersTab
                    orders={userOrders}
                    onOpenShop={onNavigateShop}
                  />
                )}

                {activeTab === 'addresses' && (
                  <AddressesTab
                    currentUser={currentUser}
                    onUpdateUser={(updated) => setCurrentUser(updated)}
                  />
                )}

                {activeTab === 'payments' && (
                  <PaymentsTab
                    currentUser={currentUser}
                    onUpdateUser={(updated) => setCurrentUser(updated)}
                  />
                )}

                {activeTab === 'cashea' && (
                  <CasheaTab
                    currentUser={currentUser}
                    onUpdateUser={(updated) => setCurrentUser(updated)}
                  />
                )}

                {activeTab === 'prescription' && (
                  <PrescriptionTab
                    currentUser={currentUser}
                    onUpdateUser={(updated) => setCurrentUser(updated)}
                  />
                )}

                {activeTab === 'security' && (
                  <SecurityTab
                    currentUser={currentUser}
                    onUpdateUser={(updated) => setCurrentUser(updated)}
                  />
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
