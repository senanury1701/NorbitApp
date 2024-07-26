import React, {  useMemo, useEffect  } from 'react';
import {    Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import EmployeeManangementTable from '../../Components/EmployeeManangement/EmployeeManangementTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeManangement } from '../../slices/thunks';

const EmployeeManangement = () => {
  

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
          header: "username",
          accessorKey: "username",
          enableColumnFilter: false,
      },
      {
          header: "Created At",
          accessorKey: "created_at",
          enableColumnFilter: false,
      },
      {
          header: "Updated At",
          accessorKey: "updated_at",
          enableColumnFilter: false,
      },

    ],
    []
  );

  const dispatch = useDispatch<any>();
  const { employeeManangement , status, error, } = useSelector((state:any) => state.employeeManangement);



  
  useEffect(() => {
    dispatch(fetchEmployeeManangement ());
  }, [dispatch]);

  if (status === 'idle') {
    return <div>Loading...</div>; 
  }

  if (status === 'failed') {
    return <div>{error}</div>; 
  }
    return (
        <React.Fragment>
            <UiContent />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="EmployeeManangement"  />
                    <div className='m-3'>
                      <EmployeeManangementTable
                            columns={(columns || [])}
                            data={(employeeManangement  || [])}
                            isGlobalFilter={true}
                            customPageSize={5}
                            SearchPlaceholder='Search...'
                      />                      
                    </div>


                </Container>
            </div>
        </React.Fragment>
    );
};

export default EmployeeManangement;

