import {
  Button,
  Checkbox,
  Divider,
  Form,
  FormProps,
  Input,
  message,
  notification,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { googleLoginApi, loginApi } from "../services/api";
import { useCurrentApp } from "@/context/app.context";
import { GooglePlusOutlined } from "@ant-design/icons";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

type FieldType = {
  username: string;
  password: string;
  remember: boolean;
};

function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useCurrentApp();

  ///////////google login

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);

      const { data } = await axios(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse?.access_token}`,
          },
        }
      );
      ///////////////////// login logic
      if (data && data.email) {
        const res = await googleLoginApi("GOOGLE", data.email);

        if (res?.data) {
          setIsAuthenticated(true);
          setUser(res.data.user);
          localStorage.setItem("access_token", res.data.access_token);
          message.success("Login Success !");
          navigate("/");
        } else {
          notification.error({
            message: "Failed to Login",
            description:
              res.message && Array.isArray(res.message) ? res.message : null,
            duration: 5,
          });
        }
      }
    },
  });

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { username, password } = values;

    const res = await loginApi(username, password);
    if (res?.data) {
      setIsAuthenticated(true);
      setUser(res.data.user);
      localStorage.setItem("access_token", res.data.access_token);
      notification.success({
        message: "Success!",
        description: "Login successful!",
      });
      navigate("/");
    } else {
      notification.error({
        message: "Failed !",
        description: "Login Failed!",
      });

      throw new Error("Invalid credentials");
    }
  };

  return (
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
        Login
      </h2>

      <Form
        form={form}
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label={
            <span style={{ fontWeight: "bold", color: "#333" }}>Username</span>
          }
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
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

        <Form.Item<FieldType>
          label={
            <span style={{ fontWeight: "bold", color: "#333" }}>Password</span>
          }
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
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

        <Form.Item<FieldType> name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
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
            Login
          </Button>
        </Form.Item>

        <Divider style={{ margin: "10px 0", fontWeight: "bold" }}>Or</Divider>
        <GooglePlusOutlined
          onClick={() => loginWithGoogle()}
          style={{ fontSize: 30, color: "orange", marginBottom: "5px" }}
        />
        <div>
          Don't have an account?
          <span
            style={{
              color: "#4096ff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            <Link to={"/register"}> Register</Link>
          </span>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
