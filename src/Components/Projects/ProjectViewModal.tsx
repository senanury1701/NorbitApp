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
    <div className="container my-4">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Project Details</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Project Name:</div>
            <div className="col-md-8">{project.project_name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Description:</div>
            <div className="col-md-8">{project.description || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Customer:</div>
            <div className="col-md-8">{project.customer}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Project Start Date:</div>
            <div className="col-md-8">{project.project_start_date || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Project End Date:</div>
            <div className="col-md-8">{project.project_end_date || 'N/A'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Company:</div>
            <div className="col-md-8">
              {company ? company.company_name : companyError || 'Loading company information...'}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Employees:</div>
            <div className="col-md-8">
              {employess.length > 0 ? (
                <ul className="list-unstyled">
                  {employess.map((employee) => (
                    <li key={employee.id}>
                      {employee.first_name} {employee.last_name}
                    </li>
                  ))}
                </ul>
              ) : (
                employessError || 'Loading employees information...'
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Created At:</div>
            <div className="col-md-8">
              {new Date(project.created_at).toLocaleString()}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 font-weight-bold">Updated At:</div>
            <div className="col-md-8">
              {new Date(project.updated_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewModal;