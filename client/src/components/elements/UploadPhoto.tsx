// modules
import React from "react";

// components
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile, RcFile, RcCustomRequestOptions } from "antd/lib/upload/interface";

interface IUploadPhoto {
  imageUrl: string | null | undefined;
  loading: boolean;
  onUpload: (option: RcCustomRequestOptions) => void;
}

function beforeUpload(file: RcFile) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.error("Image must smaller than 1MB!");
  }
  return isJpgOrPng && isLt1M;
}

export const UploadPhoto: React.FC<IUploadPhoto> = ({
  imageUrl,
  loading,
  onUpload,
}) => {
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      customRequest={onUpload}
      beforeUpload={beforeUpload}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
