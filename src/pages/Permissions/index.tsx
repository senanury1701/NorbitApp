import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import PermissionTable from '../../Components/Permission/PermissionTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPermission } from '../../slices/thunks';

const PermissionsTable = () => {

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
          header: "User Name",
          accessorKey: "username",
          enableColumnFilter: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
      },

    ],
    []
  );

  const dispatch = useDispatch<any>();

  const { permissions, status, error } = useSelector((state:any) => state.permission);


  useEffect(() => {
    dispatch(fetchPermission());
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
                    <BreadCrumb title="permissions "  />
                    <div className='m-3'>
                      <PermissionTable
                            columns={(columns )}
                            data={(permissions)}
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

export default PermissionsTable;
