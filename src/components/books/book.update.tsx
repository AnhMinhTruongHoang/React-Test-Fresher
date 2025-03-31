import {
  App,
  Button,
  Form,
  FormProps,
  GetProp,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
} from "antd";
import { getCategoryApi, updateBookApi, uploadFileAPI } from "../services/api";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadProps } from "antd/lib";
import { MAX_UPLOAD_IMAGE_SIZE } from "../services/helper";
import { UploadChangeParam } from "antd/lib/upload";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  openUpdateBook: boolean;
  setOpenUpdateBook: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IBookTable | null;
  setDataUpdate: (v: IBookTable | null) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

type UserUploadType = "thumbnail" | "slider";

type FieldType = {
  _id: string;
  thumbnail: string;
  slider: string[];
  mainText: string;
  author: string;
  price: number;
  quantity: number;
  category: string;
};

const UpdateBookModal = ({
  openUpdateBook,
  setOpenUpdateBook,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { message } = App.useApp();
  const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);
  const [fileListSlider, setFileListSlider] = useState<UploadFile[]>([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingSlider, setLoadingSlider] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");
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

  useEffect(() => {
    if (dataUpdate) {
      const arrThumbnail = [
        {
          uid: uuidv4(),
          name: dataUpdate.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataUpdate.thumbnail
          }`,
        },
      ];

      const arrSlider = dataUpdate?.slider?.map((item) => {
        return {
          uid: uuidv4(),
          name: item,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
        };
      });
      form.setFieldsValue({
        _id: dataUpdate._id,
        mainText: dataUpdate.mainText,
        author: dataUpdate.author,
        price: dataUpdate.price,
        category: dataUpdate.category,
        quantity: dataUpdate.quantity,
        thumbnail: arrThumbnail,
        slider: arrSlider,
      });

      setFileListThumbnail(arrThumbnail as any);
      setFileListSlider(arrSlider as any);
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);
    try {
      const { _id, mainText, author, price, quantity, category } = values;
      const thumbnail = fileListThumbnail?.[0]?.name ?? "";
      const slider = fileListSlider?.map((item) => item.name) ?? [];

      const resSubmit = await updateBookApi(
        _id,
        thumbnail,
        slider,
        mainText,
        author,
        price,
        quantity,
        category
      );

      if (resSubmit.data) {
        message.success("Updated successfully!");
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setOpenUpdateBook(false);
        refreshTable();
      } else {
        message.error(resSubmit.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmit(false);
    }
  };
  ///////////
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
    return e?.fileList || [];
  };
  //////////////
  return (
    <Modal
      title="Update Book"
      open={openUpdateBook}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setFileListSlider([]);
        setFileListThumbnail([]);
        setDataUpdate(null);
        setOpenUpdateBook(false);
      }}
      okButtonProps={{ loading: isSubmit }}
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
        <Form.Item name="_id" label="_id" hidden>
          <Input />
        </Form.Item>

        <Form.Item name="mainText" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price (VND)"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select options={listCategory} allowClear showSearch />
        </Form.Item>
        <Form.Item
          name="quantity"
          label="Quantity"
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
            customRequest={(options) => handleUploadFile(options, "slider")}
            fileList={fileListSlider}
            multiple
          >
            <div>
              <PlusOutlined />
              <div>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isSubmit} block>
          Update Book
        </Button>
      </Form>
    </Modal>
  );
};

export default UpdateBookModal;
