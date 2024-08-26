import axiosInstance from '../../config/axiosConfig';
import React, { useEffect, useState } from 'react';

interface DataSheets {
  id: number;
  project_name: string;
  purchasing_date: string;
  company: number;
}

interface Company {
  id: number;
  company_name: string;
  created_at: string;
  updated_at: string;
}
interface Project {
  id: number;
  project_name: string;
  project_start_date: string;

}


const DataSheetViewModal = (id:any) => {
  const [dataSheet, setDataSheet] = useState<DataSheets | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [projectError, setProjectError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchDataSheet = async () => {
      try {
        const response = await axiosInstance.get(`/datasheet/${id.rowId}`);
        setDataSheet(response.data);
      } catch (error) {
        console.error('Error fetching data sheet:', error);
      }
    };

    fetchDataSheet();
  }, [id]);

  useEffect(() => {
    const fetchCompany = async (companyId: number) => {
      console.log(companyId);
      
      try {
        const response = await axiosInstance.get(`/company/${companyId}`);
        setCompany(response.data);
        setCompanyError(null);
      } catch (error: any) {
        setCompany(null);
        if (error.response && error.response.status === 404) {
          setCompanyError('Company not found.');
        } else {
          setCompanyError('Failed to fetch company information.');
        }
      }
    };

    if (dataSheet?.company) {
      fetchCompany(dataSheet.company);
    }
  }, [dataSheet]);

  useEffect(() => {
    const fetchProject = async (projectId: number) => {
      try {
        const response = await axiosInstance.get(`/projects/${projectId}`);
        setProject(response.data);
        setProjectError(null);
      } catch (error: any) {
        setProject(null);
        if (error.response && error.response.status === 404) {
          setProjectError('Project not found.');
        } else {
          setProjectError('Failed to fetch project information.');
        }
      }
    };
    
    if (dataSheet?.id) {
      fetchProject(dataSheet.id);
    }
  }, [dataSheet]);

  if (!dataSheet) {
    return <div>Loading project...</div>;
  }

  return (
    <div>
      <p>
        {project ? (
          <>
            <span>Project Name: {project.project_name}</span><br /><br />
            <span>Project Start Date: {formatDate(project.project_start_date)}</span>
          </>
        ) : (
          <span>{projectError || 'Loading project information...'}</span>
        )}
      </p>     
      <p>Purchase Date: {formatDate(dataSheet.purchasing_date) || 'N/A'}</p>
      <p>
        Company:{' '}
        {company ? (
          company.company_name
        ) : (
          <span>{companyError || 'Loading company information...'}</span>
        )}
      </p>
    </div>
  );
};

export default DataSheetViewModal;
