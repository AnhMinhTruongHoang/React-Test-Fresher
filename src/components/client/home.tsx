import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import {
  Checkbox,
  Col,
  Divider,
  Form,
  InputNumber,
  Pagination,
  Rate,
  Row,
  Space,
  Tabs,
} from "antd";
import { FormProps } from "antd/lib";
import "../../styles/homePage.scss";
import { useEffect, useState, useRef } from "react";
import { getBookApi, getCategoryApi } from "../services/api";
import { ProColumns } from "@ant-design/pro-components";

type FieldType = {
  mainText?: string;
  author?: string;
  sold?: number;
  createdAt?: string;
  createdAtRange?: string;
  category: any;
};

const HomePage = () => {
  const [form] = Form.useForm();
  const [listBook, SetListBook] = useState<IBookTable[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [sortQuery, setSortQuery] = useState<string>("sort=-sold");
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

  //////////////////// book

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filter, sortQuery]);

  const fetchBook = async () => {
    setIsLoading(true);
    let query = `current=${current}&pageSize=${pageSize}`;
    if (filter) {
      query += `&${filter}`;
    }
    if (sortQuery) {
      query += `&${sortQuery}`;
    }

    const res = await getBookApi(query);
    if (res && res.data) {
      SetListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
    setIsLoading(false);
  };

  /////////////////////// function

  const handleOnchangePage = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const handleChangeFilter = (changedValues: any, values: any) => {
    console.log("Filter changed:", changedValues, values);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Form submitted:", values);
  };

  const onChange = (key: string) => {
    console.log("Tab changed:", key);
  };

  // const refreshTable = () => {
  //   actionRef.current?.reload();
  // };

  const items = [
    { key: "1", label: "Category 1", children: <></> },
    { key: "2", label: "Category 2", children: <></> },
    { key: "3", label: "Category 3", children: <></> },
  ];

  return (
    <div className="homepage-container">
      <Row gutter={[20, 20]}>
        <Col md={6} sm={24} className="sidebar">
          <div className="sidebar-header">
            <span>
              <FilterTwoTone /> Filters
            </span>
            <ReloadOutlined title="Reset" onClick={() => form.resetFields()} />
          </div>

          <Form
            form={form}
            onFinish={onFinish}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item name="category" label="Category" labelCol={{ span: 24 }}>
              <Checkbox.Group>
                <Row>
                  <Col span={24} style={{ display: "flex" }}>
                    <Space direction="vertical">
                      {categories &&
                        Object.keys(categories).map((key) => (
                          <Checkbox key={key} value={key}>
                            {categories[key].text}
                          </Checkbox>
                        ))}
                    </Space>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />

            <Form.Item label="Price Range" labelCol={{ span: 24 }}>
              <div className="price-range">
                <Form.Item name={["range", "from"]}>
                  <InputNumber min={0} placeholder="From" />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber min={0} placeholder="To" />
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item label="Rating">
              <Rate allowHalf defaultValue={2.5} />
            </Form.Item>
          </Form>
        </Col>

        {/* Content */}
        <Col md={18} sm={24} className="content">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />

          <Row className="customize-row">
            {listBook?.map((item, index) => {
              return (
                <div key={index} className="column">
                  <div className="wrapper">
                    <div className="thumbnail">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item.thumbnail
                        }`}
                        alt="Book Cover"
                      />
                    </div>

                    <div className="mainText">
                      <h3>{item.mainText}</h3>
                    </div>
                    <div className="mainText">
                      <i>( {item.author} )</i>
                    </div>

                    <div className="price" style={{ marginTop: "5px" }}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </div>

                    <div className="rating">
                      <Rate value={5} disabled style={{ marginTop: "5px" }} />
                      <span>{item.sold}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Row>
          <Divider />
          <Row className="pagination-row">
            <Pagination
              current={current}
              total={total}
              pageSize={pageSize}
              responsive
              onChange={(p, s) =>
                handleOnchangePage({ current: p, pageSize: s })
              }
            />
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
