import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";
import SearchTable from '../../Components/Category/datatable'

const Category = () => {
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Category"  />
          <SearchTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Category;
