import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";
import {Row,Col,} from "reactstrap";

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
      <Row>
        <Col>
          <p><strong>Company Name:</strong> {company.company_name}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Created At:</strong> {new Date(company.created_at).toLocaleString()}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Updated At:</strong> {new Date(company.updated_at).toLocaleString()}</p>
        </Col>
      </Row>
    </div>
                
  );
};

export default CompanyViewModal;
