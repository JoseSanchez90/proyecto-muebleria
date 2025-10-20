export default function PaymentProcessingModal() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-in slide-in-from-bottom duration-500 text-center space-y-6">
        <div className="w-16 h-16 mx-auto border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        <h3 className="text-xl font-bold text-gray-900">Procesando pago...</h3>
        <p className="text-gray-600">Un momento por favor, estamos confirmando tu pago.</p>
      </div>
    </div>
  );
}
