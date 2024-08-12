import React, {  useMemo, useEffect  } from 'react';
import {  Container,  } from "reactstrap";
import UiContent from 'Components/Common/UiContent';
import BreadCrumb from 'Components/Common/BreadCrumb';
import JobsTable from '../../Components/Jobs/JobsTable'
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../slices/thunks';
const Jobs = () => {
  

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
          header: "Jobs Name",
          accessorKey: "job_title",
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

  const { jobs, status, error } = useSelector((state:any) => state.jobs);


  useEffect(() => {
    dispatch(fetchJobs());
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
                    <BreadCrumb title="Jobs Page API Problems 2"  />
                    <div className='m-3'>
                      <JobsTable
                            columns={(columns )}
                            data={(jobs)}
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

export default Jobs;
