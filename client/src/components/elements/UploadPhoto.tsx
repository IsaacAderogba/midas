// modules
import React from "react";

// components
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile, RcFile } from "antd/lib/upload/interface";

interface IUploadPhoto {
  imageUrl: string | null | undefined;
  loading: boolean;
  beforeUpload:
    | ((file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void>)
    | undefined;
  onChange: ((info: UploadChangeParam<UploadFile<any>>) => void) | undefined;
}

export const UploadPhoto: React.FC<IUploadPhoto> = ({
  imageUrl,
  onChange,
  beforeUpload,
  loading,
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
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={onChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
