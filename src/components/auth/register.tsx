import {
  App,
  Button,
  Checkbox,
  Form,
  FormProps,
  Input,
  InputNumber,
} from "antd";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../services/api";

type FieldType = {
  fullName: string;
  password: string;
  remember: boolean;
  email: string;
  phone: string;
};

function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = App.useApp();

  ////////////////////////
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    const { fullName, email, password, phone } = values;

    const res = await registerApi(fullName, email, password, phone);

    if (res.data) {
      message.success("Register Success !");

      navigate("/");
    } else {
      message.error(res.message);
    }
    setLoading(false);
    console.log("res", res);
  };
  ////////////////////////
  return (
    <App>
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          background: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Register Account
        </h2>

        <Form form={form} name="register" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="fullName"
            label={
              <span style={{ fontWeight: "bold", color: "#333" }}>
                Full Name
              </span>
            }
            rules={[{ required: true, message: "Full name is required!" }]}
          >
            <Input
              style={{
                width: "100%",
                borderRadius: "6px",
                padding: "8px",
                border: "1px solid #ccc",
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <span style={{ fontWeight: "bold", color: "#333" }}>Email</span>
            }
            rules={[
              { required: true, message: "Email is required!" },
              { type: "email", message: "Invalid email!" },
            ]}
          >
            <Input
              style={{
                width: "100%",
                borderRadius: "6px",
                padding: "8px",
                border: "1px solid #ccc",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span style={{ fontWeight: "bold", color: "#333" }}>
                Password
              </span>
            }
            rules={[{ required: true, message: "Password is required!" }]}
          >
            <Input.Password
              style={{
                width: "100%",
                borderRadius: "6px",
                padding: "8px",
                border: "1px solid #ccc",
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label={
              <span style={{ fontWeight: "bold", color: "#333" }}>
                Phone Number
              </span>
            }
            rules={[{ required: true, message: "Phone number is required!" }]}
          >
            <InputNumber
              style={{
                width: "100%",
                borderRadius: "6px",
                padding: "8px",
                border: "1px solid #ccc",
                appearance: "textfield",
              }}
              controls={false}
            />
          </Form.Item>

          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "15px",
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                maxWidth: "200px",
                height: "40px",
                fontSize: "16px",
                backgroundColor: "#4096ff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              {loading ? "Processing..." : "Register"}
            </Button>
          </Form.Item>

          <div style={{ margin: "10px 0", fontWeight: "bold" }}>Or</div>

          <div>
            Already have an account?{" "}
            <span
              style={{
                color: "#4096ff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              <Link to={"/login"}> Log In</Link>
            </span>
          </div>
        </Form>
      </div>
    </App>
  );
}

export default RegisterPage;
