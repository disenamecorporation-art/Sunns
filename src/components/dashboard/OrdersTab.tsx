/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Receipt, Search, ExternalLink, PackageCheck, Truck, 
  Clock, ShieldCheck, Download, ChevronRight, X, ArrowLeft,
  CreditCard, CheckCircle2, RotateCcw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, CartItem } from '../../types';

interface OrdersTabProps {
  orders: Order[];
  onAddToCart?: (item: any) => void;
  onOpenShop?: () => void;
}

export default function OrdersTab({ orders, onAddToCart, onOpenShop }: OrdersTabProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'delivered' | 'shipped' | 'paid'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);

  // Filter and search
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = 
      filterStatus === 'all' ? true : 
      filterStatus === 'delivered' ? order.status === 'delivered' :
      filterStatus === 'shipped' ? order.status === 'shipped' :
      order.status === 'paid' || order.status === 'processing';

    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(it => it.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleReorder = (order: Order) => {
    if (onAddToCart) {
      order.items.forEach(item => {
        onAddToCart({
          product: {
            id: item.productId,
            name: item.productName,
            price: item.unitPrice,
            category: item.category,
            description: 'Pieza óptica de autor Sunns',
            details: ['Protección 100% UV400', 'Acetato pulido a mano'],
            image: item.productImage,
            images: [item.productImage],
            colors: [{ name: item.colorName, value: item.colorValue }],
            inStock: true,
            featured: false,
            rating: 4.9,
            reviewsCount: 1,
          },
          quantity: item.quantity,
          selectedColor: { name: item.colorName, value: item.colorValue },
        });
      });
      setReorderSuccess(`¡Piezas del pedido ${order.orderNumber} añadidas a tu bolsa de compras!`);
      setTimeout(() => setReorderSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6 text-black">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-300 pb-4">
        <div>
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <Receipt className="w-5 h-5 text-black stroke-[2]" />
            Historial de Pedidos
          </h3>
          <p className="text-xs font-semibold text-black mt-0.5">
            Consulta tus compras, números de guía y seguimiento de envíos.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-xl border border-neutral-300 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              filterStatus === 'all' ? 'bg-black text-white shadow-sm' : 'text-black hover:bg-neutral-200'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            className={`px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              filterStatus === 'shipped' ? 'bg-black text-white shadow-sm' : 'text-black hover:bg-neutral-200'
            }`}
          >
            En Camino
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-3.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              filterStatus === 'delivered' ? 'bg-black text-white shadow-sm' : 'text-black hover:bg-neutral-200'
            }`}
          >
            Entregados
          </button>
        </div>
      </div>

      {/* Reorder Notification */}
      {reorderSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-green-50 border border-green-300 text-green-900 p-3.5 rounded-xl text-xs flex items-center justify-between font-semibold"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>{reorderSuccess}</span>
          </div>
          {onOpenShop && (
            <button
              onClick={onOpenShop}
              className="font-bold underline uppercase text-[10px] tracking-wider text-green-950"
            >
              Ver Carrito
            </button>
          )}
        </motion.div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-black stroke-[2]" />
        <input
          type="text"
          placeholder="Buscar por número de orden (ej. SN-2026...) o modelo de gafas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-2 border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-black placeholder:text-neutral-500 focus:bg-white focus:outline-none focus:border-black transition-all"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:underline text-xs font-bold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center mx-auto text-black">
            <PackageCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <h4 className="text-base font-bold text-black">No se encontraron pedidos</h4>
          <p className="text-xs text-neutral-800 max-w-sm mx-auto font-medium">
            {searchTerm 
              ? 'No hay ninguna orden que coincida con los términos de búsqueda.' 
              : 'Aún no has realizado ninguna compra con esta cuenta. ¡Explora nuestra colección 2026!'}
          </p>
          {onOpenShop && (
            <button
              onClick={onOpenShop}
              className="bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer mt-2 shadow"
            >
              Explorar Catálogo
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-2 border-neutral-200 rounded-2xl p-5 hover:border-black transition-all shadow-sm space-y-4"
              id={`order-card-${order.id}`}
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center font-bold text-xs text-black">
                    {order.orderNumber.split('-')[2] || 'SN'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-black">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'delivered' 
                          ? 'bg-green-100 text-green-900 border border-green-300' 
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-neutral-100 text-neutral-900 border border-neutral-300'
                      }`}>
                        {order.statusLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-700 font-medium mt-0.5">
                      Comprado el {order.date} • Pago verificado con Stripe
                    </p>
                  </div>
                </div>

                <div className="sm:text-right flex items-center sm:block justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-black font-bold block">Total Pagado</span>
                  <span className="text-base font-bold text-black">${order.total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* Order Items Mini Gallery */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img 
                        src={item.productImage} 
                        alt={item.productName} 
                        className="w-12 h-12 object-contain bg-white rounded-lg p-1 border border-neutral-300 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <h5 className="font-bold text-xs text-black truncate">{item.productName}</h5>
                        <p className="text-[11px] text-neutral-800 flex items-center gap-1.5 mt-0.5 font-medium">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/30 shrink-0 inline-block"
                            style={{ backgroundColor: item.colorValue }}
                          />
                          <span>{item.colorName}</span>
                          <span>•</span>
                          <span>Cant: {item.quantity}</span>
                          {item.lensType && (
                            <>
                              <span>•</span>
                              <span className="text-black font-semibold">{item.lensType}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-xs text-black">${item.totalPrice.toFixed(2)} USD</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions & Shipping Status */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-2 text-xs border-t border-neutral-200 font-medium">
                <div className="flex items-center gap-2 text-black">
                  <CreditCard className="w-4 h-4 text-black stroke-[2]" />
                  <span>Stripe Card: <strong className="uppercase font-bold text-black">{order.paymentMethod.brand} ****{order.paymentMethod.last4}</strong></span>
                  {order.trackingNumber && (
                    <>
                      <span className="text-neutral-400">•</span>
                      <span className="text-[11px] text-blue-900 font-mono flex items-center gap-1 font-bold">
                        <Truck className="w-3.5 h-3.5" /> {order.trackingNumber}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowReceiptModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border-2 border-neutral-300 text-black hover:bg-neutral-100 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 stroke-[2]" /> Factura / Recibo
                  </button>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5 stroke-[2]" /> Comprar de Nuevo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECEIPT / INVOICE MODAL */}
      <AnimatePresence>
        {showReceiptModal && selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-300 flex flex-col max-h-[90vh] text-black"
            >
              {/* Receipt Header */}
              <div className="bg-black text-white p-6 flex justify-between items-start">
                <div>
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-neutral-300">Comprobante Fiscal Sunns</span>
                  <h3 className="text-xl font-bold tracking-wide mt-1 text-white">Recibo de Compra Oficial</h3>
                  <p className="text-xs text-neutral-300 font-medium">Orden: {selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2]" />
                </button>
              </div>

              {/* Receipt Content */}
              <div className="p-6 overflow-y-auto space-y-5 text-xs text-black">
                
                {/* Meta info */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black block">Fecha y Hora</span>
                    <span className="font-semibold text-black">{selectedOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black block">Pasarela de Pago</span>
                    <span className="text-green-800 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[2]" /> Stripe Verified
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black block">Stripe Payment Intent</span>
                    <span className="font-mono text-[10px] text-black font-semibold truncate block">
                      {selectedOrder.paymentMethod.stripePaymentIntentId || 'pi_sunns_verified_live'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-black block">Tarjeta Utilizada</span>
                    <span className="font-bold uppercase text-black">
                      {selectedOrder.paymentMethod.brand} •••• {selectedOrder.paymentMethod.last4}
                    </span>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Destino de Entrega</span>
                  <p className="font-bold text-xs text-black">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-[11px] text-neutral-800 font-medium">
                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}, {selectedOrder.shippingAddress.country}
                  </p>
                  <p className="text-[11px] text-black font-semibold">Teléfono: {selectedOrder.shippingAddress.phone}</p>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-black block">Desglose de Artículos</span>
                  <div className="divide-y divide-neutral-200">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-black">{item.quantity}x {item.productName}</p>
                          <p className="text-[11px] text-neutral-700 font-medium">{item.colorName} • {item.lensType || 'Filtro UV400'}</p>
                        </div>
                        <span className="font-bold text-sm text-black">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-neutral-50 p-4 rounded-xl space-y-2 border border-neutral-200">
                  <div className="flex justify-between text-xs text-black font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold">${selectedOrder.subtotal.toFixed(2)} USD</span>
                  </div>
                  <div className="flex justify-between text-xs text-black font-medium">
                    <span>Envío Courier Asegurado</span>
                    <span className="text-green-800 font-bold">Gratis (Cortesía Sunns)</span>
                  </div>
                  <div className="flex justify-between text-xs text-black font-medium">
                    <span>Impuestos y tasas ópticas</span>
                    <span className="font-bold">$0.00 USD</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-black border-t border-neutral-300 pt-2">
                    <span>Total Pagado (USD)</span>
                    <span className="text-base font-bold">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-center text-[11px] text-neutral-600 font-medium">
                  SUNNS OPTICS LLC • 801 Brickell Bay Dr, Miami, FL • info@sunnsshop.com
                </div>

              </div>

              {/* Receipt Footer Actions */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-end gap-3">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-black hover:bg-neutral-200 transition-colors cursor-pointer font-bold"
                >
                  Cerrar
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="px-5 py-2 rounded-xl text-xs bg-black text-white hover:bg-neutral-900 transition-colors cursor-pointer font-bold flex items-center gap-2 shadow-md"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2]" /> Imprimir / Guardar PDF
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
