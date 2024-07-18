import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import CategoryTable from '../../Components/Category/CategoryTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory, fetchAllCategory } from '../../slices/thunks';
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

  const { categories, status, error, count } = useSelector((state:any) => state.category);

  useEffect(() => {
    if (count > 5){
      dispatch(fetchAllCategory(count))
    }
  
  }, [count, dispatch])
  
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
                    <BreadCrumb title="Category"  />
                    <div className='m-3'>
                      <CategoryTable
                            columns={(columns )}
                            data={(categories)}
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

export default Category;
