import CardPayment from "@/checkout/paymentDetails/cardPayment";
import YapePayment from "@/checkout/paymentDetails/yapePayment";
import PlinPayment from "@/checkout/paymentDetails/plinPayment";
import PaymentProcessingModal from "@/checkout/paymentDetails/paymentProcessingModal";

interface PaymentDetailsProps {
  method: string;
  total: number;
  onPayment: () => Promise<void>;
  isProcessing?: boolean;
}

export default function PaymentDetails({
  method,
  total,
  onPayment,
  isProcessing = false,
}: PaymentDetailsProps) {
  return (
    <>
      {method === "card" && (
        <CardPayment total={total} onPayment={onPayment} />
      )}

      {method === "yape" && (
        <YapePayment total={total} onPayment={onPayment} isProcessing={isProcessing} />
      )}

      {method === "plin" && (
        <PlinPayment total={total} onPayment={onPayment} isProcessing={isProcessing} />
      )}

      {isProcessing && <PaymentProcessingModal />}
    </>
  );
}
