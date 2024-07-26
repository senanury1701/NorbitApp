import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

interface EmployeeManangement {
  id: number;
  EmployeeManangement_name: string;
  created_at: string;
  updated_at: string;
}

const EmployeeManangementViewModal = (id:any) => {
  const [EmployeeManangement, setEmployeeManangement] = useState<EmployeeManangement | null>(null);
  
  useEffect(() => {
    const fetchEmployeeManangement = async () => {
      try {
        const response = await axiosInstance.get(`/EmployeeManangement/${id.rowId}`);
        setEmployeeManangement(response.data); 
      } catch (error) {
        console.log("Error fetching EmployeeManangement:", error);
        throw error;
      }
    };

    fetchEmployeeManangement();
  }, [id]);

  if (!EmployeeManangement) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <p>EmployeeManangement Name: {EmployeeManangement.EmployeeManangement_name}</p>
      <p>Created At: {EmployeeManangement.created_at}</p>
      <p>Updated At: {EmployeeManangement.updated_at}</p>
      {/* Add other fields as needed */}
    </div>
                
  );
};

export default EmployeeManangementViewModal;
