import { Avatar, Descriptions, Drawer, Tag } from "antd";

interface IProps {
  openViewData: boolean;
  setOpenViewData: (v: boolean) => void;
  dataView: IUserTable | null;
  setDataView: (v: IUserTable | null) => void;
}

const UserDetails = (props: IProps) => {
  const { openViewData, setOpenViewData, dataView, setDataView } = props;

  const onClose = () => {
    setOpenViewData(false);
    setDataView(null);
  };

  return (
    <Drawer
      title="User Details"
      width={"50vw"}
      onClose={onClose}
      open={openViewData}
    >
      {dataView ? (
        <Descriptions title="User Information" bordered column={2}>
          <Descriptions.Item label="Avatar">
            <Avatar src={dataView.avatar} size={64} />
          </Descriptions.Item>
          <Descriptions.Item label="ID">{dataView._id}</Descriptions.Item>
          <Descriptions.Item label="Full Name">
            {dataView.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{dataView.email}</Descriptions.Item>
          <Descriptions.Item label="Phone">{dataView.phone}</Descriptions.Item>
          <Descriptions.Item label="Role">{dataView.role}</Descriptions.Item>
          <Descriptions.Item label="Active Status">
            <Tag color={dataView.isActive ? "green" : "red"}>
              {dataView.isActive ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(dataView.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(dataView.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No user selected.</p>
      )}
    </Drawer>
  );
};

export default UserDetails;
