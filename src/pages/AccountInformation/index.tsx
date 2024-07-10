import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";

const AccountInformation = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title='AccountInformation'/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AccountInformation;
