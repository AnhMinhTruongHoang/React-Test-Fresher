import { Descriptions, Divider, Drawer, Tag, Upload, Image } from "antd";
import { useEffect, useState } from "react";
import type { UploadFile, UploadProps } from "antd/es/upload";
import { v4 as uuidv4 } from "uuid";

interface IProps {
  openViewData: boolean;
  setOpenViewData: (v: boolean) => void;
  dataView: IBookTable | null;
  setDataView: (v: IBookTable | null) => void;
}

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const BookDetails = (props: IProps) => {
  const { openViewData, setOpenViewData, dataView, setDataView } = props;
  const [previewImage, setPreviewImage] = useState<string>("");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (dataView) {
      let imgThumbnail: UploadFile | null = null;
      let imgSlider: UploadFile[] = [];

      if (dataView.thumbnail) {
        imgThumbnail = {
          uid: uuidv4(),
          name: dataView.thumbnail,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataView.thumbnail
          }`,
        };
      }

      if (dataView.slider && Array.isArray(dataView.slider)) {
        imgSlider = dataView.slider.map((img: string) => ({
          uid: uuidv4(),
          name: img,
          status: "done",
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${img}`,
        }));
      }

      setFileList(imgThumbnail ? [imgThumbnail, ...imgSlider] : imgSlider);
    }
  }, [dataView]);

  const onClose = () => {
    setOpenViewData(false);
    setDataView(null);
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <Drawer
      title="Book Details"
      width={"50vw"}
      onClose={onClose}
      open={openViewData}
    >
      {dataView ? (
        <Descriptions title="User Information" bordered column={2}>
          <Descriptions.Item label="ID">{dataView._id}</Descriptions.Item>
          <Descriptions.Item label="Title">
            {dataView.mainText}
          </Descriptions.Item>
          <Descriptions.Item label="Author">
            {dataView.author}
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {dataView.category}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(dataView.price)}
          </Descriptions.Item>
          <Descriptions.Item label="Active Status">
            <Tag color={dataView.quantity > 0 ? "green" : "red"}>
              {dataView.quantity > 0 ? "Stocked" : "Empty"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(dataView.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(dataView.updatedAt).toLocaleDateString()}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No Book selected.</p>
      )}

      <Divider orientation="left">Images</Divider>

      <Upload
        action=""
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        showUploadList={{ showRemoveIcon: false }}
      />

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Drawer>
  );
};

export default BookDetails;
