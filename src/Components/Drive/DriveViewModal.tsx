import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Drive {
  id: number;
  name: string;
  file: string; 
  drive: number[];  
  owner_id: string;
  description: string,
  cloud: string
}

interface ResPerson {
  id: string;
  name: string;
  username: string;
}

const DriveViewModal: React.FC<{ rowId: any }> = ({ rowId }) => {
  const [drive, setDrive] = useState<Drive | null>(null);
  const [owner, setOwner] = useState<ResPerson | null>(null);
  const [cloud, setCloud] = useState<ResPerson | null>(null);

  useEffect(() => {
    const fetchDrive = async () => {
      try {
        // Fetch the main drive
        const response = await axiosInstance.get(`/drive/${rowId}`);
        const fetchedDrive: Drive = response.data;
        setDrive(fetchedDrive);

        // Fetch the owner if available
        if (fetchedDrive.owner_id) {
          const ownerResponse = await axiosInstance.get(`/ems/employee/${fetchedDrive.owner_id}`);
          setOwner(ownerResponse.data);
        }
        if (fetchedDrive.cloud) {
          const cloudResponse = await axiosInstance.get(`/cloud/${fetchedDrive.cloud}`);
          setCloud(cloudResponse.data);
        }


      } catch (error) {
        console.log('Error fetching drive:', error);
      }
    };

    fetchDrive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  if (!drive) {
    return <div>Loading drive...</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <p><strong>Owner:</strong> {owner ? owner.username : 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Drive Name:</strong> {drive.name || 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Description:</strong> {drive.description || 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>File:</strong> 
          {drive.file ? (
            <a href={drive.file} target="_blank" rel="noopener noreferrer">
              View File
            </a>
          ) : (
            'No file attached'
          )}
        </p>
      </div>
      <div className="mb-3">
        <p><strong>Associated Drives:</strong> 
          {cloud ? cloud.name : 'Not found'}
        </p>
      </div>
    </div>
  );
};

export default DriveViewModal;
