import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import InventoryTable from '../../Components/Inventory/InventoryTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventories, fetchAllInventories } from '../../slices/thunks';
const Inventories = () => {
  

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
          header: "Project",
          accessorKey: "project",
          enableColumnFilter: false,
      },
      {
          header: "Category",
          accessorKey: "category",
          enableColumnFilter: false,
      },
      {
          header: "Product Name",
          accessorKey: "product_name",
          enableColumnFilter: false,
      },
      {
          header: "Count",
          accessorKey: "count",
          enableColumnFilter: false,
      },
      {
          header: "Price",
          accessorKey: "price",
          enableColumnFilter: false,
      },

      {
          header: "Buy Time",
          accessorKey: "satin_alinan_tarih",
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

  const { inventories, status, error, count } = useSelector((state:any) => state.inventories);

  useEffect(() => {
    if (count > 5){
      dispatch(fetchAllInventories(count))
    }
  
  }, [count, dispatch])
  
  useEffect(() => {
    dispatch(fetchInventories());
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
                    <BreadCrumb title="Inventories"  />
                    <div className='m-3'>
                      <InventoryTable
                            columns={(columns )}
                            data={(inventories)}
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

export default Inventories;
