import { Avatar, Box } from "@mui/material";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import "./Presentation.css";
function Presentation() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];

   const isFileTypeValid = (file) => {
    return validTypes.includes(file.type);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && isFileTypeValid(file)) {
      setSelectedFile(file);
      setFileError('');
    } else {
      setSelectedFile(null);
      setFileError('Only office documents (DOC, DOCX, XLS, XLSX, PPT, PPTX) and PDF files are allowed. Please try again.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Box className="mainBox" {...getRootProps()}>
        <input {...getInputProps()} />

        <Avatar sx={{ width: 100, height: 100 }}>
          <BackupOutlinedIcon  sx={{ color: "#467FCF",fontSize: 40 }} />
        </Avatar>
        <h3>
          {" "}
          <span style={{ color: "#1A73E8" }}>Click to Upload</span> or drag and
          drop
        </h3>

        <p>
          Upload any office document or PDF file. Depending on the size of the
          file, it may require additional time to upload before it can be used
        </p>
        {selectedFile && (
          <div>
          <h4>Selected File:</h4>
          <p>{selectedFile.name}</p>
        </div>
        )}
         {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
      </Box>
    </div>
  );
}

export default Presentation;
