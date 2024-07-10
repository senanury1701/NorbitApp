import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";

const Jobs = () => {
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title='Jobs'/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Jobs;
