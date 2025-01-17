import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Knowhow {
  id: number;
  problem: string;
  solve_text: string;
  file_1: string;
  file_2: string;
  file_3: string;
  created_at: string;
  updated_at: string;
}

const KnowhowViewModal = (id: any) => {
  const [knowhow, setKnowhow] = useState<Knowhow | null>(null);

  useEffect(() => {
    const fetchKnowhow = async () => {
      try {
        console.log(id.rowId);
        
        const response = await axiosInstance.get(`/knowhow/detail/${id.rowId}`);
        setKnowhow(response.data);
      } catch (error) {
        console.log('Error fetching Knowhow:', error);
      }
    };

    fetchKnowhow();
  }, [id]);

  if (!knowhow) {
    return <div>Loading Knowhow...</div>;
  }

  const getFilePreview = (file: string) => {
    return file ? file : undefined;
  };

  return (
    <div>
      <p>Problem: {knowhow.problem || 'N/A'}</p>
      <p>Solution Description: {knowhow.solve_text || 'N/A'}</p>
      
      <div className="mb-3">
        <p>File 1:</p>
        {getFilePreview(knowhow.file_1) ? (
          <img
            src={getFilePreview(knowhow.file_1)}
            alt="File 1 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="mb-3">
        <p>File 2:</p>
        {getFilePreview(knowhow.file_2) ? (
          <img
            src={getFilePreview(knowhow.file_2)}
            alt="File 2 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <div className="mb-3">
        <p>File 3:</p>
        {getFilePreview(knowhow.file_3) ? (
          <img
            src={getFilePreview(knowhow.file_3)}
            alt="File 3 Preview"
            style={{ maxHeight: '100px', maxWidth: '100px' }}
          />
        ) : (
          <span>No file available</span>
        )}
      </div>

      <p>Created At: {new Date(knowhow.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(knowhow.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default KnowhowViewModal;
