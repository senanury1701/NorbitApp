import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, Button, FormFeedback } from 'reactstrap';
import { useAppDispatch } from '../hooks'; 
import { editProjects, fetchCompanies, fetchEmployeeManangement } from '../../slices/thunks';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';

interface ProjectEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData;
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>('');
  const [defaultCompany, setDefaultCompany] = useState<any>(null); // Store the default company
  const { companies, count: companyCount } = useSelector((state: any) => state.company);
  const { employeeManangement } = useSelector((state: any) => state.employeeManangement);

  const maxPage = Math.ceil(companyCount / 5);

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
    loadCompanies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchInput, dispatch]);

  useEffect(() => {
    dispatch(fetchEmployeeManangement());
  }, [dispatch]);

  useEffect(() => {
    if (props.company) {
      const selectedCompany = companies.find((company: any) => company.id === props.company);
      if (selectedCompany) {
        setDefaultCompany({
          value: selectedCompany.id,
          label: selectedCompany.company_name,
        });
      }
    }
  }, [props.company, companies]);

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
      description: props.description || '',
      customer: props.customer || '',
      project_start_date: formatDate(rowData.project_start_date) || '',
      project_end_date: formatDate(rowData.project_end_date) || '',
      company: props.company || '',
      employess: props.employess || [],
    },
    validationSchema: Yup.object({
      project_name: Yup.string()
        .min(1, 'Project name must be at least 1 character')
        .max(50, 'Project name must be at most 50 characters')
        .required('Please enter your project name'),
      description: Yup.string(),
      customer: Yup.string()
        .min(1, 'Customer name must be at least 1 character')
        .max(50, 'Customer name must be at most 50 characters')
        .required('Please enter the customer name'),
      project_start_date: Yup.date().nullable().required(),
      project_end_date: Yup.date().nullable().required(),
      company: Yup.number().required('Please select a company'),
      employess: Yup.array()
        .of(Yup.number().integer().required('Employee ID must be an integer'))
        .min(1, 'Please add at least one employee')
        .required('Please add at least one employee'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formattedValues = {
        id: props.id,
        ...values,
        project_start_date: new Date(values.project_start_date).toISOString(),
        project_end_date: new Date(values.project_end_date).toISOString(),
      };

      try {
        console.log(formattedValues);
        await dispatch(editProjects(formattedValues));
        resetForm();
        toggleEdit();
      } catch (error) {
        console.error('Failed to edit project:', error);
      }
    },
  });

  const handleEmployeeSearchChange = async (inputValue: string) => {
    await dispatch(fetchEmployeeManangement(1, inputValue));
    return employeeManangement.map((employee: any) => ({
      value: employee.id,
      label: employee.username,
    }));
  };

  const handleEmployeeChange = (selectedOptions: any) => {
    validation.setFieldValue(
      'employess',
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
  };

  const defaultEmployeeOptions = validation.values.employess.map((employeeId: any) => {
    const employee = employeeManangement.find((emp: any) => emp.id === employeeId);
    return employee ? { value: employee.id, label: employee.username } : null;
  }).filter(Boolean);

  const Menu = (props: any) => {
    return (
      <components.Menu {...props}>
        {page > 1 && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
          >
            ▲ Previous Page
          </div>
        )}
        {props.children}
        {page < maxPage && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => setPage(prevPage => Math.min(prevPage + 1, maxPage))}
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
          <Label htmlFor="project_name" className="form-label">
            Project Name
          </Label>
          <Input
            name="project_name"
            className="form-control"
            placeholder="Enter project name"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.project_name}
            invalid={validation.touched.project_name && !!validation.errors.project_name}
          />
          {validation.touched.project_name && validation.errors.project_name && (
            <FormFeedback>{String(validation.errors.project_name)}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="description" className="form-label">
            Description
          </Label>
          <Input
            name="description"
            className="form-control"
            placeholder="Enter project description"
            type="textarea"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.description}
            invalid={validation.touched.description && !!validation.errors.description}
          />
          {validation.touched.description && validation.errors.description && (
            <FormFeedback>{String(validation.errors.description)}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="customer" className="form-label">
            Customer
          </Label>
          <Input
            name="customer"
            className="form-control"
            placeholder="Enter customer name"
            type="text"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.customer}
            invalid={validation.touched.customer && !!validation.errors.customer}
          />
          {validation.touched.customer && validation.errors.customer && (
            <FormFeedback>{String(validation.errors.customer)}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="project_start_date" className="form-label">Project Start Date</Label>
          <Input
            name="project_start_date"
            className="form-control"
            placeholder="Enter project start date"
            type="date"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.project_start_date}
            invalid={validation.touched.project_start_date && !!validation.errors.project_start_date}
          />
          {validation.touched.project_start_date && validation.errors.project_start_date && (
            <FormFeedback>{String(validation.errors.project_start_date)}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="project_end_date" className="form-label">Project End Date</Label>
          <Input
            name="project_end_date"
            className="form-control"
            placeholder="Enter project end date"
            type="date"
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.project_end_date}
            invalid={validation.touched.project_end_date && !!validation.errors.project_end_date}
          />
          {validation.touched.project_end_date && validation.errors.project_end_date && (
            <FormFeedback>{String(validation.errors.project_end_date)}</FormFeedback>
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
            onChange={(selectedOption) => validation.setFieldValue('company', selectedOption ? selectedOption.value : '')}
            onBlur={validation.handleBlur}
            value={defaultCompany}
            styles={{
              menu: (provided:any) => ({
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

        <div className="mb-3">
          <Label htmlFor="employess" className="form-label">
            Employees
          </Label>
          <Select
            id="employess"
            name="employess"
            isMulti
            options={employeeManangement.map((employee: any) => ({
              value: employee.id,
              label: employee.username,
            }))}
            classNamePrefix="select"
            loadOptions={handleEmployeeSearchChange}
            onChange={handleEmployeeChange}
            onBlur={validation.handleBlur}
            defaultValue={defaultEmployeeOptions}
            styles={{
              menu: (provided:any) => ({
                ...provided,
                maxHeight: '200px',  
                overflowY: 'auto',   
              }),
            }}
          />
          {validation.touched.employess && validation.errors.employess && (
            <FormFeedback>{String(validation.errors.employess)}</FormFeedback>
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
