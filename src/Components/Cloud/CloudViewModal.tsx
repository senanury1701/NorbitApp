import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  name: string;
  description: string;
  driver: number[];  
  owner_id: string;
}

interface ResPerson {
  id: string;
  name: string;
  username:string
}

const CloudViewModal: React.FC<{ rowId: any }> = ({ rowId }) => {
  const [cloud, setCloud] = useState<Cloud | null>(null);
  const [owner, setOwner] = useState<ResPerson | null>(null);
  const [drive, setDrive] = useState<ResPerson | null>(null);

  useEffect(() => {
    const fetchCloud = async () => {
      try {
        const response = await axiosInstance.get(`/cloud/${rowId}`);
        const fetchedCloud = response.data;
        setCloud(fetchedCloud);
        console.log(cloud);

        if (fetchedCloud.owner_id) {
          const ownerResponse = await axiosInstance.get(`/ems/employee/${fetchedCloud.owner_id}`);
          setOwner(ownerResponse.data);
          
        }

        if (fetchedCloud.driver && fetchedCloud.driver.length > 0) {
          const driveResponse = await axiosInstance.get(`/drive/${fetchedCloud.driver}`);
          setDrive(driveResponse.data);
          console.log(driveResponse.data);

        }
      } catch (error) {
        console.log('Error fetching Cloud:', error);
      }
    };

    fetchCloud();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowId]);

  if (!cloud) {
    return <div>Loading cloud...</div>;
  }

  return (
    <div>
      <div className="mb-3">
        <p><strong>Owner:</strong> {owner ? owner.username : 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Cloud Name:</strong> {cloud.name || 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Description:</strong> {cloud.description || 'N/A'}</p>
      </div>
      <div className="mb-3">
        <p><strong>Drive Location:</strong> {drive ? drive.name : 'driver not found'}</p>
      </div>
    </div>
  );
};

export default CloudViewModal;
