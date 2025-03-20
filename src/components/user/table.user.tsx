import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { getUsersApi } from "../services/api";
import { dateRangeValidate } from "../services/helper";

type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const handleEdit = (record: IUserTable) => {
  console.log("Edit user:", record);
  // Add your edit logic here
};

const handleDelete = (id: string) => {
  console.log("Delete user with ID:", id);
  // Add your delete logic here
};

const columns: ProColumns<IUserTable>[] = [
  {
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "ID",
    dataIndex: "_id",
    valueType: "text",
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    copyable: true,
  },
  {
    title: "Phone",
    dataIndex: "phone",
  },
  {
    title: "Role",
    dataIndex: "role",
  },
  {
    title: "Avatar",
    dataIndex: "avatar",
  },
  {
    title: "Active Status",
    dataIndex: "isActive",
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
    hideInSearch: true,
  },
  {
    title: "Created At",
    dataIndex: "createdAtRange",
    valueType: "dateRange",
    hideInSearch: true,
    hidden: true,
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
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

const TableUser = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  return (
    <ProTable<IUserTable, TSearch>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params, sort, filter) => {
        let query = "";
        if (params) {
          query += `current=${params.current}&pageSize=${params.pageSize}`;
          if (params.email) {
            query += `&email=/${params.email}/i`;
          }
          if (params.fullName) {
            query += `$fullName${params.fullName}/i`;
          }

          const createDateRange = dateRangeValidate(params.createdAtRange);
          if (createDateRange) {
            query += `&createAt=${createDateRange[0]}&createAt<=${createDateRange[1]}`;
          }
        }

        const res = await getUsersApi(query);

        if (res.data) {
          setMeta(res.data.meta);
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
            actionRef.current?.reload();
          }}
          type="primary"
        >
          Add New
        </Button>,
      ]}
    />
  );
};

export default TableUser;
