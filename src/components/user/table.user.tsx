import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm } from "antd";
import { Fragment, useRef, useState } from "react";
import { getUsersApi } from "../services/api";
import { dateRangeValidate } from "../services/helper";
import UserDetails from "./user.view";
import CreateUserModal from "./user.create";
import FilesUpLoadModal from "./user.import";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const handleEdit = (record: IUserTable) => {
  console.log("Edit user:", record);
};

const handleDelete = (id: string) => {
  console.log("Delete user with ID:", id);
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });
  const [openViewData, setOpenViewData] = useState<boolean>(false);
  const [dataView, setDataView] = useState<IUserTable | null>(null);
  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);
  const [openUpload, setOpenUpload] = useState<boolean>(false);

  const refreshTable = () => {
    actionRef.current?.reload();
  };
  // const showDrawer = () => {
  //   setOpenViewData(true);
  // };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },

    {
      title: "Id",
      dataIndex: "_id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <a
            onClick={() => {
              setDataView(entity);
              setOpenViewData(true);
            }}
            href="#"
          >
            {entity._id}
          </a>
        );
      },
    },

    {
      title: "Full Name",
      dataIndex: "fullName",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
      sorter: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: true,
    },
    {
      title: "Role",
      dataIndex: "role",
      sorter: true,
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
    },
    {
      title: "Active Status",
      dataIndex: "isActive",
      sorter: true,
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "date",
      sorter: true,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = `current=${params.current}&pageSize=${params.pageSize}`;
          if (params.email) query += `&email=/${params.email}/i`;
          if (params.fullName) query += `&fullName=/${params.fullName}/i`;

          const createDateRange = dateRangeValidate(params.createdAtRange);
          if (createDateRange) {
            query += `&createdAt[gte]=${createDateRange[0]}&createdAt[lte]=${createDateRange[1]}`;
          }

          if (!sort || Object.keys(sort).length === 0) {
            query += "&sort=-createdAt"; // soft logic
          } else {
            Object.keys(sort).forEach((key) => {
              query += `&sort=${sort[key] === "ascend" ? key : "-" + key}`;
            });
          }

          const res = await getUsersApi(query);
          if (res.data) setMeta(res.data.meta);

          return {
            data: res.data?.result || [],
            success: true,
            total: res.data?.meta.total || 0,
          };
        }}
        rowKey="_id"
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          showSizeChanger: true,
          total: meta.total,
          onChange: (page, pageSize) => {
            setMeta((prev) => ({ ...prev, current: page, pageSize }));
            actionRef.current?.reload();
          },
          showTotal: (total, range) => (
            <div>
              {range[0]}-{range[1]} of {total} rows
            </div>
          ),
        }}
        headerTitle="User Table"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenCreateUser(true);
            }}
            type="primary"
          >
            Add New
          </Button>,
          <Button
            key="button"
            icon={<ImportOutlined />}
            onClick={() => {
              setOpenUpload(true);
            }}
            type="primary"
          >
            Import
          </Button>,
        ]}
      />
      <UserDetails
        openViewData={openViewData}
        setOpenViewData={setOpenViewData}
        dataView={dataView}
        setDataView={setDataView}
      />
      <CreateUserModal
        openCreateUser={openCreateUser}
        setOpenCreateUser={setOpenCreateUser}
        refreshTable={refreshTable}
      />
      <FilesUpLoadModal
        openUpload={openUpload}
        setOpenUpload={setOpenUpload}
        refreshTable={refreshTable}
      />
    </Fragment>
  );
};

export default TableUser;
