import { App, Button, Form, FormProps, Input, InputNumber, Modal } from "antd";
import { updateUsersApi } from "../services/api";
import { useEffect, useState } from "react";

interface IProps {
  openUpdateUser: boolean;
  setOpenUpdateUser: (v: boolean) => void;
  dataUpdate: IUserTable | null;
  setDataUpdate: (v: IUserTable | null) => void;
  refreshTable: () => void;
}

type FieldType = {
  _id: string;
  fullName: string;
  password: string;
  email: string;
  phone: string;
};

const UpdateUserModal = (props: IProps) => {
  const {
    refreshTable,
    dataUpdate,
    setDataUpdate,
    openUpdateUser,
    setOpenUpdateUser,
  } = props;

  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    } else {
      form.resetFields();
    }
  }, [dataUpdate]);

  ////////////////////////
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { _id, fullName, phone } = values;
    setIsSubmit(true);

    const res = await updateUsersApi(_id, fullName, phone);

    if (res.data) {
      message.success(" Updated !");
      form.resetFields();
      setOpenUpdateUser(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      message.error(res.message);
    }
  };

  return (
    <Modal
      title="User Updated"
      open={openUpdateUser}
      footer={null}
      onCancel={() => {
        setOpenUpdateUser(false);
        setDataUpdate(null);
        form.resetFields();
      }}
    >
      <Form
        form={form}
        name="Update User"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType> name="_id" label="_id" hidden>
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="fullName"
          label={
            <span style={{ fontWeight: "bold", color: "#333" }}> Name</span>
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
            placeholder={dataUpdate?.fullName}
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
          <Input disabled />
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
            placeholder={dataUpdate?.phone}
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
            Update User
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
