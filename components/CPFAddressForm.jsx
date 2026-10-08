import React, { useState } from 'react';

export default function CPFAddressForm({ onNext }) {
  const [data, setData] = useState({ cpf: '', endereco: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Logística de Envio</h2>
      <p className="text-sm text-slate-500">O parceiro logístico exige o CPF para emissão da nota fiscal do produto premium.</p>

      <div>
        <label className="block text-sm font-medium text-slate-700">CPF</label>
        <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        value={data.cpf} onChange={(e) => setData({...data, cpf: e.target.value})} placeholder="000.000.000-00" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Endereço Completo (Rua, Número, Bairro, Cidade, UF, CEP)</label>
        <textarea required rows="3" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        value={data.endereco} onChange={(e) => setData({...data, endereco: e.target.value})} placeholder="Digite seu endereço completo" />
      </div>

      <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition">
        Verificar Elegibilidade
      </button>
    </form>
  );
}

