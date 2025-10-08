import Lottie from "lottie-react";
import shoppingBagAnimation from "@/assets/icons/shopping bag.json";

const AnimatedShoppingBag = () => {
  return (
    <div className="w-14 h-14">
      <Lottie
        animationData={shoppingBagAnimation}
        loop={true}        // Repite infinitamente
        autoplay={true}    // Empieza automáticamente
      />
    </div>
  );
};

export default AnimatedShoppingBag;
