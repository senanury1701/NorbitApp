import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";

const Dashboard = () => {
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title='Dashboard'/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
