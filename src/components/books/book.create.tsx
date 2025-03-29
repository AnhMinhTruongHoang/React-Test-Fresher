import {
  App,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { createBookApi, getCategoryApi } from "../services/api";
import { useEffect, useState } from "react";
import { MAX_UPLOAD_IMAGE_SIZE } from "../services/helper";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

interface IProps {
  openCreateBook: boolean;
  setOpenCreateBook: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  thumbnail: any;
  slider: any;
  mainText: string;
  price: number;
  quantity: number;
  category: number;
};

const CreateBookModal = ({
  openCreateBook,
  setOpenCreateBook,
  refreshTable,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState<{
    thumbnail: boolean;
    slider: boolean;
  }>({
    thumbnail: false,
    slider: false,
  });
  const [preview, setPreview] = useState<{ open: boolean; image?: string }>({
    open: false,
  });
  const { message } = App.useApp();
  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryApi();
        if (res?.data) {
          setListCategory(
            res.data.map((item: any) => ({ label: item, value: item }))
          );
        }
      } catch (error) {
        message.error("Failed to load categories");
      }
    };
    fetchCategory();
  }, []);

  const onFinish = async (values: FieldType) => {
    setIsSubmit(true);
    try {
      await createBookApi(
        values.thumbnail,
        values.slider,
        values.mainText,
        values.price,
        values.quantity,
        values.category
      );
      message.success("Book Created!");
      form.resetFields();
      setOpenCreateBook(false);
      refreshTable();
    } catch (error) {
      message.error("Failed to create book");
    }
    setIsSubmit(false);
  };

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) message.error("You can only upload JPG/PNG files!");
    const isLtMaxSize = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLtMaxSize)
      message.error(`Image must be smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    return isJpgOrPng && isLtMaxSize;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj as File);
      reader.onload = () =>
        setPreview({ open: true, image: reader.result as string });
    } else {
      setPreview({ open: true, image: file.url });
    }
  };

  const handleChange = (
    info: UploadChangeParam,
    type: "thumbnail" | "slider"
  ) => {
    setLoading((prev) => ({
      ...prev,
      [type]: info.file.status === "uploading",
    }));
  };

  return (
    <Modal
      title="Create New Book"
      open={openCreateBook}
      footer={null}
      onCancel={() => {
        setOpenCreateBook(false);
        form.resetFields();
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="mainText"
          label={<strong>Title</strong>}
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label={<strong>Price (VND)</strong>}
          rules={[{ required: true, message: "Price is required!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="category"
          label={<strong>Category</strong>}
          rules={[{ required: true }]}
        >
          <Select options={listCategory} allowClear />
        </Form.Item>

        <Form.Item
          name="quantity"
          label={<strong>Quantity</strong>}
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="thumbnail" label="Thumbnail" valuePropName="fileList">
          <Upload
            listType="picture-card"
            maxCount={1}
            customRequest={({ file, onSuccess }) =>
              setTimeout(() => onSuccess?.("ok"), 1000)
            }
            beforeUpload={beforeUpload}
            onChange={(info) => handleChange(info, "thumbnail")}
            onPreview={handlePreview}
          >
            {loading.thumbnail ? <LoadingOutlined /> : <PlusOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item name="slider" label="Slider Images" valuePropName="fileList">
          <Upload
            listType="picture-card"
            multiple
            customRequest={({ file, onSuccess }) =>
              setTimeout(() => onSuccess?.("ok"), 1000)
            }
            beforeUpload={beforeUpload}
            onChange={(info) => handleChange(info, "slider")}
            onPreview={handlePreview}
          >
            {loading.slider ? <LoadingOutlined /> : <PlusOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmit} block>
            Create New Book
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBookModal;
