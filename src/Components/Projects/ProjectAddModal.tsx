import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addProjects } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';
import { fetchEmployeeManangement, fetchCompanies } from '../../slices/thunks';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

interface ProjectAddModalProps {
  toggleAdd: () => void;
  pageZero: () => void;
}

const ProjectAddModal: React.FC<ProjectAddModalProps> = ({ toggleAdd, pageZero }) => {
  const dispatch = useAppDispatch();
  const { employeeManangement } = useSelector((state: any) => state.employeeManangement);
  const { companies } = useSelector((state: any) => state.company);
  const [searchInput, setSearchInput] = useState<string>('');

  const handleCompanySearchChange = async (inputValue: string) => {
    setSearchInput(inputValue)
    dispatch(fetchCompanies(1, inputValue));
    const companiess = companies
  
    return companiess.map((company: any) => ({
      value: company.id,
      label: company.company_name,
    }));
  };

  useEffect(() => {
    dispatch(fetchCompanies(1, searchInput));      
  }, [searchInput, dispatch]);

  useEffect(() => {
    dispatch(fetchEmployeeManangement());
  }, [dispatch]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      project_name: '',
      description: '',
      customer: '',
      project_start_date: '',
      project_end_date: '',
      company: '',
      employess: [],
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
      const ProjectStartDate = new Date(values.project_start_date);
      const projectEndDate = new Date(values.project_end_date);
      const formattedDateStart = ProjectStartDate.toISOString();
      const formattedDateEnd = projectEndDate.toISOString();

      const formattedValues = {
        ...values,
        project_start_date: formattedDateStart,
        project_end_date: formattedDateEnd
      };
      console.log(formattedValues);

      try {
        await dispatch(addProjects(formattedValues));
        resetForm();
        pageZero();
        toggleAdd();
      }catch (error) {
        console.error('Failed to add project:');
      }
    },
  });

  const promiseCompanyOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      handleCompanySearchChange(inputValue).then((companies) => resolve(companies));
    });
  
    const handleEmployeeSearchChange = async (inputValue: string) => {
      await dispatch(fetchEmployeeManangement(1 , inputValue));
      
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
            <FormFeedback type="invalid">{validation.errors.project_name}</FormFeedback>
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
            <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
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
            <FormFeedback type="invalid">{validation.errors.customer}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
            <Label htmlFor="project_start_date" className="form-label">project Start Date</Label>
            <Input
                name="project_start_date"
                className="form-control"
                placeholder="Enter project Start Date"
                type="date"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.project_start_date}
                invalid={validation.touched.project_start_date && !!validation.errors.project_start_date}
            />
            <FormFeedback>{validation.errors.project_start_date}</FormFeedback>
        </div>

        <div className="mb-3">
            <Label htmlFor="project_end_date" className="form-label">project End Date</Label>
            <Input
                name="project_end_date"
                className="form-control"
                placeholder="Enter project End Date"
                type="date"
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.project_end_date}
                invalid={validation.touched.project_end_date && !!validation.errors.project_end_date}
            />
            <FormFeedback>{validation.errors.project_end_date}</FormFeedback>
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
            className="form-control"
            loadOptions={handleEmployeeSearchChange}
            onChange={handleEmployeeChange}
            onBlur={validation.handleBlur}
            value={validation.values.employess.map((employeeId: any) => ({
              value: employeeId,
              label: employeeManangement.find((emp: any) => emp.id === employeeId)?.username,
            }))}
          />
          {validation.touched.employess && validation.errors.employess && (
            <FormFeedback type="invalid">{validation.errors.employess}</FormFeedback>
          )}
        </div>
        <Button type="submit" color="primary">
          Add Project
        </Button>
      </Form>
    </div>
  );
};

export default ProjectAddModal;
