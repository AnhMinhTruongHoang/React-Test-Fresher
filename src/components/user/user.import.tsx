import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import Exceljs from "exceljs";
import { message, Modal, notification, Table, Upload } from "antd";
import { useState } from "react";
import { bulkCreateUserAPI } from "../services/api";

interface IProps {
  openUpload: boolean;
  setOpenUpload: (v: boolean) => void;
  refreshTable: () => void;
}

type IDataImport = {
  key: string; // Added unique key
  fullName: string;
  email: string;
  phone: string;
};

const FilesUpLoadModal = ({
  openUpload,
  setOpenUpload,
  refreshTable,
}: IProps) => {
  const { Dragger } = Upload;
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const prop: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) {
          onSuccess("ok");
        }
      }, 1000);
    },

    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      }
      if (info.fileList && info.fileList.length > 0) {
        const file = info.fileList[0].originFileObj as File;
        if (!file) return;

        try {
          const workbook = new Exceljs.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          await workbook.xlsx.load(arrayBuffer);

          let jsonData: IDataImport[] = [];
          workbook.worksheets.forEach((sheet) => {
            const firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;

            let keys = firstRow.values as any[];

            sheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) return;
              const values = row.values as any;
              let obj: any = {};

              for (let i = 0; i < keys.length; i++) {
                obj[keys[i]] = values[i];
                obj.id = i;
              }

              jsonData.push(obj);
            });
          });

          jsonData = jsonData.map((item, index) => {
            return { ...item, id: index + 1 };
          });
          setDataImport(jsonData);
        } catch (error) {
          console.error("Error processing file:", error);
          message.error("File processing failed.");
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleImport = async () => {
    setIsSubmit(true);
    const dataSubmit = dataImport.map((item) => ({
      fullName: item.fullName,
      email: item.email,
      phone: item.phone,
      password: import.meta.env.VITE_USER_CREATE_DEFAULT_PASSWORD,
    }));
    const res = await bulkCreateUserAPI(dataSubmit);
    if (res.data) {
      notification.success({
        message: "Bulk Created",
        description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
      });
    }
    setIsSubmit(false);
    setOpenUpload(false);
    setDataImport([]);
    refreshTable();
  };

  return (
    <Modal
      title="Import user file"
      width={"50vw"}
      open={openUpload}
      onOk={() => handleImport()}
      onCancel={() => {
        setOpenUpload(false);
        setDataImport([]);
      }}
      okText="Import data"
      okButtonProps={{
        disabled: dataImport.length > 0 ? false : true,
        loading: isSubmit,
      }}
    >
      <Dragger {...prop}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <hr />
      <div>
        <Table
          rowKey={"id"}
          title={() => <span>Data</span>}
          dataSource={dataImport}
          columns={[
            { dataIndex: "fullName", title: "UserName" },
            { dataIndex: "email", title: "Email" },
            { dataIndex: "phone", title: "Phone" },
          ]}
        />
      </div>
    </Modal>
  );
};

export default FilesUpLoadModal;
