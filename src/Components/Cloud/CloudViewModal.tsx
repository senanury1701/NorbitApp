import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  name: string;
  description: string;
  driver: number[];  
  owner_id: string;
}

const CloudViewModal: React.FC<{ rowId: any }> = ({ rowId }) => {
  const [cloud, setCloud] = useState<Cloud | null>(null);

  useEffect(() => {
    const fetchCloud = async () => {
      try {
        const response = await axiosInstance.get(`/cloud/${rowId}`);
        setCloud(response.data);
      } catch (error) {
        console.log('Error fetching Cloud:', error);
      }
    };

    fetchCloud();
  }, [rowId]);

  if (!cloud) {
    return <div>Loading cloud...</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <p><strong>Cloud Name:</strong> {cloud.name || 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Description:</strong> {cloud.description || 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Driver:</strong> {cloud.driver.length > 0 ? cloud.driver.join(', ') : 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Owner ID:</strong> {cloud.owner_id || 'N/A'}</p>
      </div>
    </div>
  );
};

export default CloudViewModal;
