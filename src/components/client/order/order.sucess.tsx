import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Result
        status="success"
        title="Order Placed Successfully"
        subTitle="Your order has been recorded in the system."
        extra={[
          <Button type="primary" key="home" onClick={() => navigate("/")}>
            Home
          </Button>,
          <Button key="history">Order History</Button>,
        ]}
      />
    </div>
  );
};

export default OrderSuccess;
