import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addDataSheet } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';
import {  fetchCompanies, fetchProjects } from '../../slices/thunks';
import { useSelector } from 'react-redux';
import  { components } from 'react-select';
import AsyncSelect from 'react-select/async';

interface ProjectAddModalProps {
  toggleAdd: () => void;
  pageZero: () => void;
}

// Define the type for the select options
interface OptionType {
  value: number;
  label: string;
}

const DataSheetAddModal: React.FC<ProjectAddModalProps> = ({ toggleAdd, pageZero }) => {
  const dispatch = useAppDispatch();
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchInputProject, setSearchInputProject] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageProject, setPageProject] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { companies, count: companyCount } = useSelector((state: any) => state.company);
  const { projects, count: projectCount } = useSelector((state: any) => state.project);

  const maxPage = Math.ceil(companyCount / 5);
  const maxPageProject = Math.ceil(projectCount / 5);

  // Handle project search and pagination
  const handleProjectSearchChange = async (inputValue: string): Promise<OptionType[]> => {
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

  useEffect(() => {
    loadProjects(pageProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProject, searchInputProject, dispatch]);

  // Handle company search and pagination
  const handleCompanySearchChange = async (inputValue: string): Promise<OptionType[]> => {
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
    loadCompanies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchInput, dispatch]);


  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_name: '',
      product_name: '',
      purchasing_date: '',
      company: '',
    },
    validationSchema: Yup.object({
      project_name: Yup.string().required('Please enter your project name'),
      product_name: Yup.string().required('Please enter your product name'),
      purchasing_date: Yup.date().nullable().required(),
      company: Yup.number().required('Please select a company'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formattedDateStart = new Date(values.purchasing_date).toISOString();
      console.log(values);
      
      const formattedValues = {
        ...values,
        purchasing_date: formattedDateStart,
      };

      try {
        await dispatch(addDataSheet(formattedValues));
        resetForm();
        pageZero();
        toggleAdd();
      } catch (error) {
        console.error('Failed to add data sheet:', error);
      }
    },
  });

  useEffect(() => {
    console.log(validation);
    
  }, [validation]);

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
            name="project_name"
            cacheOptions
            defaultOptions={projects.map((project: any) => ({
              value: project.id,
              label: project.project_name,
            }))}
            loadOptions={handleProjectSearchChange}
            components={{ Menu }}
            onChange={(selectedOption) => validation.setFieldValue('project_name', selectedOption?.value || '')}
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
            <FormFeedback>{validation.errors.product_name}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="purchasing_date" className="form-label">
            Purchase End Date
          </Label>
          <Input
            name="purchasing_date"
            className="form-control"
            placeholder="Enter purchase date"
            type="date"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.purchasing_date}
            invalid={validation.touched.purchasing_date && !!validation.errors.purchasing_date}
          />
          <FormFeedback>{validation.errors.purchasing_date}</FormFeedback>
        </div>

        <div className="mb-3">
          <Label htmlFor="company" className="form-label">
            Company Name
          </Label>
          <AsyncSelect
            name="company"
            cacheOptions
            defaultOptions={companies.map((company: any) => ({
              value: company.id,
              label: company.company_name,
            }))}
            loadOptions={handleCompanySearchChange}
            components={{ Menu }}
            onChange={(selectedOption) => validation.setFieldValue('company', selectedOption?.value || '')}
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

        <Button type="submit" color="primary">
          Add DataSheet
        </Button>
      </Form>
    </div>
  );
};

export default DataSheetAddModal;
