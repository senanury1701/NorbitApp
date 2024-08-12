import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import CategoryTable from '../../Components/Category/CategoryTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory } from '../../slices/thunks';
const Category = () => {
  

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
          header: "Category Name",
          accessorKey: "name",
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

  const { categories, status, error } = useSelector((state:any) => state.category);


  useEffect(() => {
    dispatch(fetchCategory());    
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
                    <BreadCrumb title="Category  ApiDe Search yok"  />
                    <div className='m-3'>
                      <CategoryTable
                            columns={(columns || [])}
                            data={(categories || [])}
                            isGlobalFilter={true}
                            customPageSize={5}
                      />                      
                    </div>


                </Container>
            </div>
        </React.Fragment>
    );
};

export default Category;
