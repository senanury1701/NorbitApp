import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface File {
  id: number;
  problem: string;
  solve_text: string;
  file_1: string;
  file_2: string;
  file_3: string;
  created_at: string;
  updated_at: string;
}

const FileViewModal = (id: any) => {
  const [File, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log(id.rowId);
        
        const response = await axiosInstance.get(`/file/${id.rowId}`);
        setFile(response.data);
      } catch (error) {
        console.log('Error fetching File:', error);
      }
    };

    fetchFile();
  }, [id]);

  if (!File) {
    return <div>Loading File...</div>;
  }

  const getFilePreview = (file: string) => {
    return file ? file : undefined;
  };

  return (
    <div>
      <p>Problem: {File.problem || 'N/A'}</p>
      <p>Solution Description: {File.solve_text || 'N/A'}</p>
      
      <div className="mb-3">
        <p>File 1:</p>
        {getFilePreview(File.file_1) ? (
          <img
            src={getFilePreview(File.file_1)}
            alt="File 1 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="mb-3">
        <p>File 2:</p>
        {getFilePreview(File.file_2) ? (
          <img
            src={getFilePreview(File.file_2)}
            alt="File 2 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="mb-3">
        <p>File 3:</p>
        {getFilePreview(File.file_3) ? (
          <img
            src={getFilePreview(File.file_3)}
            alt="File 3 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <p>Created At: {new Date(File.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(File.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default FileViewModal;
