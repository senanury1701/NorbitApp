import React, {  useMemo,  } from 'react';
import TableContainer from "../Common/TableContainerReactTable";


const DataTable = () => {

  const searchTable =
    [
      { id: "10", name: "Tyrone", email: "tyrone@example.com", designation: "Senior Response Liaison", company: "Raynor, Rolfson and Daugherty", location: "Qatar",haha: "Qatar" },
      { id: "09", name: "Cathy", email: "cathy@example.com", designation: "Customer Data Director", company: "Ebert, Schamberger and Johnston", location: "Mexico" ,haha: "Qatar"},
      { id: "08", name: "Patsy", email: "patsy@example.com", designation: "Dynamic Assurance Director", company: "Streich Group", location: "Niue" ,haha: "Qatar"},
      { id: "07", name: "Kerry", email: "kerry@example.com", designation: "Lead Applications Associate", company: "Feeney, Langworth and Tremblay", location: "Niger",haha: "Qatar" },
      { id: "06", name: "Traci", email: "traci@example.com", designation: "Corporate Identity Director", company: "Koelpin - Goldner", location: "Vanuatu" ,haha: "Qatar"},
      { id: "05", name: "Noel", email: "noel@example.com", designation: "Customer Data Director", company: "Howell - Rippin", location: "Germany" ,haha: "Qatar"},
      { id: "04", name: "Robert", email: "robert@example.com", designation: "Product Accounts Technician", company: "Hoeger", location: "San Marino" ,haha: "Qatar"},
      { id: "03", name: "Shannon", email: "shannon@example.com", designation: "Legacy Functionality Associate", company: "Zemlak Group", location: "South Georgia" ,haha: "Qatar"},
      { id: "02", name: "Harold", email: "harold@example.com", designation: "Forward Creative Coordinator", company: "Metz Inc", location: "Iran" ,haha: "Qatar"},
      { id: "01", name: "Jonathan", email: "jonathan@example.com", designation: "Senior Implementation Architect", company: "Hauck Inc", location: "Holy See" ,haha: "Qatar"}
    ];

  const columns = useMemo(
    () => [
      {
        header: "ID",
        cell: (cell: any) => {
          return (
            <span className="fw-semibold">{cell.getValue()}</span>
          );
        },
        accessorKey: "id",
        enableColumnFilter: false,
      },

      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },
      {
        header: "Designation",
        accessorKey: "designation",
        enableColumnFilter: false,
      },
      {
        header: "Company",
        accessorKey: "company",
        enableColumnFilter: false,
      },
      {
        header: "Location",
        accessorKey: "location",
        enableColumnFilter: false,
      },
      {
        header: "Location",
        accessorKey: "location",
        enableColumnFilter: false,
      }
    ],
    []
  );

  return (
    <React.Fragment >
      <TableContainer
        columns={(columns || [])}
        data={(searchTable || [])}
        isGlobalFilter={true}        
        SearchPlaceholder='Search...'
      />
    </React.Fragment >
  );
};


export default  DataTable ;