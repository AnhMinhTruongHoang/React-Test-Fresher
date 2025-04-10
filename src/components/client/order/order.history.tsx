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
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      render: (createdAt: string) => {
        const date = new Date(createdAt);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (item, record, index) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "VND",
        }).format(item);
      },
    },
    {
      title: "Status",
      render: (item, record, index) => (
        <Tag color={record.paymentStatus === "UNPAID" ? "volcano" : "green"}>
          {record.paymentStatus}
        </Tag>
      ),
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
