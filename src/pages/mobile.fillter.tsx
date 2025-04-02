import {
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  InputNumber,
  Rate,
  Row,
  Divider,
  Space,
} from "antd";

interface IProps {
  isOpenFillter: boolean;
  setIsOpenFillter: (v: boolean) => void;
  handleChangeFilter: any;
  categories: any;
  onFinish: any;
}

const MobileFilter = (props: IProps) => {
  const {
    isOpenFillter,
    setIsOpenFillter,
    handleChangeFilter,
    categories,
    onFinish,
  } = props;

  const [form] = Form.useForm();

  return (
    <Drawer
      title="Lọc sản phẩm"
      placement="right"
      onClose={() => setIsOpenFillter(false)}
      open={isOpenFillter}
    >
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
            <span> - </span>
            <Form.Item name={["range", "to"]}>
              <InputNumber min={0} placeholder="To" />
            </Form.Item>
          </div>
          <div>
            <Button
              onClick={() => form.submit()}
              style={{ width: "100%" }}
              type="primary"
            >
              Apply
            </Button>
          </div>
        </Form.Item>

        <Form.Item label="Rating">
          <Rate allowHalf defaultValue={2.5} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default MobileFilter;
