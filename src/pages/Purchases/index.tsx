import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";

const Purchases = () => {
  console.log('purchases');
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle='Purchases' title='Purchases'/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Purchases;
