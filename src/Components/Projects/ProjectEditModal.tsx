import React, { useEffect, useRef, useState  } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, Button, FormFeedback } from 'reactstrap';
import { useAppDispatch } from '../hooks'; 
import { editProjects, fetchCompanies, fetchCategory, fetchEmployeeManangement } from '../../slices/thunks';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

interface ProjectEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData;
  const [searchInput, setSearchInput] = useState<string>('');
  const { companies } = useSelector((state: any) => state.company);
  const { employeeManangement } = useSelector((state: any) => state.employeeManangement);
  console.log(props.id);
  
  const handleCompanySearchChange = async (inputValue: string) => {
    dispatch(fetchCompanies(1, inputValue));
    const companiess = companies
  
    return companiess.map((company: any) => ({
      value: company.id,
      label: company.company_name,
    }));
  };
  
  
  useEffect(() => {
    
    dispatch(fetchCompanies(1, searchInput));
    
    console.log(companies);
    
  }, [searchInput, dispatch]);

  useEffect(() => {
    dispatch(fetchCategory());
    dispatch(fetchEmployeeManangement());
  }, [dispatch]);

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

  const promiseCompanyOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      handleCompanySearchChange(inputValue).then((companies) => resolve(companies));
    });
  

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
            defaultOptions
            loadOptions={promiseCompanyOptions}
            onChange={(selectedOption) => validation.setFieldValue('company', selectedOption ? selectedOption.value : '')}
            onBlur={validation.handleBlur}
            value={validation.values.company 
              ? {
                  value: validation.values.company,
                  label: companies.find((company: any) => company.id === validation.values.company)?.company_name || ''
                }
              : null
            }
          />
          {validation.touched.company && validation.errors.company && (
            <FormFeedback>{String(validation.errors.company)}</FormFeedback>
          )}
        </div>


        <div className="mb-3">
          <Label htmlFor="employess" className="form-label">
            employess
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
            onChange={handleEmployeeChange}
            onBlur={validation.handleBlur}
            defaultValue={defaultEmployeeOptions}
          />
          {validation.touched.employess && validation.errors.employess && (
            <FormFeedback>{String(validation.errors.employess)}</FormFeedback>
          )}
        </div>
        <Button type="submit" color="primary">
          Edit Project
        </Button>
      </Form>
    </div>
  );
};

export default ProjectEditModal;
