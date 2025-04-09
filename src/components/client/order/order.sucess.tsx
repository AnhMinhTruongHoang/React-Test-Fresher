import { updatePaymentOrderAPI } from "@/components/services/api";
import { Button, Result, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { App } from "antd";

const ReturnURLPage = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const paymentRef = searchParams?.get("vnp_TxnRef") ?? "";
  const responseCode = searchParams?.get("vnp_ResponseCode") ?? "";

  const [loading, setLoading] = useState<boolean>(true);
  const { notification } = App.useApp();

  useEffect(() => {
    if (paymentRef) {
      const changePaymentStatus = async () => {
        setLoading(true);

        const res = await updatePaymentOrderAPI(
          responseCode === "00" ? "PAYMENT_SUCCEED" : "PAYMENT_FAILED",
          paymentRef
        );
        if (res.data) {
        } else {
          notification.error({
            message: "An error occurred",
            description:
              res.message && Array.isArray(res.message)
                ? res.message[0]
                : res.message,
            duration: 5,
          });
        }

        setLoading(false);
      };
      changePaymentStatus();
    }
  }, [paymentRef, responseCode, notification]);

  return (
    <>
      {loading ? (
        <div style={{ padding: 50 }}>
          <Skeleton active />
        </div>
      ) : (
        <>
          {responseCode === "00" ? (
            <Result
              status="success"
              title="Order placed successfully"
              subTitle="The system has recorded your order information."
              extra={[
                <Button key="home">
                  <Link to={"/"} type="primary">
                    Homepage
                  </Link>
                </Button>,
                <Button key="history">
                  <Link to={"/OrderHistoryPage"} type="primary">
                    Purchase History
                  </Link>
                </Button>,
              ]}
            />
          ) : (
            <Result
              status="error"
              title="Payment transaction failed"
              subTitle="Please contact the administrator for support."
              extra={
                <Button type="primary" key="console">
                  <Link to={"/"} type="primary">
                    Homepage
                  </Link>
                </Button>
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default ReturnURLPage;
