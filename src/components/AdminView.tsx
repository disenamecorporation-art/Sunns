/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Package, ShoppingBag, Layers, Sparkles, Plus, 
  Trash2, Edit3, Check, X, Search, DollarSign, TrendingUp, 
  Truck, ArrowLeft, User as UserIcon, LogOut, CheckCircle2, 
  AlertCircle, Eye, ExternalLink, Filter, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, HomeContent, User, Order } from '../types';
import { 
  dbGetOrders, dbUpdateOrderStatus, dbSaveProduct, 
  dbDeleteProduct, dbSaveCategory, dbDeleteCategory, 
  dbAddSubcategory, dbDeleteSubcategory 
} from '../lib/dbService';
import AdminHomeEditor from './dashboard/AdminHomeEditor';

interface AdminViewProps {
  currentUser: User | null;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  homeContent: HomeContent;
  setHomeContent: React.Dispatch<React.SetStateAction<HomeContent>>;
  onNavigateHome: () => void;
  onNavigateShop: () => void;
  onNavigateAccount: () => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

export default function AdminView({
  currentUser,
  products,
  setProducts,
  categories,
  setCategories,
  homeContent,
  setHomeContent,
  onNavigateHome,
  onNavigateShop,
  onNavigateAccount,
  onLogout,
  onOpenAuthModal,
}: AdminViewProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'home'>('orders');

  // Orders State
  const [globalOrders, setGlobalOrders] = useState<{ order: Order; userName: string; userEmail: string; userId: string }[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<{ order: Order; userName: string; userEmail: string } | null>(null);

  // Edit / Tracking states for order modal
  const [editingTrackingNumber, setEditingTrackingNumber] = useState('');
  const [editingCourier, setEditingCourier] = useState('');
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);

  // Products State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Safe inline delete states (NO window.confirm!)
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  // Categories State
  const [newCatName, setNewCatName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [newSubcatInputs, setNewSubcatInputs] = useState<Record<string, string>>({});
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);

  // Toast feedback state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load orders on mount or when tab switches to orders
  useEffect(() => {
    async function loadAllOrders() {
      setLoadingOrders(true);
      try {
        const data = await dbGetOrders();
        setGlobalOrders(data);
      } catch (err) {
        console.warn('Error loading orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadAllOrders();
  }, [activeTab]);

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderStatus(true);
    try {
      const ok = await dbUpdateOrderStatus(orderId, newStatus, editingTrackingNumber, editingCourier);
      if (ok) {
        setGlobalOrders(prev =>
          prev.map(item => {
            if (item.order.id === orderId) {
              return {
                ...item,
                order: {
                  ...item.order,
                  status: newStatus,
                  trackingNumber: editingTrackingNumber || item.order.trackingNumber,
                  courier: editingCourier || item.order.courier,
                }
              };
            }
            return item;
          })
        );
        if (selectedOrderDetails && selectedOrderDetails.order.id === orderId) {
          setSelectedOrderDetails({
            ...selectedOrderDetails,
            order: {
              ...selectedOrderDetails.order,
              status: newStatus,
              trackingNumber: editingTrackingNumber || selectedOrderDetails.order.trackingNumber,
              courier: editingCourier || selectedOrderDetails.order.courier,
            }
          });
        }
        showToast(`Estado de pedido actualizado a "${newStatus}" en Supabase`);
      } else {
        showToast('Error al actualizar el pedido');
      }
    } catch (err) {
      console.error(err);
      showToast('Error al conectar con la base de datos');
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  // Product Delete Handler - 100% Supabase, zero window.confirm, zero localStorage
  const handleDeleteProduct = async (productId: string, productName: string) => {
    setIsDeletingProduct(true);
    try {
      await dbDeleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      setConfirmDeleteProductId(null);
      showToast(`Producto "${productName}" eliminado permanentemente de Supabase`);
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Error al eliminar producto de la base de datos');
    } finally {
      setIsDeletingProduct(false);
    }
  };

  // Product Save (Add/Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editingProduct.name.trim() || !editingProduct.price) {
      showToast('Por favor completa el nombre y precio del producto');
      return;
    }

    try {
      await dbSaveProduct(editingProduct);
      const existing = products.some(p => p.id === editingProduct.id);
      if (existing) {
        setProducts(prev => prev.map(p => (p.id === editingProduct.id ? editingProduct : p)));
        showToast(`Producto "${editingProduct.name}" actualizado en Supabase`);
      } else {
        setProducts(prev => [editingProduct, ...prev]);
        showToast(`Nuevo producto "${editingProduct.name}" creado en Supabase`);
      }
      setEditingProduct(null);
      setIsCreatingProduct(false);
    } catch (err) {
      console.error(err);
      showToast('Error al guardar producto');
    }
  };

  // Categories Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name: newCatName.trim(),
      subcategories: [
        { id: `sub_${Date.now()}_1`, name: 'Clásico' },
        { id: `sub_${Date.now()}_2`, name: 'Novedades' }
      ]
    };

    await dbSaveCategory(newCat);
    setCategories([...categories, newCat]);
    setNewCatName('');
    showToast(`Categoría "${newCat.name}" guardada en Supabase`);
  };

  const handleSaveEditCategory = async (catId: string) => {
    if (!editingCategoryName.trim()) return;
    const oldCat = categories.find(c => c.id === catId);
    const oldName = oldCat?.name;

    const updatedCat: Category = {
      ...(oldCat || { id: catId, subcategories: [] }),
      name: editingCategoryName.trim(),
    };

    await dbSaveCategory(updatedCat);
    const updated = categories.map(c => (c.id === catId ? updatedCat : c));
    setCategories(updated);

    if (oldName && oldName !== editingCategoryName.trim()) {
      const updatedProducts = products.map(p => {
        if (p.category === oldName) {
          const up = { ...p, category: editingCategoryName.trim() };
          dbSaveProduct(up);
          return up;
        }
        return p;
      });
      setProducts(updatedProducts);
    }

    setEditingCategoryId(null);
    showToast('Categoría actualizada en Supabase');
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    await dbDeleteCategory(catId);
    setCategories(prev => prev.filter(c => c.id !== catId));
    setConfirmDeleteCatId(null);
    showToast(`Categoría "${catName}" eliminada de Supabase`);
  };

  const handleAddSubcategory = async (catId: string) => {
    const subName = newSubcatInputs[catId];
    if (!subName || !subName.trim()) return;

    const subObj = { id: `sub_${Date.now()}`, name: subName.trim() };
    await dbAddSubcategory(catId, subObj);

    const updated = categories.map(c => {
      if (c.id === catId) {
        return { ...c, subcategories: [...c.subcategories, subObj] };
      }
      return c;
    });

    setCategories(updated);
    setNewSubcatInputs({ ...newSubcatInputs, [catId]: '' });
    showToast('Subcategoría guardada en Supabase');
  };

  const handleDeleteSubcategory = async (catId: string, subId: string) => {
    await dbDeleteSubcategory(catId, subId);
    const updated = categories.map(c => {
      if (c.id === catId) {
        return { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) };
      }
      return c;
    });
    setCategories(updated);
    showToast('Subcategoría eliminada de Supabase');
  };

  // Filtered Orders
  const filteredOrders = globalOrders.filter(entry => {
    const matchStatus = orderStatusFilter === 'all' || entry.order.status === orderStatusFilter;
    const q = orderSearch.toLowerCase();
    const matchQuery = 
      entry.order.orderNumber.toLowerCase().includes(q) ||
      entry.userName.toLowerCase().includes(q) ||
      entry.userEmail.toLowerCase().includes(q) ||
      entry.order.items.some(i => i.productName.toLowerCase().includes(q));
    return matchStatus && matchQuery;
  });

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const q = productSearch.toLowerCase();
    const matchQuery = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  // Orders Summary Stats
  const totalRevenue = globalOrders.reduce((sum, item) => sum + (item.order.status !== 'cancelled' ? item.order.total : 0), 0);
  const totalOrdersCount = globalOrders.length;
  const avgTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
  const deliveredOrdersCount = globalOrders.filter(o => o.order.status === 'delivered').length;

  // Access Protection
  if (currentUser?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#faf9f6] pt-32 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white border border-neutral-300 rounded-3xl p-8 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-800">
            <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Acceso Restringido</h2>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Esta sección es de uso exclusivo para administradores de SUNNS. Inicia sesión con una cuenta autorizada para gestionar la base de datos Supabase.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={onNavigateHome}
              className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Ir al Inicio
            </button>
            <button
              onClick={onOpenAuthModal}
              className="flex-1 py-2.5 px-4 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-neutral-900 font-['Montserrat',sans-serif]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-black text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold border border-neutral-700"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* 1. Breadcrumb and Navigation Bar (Exact same layout as user dashboard) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2 pb-4 border-b border-neutral-200">
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-950">
              Panel de Administración
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateAccount}
              className="inline-flex items-center gap-1.5 border border-neutral-300 hover:border-neutral-900 bg-white px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] text-neutral-900 transition-all cursor-pointer shadow-sm"
              title="Ir a mi cuenta personal de usuario"
            >
              <UserIcon className="w-3.5 h-3.5 stroke-[1.5] text-neutral-600" />
              <span>Mi Cuenta</span>
            </button>
            <button
              onClick={onNavigateShop}
              className="inline-flex items-center gap-1.5 border border-neutral-300 hover:border-neutral-900 bg-white px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] text-neutral-900 transition-all cursor-pointer shadow-sm"
              title="Ver el catálogo como cliente"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5] text-neutral-600" />
              <span>Ver Tienda</span>
            </button>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 border border-neutral-300 hover:border-neutral-900 bg-white px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-[0.1em] text-neutral-900 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[1.5] text-neutral-600" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* 2. Top Header Status Banner (Matching user dashboard aesthetic) */}
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 p-6 sm:p-8 text-white shadow-xl border border-neutral-800">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Admin identity & status */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 border-2 border-amber-400/40 p-1 flex items-center justify-center shrink-0 shadow-lg">
                <ShieldCheck className="w-8 h-8 text-amber-400 stroke-[1.5]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Super Administrador
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Supabase Conectado
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {currentUser.name || 'Administrador Central'}
                </h1>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Quick Metrics KPI Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/80 border border-neutral-800 p-3 sm:p-4 rounded-2xl">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Facturación</div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                  ${totalRevenue.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Pedidos</div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {totalOrdersCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Productos</div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {products.length}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold">Categorías</div>
                <div className="text-base sm:text-lg font-bold font-mono text-white">
                  {categories.length}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Main Dashboard Layout (Left Sidebar + Right Content Area) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-1 bg-white border border-neutral-300 rounded-3xl p-3 sm:p-4 shadow-sm space-y-1.5 sticky top-28">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 px-3 py-2 block">
              Menú de Administración
            </span>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                <span>Historial de Compras</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800 font-bold'
              }`}>
                {globalOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 stroke-[1.5]" />
                <span>Gestión de Productos</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'products' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800 font-bold'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 stroke-[1.5]" />
                <span>Gestión de Categorías</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeTab === 'categories' ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-800 font-bold'
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-black text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 stroke-[1.5]" />
                <span>Textos del Home</span>
              </div>
              <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                EDITOR
              </span>
            </button>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm text-neutral-900 min-h-[500px]">
            
            {/* ==================================================== */}
            {/* TAB 1: HISTORIAL DE COMPRAS (ORDERS)                */}
            {/* ==================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-neutral-800 stroke-[2]" />
                      Historial de Compras y Pedidos
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Monitorea las órdenes registradas en Supabase, actualiza estados y códigos de rastreo.
                    </p>
                  </div>

                  <div className="text-xs font-mono bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 self-start sm:self-auto">
                    Total: <strong className="text-black">{globalOrders.length}</strong> compras
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Facturación Total
                    </span>
                    <span className="text-xl font-bold text-emerald-600 font-mono">
                      ${totalRevenue.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Pedidos Pagados
                    </span>
                    <span className="text-xl font-bold text-neutral-900 font-mono">
                      {globalOrders.filter(o => o.order.status === 'paid').length}
                    </span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Entregados
                    </span>
                    <span className="text-xl font-bold text-neutral-900 font-mono">
                      {deliveredOrdersCount}
                    </span>
                  </div>
                  <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                      Ticket Promedio
                    </span>
                    <span className="text-xl font-bold text-neutral-900 font-mono">
                      ${Math.round(avgTicket)} USD
                    </span>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar por orden, cliente, email o producto..."
                      value={orderSearch}
                      onChange={e => setOrderSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-black text-neutral-900"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-neutral-500 whitespace-nowrap">Estado:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      className="text-xs bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="paid">Pagado</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                {loadingOrders ? (
                  <div className="py-12 text-center text-xs text-neutral-500">
                    Cargando pedidos de Supabase...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-neutral-500 border-2 border-dashed border-neutral-200 rounded-2xl">
                    No se encontraron órdenes registradas con los filtros actuales.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map(({ order, userName, userEmail }) => (
                      <div
                        key={order.id}
                        className="bg-neutral-50/60 hover:bg-neutral-50 border border-neutral-200 rounded-2xl p-4 transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono font-bold text-xs text-black">
                                #{order.orderNumber}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                order.status === 'shipped' ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800 border border-red-300' :
                                'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {order.status === 'delivered' ? 'Entregado' :
                                 order.status === 'shipped' ? 'En Camino' :
                                 order.status === 'cancelled' ? 'Cancelado' : 'Pagado'}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-mono">
                                {order.date}
                              </span>
                            </div>
                            <div className="text-xs text-neutral-800 font-medium">
                              <strong>{userName}</strong> • <span className="text-neutral-500 font-mono">{userEmail}</span>
                            </div>
                            <div className="text-[11px] text-neutral-600 mt-1">
                              {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}: {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                            </div>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                            <span className="text-sm font-bold text-neutral-900 font-mono">
                              ${order.total.toLocaleString()} USD
                            </span>
                            <button
                              onClick={() => {
                                setSelectedOrderDetails({ order, userName, userEmail });
                                setEditingTrackingNumber(order.trackingNumber || '');
                                setEditingCourier(order.courier || '');
                              }}
                              className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-medium cursor-pointer transition-colors"
                            >
                              Gestionar Pedido
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 2: GESTIÓN DE PRODUCTOS (PRODUCTS)               */}
            {/* ==================================================== */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="border-b border-neutral-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-neutral-800 stroke-[2]" />
                      Gestión de Productos
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Añade, edita o elimina productos directamente en la tabla Supabase con sincronización inmediata.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProduct({
                        id: `prod_${Date.now()}`,
                        name: '',
                        price: 150,
                        category: categories[0]?.name || 'Sol',
                        description: '',
                        details: ['Material de alta densidad', 'Protección UV400'],
                        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
                        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800'],
                        colors: ['Negro Mate', 'Carey'],
                        inStock: true,
                        featured: false,
                        rating: 5.0,
                        reviewsCount: 1,
                      });
                      setIsCreatingProduct(true);
                    }}
                    className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-md self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nuevo Producto</span>
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre o descripción..."
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-black text-neutral-900"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs text-neutral-500 whitespace-nowrap">Categoría:</span>
                    <select
                      value={productCategoryFilter}
                      onChange={e => setProductCategoryFilter(e.target.value)}
                      className="text-xs bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="all">Todas ({products.length})</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Creation / Edit Form */}
                {editingProduct && (
                  <form onSubmit={handleSaveProduct} className="bg-neutral-50 border-2 border-neutral-300 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        {isCreatingProduct ? 'Crear Nuevo Producto en Catálogo' : `Editar: ${editingProduct.name}`}
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                        className="text-neutral-400 hover:text-black cursor-pointer p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Nombre del Modelo</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name}
                          onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none"
                          placeholder="Ej: Nox Minimalist 2026"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Precio (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={editingProduct.price}
                          onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Categoría</label>
                        <select
                          value={editingProduct.category}
                          onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none cursor-pointer"
                        >
                          {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Subcategoría (Opcional)</label>
                        <input
                          type="text"
                          value={editingProduct.subcategory || ''}
                          onChange={e => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none"
                          placeholder="Ej: Aviador, Polarizado, Clásico"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-neutral-700 font-semibold mb-1">URL de la Imagen Principal</label>
                        <input
                          type="url"
                          required
                          value={editingProduct.image}
                          onChange={e => setEditingProduct({ 
                            ...editingProduct, 
                            image: e.target.value,
                            images: [e.target.value, ...(editingProduct.images?.slice(1) || [])]
                          })}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none font-mono text-[11px]"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-neutral-700 font-semibold mb-1">Descripción del Producto</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none leading-relaxed"
                          placeholder="Detalles sobre materiales, estilo y artesanía..."
                        />
                      </div>

                      <div className="flex items-center gap-6 md:col-span-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold">
                          <input
                            type="checkbox"
                            checked={editingProduct.inStock}
                            onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                            className="w-4 h-4 rounded text-black focus:ring-0 cursor-pointer"
                          />
                          <span>En Stock para Venta Inmediata</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-semibold">
                          <input
                            type="checkbox"
                            checked={editingProduct.featured}
                            onChange={e => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                            className="w-4 h-4 rounded text-black focus:ring-0 cursor-pointer"
                          />
                          <span>Destacado en el Home</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                      <button
                        type="button"
                        onClick={() => { setEditingProduct(null); setIsCreatingProduct(false); }}
                        className="px-4 py-2 rounded-xl text-neutral-600 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                      >
                        Guardar en Supabase
                      </button>
                    </div>
                  </form>
                )}

                {/* Product Catalog Cards / List */}
                <div className="space-y-3">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-neutral-50/70 hover:bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-neutral-200 bg-white shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="font-bold text-sm text-neutral-900">
                              {product.name}
                            </h4>
                            <span className="text-[10px] font-semibold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                              {product.category}
                            </span>
                            {product.subcategory && (
                              <span className="text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200 px-2 py-0.5 rounded-full">
                                {product.subcategory}
                              </span>
                            )}
                            {product.featured && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">
                                Destacado
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              product.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'En Stock' : 'Agotado'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 line-clamp-1 max-w-xl">
                            {product.description}
                          </p>
                          <div className="text-xs font-mono font-bold text-neutral-900 mt-1">
                            ${product.price.toLocaleString()} USD
                          </div>
                        </div>
                      </div>

                      {/* Action buttons with 100% IN-UI CONFIRMATION (NO window.confirm!) */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {confirmDeleteProductId === product.id ? (
                          <div className="flex items-center gap-2 bg-red-50 border border-red-300 p-1.5 rounded-xl shadow-sm">
                            <span className="text-[11px] font-bold text-red-700 px-1">¿Eliminar?</span>
                            <button
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              disabled={isDeletingProduct}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
                            >
                              {isDeletingProduct ? 'Borrando...' : 'Sí, borrar'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteProductId(null)}
                              className="px-2 py-1 text-neutral-600 hover:text-black rounded-lg text-[10px] cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingProduct({ ...product });
                                setIsCreatingProduct(false);
                                window.scrollTo({ top: 300, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => setConfirmDeleteProductId(product.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                              title="Eliminar producto permanentemente"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 3: GESTIÓN DE CATEGORÍAS (CATEGORIES)            */}
            {/* ==================================================== */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                
                {/* Header */}
                <div className="border-b border-neutral-200 pb-4">
                  <h3 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-neutral-800 stroke-[2]" />
                    Gestión de Categorías y Subcategorías
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Organiza las secciones del menú, filtros de la tienda y vinculaciones de productos.
                  </p>
                </div>

                {/* Add new Category Form */}
                <form onSubmit={handleAddCategory} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Nombre de la nueva categoría (Ej: Edición Limitada)..."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full text-xs bg-white border border-neutral-300 rounded-xl p-2.5 focus:border-black outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0 shadow-sm"
                  >
                    Crear Categoría
                  </button>
                </form>

                {/* Categories List */}
                <div className="space-y-4">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-5 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                        {editingCategoryId === cat.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editingCategoryName}
                              onChange={e => setEditingCategoryName(e.target.value)}
                              className="text-xs bg-white border border-neutral-300 rounded-xl px-3 py-1.5 focus:border-black outline-none font-bold"
                            />
                            <button
                              onClick={() => handleSaveEditCategory(cat.id)}
                              className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingCategoryId(null)}
                              className="p-1.5 text-neutral-400 hover:text-black cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold text-base text-neutral-900">
                              {cat.name}
                            </h4>
                            <span className="text-[10px] font-mono bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                              ID: {cat.id}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {editingCategoryId !== cat.id && (
                            <button
                              onClick={() => {
                                setEditingCategoryId(cat.id);
                                setEditingCategoryName(cat.name);
                              }}
                              className="text-xs text-neutral-600 hover:text-black font-medium cursor-pointer"
                            >
                              Renombrar
                            </button>
                          )}

                          {confirmDeleteCatId === cat.id ? (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-300 p-1 rounded-xl">
                              <span className="text-[10px] text-red-700 font-bold px-1">¿Eliminar categoría?</span>
                              <button
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setConfirmDeleteCatId(null)}
                                className="px-2 py-0.5 text-neutral-600 hover:text-black text-[10px] cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteCatId(cat.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 cursor-pointer"
                              title="Eliminar categoría"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subcategories list */}
                      <div>
                        <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                          Subcategorías vinculadas:
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          {cat.subcategories.map(sub => (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 bg-white border border-neutral-300 text-neutral-800 text-xs px-3 py-1 rounded-xl shadow-xs"
                            >
                              <span>{sub.name}</span>
                              <button
                                onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                className="text-neutral-400 hover:text-red-600 cursor-pointer p-0.5"
                                title="Eliminar subcategoría"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}

                          {/* Add subcategory input */}
                          <div className="inline-flex items-center gap-1 bg-white border border-neutral-300 rounded-xl p-1 shadow-xs">
                            <input
                              type="text"
                              placeholder="Nueva subcategoría..."
                              value={newSubcatInputs[cat.id] || ''}
                              onChange={e => setNewSubcatInputs({ ...newSubcatInputs, [cat.id]: e.target.value })}
                              className="text-xs px-2 py-0.5 outline-none w-32 text-neutral-800"
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddSubcategory(cat.id);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddSubcategory(cat.id)}
                              className="px-2 py-0.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ==================================================== */}
            {/* TAB 4: TEXTOS DEL HOME (SUPABASE)                    */}
            {/* ==================================================== */}
            {activeTab === 'home' && (
              <AdminHomeEditor
                content={homeContent}
                onUpdateContent={setHomeContent}
                showToast={showToast}
              />
            )}

          </div>

        </div>

      </div>

      {/* Order Details & Logistics Modal */}
      <AnimatePresence>
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-300 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 text-neutral-900"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 block uppercase">Detalles de Facturación</span>
                  <h4 className="font-bold text-lg text-black">
                    Orden #{selectedOrderDetails.order.orderNumber}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-neutral-50 p-3 rounded-xl space-y-1">
                  <div><strong>Cliente:</strong> {selectedOrderDetails.userName}</div>
                  <div><strong>Email:</strong> {selectedOrderDetails.userEmail}</div>
                  <div><strong>Fecha:</strong> {selectedOrderDetails.order.date}</div>
                  {selectedOrderDetails.order.shipping && (
                    <div><strong>Dirección de Envío:</strong> {selectedOrderDetails.order.shipping.address}, {selectedOrderDetails.order.shipping.city}, {selectedOrderDetails.order.shipping.country}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <strong className="block text-neutral-700">Artículos Comprados:</strong>
                  {selectedOrderDetails.order.items.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-1 border-b border-neutral-100">
                      <span>{item.productName} (x{item.quantity})</span>
                      <span className="font-mono font-bold">${(item.unitPrice * item.quantity).toFixed(2)} USD</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-1 font-bold text-sm">
                    <span>Total de la Orden:</span>
                    <span className="font-mono">${selectedOrderDetails.order.total.toFixed(2)} USD</span>
                  </div>
                </div>

                {/* Status & Logistics controls */}
                <div className="border-t border-neutral-200 pt-3 space-y-3">
                  <div>
                    <label className="block font-semibold mb-1">Estado del Pedido:</label>
                    <select
                      value={selectedOrderDetails.order.status}
                      onChange={e => handleUpdateOrderStatus(selectedOrderDetails.order.id, e.target.value as Order['status'])}
                      disabled={updatingOrderStatus}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2 cursor-pointer focus:border-black outline-none"
                    >
                      <option value="paid">Pagado (En preparación)</option>
                      <option value="shipped">Enviado (En tránsito con transportadora)</option>
                      <option value="delivered">Entregado al cliente</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Transportadora:</label>
                      <input
                        type="text"
                        placeholder="Ej: DHL Express, FedEx..."
                        value={editingCourier}
                        onChange={e => setEditingCourier(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Número de Guía / Tracking:</label>
                      <input
                        type="text"
                        placeholder="Ej: DHL-883921..."
                        value={editingTrackingNumber}
                        onChange={e => setEditingTrackingNumber(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-2 outline-none text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrderDetails.order.id, selectedOrderDetails.order.status)}
                    disabled={updatingOrderStatus}
                    className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {updatingOrderStatus ? 'Actualizando...' : 'Guardar Información Logística'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
