import { App, Button, Col, Divider, Form, Radio, Row, Space } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Input } from "antd";
import type { FormProps } from "antd";
import { useCurrentApp } from "@/context/app.context";
import { createOrderApi } from "@/components/services/api";

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
  fullName: string;
  phone: string;
  address: string;
  method: UserMethod;
};

interface IProps {
  setCurrentStep: (v: number) => void;
}
const Payment = (props: IProps) => {
  const { carts, setCarts, user } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { setCurrentStep } = props;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
        method: "COD",
      });
    }
  }, [user]);

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

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      // update
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      // sync React Context
      setCarts(newCarts);
    }
  };

  const handlePlaceOrder: FormProps<FieldType>["onFinish"] = async (values) => {
    const { address, fullName, method, phone } = values;
    const detail = carts.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      bookName: item.detail.mainText,
    }));

    setIsSubmit(true);
    const res = await createOrderApi(
      fullName,
      address,
      phone,
      totalPrice,
      method,
      detail
    );
    if (res?.data) {
      localStorage.removeItem("carts");
      setCarts([]);
      message.success("Order placed successfully!");
      setCurrentStep(2);
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

    setIsSubmit(false);
  };

  return (
    <Row gutter={[20, 20]}>
      <Col md={16} xs={24}>
        {carts?.map((book, index) => {
          const currentBookPrice = book?.detail?.price ?? 0;
          return (
            <div className="order-book" key={`index-${index}`}>
              <div className="book-content">
                <img
                  alt="no image"
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div className="title">{book?.detail?.mainText}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentBookPrice)}
                </div>
              </div>
              <div className="action">
                <div className="quantity">Quantity: {book?.quantity}</div>
                <div className="sum">
                  Total:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentBookPrice * (book?.quantity ?? 0))}
                </div>
                <DeleteTwoTone
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveBook(book._id)}
                  twoToneColor="#eb2f96"
                />
              </div>
            </div>
          );
        })}
        <div>
          <span style={{ cursor: "pointer" }} onClick={() => setCurrentStep(0)}>
            Go back
          </span>
        </div>
      </Col>
      <Col md={8} xs={24}>
        <Form
          form={form}
          name="payment-form"
          onFinish={handlePlaceOrder}
          autoComplete="off"
          layout="vertical"
        >
          <div className="order-sum">
            <Form.Item<FieldType> label="Payment method" name="method">
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value={"COD"}>Cash on Delivery</Radio>
                  <Radio value={"BANKING"}>Bank Transfer</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item<FieldType>
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Full name is required!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Phone number is required!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Delivery Address"
              name="address"
              rules={[{ required: true, message: "Address is required!" }]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <div className="calculate">
              <span> Subtotal</span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <div className="calculate">
              <span> Total</span>
              <span className="sum-final">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice || 0)}
              </span>
            </div>
            <Divider style={{ margin: "10px 0" }} />
            <Button
              color="danger"
              variant="solid"
              htmlType="submit"
              loading={isSubmit}
            >
              Place Order ({carts?.length ?? 0})
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Payment;
