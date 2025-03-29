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
import { deleteUsersApi, getBookApi } from "../services/api";
import { dateRangeValidate } from "../services/helper";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";
import UpdateUserModal from "../user/user.update";
import FilesUpLoadModal from "../user/user.import";
import BookDetails from "./book.detail";
import CreateBookModal from "./book.create";

type TSearch = {
  mainText: string;
  author: string;
  sold: number;
  createdAt: string;
  createdAtRange: string;
};

const TableBooks = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });

  const [openViewData, setOpenViewData] = useState<boolean>(false);

  const [dataView, setDataView] = useState<IBookTable | null>(null);

  const [openCreateBook, setOpenCreateBook] = useState<boolean>(false);

  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
  const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);

  const [openUpload, setOpenUpload] = useState<boolean>(false);
  const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

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

  const columns: ProColumns<IBookTable>[] = [
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
      title: "Title",
      dataIndex: "mainText",
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      copyable: true,
      sorter: true,
    },
    {
      title: "Author",
      dataIndex: "author",
      sorter: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: true,
    },
    {
      title: "Sold",
      dataIndex: "sold",
      sorter: true,
      render: (_, record) => (
        <Tag color={record.sold <= 0 ? "red" : "green"}>
          {record.sold <= 0 ? "In Stock" : "Sold Out"}
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
      <ProTable<IBookTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params, sort, filter) => {
          let query = `current=${params.current}&pageSize=${params.pageSize}`;
          if (params.mainText) query += `&email=/${params.mainText}/i`;
          if (params.author) query += `&fullName=/${params.author}/i`;

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

          const res = await getBookApi(query);
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
        headerTitle="Books Table"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenCreateBook(true);
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
      <BookDetails
        openViewData={openViewData}
        setOpenViewData={setOpenViewData}
        dataView={dataView}
        setDataView={setDataView}
      />
      <CreateBookModal
        openCreateBook={openCreateBook}
        setOpenCreateBook={setOpenCreateBook}
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

export default TableBooks;
