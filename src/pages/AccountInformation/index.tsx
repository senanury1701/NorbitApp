import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import AccountInformationTable from '../../Components/AccountInformation/AccountInformationTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountInformation } from '../../slices/thunks';

const AccountInformation = () => {
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
          header: "Website Name",
          accessorKey: "website_name",
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
  const { accountInformation, status, error, } = useSelector((state:any) => state.accountInformation);



  
  useEffect(() => {
    dispatch(fetchAccountInformation());
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
                    <BreadCrumb title="Account Information"  />
                    <div className='m-3'>
                      <AccountInformationTable
                            columns={(columns || [])}
                            data={(accountInformation || [])}
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
export default AccountInformation;
