/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, Glasses, ShieldCheck, CheckCircle2, Sparkles, 
  FileText, Award, HelpCircle, Save 
} from 'lucide-react';
import { User, OpticalPrescription } from '../../types';
import { updateUserProfile } from '../../lib/userService';

interface PrescriptionTabProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
}

export default function PrescriptionTab({ currentUser, onUpdateUser }: PrescriptionTabProps) {
  const current = currentUser.prescription || {};

  const [sphereOD, setSphereOD] = useState(current.sphereOD || '-1.00');
  const [sphereOS, setSphereOS] = useState(current.sphereOS || '-1.00');
  const [cylinderOD, setCylinderOD] = useState(current.cylinderOD || '0.00');
  const [cylinderOS, setCylinderOS] = useState(current.cylinderOS || '0.00');
  const [axisOD, setAxisOD] = useState(current.axisOD || '0');
  const [axisOS, setAxisOS] = useState(current.axisOS || '0');
  const [pupillaryDistance, setPupillaryDistance] = useState(current.pupillaryDistance || '63');
  const [preferredTreatment, setPreferredTreatment] = useState<'polarizado' | 'blue_light' | 'fotocromatico' | 'antirreflejo_hd'>(
    current.preferredLensTreatment || 'polarizado'
  );
  const [notes, setNotes] = useState(current.notes || '');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPrescription: OpticalPrescription = {
      sphereOD,
      sphereOS,
      cylinderOD,
      cylinderOS,
      axisOD,
      axisOS,
      pupillaryDistance,
      preferredLensTreatment: preferredTreatment,
      notes,
    };

    const res = await updateUserProfile(currentUser.id, { prescription: updatedPrescription });
    setIsSaving(false);

    if (res.success && res.user) {
      onUpdateUser(res.user);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  return (
    <div className="space-y-6 text-black">
      
      {/* Header */}
      <div className="border-b border-neutral-300 pb-4">
        <h3 className="text-xl font-bold text-black flex items-center gap-2">
          <Eye className="w-5 h-5 text-black stroke-[2]" />
          Ficha Óptica & Calibración de Cristales
        </h3>
        <p className="text-xs font-semibold text-black mt-0.5">
          Guarda tus valores refractivos y preferencias de filtro para aplicar automáticamente a tus monturas SUNNS.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-green-50 border border-green-300 text-green-900 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-green-700 stroke-[2]" />
          <span>¡Ficha óptica guardada con éxito! Tus próximas compras vendrán calibradas con esta graduación.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSavePrescription} className="space-y-6">
        
        {/* Refraction Table */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
            <h4 className="font-bold text-sm text-black flex items-center gap-2">
              <Glasses className="w-4 h-4 text-black stroke-[2]" /> Graduación de Lentes
            </h4>
            <span className="text-[10px] uppercase tracking-wider font-bold text-black">Dioptrías (D)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-[10px] uppercase font-bold text-black">
                  <th className="py-2.5 px-2">Ojo</th>
                  <th className="py-2.5 px-2">Esfera (SPH)</th>
                  <th className="py-2.5 px-2">Cilindro (CYL)</th>
                  <th className="py-2.5 px-2">Eje (AXIS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-mono">
                <tr>
                  <td className="py-3 px-2 font-sans font-bold text-black">OD (Derecho)</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={sphereOD}
                      onChange={(e) => setSphereOD(e.target.value)}
                      placeholder="-1.25"
                      className="w-24 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center font-mono text-xs font-bold text-black focus:outline-none focus:border-black"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={cylinderOD}
                      onChange={(e) => setCylinderOD(e.target.value)}
                      placeholder="-0.50"
                      className="w-24 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center font-mono text-xs font-bold text-black focus:outline-none focus:border-black"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={axisOD}
                      onChange={(e) => setAxisOD(e.target.value)}
                      placeholder="90°"
                      className="w-24 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center font-mono text-xs font-bold text-black focus:outline-none focus:border-black"
                    />
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-2 font-sans font-bold text-black">OS (Izquierdo)</td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={sphereOS}
                      onChange={(e) => setSphereOS(e.target.value)}
                      placeholder="-1.00"
                      className="w-24 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center font-mono text-xs font-bold text-black focus:outline-none focus:border-black"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={cylinderOS}
                      onChange={(e) => setCylinderOS(e.target.value)}
                      placeholder="-0.25"
                      className="w-24 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center font-mono text-xs font-bold text-black focus:outline-none focus:border-black"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      value={axisOS}
                      onChange={(e) => setAxisOS(e.target.value)}
                      placeholder="85°"
                      className="w-24 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center font-mono text-xs font-bold text-black focus:outline-none focus:border-black"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-black block">Distancia Pupilar (DP)</label>
              <span className="text-xs text-neutral-800 font-medium">Milímetros entre ambos centros oculares</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <input
                type="text"
                value={pupillaryDistance}
                onChange={(e) => setPupillaryDistance(e.target.value)}
                placeholder="63"
                className="w-20 bg-white border-2 border-neutral-300 rounded-lg px-2.5 py-1.5 text-center text-xs font-bold text-black focus:outline-none focus:border-black"
              />
              <span className="text-xs font-bold text-black">mm</span>
            </div>
          </div>
        </div>

        {/* Preferred Lens Treatment */}
        <div className="bg-white border-2 border-neutral-200 rounded-2xl p-5 space-y-3 shadow-sm">
          <h4 className="font-bold text-sm text-black">Tratamiento de Cristales Predeterminado</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className={`p-3.5 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              preferredTreatment === 'polarizado' ? 'bg-neutral-50 border-black shadow-sm' : 'border-neutral-200 hover:bg-neutral-50'
            }`}>
              <input
                type="radio"
                name="treatment"
                value="polarizado"
                checked={preferredTreatment === 'polarizado'}
                onChange={() => setPreferredTreatment('polarizado')}
                className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
              />
              <div>
                <strong className="block text-black font-bold text-xs">Polarizado HD UV400</strong>
                <span className="text-xs text-neutral-800 font-medium">Elimina destellos de agua, asfalto y nieve con nitidez absoluta.</span>
              </div>
            </label>

            <label className={`p-3.5 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              preferredTreatment === 'blue_light' ? 'bg-neutral-50 border-black shadow-sm' : 'border-neutral-200 hover:bg-neutral-50'
            }`}>
              <input
                type="radio"
                name="treatment"
                value="blue_light"
                checked={preferredTreatment === 'blue_light'}
                onChange={() => setPreferredTreatment('blue_light')}
                className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
              />
              <div>
                <strong className="block text-black font-bold text-xs">Filtro Luz Azul (Blue-Block)</strong>
                <span className="text-xs text-neutral-800 font-medium">Ideal para pantallas digitales, trabajo de oficina y descanso visual.</span>
              </div>
            </label>

            <label className={`p-3.5 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              preferredTreatment === 'fotocromatico' ? 'bg-neutral-50 border-black shadow-sm' : 'border-neutral-200 hover:bg-neutral-50'
            }`}>
              <input
                type="radio"
                name="treatment"
                value="fotocromatico"
                checked={preferredTreatment === 'fotocromatico'}
                onChange={() => setPreferredTreatment('fotocromatico')}
                className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
              />
              <div>
                <strong className="block text-black font-bold text-xs">Fotocromático Inteligente</strong>
                <span className="text-xs text-neutral-800 font-medium">Cristales que se oscurecen dinámicamente con la luz del sol.</span>
              </div>
            </label>

            <label className={`p-3.5 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
              preferredTreatment === 'antirreflejo_hd' ? 'bg-neutral-50 border-black shadow-sm' : 'border-neutral-200 hover:bg-neutral-50'
            }`}>
              <input
                type="radio"
                name="treatment"
                value="antirreflejo_hd"
                checked={preferredTreatment === 'antirreflejo_hd'}
                onChange={() => setPreferredTreatment('antirreflejo_hd')}
                className="mt-0.5 accent-black w-4 h-4 cursor-pointer"
              />
              <div>
                <strong className="block text-black font-bold text-xs">Antirreflejo HD Multicapa</strong>
                <span className="text-xs text-neutral-800 font-medium">Transparencia cristalina con repelente de polvo y huellas.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-1 text-xs">
          <label className="text-[10px] uppercase font-bold text-black">Notas Ópticas Especiales</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Especificaciones adicionales o indicación de tu optometrista..."
            className="w-full bg-white border-2 border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-black focus:bg-white focus:outline-none focus:border-black"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-black text-white py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neutral-900 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4 stroke-[2]" />
          {isSaving ? 'Guardando Calibración...' : 'Guardar Ficha Óptica'}
        </button>

      </form>

    </div>
  );
}
