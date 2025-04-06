import { Col, Divider, Empty, InputNumber, message, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "../../../styles/orderPage.scss";
import { useCurrentApp } from "@/context/app.context";
import { isMobile } from "react-device-detect"; // Importing isMobile

interface IProps {
  setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleOnChangeInput = (value: number, book: IBookTable) => {
    if (!value || +value < 1) return;
    if (!isNaN(+value)) {
      const cartStorage = localStorage.getItem("carts");
      if (cartStorage && book) {
        const carts = JSON.parse(cartStorage) as ICart[];
        let isExistIndex = carts.findIndex((c) => c._id === book?._id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = +value;
        }
        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);
      }
    }
  };

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCarts(newCarts);
    }
  };

  const handleNextStep = () => {
    if (!carts.length) {
      message.error("Cart is Empty.");
      return;
    }
    setCurrentStep(1);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="order-container"
        style={{ maxWidth: 1440, margin: "0 auto" }}
      >
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((item, index) => {
              const currentBookPrice = item?.detail?.price ?? 0;
              return (
                <div className="order-book" key={`index-${index}`}>
                  <div className="book-content">
                    <img
                      alt="no image"
                      src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                        item?.detail?.thumbnail
                      }`}
                    />
                    <div className="title">{item?.detail?.mainText}</div>
                    <div className="price">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(currentBookPrice)}
                    </div>
                  </div>
                  <div className="action">
                    <div className="quantity">
                      <InputNumber
                        onChange={(value) =>
                          handleOnChangeInput(value as number, item.detail)
                        }
                        value={item.quantity}
                      />
                    </div>
                    <div className="sum">
                      Total:{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(currentBookPrice * (item?.quantity ?? 0))}
                    </div>
                    <DeleteTwoTone
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveBook(item._id)}
                      twoToneColor="#eb2f96"
                    />
                  </div>
                </div>
              );
            })}
            {carts.length === 0 && <Empty description="Cart is Empty" />}
          </Col>

          {/* Mobile vs Desktop Layout Adjustment */}
          {!isMobile && (
            <Col md={6} xs={24}>
              <div className="order-sum">
                <div className="calculate">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalPrice || 0)}
                  </span>
                </div>
                <Divider style={{ margin: "10px 0" }} />
                <div className="calculate">
                  <span>Total Amount</span>
                  <span className="sum-final">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalPrice || 0)}
                  </span>
                </div>
                <Divider style={{ margin: "10px 0" }} />
                <button onClick={() => handleNextStep()}>
                  Buy Now ({carts?.length ?? 0})
                </button>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default OrderDetail;
