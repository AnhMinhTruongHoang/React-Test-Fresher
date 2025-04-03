import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
} from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "../../../styles/orderPage.scss";
import { useCurrentApp } from "@/context/app.context";
import { useForm } from "antd/es/form/Form";

interface IProps {
  setCurrentStep: (v: number) => void;
}

const PaymentPage = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);
  const [form] = useForm();

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
      // Update localStorage
      const cartStorage = localStorage.getItem("carts");
      if (cartStorage && book) {
        // Update
        const carts = JSON.parse(cartStorage) as ICart[];

        // Check if the item exists
        let isExistIndex = carts.findIndex((c) => c._id === book?._id);
        if (isExistIndex > -1) {
          carts[isExistIndex].quantity = +value;
        }

        localStorage.setItem("carts", JSON.stringify(carts));

        // Sync React Context
        setCarts(carts);
      }
    }
  };

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      // Update
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      // Sync React Context
      setCarts(newCarts);
    }
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
                      Total:
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
          </Col>
          <Col md={6} xs={24}>
            <Form
              form={form}
              layout="vertical"
              style={{
                maxWidth: 500,
                margin: "auto",
                background: "#fff",
                padding: 20,
                borderRadius: 8,
              }}
            >
              <h1 style={{ textAlign: "center", color: "yellow" }}>
                Payment Methods
              </h1>
              <Form.Item
                labelAlign="left"
                labelCol={{ span: 24 }}
                style={{ textAlign: "center" }}
              >
                <Radio.Group>
                  <Radio value="cod">Cash on Delivery</Radio>
                  <Radio value="bank">Bank Transfer</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input placeholder="Enter your full name" />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Enter your phone number" />
              </Form.Item>

              <Form.Item
                label="Shipping Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                ]}
              >
                <Input.TextArea
                  placeholder="Enter your shipping address"
                  rows={3}
                />
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span>Subtotal</span>
                <span>{totalPrice} ₫</span>
              </div>
              <hr />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  color: "red",
                  fontSize: 16,
                }}
              >
                <span>Total</span>
                <span>{totalPrice} ₫</span>
              </div>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                >
                  Place Order (5)
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PaymentPage;
