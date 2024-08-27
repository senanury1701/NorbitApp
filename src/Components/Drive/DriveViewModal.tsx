import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Drive {
  id: number;
  problem: string;
  solve_text: string;
  file_1: string;
  file_2: string;
  file_3: string;
  created_at: string;
  updated_at: string;
}

const DriveViewModal = (id: any) => {
  const [Drive, setDrive] = useState<Drive | null>(null);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        console.log(id.rowId);
        
        const response = await axiosInstance.get(`/drive/${id.rowId}`);
        setDrive(response.data);
      } catch (error) {
        console.log('Error fetching Drive:', error);
      }
    };

    fetchDrive();
  }, [id]);

  if (!Drive) {
    return <div>Loading Drive...</div>;
  }

  const getFilePreview = (file: string) => {
    return file ? file : undefined;
  };

  return (
    <div>
      <p>Problem: {Drive.problem || 'N/A'}</p>
      <p>Solution Description: {Drive.solve_text || 'N/A'}</p>
      
      <div className="mb-3">
        <p>File 1:</p>
        {getFilePreview(Drive.file_1) ? (
          <img
            src={getFilePreview(Drive.file_1)}
            alt="File 1 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="mb-3">
        <p>File 2:</p>
        {getFilePreview(Drive.file_2) ? (
          <img
            src={getFilePreview(Drive.file_2)}
            alt="File 2 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="mb-3">
        <p>File 3:</p>
        {getFilePreview(Drive.file_3) ? (
          <img
            src={getFilePreview(Drive.file_3)}
            alt="File 3 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <p>Created At: {new Date(Drive.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(Drive.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default DriveViewModal;
