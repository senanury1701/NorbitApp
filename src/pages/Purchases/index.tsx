import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import PurchaseTable from '../../Components/Purchase/PurchaseTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchase } from '../../slices/thunks';

const Purchase = () => {
  

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
          header: "Product Name",
          accessorKey: "product_name",
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
      {
          header: "Status",
          accessorKey: "status",
          enableColumnFilter: false,
      },
    ],
    []
  );

  const dispatch = useDispatch<any>();
  const { purchase, status, error, } = useSelector((state:any) => state.purchase);



  
  useEffect(() => {
    dispatch(fetchPurchase());
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
                    <BreadCrumb title="Purchase"  />
                    <div className='m-3'>
                      <PurchaseTable
                            columns={(columns || [])}
                            data={(purchase || [])}
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

export default Purchase;
