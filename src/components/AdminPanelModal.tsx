/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Package, FolderPlus, Trash2, Edit3, Plus, 
  Search, CheckCircle2, Clock, Truck, Check, AlertTriangle, 
  ExternalLink, DollarSign, TrendingUp, ShoppingBag, Eye,
  Tag, Filter, RefreshCw, Sparkles, Layers, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Category, User, Order } from '../types';
import { 
  getAllGlobalOrders, 
  updateGlobalOrderStatus, 
  updateGlobalOrderTracking,
  AdminOrderEntry,
  dbSaveProduct,
  dbDeleteProduct,
  dbSaveCategory,
  dbDeleteCategory,
  dbAddSubcategory,
  dbDeleteSubcategory
} from '../lib/userService';
import { HomeContent } from '../types';
import { DEFAULT_HOME_CONTENT } from '../data/homeContent';
import AdminHomeEditor from './dashboard/AdminHomeEditor';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  homeContent?: HomeContent;
  setHomeContent?: (content: HomeContent) => void;
}

export default function AdminPanelModal({
  isOpen,
  onClose,
  currentUser,
  products,
  setProducts,
  categories,
  setCategories,
  homeContent,
  setHomeContent,
}: AdminPanelModalProps) {
  // Navigation tabs
  type AdminTab = 'orders' | 'products' | 'categories' | 'home';
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');

  // Orders State
  const [globalOrders, setGlobalOrders] = useState<AdminOrderEntry[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<AdminOrderEntry | null>(null);

  // Tracking edit inside order detail
  const [trackingCourier, setTrackingCourier] = useState('DHL Express');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  // Products State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    price: 180,
    category: categories[0]?.name || 'Sol',
    subcategory: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    colorName: 'Negro Carbón',
    colorValue: '#1A1A1A',
    inStock: true,
    featured: false,
  });

  // Categories State
  const [newCatName, setNewCatName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [newSubcatInputs, setNewSubcatInputs] = useState<Record<string, string>>({});

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Load orders on open
  useEffect(() => {
    if (isOpen) {
      getAllGlobalOrders().then(orders => {
        setGlobalOrders(orders);
      });
    }
  }, [isOpen]);

  const refreshOrders = async () => {
    const orders = await getAllGlobalOrders();
    setGlobalOrders(orders);
    showToast('Historial de pedidos actualizado');
  };

  // Status badge style helper
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return { label: 'Pagado', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 };
      case 'processing':
        return { label: 'En Preparación', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Clock };
      case 'shipped':
        return { label: 'Enviado', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30', icon: Truck };
      case 'delivered':
        return { label: 'Entregado', bg: 'bg-green-500/15 text-green-300 border-green-500/30', icon: Check };
      case 'cancelled':
        return { label: 'Cancelado', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30', icon: AlertTriangle };
      default:
        return { label: status, bg: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30', icon: Clock };
    }
  };

  // Handle Order Status Update
  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    const success = await updateGlobalOrderStatus(orderId, newStatus);
    if (success) {
      const orders = await getAllGlobalOrders();
      setGlobalOrders(orders);
      if (selectedOrderDetails && selectedOrderDetails.order.id === orderId) {
        setSelectedOrderDetails({
          ...selectedOrderDetails,
          order: { ...selectedOrderDetails.order, status: newStatus }
        });
      }
      showToast(`Estado del pedido actualizado a: ${newStatus.toUpperCase()}`);
    }
  };

  // Handle Save Tracking
  const handleSaveTracking = async (orderId: string) => {
    if (!trackingNumberInput.trim()) return;
    const success = await updateGlobalOrderTracking(orderId, trackingCourier, trackingNumberInput.trim());
    if (success) {
      const orders = await getAllGlobalOrders();
      setGlobalOrders(orders);
      if (selectedOrderDetails && selectedOrderDetails.order.id === orderId) {
        setSelectedOrderDetails({
          ...selectedOrderDetails,
          order: {
            ...selectedOrderDetails.order,
            courier: trackingCourier,
            trackingNumber: trackingNumberInput.trim(),
            status: 'shipped',
          }
        });
      }
      showToast('Guía de seguimiento guardada y pedido marcado como Enviado');
    }
  };

  // Product Actions
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      price: 180,
      category: categories[0]?.name || 'Sol',
      subcategory: categories[0]?.subcategories[0]?.name || '',
      description: '',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
      colorName: 'Negro Carbón',
      colorValue: '#1A1A1A',
      inStock: true,
      featured: false,
    });
    setIsProductFormOpen(true);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdForm({
      name: prod.name,
      price: prod.price,
      category: prod.category,
      subcategory: prod.subcategory || '',
      description: prod.description,
      image: prod.image,
      colorName: prod.colors[0]?.name || 'Negro Carbón',
      colorValue: prod.colors[0]?.value || '#1A1A1A',
      inStock: prod.inStock,
      featured: prod.featured,
    });
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    if (editingProductId) {
      // Edit existing product
      const target = products.find(p => p.id === editingProductId);
      const updatedItem: Product = {
        ...(target || {
          id: editingProductId,
          details: [],
          images: [prodForm.image.trim()],
          rating: 5.0,
          reviewsCount: 1,
        }),
        name: prodForm.name.trim(),
        price: Number(prodForm.price),
        category: prodForm.category,
        subcategory: prodForm.subcategory || undefined,
        description: prodForm.description.trim(),
        image: prodForm.image.trim(),
        colors: [{ name: prodForm.colorName, value: prodForm.colorValue }],
        inStock: prodForm.inStock,
        featured: prodForm.featured,
      };

      await dbSaveProduct(updatedItem);
      const updated = products.map(p => (p.id === editingProductId ? updatedItem : p));
      setProducts(updated);
      showToast('Producto actualizado en la base de datos');
    } else {
      // Create new product
      const newProd: Product = {
        id: `prod_${Date.now()}`,
        name: prodForm.name.trim(),
        price: Number(prodForm.price),
        category: prodForm.category,
        subcategory: prodForm.subcategory || undefined,
        description: prodForm.description.trim(),
        details: [
          'Montura de acetato de celulosa Mazzucchelli pulido artesanalmente',
          'Lentes orgánicas CR-39 con filtro UV400 y polarizado HD',
          'Bisagras alemanas de 5 charnelas reforzadas',
          'Estuche rígido de piel y paño microfibra de limpieza incluido'
        ],
        image: prodForm.image.trim(),
        images: [
          prodForm.image.trim(),
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=600'
        ],
        colors: [{ name: prodForm.colorName, value: prodForm.colorValue }],
        inStock: prodForm.inStock,
        featured: prodForm.featured,
        rating: 5.0,
        reviewsCount: 1,
      };
      await dbSaveProduct(newProd);
      setProducts([newProd, ...products]);
      showToast('Nuevo producto guardado en la base de datos');
    }

    setIsProductFormOpen(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del catálogo?')) {
      await dbDeleteProduct(productId);
      const filtered = products.filter(p => p.id !== productId);
      setProducts(filtered);
      showToast('Producto eliminado de la base de datos');
    }
  };

  const handleToggleStock = async (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const updatedProd = { ...target, inStock: !target.inStock };
    await dbSaveProduct(updatedProd);
    const updated = products.map(p => (p.id === productId ? updatedProd : p));
    setProducts(updated);
    showToast('Estado de stock actualizado en DB');
  };

  const handleToggleFeatured = async (productId: string) => {
    const target = products.find(p => p.id === productId);
    if (!target) return;
    const updatedProd = { ...target, featured: !target.featured };
    await dbSaveProduct(updatedProd);
    const updated = products.map(p => (p.id === productId ? updatedProd : p));
    setProducts(updated);
    showToast('Estado destacado actualizado en DB');
  };

  // Category Actions
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
    showToast(`Categoría "${newCat.name}" guardada en la base de datos`);
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

    // Update products assigned to old category name
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
    showToast('Categoría actualizada en DB');
  };

  const handleDeleteCategory = async (catId: string) => {
    const targetCat = categories.find(c => c.id === catId);
    if (!targetCat) return;

    if (window.confirm(`¿Deseas eliminar la categoría "${targetCat.name}"? Los productos asociados se mantendrán.`)) {
      await dbDeleteCategory(catId);
      const filtered = categories.filter(c => c.id !== catId);
      setCategories(filtered);
      showToast(`Categoría "${targetCat.name}" eliminada de la base de datos`);
    }
  };

  const handleAddSubcategory = async (catId: string) => {
    const subName = newSubcatInputs[catId];
    if (!subName || !subName.trim()) return;

    const subObj = { id: `sub_${Date.now()}`, name: subName.trim() };
    await dbAddSubcategory(catId, subObj);

    const updated = categories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: [...c.subcategories, subObj]
        };
      }
      return c;
    });

    setCategories(updated);
    setNewSubcatInputs({ ...newSubcatInputs, [catId]: '' });
    showToast('Subcategoría guardada en la base de datos');
  };

  const handleDeleteSubcategory = async (catId: string, subId: string) => {
    await dbDeleteSubcategory(catId, subId);
    const updated = categories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          subcategories: c.subcategories.filter(s => s.id !== subId)
        };
      }
      return c;
    });
    setCategories(updated);
    showToast('Subcategoría eliminada de la base de datos');
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 z-50 bg-black/95 text-white border border-amber-400/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-xl"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{toastMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 240 }}
          className="relative w-full max-w-6xl bg-[#0d0d0d] border border-white/20 rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] text-[#f5f0e6] flex flex-col max-h-[92vh] my-auto"
          id="admin-panel-modal"
        >
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/10 bg-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    SUNNS Admin Control Hub
                  </h2>
                  <span className="font-mono text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full uppercase">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light">
                  Gestiona pedidos de Stripe, inventario de productos y catálogo de categorías
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              {currentUser && (
                <div className="hidden md:flex flex-col text-right mr-2">
                  <span className="text-[10px] text-zinc-400 font-light">Admin Activo</span>
                  <span className="text-xs font-semibold text-white">{currentUser.email}</span>
                </div>
              )}
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
                id="close-admin-panel-btn"
                title="Cerrar panel de administración"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="px-6 border-b border-white/10 bg-black/40 flex items-center gap-2 overflow-x-auto shrink-0 py-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Historial de Compras</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-white/10 text-zinc-300'}`}>
                {globalOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Gestión de Productos</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'products' ? 'bg-black text-white' : 'bg-white/10 text-zinc-300'}`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-white text-black shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Gestión de Categorías</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'categories' ? 'bg-black text-white' : 'bg-white/10 text-zinc-300'}`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-400 text-black shadow-md font-extrabold'
                  : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-400/10 border border-amber-400/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Textos del Home (Supabase)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-black/40 text-amber-200">
                EDITOR
              </span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto flex-grow space-y-6">

            {/* TAB 1: HISTORIAL DE COMPRAS */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                
                {/* Metric KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-zinc-900/70 border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Facturación Total</span>
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                      ${totalRevenue.toLocaleString()} USD
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">Ventas pasarela Stripe</p>
                  </div>

                  <div className="bg-zinc-900/70 border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Total de Pedidos</span>
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                      {totalOrdersCount}
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">Registrados globalmente</p>
                  </div>

                  <div className="bg-zinc-900/70 border border-white/10 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Ticket Promedio</span>
                      <TrendingUp className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                      ${Math.round(avgTicket)} USD
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">Por cliente verificado</p>
                  </div>

                  <div className="bg-zinc-900/70 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider">Acción Rápida</span>
                      <RefreshCw className="w-4 h-4 text-zinc-400" />
                    </div>
                    <button
                      onClick={refreshOrders}
                      className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/10"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Sincronizar
                    </button>
                  </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Buscar por cliente, correo, nº de orden..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-white/10 focus:border-white rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
                    {['all', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((statusKey) => (
                      <button
                        key={statusKey}
                        onClick={() => setOrderStatusFilter(statusKey)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                          orderStatusFilter === statusKey
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                            : 'bg-zinc-900/60 text-zinc-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {statusKey === 'all' ? 'Todos' : statusKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders List Table */}
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-900/40 border border-white/10 rounded-2xl space-y-2">
                    <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
                    <p className="text-sm font-semibold text-zinc-300">No se encontraron pedidos</p>
                    <p className="text-xs text-zinc-500">Prueba ajustando los filtros o el término de búsqueda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredOrders.map(({ userId, userEmail, userName, order }) => {
                      const badge = getStatusBadge(order.status);
                      const BadgeIcon = badge.icon;

                      return (
                        <div
                          key={order.id}
                          className="bg-zinc-900/70 border border-white/10 hover:border-white/20 p-4 sm:p-5 rounded-2xl transition-all space-y-4"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-white/10">
                            
                            {/* Left: Order Info & Customer */}
                            <div className="flex items-start sm:items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-5 h-5 text-zinc-300" />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono font-bold text-sm text-white">
                                    {order.orderNumber}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                                    <BadgeIcon className="w-3 h-3" />
                                    {badge.label}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                                  <span>Cliente: <strong className="text-white">{userName}</strong> ({userEmail})</span>
                                  <span>•</span>
                                  <span>Fecha: {order.date}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Total & Stripe Payment */}
                            <div className="flex items-center justify-between lg:justify-end gap-4">
                              <div className="text-left lg:text-right">
                                <div className="font-mono text-base font-bold text-white">
                                  ${order.total} USD
                                </div>
                                <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                                  {order.paymentMethod.brand} •••• {order.paymentMethod.last4}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedOrderDetails({ userId, userEmail, userName, order });
                                    setTrackingCourier(order.courier || 'DHL Express Worldwide');
                                    setTrackingNumberInput(order.trackingNumber || '');
                                  }}
                                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                                >
                                  <Eye className="w-3.5 h-3.5" /> Ver Detalle
                                </button>
                              </div>
                            </div>

                          </div>

                          {/* Quick Items Preview & Status Controls */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3 overflow-x-auto py-1">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl px-2.5 py-1.5 shrink-0">
                                  <img src={item.productImage} alt={item.productName} className="w-7 h-7 object-contain bg-zinc-800 rounded p-0.5" referrerPolicy="no-referrer" />
                                  <div>
                                    <p className="font-semibold text-white truncate max-w-[140px] text-[11px]">{item.productName}</p>
                                    <p className="text-[9px] text-zinc-400 font-mono">Cant: {item.quantity} • ${item.unitPrice} USD</p>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Status Changer */}
                            <div className="flex items-center gap-2 self-end md:self-center">
                              <span className="text-[10px] text-zinc-400 font-bold uppercase">Cambiar Estado:</span>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                                className="bg-black border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-300"
                              >
                                <option value="paid">Pagado</option>
                                <option value="processing">En Preparación</option>
                                <option value="shipped">Enviado</option>
                                <option value="delivered">Entregado</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: GESTIÓN DE PRODUCTOS */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="relative w-full sm:max-w-md">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Buscar producto por nombre o descripción..."
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/90 border border-white/10 focus:border-white rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="bg-zinc-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="all">Todas las Categorías</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={handleOpenNewProduct}
                      className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shrink-0"
                    >
                      <Plus className="w-4 h-4" /> Nuevo Producto
                    </button>
                  </div>
                </div>

                {/* Product Form Drawer/Modal */}
                <AnimatePresence>
                  {isProductFormOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-zinc-900/90 border border-amber-400/40 rounded-2xl p-5 sm:p-6 overflow-hidden shadow-2xl space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5 text-amber-300" />
                          <h3 className="font-bold text-sm text-white">
                            {editingProductId ? 'Editar Modelo de Gafas' : 'Añadir Nuevo Modelo al Catálogo'}
                          </h3>
                        </div>
                        <button
                          onClick={() => setIsProductFormOpen(false)}
                          className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">Nombre del Modelo *</label>
                          <input
                            type="text"
                            required
                            value={prodForm.name}
                            onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                            placeholder="Ej. Sovereign Titanium Aviator"
                            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-300"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">Precio (USD) *</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={prodForm.price}
                            onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-300"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">Categoría Principal *</label>
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
                            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-300"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">Subcategoría</label>
                          <select
                            value={prodForm.subcategory}
                            onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-300"
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

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">Color / Acabado</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={prodForm.colorName}
                              onChange={(e) => setProdForm({ ...prodForm, colorName: e.target.value })}
                              placeholder="Ej. Oro Pulido"
                              className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none"
                            />
                            <input
                              type="color"
                              value={prodForm.colorValue}
                              onChange={(e) => setProdForm({ ...prodForm, colorValue: e.target.value })}
                              className="w-10 h-9 p-1 bg-black border border-white/20 rounded-xl cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">URL Imagen de Alta Calidad *</label>
                          <input
                            type="text"
                            required
                            value={prodForm.image}
                            onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-300"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                          <label className="text-[10px] font-bold uppercase text-zinc-300">Descripción Editorial de la Montura *</label>
                          <textarea
                            rows={2}
                            required
                            value={prodForm.description}
                            onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                            placeholder="Describe el diseño, inspiración, tipo de puente y cristales..."
                            className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-300"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                          <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={prodForm.inStock}
                                onChange={(e) => setProdForm({ ...prodForm, inStock: e.target.checked })}
                                className="rounded text-amber-400"
                              />
                              <span className="text-xs font-semibold text-white">Disponible en Stock</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={prodForm.featured}
                                onChange={(e) => setProdForm({ ...prodForm, featured: e.target.checked })}
                                className="rounded text-amber-400"
                              />
                              <span className="text-xs font-semibold text-white">Destacado en Home</span>
                            </label>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsProductFormOpen(false)}
                              className="px-4 py-2.5 rounded-xl border border-white/20 text-zinc-400 hover:text-white text-xs font-semibold"
                            >
                              Cancelar
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 shadow-lg cursor-pointer"
                            >
                              {editingProductId ? 'Guardar Cambios' : 'Publicar Producto'}
                            </button>
                          </div>
                        </div>

                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Product Catalog Grid / Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="bg-zinc-900/70 border border-white/10 hover:border-white/25 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-18 h-18 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-inner">
                          <img src={p.image} alt={p.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full uppercase">
                              {p.category}
                            </span>
                            {p.featured && (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded">
                                ★ Destacado
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-white mt-1 truncate">{p.name}</h4>
                          <p className="text-xs font-mono font-bold text-white mt-0.5">${p.price} USD</p>
                          <p className="text-[10px] text-zinc-400 line-clamp-2 mt-1">{p.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStock(p.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              p.inStock
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {p.inStock ? 'En Stock' : 'Agotado'}
                          </button>

                          <button
                            onClick={() => handleToggleFeatured(p.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] transition-all ${
                              p.featured ? 'text-amber-300 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                            title="Alternar Destacado"
                          >
                            {p.featured ? 'Destacado' : '+ Destacar'}
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStartEditProduct(p)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Editar producto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 3: GESTIÓN DE CATEGORÍAS */}
            {activeTab === 'categories' && (
              <div className="space-y-6">
                
                {/* Create Category Form */}
                <form onSubmit={handleAddCategory} className="bg-zinc-900/90 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-zinc-300 flex items-center gap-1.5">
                      <FolderPlus className="w-4 h-4 text-amber-300" /> Crear Nueva Categoría
                    </label>
                    <input
                      type="text"
                      required
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="Ej. Titanio Ultraligero, Vintage de Autor, Polarizados HD"
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md shrink-0"
                  >
                    Crear Categoría
                  </button>
                </form>

                {/* Categories List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const count = products.filter(p => p.category === cat.name).length;

                    return (
                      <div
                        key={cat.id}
                        className="bg-zinc-900/70 border border-white/10 hover:border-white/20 p-5 rounded-2xl space-y-4 transition-all"
                      >
                        {/* Category Header */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                          {editingCategoryId === cat.id ? (
                            <div className="flex items-center gap-2 flex-1 mr-2">
                              <input
                                type="text"
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                className="bg-black border border-amber-400 text-xs text-white px-2.5 py-1 rounded-lg w-full"
                              />
                              <button
                                onClick={() => handleSaveEditCategory(cat.id)}
                                className="px-2.5 py-1 bg-amber-400 text-black font-bold text-xs rounded-lg"
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => setEditingCategoryId(null)}
                                className="text-xs text-zinc-400 hover:text-white"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white uppercase tracking-wider">
                                {cat.name}
                              </h4>
                              <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                {count} productos
                              </span>
                            </div>
                          )}

                          {editingCategoryId !== cat.id && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingCategoryId(cat.id);
                                  setEditingCategoryName(cat.name);
                                }}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                title="Editar nombre"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Eliminar categoría"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Subcategories list */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase text-zinc-400">Subcategorías del Menú</label>
                          <div className="flex flex-wrap gap-2">
                            {cat.subcategories.map((sub) => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center gap-1.5 bg-black/60 border border-white/10 text-zinc-300 px-3 py-1 rounded-full text-xs"
                              >
                                <span>{sub.name}</span>
                                <button
                                  onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                                  className="p-0.5 rounded-full hover:bg-rose-500/30 text-zinc-500 hover:text-rose-300"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Add subcategory */}
                        <div className="flex gap-2 pt-2 border-t border-white/10">
                          <input
                            type="text"
                            placeholder="Nueva subcategoría..."
                            value={newSubcatInputs[cat.id] || ''}
                            onChange={(e) => setNewSubcatInputs({ ...newSubcatInputs, [cat.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSubcategory(cat.id);
                              }
                            }}
                            className="w-full bg-black border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSubcategory(cat.id)}
                            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
                          >
                            + Añadir
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 4: GESTIÓN DE TEXTOS DEL HOME (SUPABASE) */}
            {activeTab === 'home' && (
              <AdminHomeEditor
                content={homeContent || DEFAULT_HOME_CONTENT}
                onUpdateContent={(updated) => {
                  if (setHomeContent) setHomeContent(updated);
                  showToast('Portada actualizada con éxito');
                }}
                showToast={showToast}
              />
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 border-t border-white/10 bg-black/80 flex items-center justify-between text-xs text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Base de datos sincronizada en tiempo real</span>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:underline text-xs font-semibold"
            >
              Volver a la Tienda
            </button>
          </div>

        </motion.div>

        {/* ORDER DETAILS POPUP MODAL */}
        <AnimatePresence>
          {selectedOrderDetails && (
            <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-zinc-950 border border-white/20 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-5 text-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-white">Detalle de Compra: {selectedOrderDetails.order.orderNumber}</h3>
                    <p className="text-xs text-zinc-400">Cliente: {selectedOrderDetails.userName} ({selectedOrderDetails.userEmail})</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderDetails(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Artículos Comprados</h4>
                  {selectedOrderDetails.order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <img src={it.productImage} alt={it.productName} className="w-12 h-12 object-contain bg-white rounded-lg p-1" referrerPolicy="no-referrer" />
                        <div>
                          <h5 className="font-bold text-xs text-white">{it.productName}</h5>
                          <p className="text-[10px] text-zinc-400">Color: {it.colorName} • {it.lensType || 'Cristal Estándar'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-white">${it.totalPrice} USD</p>
                        <p className="text-[10px] text-zinc-400">Cant: {it.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-zinc-900/60 p-4 rounded-xl border border-white/10">
                  <div>
                    <h5 className="font-bold uppercase text-zinc-400 text-[10px] mb-1">Dirección de Envío</h5>
                    <p className="text-white font-medium">{selectedOrderDetails.order.shippingAddress.fullName}</p>
                    <p className="text-zinc-300">{selectedOrderDetails.order.shippingAddress.address}</p>
                    <p className="text-zinc-300">{selectedOrderDetails.order.shippingAddress.city}, {selectedOrderDetails.order.shippingAddress.zip}</p>
                    <p className="text-zinc-400">{selectedOrderDetails.order.shippingAddress.country} • Tel: {selectedOrderDetails.order.shippingAddress.phone}</p>
                  </div>
                  <div>
                    <h5 className="font-bold uppercase text-zinc-400 text-[10px] mb-1">Pasarela Stripe & Pago</h5>
                    <p className="text-white font-mono font-bold text-sm">${selectedOrderDetails.order.total} USD</p>
                    <p className="text-zinc-400 font-mono text-[11px]">{selectedOrderDetails.order.paymentMethod.brand.toUpperCase()} terminada en {selectedOrderDetails.order.paymentMethod.last4}</p>
                    {selectedOrderDetails.order.paymentMethod.stripePaymentIntentId && (
                      <p className="text-[10px] text-emerald-400 font-mono mt-1 truncate">ID: {selectedOrderDetails.order.paymentMethod.stripePaymentIntentId}</p>
                    )}
                  </div>
                </div>

                {/* Tracking Management */}
                <div className="bg-zinc-900 p-4 rounded-xl border border-white/10 space-y-3">
                  <h5 className="font-bold uppercase text-amber-300 text-[10px] flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Asignar Seguimiento de Entrega
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={trackingCourier}
                      onChange={(e) => setTrackingCourier(e.target.value)}
                      placeholder="Empresa (DHL, FedEx, UPS)..."
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={trackingNumberInput}
                      onChange={(e) => setTrackingNumberInput(e.target.value)}
                      placeholder="Número de guía / Tracking #"
                      className="bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <button
                    onClick={() => handleSaveTracking(selectedOrderDetails.order.id)}
                    className="w-full py-2.5 bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-200 transition-all"
                  >
                    Guardar Guía y Marcar como Enviado
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AnimatePresence>
  );
}
