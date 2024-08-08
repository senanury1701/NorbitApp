import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface Project {
  id: number;
  project_name: string;
  description: string;
  customer: string;
  project_start_date: string;
  project_end_date: string;
  company: number;
  employess: number[];
  created_at: string;
  updated_at: string;
}
interface Company {
  id: number;
  company_name: string;
  created_at: string;
  updated_at: string;
}
interface Employee {
  id: number;
  first_name: string;
  last_name: string;

}
const ProjectViewModal = ( id:any ) => {
  const [project, setProject] = useState<Project | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
 const [employess, setEmployess] = useState<Employee[]>([]);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [employessError, setEmployessError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axiosInstance.get(`/projects/${id.rowId}`);
        setProject(response.data);
      } catch (error) {
        console.log('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  useEffect(() => {
    const fetchCompany = async (companyId: number) => {
      try {
        const response = await axiosInstance.get(`/company/${companyId}`);
        setCompany(response.data);
        setCompanyError(null);
      } catch (error:any) {
        setCompany(null);
        if (error.response && error.response.status === 404) {
          setCompanyError('Company not found.');
        } else {
          setCompanyError('Failed to fetch company information.');
        }
      }
    };

    if (project?.company) {
      fetchCompany(project.company);
    }
  }, [project]);

  useEffect(() => {
    const fetchemployess = async (employeeIds: number[]) => {
      if (!employeeIds || employeeIds.length === 0) return;
      
      try {
        const employeePromises = employeeIds.map(async (emsId) => {
          const response = await axiosInstance.get(`/ems/employee/${emsId}`);
          return response.data;
        });

        const employeeData = await Promise.all(employeePromises);
        setEmployess(employeeData);
        setEmployessError(null);
      } catch (error: any) {
        console.log('Error fetching employess:', error);
        setEmployess([]);
        if (error.response && error.response.status === 404) {
          setEmployessError('employess not found.');
        } else {
          setEmployessError('Failed to fetch employess information.');
        }
      }
    };

    if (project?.employess && project.employess.length > 0) {
      fetchemployess(project.employess);
    }
  }, [project?.employess]);

  if (!project) {
    return <div>Loading project...</div>;
  }

  return (
    <div>
      <p>Project Name: {project.project_name}</p>
      <p>Description: {project.description || 'N/A'}</p>
      <p>Customer: {project.customer}</p>
      <p>Project Start Date: {project.project_start_date || 'N/A'}</p>
      <p>Project End Date: {project.project_end_date || 'N/A'}</p>
      <p>
        Company:{' '}
        {company ? (
          company.company_name
        ) : (
          <span>{companyError || 'Loading company information...'}</span>
        )}
      </p>
      <p>employess:</p>
      {employess.length > 0 ? (
        <ul>
          {employess.map((employee) => (
            <li key={employee.id}>
              {employee.first_name} {employee.last_name}
            </li>
          ))}
        </ul>
      ) : (
        <span>{employessError || 'Loading employess information...'}</span>
      )}
      <p>Created At: {new Date(project.created_at).toLocaleString()}</p>
      <p>Updated At: {new Date(project.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default ProjectViewModal;