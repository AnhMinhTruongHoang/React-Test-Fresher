import {
  App,
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { createBookAPI, getCategoryApi, uploadFileAPI } from "../services/api";
import { useEffect, useState } from "react";
import { MAX_UPLOAD_IMAGE_SIZE } from "../services/helper";
import { UploadChangeParam, UploadFile } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { GetProp, UploadProps } from "antd/lib";

interface IProps {
  openCreateBook: boolean;
  setOpenCreateBook: (v: boolean) => void;
  refreshTable: () => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type UserUploadType = "thumbnail" | "slider";

type FieldType = {
  thumbnail: string;
  slider: string;
  mainText: any;
  price: number;
  quantity: number;
  category: any;
  author: string;
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

  const { message } = App.useApp();
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
  const [listCategory, setListCategory] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryApi();
      if (res && res.data) {
        const d = res.data.map((item) => {
          return { label: item, value: item };
        });
        setListCategory(d);
      }
    };
    fetchCategory();
  }, []);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    try {
      const { thumbnail, slider, mainText, price, quantity, category, author } =
        values;

      const resSubmit = await createBookAPI(
        thumbnail,
        slider,
        mainText,
        price,
        quantity,
        category,
        author
      );

      if (resSubmit.data) {
        message.success("Created successfully!");
        form.resetFields();
        setOpenCreateBook(false);
        refreshTable();
      } else {
        message.error(resSubmit.message);
      }

      console.log("Form values:", values);
      console.log("Thumbnail files:", fileListThumbnail);
      console.log("Slider files:", fileListSlider);
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmit(false); // Ensure this always runs
    }
  };

  const getBase64 = (file: FileType): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
    if (!isLt2M) {
      message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
    }
    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleRemove = (file: UploadFile, type: UserUploadType) => {
    if (type === "thumbnail") {
      setFileListThumbnail([]);
    } else if (type === "slider") {
      setFileListSlider(fileListSlider.filter((item) => item.uid !== file.uid));
    }
  };

  const handleChange = (info: UploadChangeParam, type: UserUploadType) => {
    if (info.file.status === "uploading") {
      type === "slider" ? setLoadingSlider(true) : setLoadingThumbnail(true);
      return;
    }

    if (info.file.status === "done") {
      // Get this url from response in real world.
      type === "slider" ? setLoadingSlider(false) : setLoadingThumbnail(false);
    }
  };

  const handleUploadFile = async (
    options: RcCustomRequestOptions,
    type: UserUploadType
  ) => {
    const { onSuccess } = options;
    const file = options.file as UploadFile;
    const res = await uploadFileAPI(file, "book");

    if (res && res.data) {
      const uploadedFile: any = {
        uid: file.uid,
        name: res.data.fileUploaded,
        status: "done",
        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
          res.data.fileUploaded
        }`,
      };
      if (type === "thumbnail") {
        setFileListThumbnail([{ ...uploadedFile }]);
      } else {
        setFileListSlider((prevState) => [...prevState, { ...uploadedFile }]);
      }
      if (onSuccess) {
        onSuccess("ok");
      } else {
        message.error(res.message);
      }
    }
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title="Create New Book"
      open={openCreateBook}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenCreateBook(false);
      }}
      destroyOnClose={true}
      okButtonProps={{ loading: isSubmit }}
      okText={"Create"}
      cancelText={"Cancel"}
      confirmLoading={isSubmit}
      width={"50vw"}
      maskClosable={false}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="mainText"
          label={<strong>Title</strong>}
          rules={[{ required: true, message: "Title is required!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="author"
          label={<strong>Author</strong>}
          rules={[{ required: true, message: "author is required!" }]}
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
          <Select options={listCategory} allowClear showSearch />
        </Form.Item>

        <Form.Item
          name="quantity"
          label={<strong>Quantity</strong>}
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label="Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            maxCount={1}
            multiple={false}
            customRequest={(options) => handleUploadFile(options, "thumbnail")}
            beforeUpload={beforeUpload}
            onChange={(info) => handleChange(info, "thumbnail")}
            onPreview={handlePreview}
            onRemove={(file) => handleRemove(file, "thumbnail")}
            fileList={fileListThumbnail}
          >
            <div>
              {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="slider"
          label="Slider Images"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            maxCount={1}
            multiple={false}
            customRequest={(options) => handleUploadFile(options, "slider")}
            beforeUpload={beforeUpload}
            onChange={(info) => handleChange(info, "slider")}
            onPreview={handlePreview}
            onRemove={(file) => handleRemove(file, "slider")}
            fileList={fileListThumbnail}
          >
            <div>
              {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
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
