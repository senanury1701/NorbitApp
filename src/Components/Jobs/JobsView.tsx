import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

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
      <p>Jobs Name: {jobs.job_title}</p>
      <p>Created At: {jobs.created_at}</p>
      <p>Updated At: {jobs.updated_at}</p>
      {/* Add other fields as needed */}
    </div>
                
  );
};

export default JobsView;
