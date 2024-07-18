import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

interface Company {
  id: number;
  company_name: string;
  created_at: string;
  updated_at: string;
}

const CompanyViewModal = (id:any) => {
  const [company, setCompany] = useState<Company | null>(null);
  
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axiosInstance.get(`/company/${id.rowId}`);
        setCompany(response.data); 
      } catch (error) {
        console.log("Error fetching company:", error);
        throw error;
      }
    };

    fetchCompany();
  }, [id]);

  if (!company) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <p>Company Name: {company.company_name}</p>
      <p>Created At: {company.created_at}</p>
      <p>Updated At: {company.updated_at}</p>
      {/* Add other fields as needed */}
    </div>
                
  );
};

export default CompanyViewModal;
