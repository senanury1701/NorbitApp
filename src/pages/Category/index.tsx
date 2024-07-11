import React from "react";
import { Container } from "reactstrap";
import BreadCrumb from "Components/Common/BreadCrumb";
import DataTable from '../../Components/Category/datatable'

const Category = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Category"  />
          <DataTable/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Category;
