import { App, Button, Form, FormProps, Input, InputNumber, Modal } from "antd";
import { createUsersApi } from "../services/api";

interface IProps {
  openCreateUser: boolean;
  setOpenCreateUser: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};

const CreateUserModal = (props: IProps) => {
  const { openCreateUser, setOpenCreateUser, refreshTable } = props;
  const [form] = Form.useForm();
  const { message } = App.useApp();

  ////////////////////////
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, password, email, phone } = values;

    const res = await createUsersApi(fullName, password, email, phone);

    if (res.data) {
      message.success(" Created !");
      form.resetFields();
      setOpenCreateUser(false);
      refreshTable();
    } else {
      message.error(res.message);
    }
  };

  return (
    <>
      <Modal
        title="Create New User"
        open={openCreateUser}
        footer={null}
        onCancel={() => {
          setOpenCreateUser(false);
          form.resetFields();
        }}
      >
        <Form
          form={form}
          name="createUser"
          layout="vertical"
          onFinish={onFinish}
        >
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

          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
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
              Create new User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUserModal;
