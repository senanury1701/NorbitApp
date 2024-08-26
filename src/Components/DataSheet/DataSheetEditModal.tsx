import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, Button, FormFeedback } from 'reactstrap';
import { useAppDispatch } from '../hooks'; 
import { editDataSheet, fetchCompanies, fetchProjects } from '../../slices/thunks';
import { useSelector } from 'react-redux';
import  { components } from 'react-select';
import AsyncSelect from 'react-select/async';
interface SelectOption {
  value: number | string;
  label: string;
}

interface ProjectEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData;
  const [page, setPage] = useState<number>(1);
  const [pageProject, setPageProject] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchInputProject, setSearchInputProject] = useState<string>('');
  const [defaultCompany, setDefaultCompany] = useState<any>(null); 
  const [defaultProject, setDefaultProject] = useState<any>(null); 
  const { companies, count: companyCount } = useSelector((state: any) => state.company);
  const { projects, count: projectCount } = useSelector((state: any) => state.project);
  const maxPage = Math.ceil(companyCount / 5);
  const maxPageProject = Math.ceil(projectCount / 5);
  
  
  const handleProjectSearchChange = async (inputValue: string) => {
    setSearchInputProject(inputValue);
    setPageProject(1);
    const fetchedProjects = await dispatch(fetchProjects(1, inputValue));
    return fetchedProjects.map((project: any) => ({
      value: project.id,
      label: project.project_name,
    }));
  };

  const loadProjects = async (pageProject: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchProjects(pageProject, searchInputProject));
    setIsFetching(false);
  };



  const handleCompanySearchChange = async (inputValue: string) => {
    setSearchInput(inputValue);
    setPage(1);
    const fetchedCompanies = await dispatch(fetchCompanies(1, inputValue));
    return fetchedCompanies.map((company: any) => ({
      value: company.id,
      label: company.company_name,
    }));
  };

  const loadCompanies = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchCompanies(page, searchInput));
    setIsFetching(false);
  };

  useEffect(() => {
    loadProjects(pageProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProject, searchInputProject]);
  
  useEffect(() => {
    loadCompanies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchInput]);


  const formatDate = (dateString: any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_name: props.project_name || '',
      product_name: props.product_name || '',
      purchasing_date: formatDate(rowData.purchasing_date) || '',
      company: props.company || '',
    },
    validationSchema: Yup.object({
      project_name: Yup.string().required('Please enter your project name'),
      product_name: Yup.string().required('Please enter your product name'),
      purchasing_date: Yup.date().nullable().required(),
      company: Yup.number().required('Please select a company'),

    }),
    onSubmit: async (values, { resetForm }) => {
      const formattedValues = {
        id: props.id,
        ...values,
        purchasing_date: new Date(values.purchasing_date).toISOString(),
      };

      try {
        console.log(formattedValues);
        await dispatch(editDataSheet(formattedValues));
        resetForm();
        toggleEdit();
      } catch (error) {
        console.error('Failed to edit project:', error);
      }
    },
  });


  const Menu = (props: any) => {
    const isProjectMenu = props.selectProps.name === 'project_name';
    const currentPage = isProjectMenu ? pageProject : page;
    const maxPages = isProjectMenu ? maxPageProject : maxPage;

    return (
      <components.Menu {...props}>
        {currentPage > 1 && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => isProjectMenu ? setPageProject(prev => Math.max(prev - 1, 1)) : setPage(prev => Math.max(prev - 1, 1))}
          >
            ▲ Previous Page
          </div>
        )}
        {props.children}
        {currentPage < maxPages && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => isProjectMenu ? setPageProject(prev => Math.min(prev + 1, maxPages)) : setPage(prev => Math.min(prev + 1, maxPages))}
          >
            ▼ Next Page
          </div>
        )}
      </components.Menu>
    );
  };

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
        action="#"
      >
        <div className="mb-3">
          <Label htmlFor="project" className="form-label">
            Project Name
          </Label>
          <AsyncSelect
            cacheOptions
            defaultOptions={projects.map((project: any) => ({
              value: project.id,
              label: project.project_name,
            }))}
            loadOptions={handleProjectSearchChange}
            components={{ Menu }}
            onChange={(selectedOption: SelectOption | null) => validation.setFieldValue('project_name', selectedOption ? selectedOption.value : '')}
            onBlur={validation.handleBlur}
            styles={{
              menu: (provided: any) => ({
                ...provided,
                maxHeight: '200px',  
                overflowY: 'auto',   
              }),
            }}
          />
          {validation.touched.project_name && validation.errors.project_name && (
            <FormFeedback>{String(validation.errors.project_name)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="product_name" className="form-label">
            Product Name
          </Label>
          <Input
            name="product_name"
            className="form-control"
            placeholder="Enter product name"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.product_name}
            invalid={validation.touched.product_name && !!validation.errors.product_name}
          />
          {validation.touched.product_name && validation.errors.product_name && (
            <FormFeedback>{String(validation.errors.product_name)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="purchasing_date" className="form-label">Project Start Date</Label>
          <Input
            name="purchasing_date"
            className="form-control"
            placeholder="Enter project start date"
            type="date"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.purchasing_date}
            invalid={validation.touched.purchasing_date && !!validation.errors.purchasing_date}
          />
          {validation.touched.purchasing_date && validation.errors.purchasing_date && (
            <FormFeedback>{String(validation.errors.purchasing_date)}</FormFeedback>
          )}
        </div>
        

        <div className="mb-3">
          <Label htmlFor="company" className="form-label">
            Company Name
          </Label>
          <AsyncSelect
            cacheOptions
            defaultOptions={companies.map((company: any) => ({
              value: company.id,
              label: company.company_name,
            }))}
            loadOptions={handleCompanySearchChange}
            components={{ Menu }}
            onChange={(selectedOption: SelectOption | null) => validation.setFieldValue('company', selectedOption ? selectedOption.value : '')}
            onBlur={validation.handleBlur}
            styles={{
              menu: (provided: any) => ({
                ...provided,
                maxHeight: '200px',  
                overflowY: 'auto',   
              }),
            }}
          />
          {validation.touched.company && validation.errors.company && (
            <FormFeedback>{String(validation.errors.company)}</FormFeedback>
          )}
        </div>

        <Button type="submit" color="primary" className="mt-3">
          Edit Project
        </Button>
      </Form>
    </div>
  );
};

export default ProjectEditModal;
