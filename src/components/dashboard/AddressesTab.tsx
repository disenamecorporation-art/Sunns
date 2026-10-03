/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Edit3, CheckCircle2, Star, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, SavedAddress } from '../../types';
import { updateUserProfile } from '../../lib/userService';

interface AddressesTabProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export default function AddressesTab({ currentUser, onUpdateUser }: AddressesTabProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Address Form State
  const [title, setTitle] = useState('Casa');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('FL');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('Estados Unidos');
  const [phone, setPhone] = useState('');
  const [isDefaultShipping, setIsDefaultShipping] = useState(false);
  const [isDefaultBilling, setIsDefaultBilling] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const addresses = currentUser.addresses || [];

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('Casa');
    setFullName(currentUser.name || '');
    setAddress('');
    setCity('Miami');
    setState('FL');
    setZip('33131');
    setCountry('Estados Unidos');
    setPhone(currentUser.phone || '+1 (786) 825-9355');
    setIsDefaultShipping(addresses.length === 0);
    setIsDefaultBilling(addresses.length === 0);
    setErrorMsg('');
    setShowAddressModal(true);
  };

  const handleOpenEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setTitle(addr.title);
    setFullName(addr.fullName);
    setAddress(addr.address);
    setCity(addr.city);
    setState(addr.state);
    setZip(addr.zip);
    setCountry(addr.country);
    setPhone(addr.phone);
    setIsDefaultShipping(addr.isDefaultShipping);
    setIsDefaultBilling(addr.isDefaultBilling);
    setErrorMsg('');
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !address || !city || !zip || !phone) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }

    let updatedList: SavedAddress[];

    if (editingId) {
      updatedList = addresses.map(a => {
        if (a.id === editingId) {
          return {
            ...a,
            title,
            fullName,
            address,
            city,
            state,
            zip,
            country,
            phone,
            isDefaultShipping,
            isDefaultBilling,
          };
        }
        return {
          ...a,
          isDefaultShipping: isDefaultShipping ? false : a.isDefaultShipping,
          isDefaultBilling: isDefaultBilling ? false : a.isDefaultBilling,
        };
      });
    } else {
      const newAddress: SavedAddress = {
        id: `addr_${Date.now()}`,
        title,
        fullName,
        address,
        city,
        state,
        zip,
        country,
        phone,
        isDefaultShipping: isDefaultShipping || addresses.length === 0,
        isDefaultBilling: isDefaultBilling || addresses.length === 0,
      };

      updatedList = [
        ...addresses.map(a => ({
          ...a,
          isDefaultShipping: newAddress.isDefaultShipping ? false : a.isDefaultShipping,
          isDefaultBilling: newAddress.isDefaultBilling ? false : a.isDefaultBilling,
        })),
        newAddress,
      ];
    }

    const res = await updateUserProfile(currentUser.id, { addresses: updatedList });
    if (res.success && res.user) {
      onUpdateUser(res.user);
      setShowAddressModal(false);
    } else {
      setErrorMsg(res.error || 'Error al guardar la dirección.');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('¿Desea eliminar esta dirección de entrega?')) {
      const updated = addresses.filter(a => a.id !== id);
      if (updated.length > 0 && !updated.some(a => a.isDefaultShipping)) {
        updated[0].isDefaultShipping = true;
      }
      const res = await updateUserProfile(currentUser.id, { addresses: updated });
      if (res.success && res.user) {
        onUpdateUser(res.user);
      }
    }
  };

  const handleSetDefaultShipping = async (id: string) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefaultShipping: a.id === id,
    }));
    const res = await updateUserProfile(currentUser.id, { addresses: updated });
    if (res.success && res.user) {
      onUpdateUser(res.user);
    }
  };

  return (
    <div className="space-y-6 text-black">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-300 pb-4">
        <div>
          <h3 className="text-xl font-bold text-black flex items-center gap-2">
            <MapPin className="w-5 h-5 text-black stroke-[2]" />
            Libreta de Direcciones de Envío y Facturación
          </h3>
          <p className="text-xs font-semibold text-black mt-0.5">
            Administra tus residencias y destinos para entregas exprés aseguradas de gafas SUNNS.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-black text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-neutral-900 transition-all flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Nueva Dirección
        </button>
      </div>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="bg-neutral-50 border-2 border-neutral-200 rounded-2xl p-8 text-center space-y-3">
          <MapPin className="w-10 h-10 text-black mx-auto stroke-[2]" />
          <h4 className="font-bold text-base text-black">No hay direcciones registradas</h4>
          <p className="text-xs text-neutral-800 font-medium max-w-sm mx-auto">
            Guarda tu dirección preferida para un checkout automático en segundos.
          </p>
          <button
            onClick={handleOpenNew}
            className="bg-black text-white text-[11px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors cursor-pointer shadow"
          >
            Añadir Dirección Principal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border-2 border-neutral-200 rounded-2xl p-5 hover:border-black transition-all shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] tracking-wider uppercase font-bold text-black bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-300">
                    {addr.title}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {addr.isDefaultShipping ? (
                      <span className="text-[10px] font-bold text-green-900 bg-green-100 border border-green-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-3 h-3 fill-green-900" /> Envío Predeterminado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefaultShipping(addr.id)}
                        className="text-[10px] uppercase tracking-wider text-black font-bold hover:underline cursor-pointer"
                      >
                        Hacer Predeterminada
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-black">{addr.fullName}</h4>
                  <p className="text-xs text-black mt-1 font-medium leading-relaxed">
                    {addr.address}<br />
                    {addr.city}, {addr.state} {addr.zip}<br />
                    {addr.country}
                  </p>
                  <p className="text-xs text-black font-semibold mt-1">Tel: {addr.phone}</p>
                </div>
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-neutral-200">
                <button
                  onClick={() => handleOpenEdit(addr)}
                  className="p-2 rounded-lg hover:bg-neutral-100 text-black transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-neutral-300"
                >
                  <Edit3 className="w-3.5 h-3.5 stroke-[2]" /> Editar
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-700 transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5 stroke-[2]" /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADDRESS MODAL */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-neutral-300 flex flex-col text-black"
            >
              <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-black stroke-[2]" />
                  <h4 className="font-bold text-base text-black">
                    {editingId ? 'Editar Dirección' : 'Nueva Dirección de Entrega'}
                  </h4>
                </div>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="p-1.5 rounded-full text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2]" />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="p-6 space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0 stroke-[2]" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Etiqueta</label>
                    <select
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    >
                      <option value="Casa">Casa</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Boutique">Boutique</option>
                      <option value="Residencia de Playa">Residencia de Playa</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Nombre del Receptor</label>
                    <input
                      type="text"
                      required
                      placeholder="Alexander Rossi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-black">Dirección de Entrega</label>
                  <input
                    type="text"
                    required
                    placeholder="801 Brickell Bay Dr, Apt 1402"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Ciudad</label>
                    <input
                      type="text"
                      required
                      placeholder="Miami"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Estado / Prov</label>
                    <input
                      type="text"
                      required
                      placeholder="FL"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Código Postal</label>
                    <input
                      type="text"
                      required
                      placeholder="33131"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">País</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-black">Teléfono de Contacto</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (786) 825-9355"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <label className="flex items-center gap-2 cursor-pointer text-black font-semibold">
                    <input
                      type="checkbox"
                      checked={isDefaultShipping}
                      onChange={(e) => setIsDefaultShipping(e.target.checked)}
                      className="rounded accent-black w-4 h-4 cursor-pointer"
                    />
                    <span>Establecer como dirección predeterminada de envío</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-black text-white hover:bg-neutral-900 transition-colors cursor-pointer shadow-md"
                  >
                    Guardar Dirección
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
