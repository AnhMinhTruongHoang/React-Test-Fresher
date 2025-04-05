import { Modal, Tabs, Form, Input, Button, Upload, Avatar } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

interface IProps {
  openAccountModal: boolean;
  setOpenAccountModal: (v: boolean) => void;
}

type FieldType = {
  email: string;
  displayName: string;
  phone: string;
};

const AccountModal = (props: IProps) => {
  const { openAccountModal, setOpenAccountModal } = props;

  const [form] = Form.useForm();

  const handleUpdate = () => {};

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
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdate}
            initialValues={{
              email: "admin@gmail.com",
              displayName: "I'm Admin1",
              phone: "123456789",
            }}
          >
            <Form.Item>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{ display: "block", margin: "0 auto 10px" }}
              />
              <Upload showUploadList={false}>
                <Button
                  icon={<UploadOutlined />}
                  style={{ display: "block", margin: "10px auto" }}
                >
                  Upload Avatar
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Display Name"
              name="displayName"
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

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Change Password" key="2">
          {/* You can implement the password change form here */}
          <p>Change password functionality goes here.</p>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default AccountModal;
