import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface File {
  id: number;
  name: string;
  owner_id: string;
  file: string;
  drive: string;
  created_at: string;
  updated_at: string;
}

interface ResPerson {
  id: string;
  name: string;
  username: string
}

const FileViewModal = (id: any ) => {
  const [file, setFile] = useState<File | null>(null);
  const [owner, setOwner] = useState<ResPerson | null>(null);
  const [drive, setDrive] = useState<ResPerson | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log(id.rowId);
        const response = await axiosInstance.get(`/file/${id.rowId}`);
        const fetchedFile = response.data;
        setFile(fetchedFile);

        if (fetchedFile.owner_id) {
          const ownerResponse = await axiosInstance.get(`/ems/employee/${fetchedFile.owner_id}`);
          setOwner(ownerResponse.data);
        }

        if (fetchedFile.drive) {
          const driveResponse = await axiosInstance.get(`/drive/${fetchedFile.drive}`);
          setDrive(driveResponse.data);
        }
      } catch (error) {
        console.log('Error fetching File:', error);
      }
    };

    fetchFile();
  }, [id]);

  if (!file) {
    return <div>Loading File...</div>;
  }

  const getFilePreview = (fileUrl: string) => {
    return fileUrl || undefined;
  };

  return (
    <div>
      <p>File Name: {file.name || 'N/A'}</p>
      <p>Owner: {owner ? owner.username : 'N/A'}</p>
      
      <div className="mb-3">
        <p>File Preview:</p>
        {getFilePreview(file.file) ? (
          <img
            src={getFilePreview(file.file)}
            alt="File Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <p>Drive Location: {drive ? drive.name : 'N/A'}</p>
      <p>Created At: {new Date(file.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(file.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default FileViewModal;
