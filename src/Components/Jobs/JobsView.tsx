import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";
import {Row,Col,} from "reactstrap";


interface Jobs {
  id: number;
  job_title: string;
  created_at: string;
  updated_at: string;
}

const JobsView = (id:any) => {
  const [jobs, setJobs] = useState<Jobs | null>(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get(`/jobs/${id.rowId}`);
        setJobs(response.data); 
        console.log(response.data);
        
      } catch (error) {
        console.log("Error fetching Jobs:", error);
        throw error;
      }
    };

    fetchJobs();
  }, [id]);

  if (!jobs) {
    return <div>Loading...</div>;
  }



  return (
    <div >
      <Row>
        <Col>
          <p><strong>Jobs Name:</strong> {jobs.job_title}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Created At:</strong> {new Date(jobs.created_at).toLocaleString()}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <p><strong>Updated At:</strong> {new Date(jobs.updated_at).toLocaleString()}</p>
        </Col>
      </Row>
    </div>            
  );
};

export default JobsView;
