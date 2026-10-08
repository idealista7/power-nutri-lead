import React, { useState } from 'react';

export default function PersonalForm({ onNext }) {
  const [data, setData] = useState({ nome: '', email: '', telefone: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Dados do Beneficiário</h2>
      <p className="text-sm text-slate-500">Para garantir que o iPhone chegue a você, precisamos confirmar sua identidade.</p>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">Nome Completo</label>
        <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" 
        value={data.nome} onChange={(e) => setData({...data, nome: e.target.value})} placeholder="Ex: João da Silva" />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">E-mail</label>
        <input required type="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        value={data.email} onChange={(e) => setData({...data, email: e.target.value})} placeholder="voce@email.com" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Telefone (WhatsApp)</label>
        <input required type="tel" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        value={data.telefone} onChange={(e) => setData({...data, telefone: e.target.value})} placeholder="(11) 99999-9999" />
      </div>

      <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
        Continuar para Entrega
      </button>
    </form>
  );
}
