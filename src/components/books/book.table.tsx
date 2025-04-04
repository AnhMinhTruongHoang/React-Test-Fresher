import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Tag, Space, Popconfirm, message } from "antd";
import { Fragment, useRef, useState } from "react";
import { deleteBookApi, getBookApi } from "../services/api";
import { dateRangeValidate } from "../services/helper";
import { CSVLink } from "react-csv";
import UpdateBookModal from "./book.update";
import CreateBookModal from "./book.create";
import BookDetails from "./book.detail";

//////////////////////

type TSearch = {
  mainText?: string;
  author?: string;
  category?: string;
  price?: number;
  sold?: number;
  createdAt?: string;
  createdAtRange?: string;
};

const TableBooks = () => {
  const actionRef = useRef<ActionType>();
  const [meta, setMeta] = useState({ current: 1, pageSize: 5, total: 0 });
  const [openViewData, setOpenViewData] = useState<boolean>(false);
  const [dataView, setDataView] = useState<IBookTable | null>(null);
  const [openCreateBook, setOpenCreateBook] = useState<boolean>(false);
  const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);
  const [openUpdateBook, setOpenUpdateBook] = useState<boolean>(false);
  const [currentDataTable, setCurrentDataTable] = useState<IBookTable[]>([]);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const handleDelete = async (id: string) => {
    const res = await deleteBookApi(id);
    if (res.data) {
      message.success(`Deleted ID: ${id}`);
      refreshTable();
    } else {
      message.error("Delete Failed");
    }
  };

  const columns: ProColumns<IBookTable>[] = [
    { dataIndex: "index", valueType: "indexBorder", width: 48 },
    {
      title: "Id",
      dataIndex: "_id",
      hideInSearch: true,
      render: (_, entity) => (
        <a
          onClick={() => {
            setDataView(entity);
            setOpenViewData(true);
          }}
          href="#"
        >
          {entity._id}
        </a>
      ),
    },
    { title: "Title", dataIndex: "mainText", sorter: true },
    {
      title: "Category",
      dataIndex: "category",
      sorter: true,
      search: true,
      copyable: true,
    },
    { title: "Author", dataIndex: "author", sorter: true, search: true },
    { title: "Price", dataIndex: "price", sorter: true, valueType: "money" },
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
      render: (_, entity) => (
        <>{dayjs(entity.createdAt).format("DD-MM-YYYY")}</>
      ),
    },
    { title: "Updated At", dataIndex: "updatedAt", sorter: true },
    {
      title: "Actions",
      key: "actions",
      render: (_, entity) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setDataUpdate(entity);
              setOpenUpdateBook(true);
            }}
          />
          <Popconfirm
            title="Are you sure to delete this book?"
            onConfirm={() => handleDelete(entity._id)}
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
        request={async (params, sort) => {
          let query = `current=${params.current}&pageSize=${params.pageSize}`;
          if (params.mainText) query += `&mainText=/${params.mainText}/i`;
          if (params.author) query += `&author=/${params.author}/i`;
          if (params.category) query += `&category=/${params.category}/i`;
          if (params.price) query += `&price=${params.price}`;
          if (params.sold !== undefined) query += `&sold=${params.sold}`;

          const createDateRange = dateRangeValidate(params.createdAtRange);
          if (createDateRange) {
            query += `&createdAt[gte]=${createDateRange[0]}&createdAt[lte]=${createDateRange[1]}`;
          }

          Object.keys(sort).forEach((key) => {
            query += `&sort=${sort[key] === "ascend" ? key : "-" + key}`;
          });

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
        }}
        headerTitle="Books Table"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreateBook(true)}
            type="primary"
          >
            Add New
          </Button>,
          <Button
            key="button"
            icon={<ExportOutlined />}
            style={{ backgroundColor: "green" }}
          >
            <CSVLink data={currentDataTable} filename="export-books.csv">
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
      <UpdateBookModal
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        openUpdateBook={openUpdateBook}
        setOpenUpdateBook={setOpenUpdateBook}
        refreshTable={refreshTable}
      />
    </Fragment>
  );
};

export default TableBooks;
