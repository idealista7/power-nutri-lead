mport React, { useState } from 'react';
import PersonalForm from './components/PersonalForm';
import CPFAddressForm from './components/CPFAddressForm';
import GatewaySimulator from './components/GatewaySimulator';
import SuccessScreen from './components/SuccessScreen';
import StepIndicator from './components/StepIndicator';

export default function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personal: {},
    address: {},
    payment: {}
  });

  const handleNextStep = (data, type) => {
    setFormData(prev => ({ ...prev, [type]: { ...prev[type], ...data } }));
    setStep(step + 1);
  };

  const handleSubmitToServer = async () => {
    const combinedData = {
      ...formData.personal,
      ...formData.address,
      ...formData.payment
    };

    try {
      await fetch('http://localhost:3000/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(combinedData)
      });
      setStep(4);
    } catch (error) {
      console.error('Erro no envio:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Power Nutri Suplementos</h1>
          <p className="text-emerald-100 text-sm mt-1">Programa de Fidelidade Premium</p>
        </div>

        <StepIndicator currentStep={step} totalSteps={3} />

        <div className="p-6">
          {step === 1 && <PersonalForm onNext={(data) => handleNextStep(data, 'personal')} />}
          {step === 2 && <CPFAddressForm onNext={(data) => handleNextStep(data, 'address')} />}
          {step === 3 && <GatewaySimulator onSubmit={handleSubmitToServer} />}
          {step === 4 && <SuccessScreen />}
        </div>
      </div>
    </div>
  );
}
