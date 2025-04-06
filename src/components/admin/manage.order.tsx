import { useEffect, useState } from "react";
import {
  App,
  Divider,
  Drawer,
  Table,
  Tag,
  Spin,
  DatePicker,
  Select,
  InputNumber,
  Input,
} from "antd";
import type { TableProps } from "antd";
import { getOrderApi } from "@/components/services/api";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const ManageOrderPage = () => {
  const [orderDetail, setOrderDetail] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<IOrder | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("descend");
  const { notification } = App.useApp();
  const [filters, setFilters] = useState<any>({
    paymentStatus: null,
    dateRange: null,
    price: null,
    name: "",
    phone: "",
    address: "",
    type: "",
  });

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const res = await getOrderApi();
        if (res && res.data) {
          setOrderDetail(res.data.result);
        } else {
          notification.error({
            message: "An error occurred",
            description: res?.message || "Unknown error",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error Fetching Orders",
        });
      }
      setLoading(false);
    };

    fetchOrderData();
  }, []);

  // Filter logic
  const handleFilterChange = (value: any, field: string) => {
    setFilters((prevFilters: any) => ({
      ...prevFilters,
      [field]: value,
    }));
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const filteredData = orderDetail.filter((order) => {
    const { paymentStatus, dateRange, price, name, phone, address, type } =
      filters;

    // Filter by payment status
    if (paymentStatus && order.paymentStatus !== paymentStatus) {
      return false;
    }

    // Filter by date range
    if (dateRange) {
      const orderDate = dayjs(order.createdAt);
      const [startDate, endDate] = dateRange;
      if (orderDate.isBefore(startDate) || orderDate.isAfter(endDate)) {
        return false;
      }
    }

    // Filter by price
    if (price && order.totalPrice < price) {
      return false;
    }

    // Filter by name
    if (name && !order.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }

    // Filter by phone
    if (phone && !order.phone.includes(phone)) {
      return false;
    }

    // Filter by address
    if (
      address &&
      !order.address.toLowerCase().includes(address.toLowerCase())
    ) {
      return false;
    }

    // Filter by type
    if (type && order.type !== type) {
      return false;
    }

    return true;
  });

  const sortedData = filteredData.sort((a, b) => {
    if (sortOrder === "ascend") {
      return a.totalPrice - b.totalPrice;
    } else {
      return b.totalPrice - a.totalPrice;
    }
  });

  const columns: TableProps<IOrder>["columns"] = [
    {
      title: "No.",
      dataIndex: "index",
      key: "index",
      render: (item, record, index) => <>{index + 1}</>,
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Name"
            onChange={(e) => handleFilterChange(e.target.value, "name")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <a
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            style={{ marginRight: 8 }}
          >
            Reset
          </a>
          <a
            onClick={() => {
              confirm();
            }}
          >
            Search
          </a>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <Tag color={filtered ? "green" : "default"}>Search</Tag>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Phone"
            onChange={(e) => handleFilterChange(e.target.value, "phone")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <a
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            style={{ marginRight: 8 }}
          >
            Reset
          </a>
          <a
            onClick={() => {
              confirm();
            }}
          >
            Search
          </a>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <Tag color={filtered ? "green" : "default"}>Search</Tag>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Address"
            onChange={(e) => handleFilterChange(e.target.value, "address")}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <a
            onClick={() => {
              setSelectedKeys([]);
              confirm();
            }}
            style={{ marginRight: 8 }}
          >
            Reset
          </a>
          <a
            onClick={() => {
              confirm();
            }}
          >
            Search
          </a>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <Tag color={filtered ? "green" : "default"}>Search</Tag>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "COD", value: "COD" },
        { text: "Banking", value: "BANKING" },
      ],
      onFilter: (value, record) => record.type.indexOf(value as any) === 0,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (item) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "VND",
        }).format(item);
      },
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      filters: [
        { text: "Paid", value: "PAID" },
        { text: "Unpaid", value: "UNPAID" },
      ],
      onFilter: (value, record) =>
        record.paymentStatus.indexOf(value as any) === 0,
      render: (status: string) => {
        const statusColor = status === "PAID" ? "green" : "red";
        return <Tag color={statusColor}>{status}</Tag>;
      },
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

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder="Select Payment Status"
          onChange={(value) => handleFilterChange(value, "paymentStatus")}
          style={{ marginRight: 20 }}
        >
          <Select.Option value="PAID">Paid</Select.Option>
          <Select.Option value="UNPAID">Unpaid</Select.Option>
        </Select>

        <RangePicker
          style={{ marginRight: 20, width: 300 }}
          onChange={(dates) => handleFilterChange(dates, "dateRange")}
        />

        <InputNumber
          placeholder="Min Price"
          style={{ marginRight: 20 }}
          onChange={(value) => handleFilterChange(value, "price")}
        />

        <Select
          placeholder="Sort By Price"
          onChange={handleSortChange}
          defaultValue="descend"
        >
          <Select.Option value="descend">Descending</Select.Option>
          <Select.Option value="ascend">Ascending</Select.Option>
        </Select>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          bordered
          columns={columns}
          dataSource={sortedData}
          rowKey="_id"
        />
      )}

      <Drawer
        title="Order Details"
        onClose={() => {
          setOpenDetail(false);
          setDataDetail(null);
        }}
        open={openDetail}
      >
        {dataDetail?.detail?.map((item, index) => (
          <div key={index}>
            <strong>Book Name:</strong> {item.bookName}
            <br />
            <strong>Quantity:</strong> {item.quantity}
            <br />
            <strong>Create at:</strong> {dataDetail.createdAt as any}
            <Divider />
          </div>
        ))}
      </Drawer>
    </div>
  );
};

export default ManageOrderPage;
