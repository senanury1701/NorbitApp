import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";

const Inventories = () => {
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title='Inventories'/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Inventories;
