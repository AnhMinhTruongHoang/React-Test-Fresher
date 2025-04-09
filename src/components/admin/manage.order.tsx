import { useEffect, useState } from "react";
import { App, Divider, Drawer, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { getOrderHistoryApi } from "@/components/services/api";

const OrderHistoryPage = () => {
  const [dataHistory, setDataHistory] = useState<IHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IHistory | null>(null);
  const { notification } = App.useApp();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getOrderHistoryApi();
      if (res && res.data) {
        setDataHistory(res.data);
      } else {
        notification.error({
          message: "An error occurred",
          description: res.message,
        });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const columns: TableProps<IHistory>["columns"] = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (item, record, index) => <>{index + 1}</>,
    },
    {
      title: "Order ID",
      dataIndex: "paymentRef",
      key: "paymentRef",
      filters: Array.from(
        new Set(dataHistory.map((item) => item.paymentRef))
      ).map((value) => ({
        text: value,
        value,
      })),
      onFilter: (value, record) => record.paymentRef === value,
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
        return formatted;
      },
      filters: Array.from(
        new Set(
          dataHistory.map((item) => {
            const date = new Date(item.createdAt);
            return `${String(date.getDate()).padStart(2, "0")}/${String(
              date.getMonth() + 1
            ).padStart(2, "0")}/${date.getFullYear()}`;
          })
        )
      ).map((value) => ({
        text: value,
        value,
      })),
      onFilter: (value, record) => {
        const date = new Date(record.createdAt);
        const formatted = `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1
        ).padStart(2, "0")}/${date.getFullYear()}`;
        return formatted === value;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (item) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "VND",
        }).format(item),
      filters: Array.from(
        new Set(dataHistory.map((item) => item.totalPrice))
      ).map((value) => ({
        text: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "VND",
        }).format(value),
        value,
      })),
      onFilter: (value, record) => record.totalPrice === value,
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (item, record) => (
        <Tag color={record.paymentStatus === "UNPAID" ? "volcano" : "green"}>
          {record.paymentStatus}
        </Tag>
      ),
      filters: [
        { text: "PAID", value: "PAID" },
        { text: "PAYMENT_SUCCEED", value: "PAYMENT_SUCCEED" },
      ],
      onFilter: (value, record) => record.paymentStatus === value,
    },
    {
      title: "Details",
      key: "action",
      render: (_, record) => (
        <a
          onClick={() => {
            setOpenDetail(true);
            setDataDetail(record);
          }}
          href="#"
        >
          View Details
        </a>
      ),
    },
  ];

  return (
    <div style={{ margin: 50 }}>
      <h3 style={{ textAlign: "center", color: "greenyellow" }}>
        Order History
      </h3>
      <Divider />
      <Table
        bordered
        columns={columns}
        dataSource={dataHistory}
        rowKey={"_id"}
        loading={loading}
      />
      <Drawer
        title="Order Details"
        onClose={() => {
          setOpenDetail(false);
          setDataDetail(null);
        }}
        open={openDetail}
      >
        {dataDetail?.detail?.map((item, index) => {
          return (
            <ul key={index}>
              <li>Book Name: {item.bookName}</li>
              <li>Quantity: {item.quantity}</li>
              <Divider />
            </ul>
          );
        })}
      </Drawer>
    </div>
  );
};

export default OrderHistoryPage;
