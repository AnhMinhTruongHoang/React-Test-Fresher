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
import { Fragment, useEffect, useRef, useState } from "react";
import { deleteBookApi, getBookApi, getCategoryApi } from "../services/api";
import { dateRangeValidate } from "../services/helper";
import { CSVLink } from "react-csv";

//////////////////////

type TSearch = {
  mainText?: string;
  author?: string;
  sold?: number;
  createdAt?: string;
  createdAtRange?: string;
  category: any;
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
  const [categories, setCategories] = useState<
    Record<string, { text: string }>
  >({});

  /////////////category
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryApi();
      if (res && res.data) {
        const categoryEnum = res.data.reduce((acc, item) => {
          acc[item as any] = { text: item as any };
          return acc;
        }, {} as Record<string, { text: string }>);
        setCategories(categoryEnum);
      }
    };
    fetchCategory();
  }, []);

  ///////////////////

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
      copyable: true,
      sorter: true,
      filters: Object.keys(categories).map((key) => ({
        text: categories[key].text,
        value: key,
      })),
      valueEnum: categories,
    },
    { title: "Author", dataIndex: "author", sorter: true },
    { title: "Price", dataIndex: "price", sorter: true },
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
          if (params.sold !== undefined) query += `&sold=${params.sold}`;
          if (params.createdAt) query += `&createdAt=${params.createdAt}`;
          if (params.category) query += `&category=${params.category}`;
        
          const dateRange = dateRangeValidate(params.createdAtRange);
          if (dateRange) {
            query += `&createdAt[gte]=${dateRange[0]}&createdAt[lte]=${dateRange[1]}`;
          }
          if (!sort || Object.keys(sort).length === 0) {
            query += "&sort=-createdAt";
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
        }}
        headerTitle="Books Table"
        toolBarRender={() => [
          <Button
            key="add"
            icon={<PlusOutlined />}
            onClick={() => setOpenCreateBook(true)}
            type="primary"
          >
            Add New
          </Button>,
          <Button
            key="export"
            icon={<ExportOutlined />}
            style={{ backgroundColor: "green" }}
          >
            <CSVLink data={currentDataTable} filename="export-books.csv">
              Export
            </CSVLink>
          </Button>,
        ]}
      />
    </Fragment>
  );
};

export default TableBooks;
