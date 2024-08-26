import axiosInstance from '../../config/axiosConfig'
import React, { useEffect, useState } from "react";

interface EmployeeManangement {
  job_title: number[];
  company_name: number[];
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  user: string;
  profile_pic: string | null;
  skills: string;
  about: string;
  files: string | null;
  links: string;
  job_start_date: string | null;
  job_end_date: string | null;
  created_at: string;
  updated_at: string;
}

const EmployeeManangementViewModal = (id: any) => {
  const [EmployeeManangement, setEmployeeManangement] = useState<EmployeeManangement | null>(null);
  
  const formatDate = (dateString: any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchEmployeeManangement = async () => {
      try {
        const response = await axiosInstance.get(`/ems/employee/${id.rowId}`);
        setEmployeeManangement(response.data); 
      } catch (error) {
        console.log("Error fetching EmployeeManangement:", error);
        throw error;
      }
    };

    fetchEmployeeManangement();
  }, [id]);

  if (!EmployeeManangement) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>Job Titles: {EmployeeManangement.job_title.join(', ')}</p>
      <p>Company Names: {EmployeeManangement.company_name.join(', ')}</p>
      <p>Username: {EmployeeManangement.username}</p>
      <p>First Name: {EmployeeManangement.first_name}</p>
      <p>Last Name: {EmployeeManangement.last_name}</p>
      <p>Email: {EmployeeManangement.email}</p>
      <p>User Type: {EmployeeManangement.user}</p>
      <p>Profile Picture: {EmployeeManangement.profile_pic || 'No picture available'}</p>
      <p>Skills: {EmployeeManangement.skills}</p>
      <p>About: {EmployeeManangement.about}</p>
      <p>Links: {EmployeeManangement.links}</p>
      <p>Job Start Date: {formatDate(EmployeeManangement.job_start_date)}</p>
      <p>Job End Date: {formatDate(EmployeeManangement.job_end_date)}</p>
      <p>Created At: {formatDate(EmployeeManangement.created_at)}</p>
      <p>Updated At: {formatDate(EmployeeManangement.updated_at)}</p>
    </div>
  );
};

export default EmployeeManangementViewModal;
