import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";
import {Row,Col,} from "reactstrap";

interface AccountInformation {
  id: number;
  website_name: string;
  website_link: string;
  e_mail: string;
  password: string;
  owner: string;
  created_at: string;
  updated_at: string;
}

const AccountInformationViewModal = (id:any) => {
  const [accountInformation, setAccountInformation] = useState<AccountInformation | null>(null);
  const [owner , setOwner] = useState<any>(null)
  useEffect(() => {
    const fetchAccountInformation = async () => {
      try {
        const response = await axiosInstance.get(`/accountinfo/${id.rowId}`);
        setAccountInformation(response.data); 
        const responseOwner = await axiosInstance.get(`/ems/employee/${response.data.owner}`);
        setOwner(responseOwner.data.username)
       
        
      } catch (error) {
        console.log("Error fetching account Information:", error);
        throw error;
      }
    };

    fetchAccountInformation();
  }, [id]);

  if (!accountInformation) {
    return <div>Loading...</div>;
  }



  return (
    <div>
      <Row>
        <Col>
          <p><strong>Website Name:</strong> {accountInformation.website_name}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Website Link:</strong> <a href={accountInformation.website_link} target="_blank" rel="noopener noreferrer">{accountInformation.website_link}</a></p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Email:</strong> {accountInformation.e_mail}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Password:</strong> {accountInformation.password}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Owner:</strong> {owner}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Created At:</strong> {new Date(accountInformation.created_at).toLocaleString()}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Updated At:</strong> {new Date(accountInformation.updated_at).toLocaleString()}</p>
        </Col>
      </Row>
    </div>
  );
                
};

export default AccountInformationViewModal;
