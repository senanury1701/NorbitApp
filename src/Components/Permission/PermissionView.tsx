import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";
import {Row,Col,} from "reactstrap";

interface Permission {
  id: number;
  username: string;
  email: string;
  user_permissions: [];
}

const PermissionViewModal = (id:any) => {
  const [permission, setPermission] = useState<Permission | null>(null);
  
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axiosInstance.get(`/permission/${id.rowId}`);
        setPermission(response.data);
        console.log(response.data);
         
      } catch (error) {
        console.log("Error fetching Permission:", error);
        throw error;
      }
    };

    fetchPermission();
  }, [id]);

  if (!permission) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <Row>
        <Col>
          <p><strong>Permission Name:</strong> {permission.username}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>email:</strong> {permission.email}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Updated At:</strong> {permission.user_permissions}</p>
        </Col>
      </Row>
    </div>
                
  );
};

export default PermissionViewModal;
