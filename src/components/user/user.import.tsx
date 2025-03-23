import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import Exceljs from "exceljs";
import { message, Modal, Table, Upload } from "antd";
import { useState } from "react";

interface IProps {
  openUpload: boolean;
  setOpenUpload: (v: boolean) => void;
}

type IDataImport = {
  key: string; // Added unique key
  fullName: string;
  email: string;
  phone: string;
};

const FilesUpLoadModal = ({ openUpload, setOpenUpload }: IProps) => {
  const { Dragger } = Upload;
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);

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

            const keys = firstRow.values?.filter((key) => key) as string[];

            sheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) return;
              const values = row.values as any;
              let obj: IDataImport = {
                key: rowNumber.toString(), // Unique key for React
                fullName: values[1] || "",
                email: values[2] || "",
                phone: values[3] || "",
              };

              jsonData.push(obj);
            });
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

  return (
    <Modal
      title="Import user file"
      width={"50vw"}
      open={openUpload}
      onOk={() => setOpenUpload(false)}
      onCancel={() => {
        setOpenUpload(false);
        setDataImport([]);
      }}
      okButtonProps={{
        disabled: true,
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
          title={() => <span>Data</span>}
          dataSource={dataImport}
          rowKey="key" // Add this to properly render rows
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
