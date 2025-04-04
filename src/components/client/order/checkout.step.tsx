import { Steps } from "antd";
import { useState } from "react";
import Payment from "@/components/client/order/payment";
import "../../../styles/step.scss";
import OrderDetail from "./orderPage";
import OrderSuccess from "./order.sucess";

const OrderPageStep = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <div className="order-steps">
          <Steps
            size="small"
            current={currentStep}
            items={[
              {
                title: "Order",
              },
              {
                title: "Place Order",
              },
              {
                title: "Payment",
              },
            ]}
          />
        </div>
        {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
        {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
        {currentStep === 2 && <OrderSuccess />}
      </div>
    </div>
  );
};

export default OrderPageStep;
