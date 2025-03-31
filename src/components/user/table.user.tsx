import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, message } from "antd";
import { Fragment, useRef, useState } from "react";
import { deleteUsersApi, getUsersApi } from "../services/api";
import { dateRangeValidate } from "../services/helper";
import UserDetails from "./user.view";
import CreateUserModal from "./user.create";
import FilesUpLoadModal from "./user.import";
import { CSVLink } from "react-csv";
import UpdateUserModal from "./user.update";
import dayjs from "dayjs";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
  phone: string;
  role: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });

  const [openViewData, setOpenViewData] = useState<boolean>(false);

  const [dataView, setDataView] = useState<IUserTable | null>(null);

  const [openCreateUser, setOpenCreateUser] = useState<boolean>(false);

  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);

  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUsersApi(id);

    if (res.data) {
      message.success(`Deleted ID: ${id}`);
      refreshTable();
    } else {
      message.error("Delete Failed");
    }
  }; /////////delete

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
      render(dom, entity, index, action, schema) {
        return <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>;
      },
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
            onClick={() => {
              setDataUpdate(record);
              setOpenUpdateUser(true);
            }}
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
          let query = new URLSearchParams();

          query.append("current", params.current?.toString() || "1");
          query.append("pageSize", params.pageSize?.toString() || "5");

          if (params.email)
            query.append("email", `/${encodeURIComponent(params.email)}/i`);
          if (params.fullName)
            query.append(
              "fullName",
              `/${encodeURIComponent(params.fullName)}/i`
            );
          if (params.phone)
            query.append("phone", `/${encodeURIComponent(params.phone)}/i`);
          if (params.role)
            query.append("role", `/${encodeURIComponent(params.role)}/i`);

          if (!sort || Object.keys(sort).length === 0) {
            query.append("sort", "-createdAt");
          } else {
            Object.entries(sort).forEach(([key, value]) => {
              query.append("sort", value === "ascend" ? key : `-${key}`);
            });
          }

          const res = await getUsersApi(query.toString());
          if (res.data) {
            setMeta(res.data.meta);
            setCurrentDataTable(res.data?.result ?? []);
          }

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
            style={{ backgroundColor: "yellow" }}
          >
            Import
          </Button>,

          <Button
            key="button"
            icon={<ExportOutlined />}
            style={{ backgroundColor: "green" }}
          >
            <CSVLink data={currentDataTable} filename="export-user.csv">
              Export
            </CSVLink>
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
      <UpdateUserModal
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        openUpdateUser={openUpdateUser}
        setOpenUpdateUser={setOpenUpdateUser}
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
