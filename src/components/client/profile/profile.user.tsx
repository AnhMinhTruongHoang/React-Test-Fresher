import {
  Modal,
  Tabs,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  notification,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useCurrentApp } from "@/context/app.context";
import { useEffect, useState } from "react";
import { FormProps, UploadFile } from "antd/lib";
import {
  updateUserInfoAPI,
  updateUserPasswordAPI,
  uploadFileAPI,
} from "@/components/services/api";
import { UploadChangeParam } from "antd/es/upload";

const { TabPane } = Tabs;

interface IProps {
  openAccountModal: boolean;
  setOpenAccountModal: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  newpass: string; // Only include the newpass field for password change
};

const AccountModal = (props: IProps) => {
  const { openAccountModal, setOpenAccountModal, refreshTable } = props;
  const { user, setUser } = useCurrentApp();
  const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");
  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();
  const urlAvatar = `${
    import.meta.env.VITE_BACKEND_URL
  }/images/avatar/${userAvatar}`;

  useEffect(() => {
    if (openAccountModal && user) {
      form.setFieldsValue({
        _id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
      });
      setUserAvatar(user.avatar ?? "");
    }
  }, [openAccountModal]);

  /////////////// image handle
  const handleUploadFile = async (options: RcCustomRequestOptions) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "avatar");

    if (res && res.data) {
      const newAvatar = res.data.fileUploaded;
      setUserAvatar(newAvatar);

      if (onSuccess) onSuccess("Success !");
    } else {
      message.error(res.message);
    }
  };

  const propsUpload = {
    maxCount: 1,
    multiple: false,
    showUploadList: false,
    customRequest: handleUploadFile,
    onChange(info: UploadChangeParam) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`Uploaded`);
      } else if (info.file.status === "error") {
        message.error(`Upload failed`);
      }
    },
  };

  ////////////////////////////

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, phone, _id } = values;

    const res = await updateUserInfoAPI(_id, userAvatar, fullName, phone);

    if (res && res.data) {
      setUser({
        ...user!,
        avatar: userAvatar,
        fullName,
        phone,
      });
      message.success("Cập nhật thông tin user thành công");

      //force renew token
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  ////////////////////////// password (now only new password)
  const onFinishPassword: FormProps<FieldType>["onFinish"] = async (values) => {
    const { email, newpass } = values;

    const res = await updateUserPasswordAPI(email, "", newpass);

    if (res && res.data) {
      setUser({
        ...user!,
        email,
        newpass,
      });
      message.success("Password Updated!");

      //force renew token
      localStorage.removeItem("access_token");
    } else {
      notification.error({
        message: "Failed to update password!",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title="Account Management"
      footer={null}
      centered
      open={openAccountModal}
      onCancel={() => {
        setOpenAccountModal(false);
        form.resetFields();
      }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="Update Info" key="1">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              style={{
                display: "block",
                margin: "10px auto",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{ display: "block", margin: "0 auto 10px" }}
                src={urlAvatar}
                shape="circle"
              />
              <Upload {...propsUpload}>
                <Button
                  style={{
                    display: "block",
                    margin: "10px auto",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  Upload Avatar
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item label="_id" name="_id" hidden>
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please enter your display name" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              style={{ justifyContent: "center", textAlign: "center" }}
            >
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Change Password" key="2">
          <Form form={form} layout="vertical" onFinish={onFinishPassword}>
            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="New password" name="newpass">
              <Input.Password />
            </Form.Item>

            <Form.Item
              style={{ justifyContent: "center", textAlign: "center" }}
            >
              <Button type="primary" htmlType="submit">
                Update Password
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AccountModal;
