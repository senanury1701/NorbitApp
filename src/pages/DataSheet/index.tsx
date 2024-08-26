import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import DataSheetTable from '../../Components/DataSheet/DataSheetTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchDataSheet } from '../../slices/thunks';

const DataSheet = () => {
  

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
          header: "Purchasing Date",
          accessorKey: "purchasing_date",
          enableColumnFilter: false,
      },

    ],
    []
  );

  const dispatch = useDispatch<any>();
  const { datasheet, status, error, } = useSelector((state:any) => state.datasheet);



  
  useEffect(() => {
    dispatch(fetchDataSheet());
    console.log(datasheet);
    
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
                    <BreadCrumb title="DataSheet"  />
                    <div className='m-3'>
                      <DataSheetTable
                            columns={(columns || [])}
                            data={(datasheet || [])}
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

export default DataSheet;
