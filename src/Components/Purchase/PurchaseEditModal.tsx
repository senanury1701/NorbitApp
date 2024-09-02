import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editPurchase, fetchCompanies, fetchCategory, fetchEmployeeManangement, fetchProjects } from '../../slices/thunks';
import { useSelector, useDispatch } from 'react-redux';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

interface PurchaseEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const PurchaseEditModal: React.FC<PurchaseEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useDispatch<any>();
  const data = rowData;
  const { companies, count: companyCount } = useSelector((state: any) => state.company);
  const { employeeManangement, count: employeeManangementCount } = useSelector((state: any) => state.employeeManangement);
  const { categories, count: categoryCount } = useSelector((state: any) => state.category);
  const { projects, count: projectCount } = useSelector((state: any) => state.project);

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
  const [searchProject, setSearchProject] = useState<string>('');
  const [pageCompanies, setPageCompanies] = useState<number>(1);
  const [pageProject, setPageProject] = useState<number>(1);
  const [pageCategories, setPageCategories] = useState<number>(1);
  const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [defaultCompany, setDefaultCompany] = useState<any>(null);

  const maxPageCompanies = Math.ceil(companyCount / 5);
  const maxPageEmployeeManangement = Math.ceil(employeeManangementCount / 5);
  const maxPageProject = Math.ceil(projectCount / 5);
  const maxPageCategories = Math.ceil(categoryCount / 5);

  const handleCategorySearchChange = async (inputValue: string) => {
    setPageCategories(1);
    const fetchedCategories = await dispatch(fetchCategory(1));
    return fetchedCategories.map((category: any) => ({
        value: category.id,
        label: category.name,
    }));
  };

  const loadCategories = async (pageCategories: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchCategory(pageCategories));
    setIsFetching(false);
  };

  useEffect(() => {
    loadCategories(pageCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCategories, dispatch]);

  const handleProjectSearchChange = async (inputValue: string) => {
    setSearchProject(inputValue);
    setPageProject(1);
    const fetchedProject = await dispatch(fetchProjects(1, inputValue));
    return fetchedProject.map((project: any) => ({
        value: project.id,
        label: project.project_name,
    }));
  };

  const loadProject = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchProjects(page, searchProject));
    setIsFetching(false);
  };

  useEffect(() => {
    loadProject(pageProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageProject, searchProject, dispatch]);

  const handleCompanySearchChange = async (inputValue: string) => {
    setSearchInput(inputValue);
    setPageCompanies(1);
    const fetchedCompanies = await dispatch(fetchCompanies(1, inputValue));
    return fetchedCompanies.map((company: any) => ({
      value: company.id,
      label: company.name,
    }));
  };

  const loadCompanies = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchCompanies(page, searchInput));
    setIsFetching(false);
  };

  useEffect(() => {
    loadCompanies(pageCompanies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCompanies, searchInput, dispatch]);

  useEffect(() => {
    if (data.company) {
      const selectedCompany = companies.find((company: any) => company.id === data.company);
      if (selectedCompany) {
        setDefaultCompany({
          value: selectedCompany.id,
          label: selectedCompany.name,
        });
      }
    }
  }, [data.company, companies]);

  const handleEmployeeManangementSearchChange = async (inputValue: string) => {
    setSearchInputEmployeeManangement(inputValue);
    setPageEmployeeManangement(1);
    const fetchedEmployeeManangement = await dispatch(fetchEmployeeManangement(1, inputValue));
    return fetchedEmployeeManangement.map((ems: any) => ({
      value: ems.id,
      label: ems.username,
    }));
  };

  const loadEmployeeManangement = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchEmployeeManangement(page, searchInputEmployeeManangement));
    setIsFetching(false);
  };

  useEffect(() => {
    loadEmployeeManangement(pageEmployeeManangement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageEmployeeManangement, searchInputEmployeeManangement, dispatch]);

    
  const statusOptions = [
    { value: 'BE', label: 'BE' },
    { value: 'ON', label: 'ON' },
    { value: 'TA', label: 'TA' },
    { value: 'IP', label: 'IP' },
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      project: data.project || [],
      category: data.category || [],
      product_name: data.product_name || '',
      satin_alinan_tarih: data.satin_alinan_tarih || '',
      count: data.count || 0,
      price: data.price || 0,
      description: data.description || '',
      account: data.account || '',
      e_commerce_site: data.e_commerce_site || '',
      company: data.company || '',
      where_in_the_office: data.where_in_the_office || '',
      responsible_person: data.responsible_person || '',
      owner: data.owner || '',
      ordering_person: data.ordering_person || [],
      status: rowData.status || '',

    },
    validationSchema: Yup.object({
      product_name: Yup.string().required('Please Enter Product Name'),
      project: Yup.array().of(Yup.number()).required('Please Enter Project Name'),
      price: Yup.number(),
      where_in_the_office: Yup.string(),
      account: Yup.string(),
      e_commerce_site: Yup.string().url('Enter a valid URL'),
      company: Yup.number(),
      ordering_person: Yup.array().of(Yup.number()),
      responsible_person: Yup.number(),
      owner: Yup.number(),
      category: Yup.array().of(Yup.number()).required('Please Enter Category'),
      description: Yup.string().required('Please Enter Description'),
      count: Yup.number().required('Please Enter Count'),
      satin_alinan_tarih: Yup.date().nullable(),
      status: Yup.string().oneOf(['BE', 'ON', 'TA', 'IP']).required('Please select a status'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const PurchaseDate = new Date(values.satin_alinan_tarih);
      const formattedDate = PurchaseDate.toISOString();
      const formattedValues = {
        id: data.id,
        ...values,
        satin_alinan_tarih: formattedDate,
      };
      try {
        await dispatch(editPurchase(formattedValues));
        resetForm();
        toggleEdit();
      } catch (error) {
        console.error('Failed to add Purchase:', error);
      }
    },
  });

  const handleStatusChange = (selectedOption: any) => {
    validation.setFieldValue('status', selectedOption ? selectedOption.value : '');
  };

  const defaultEmployeeOptions = validation.values.ordering_person.map((employeeId: any) => {
    const employee = employeeManangement.find((emp: any) => emp.id === employeeId);
    return employee ? { value: employee.id, label: employee.username } : null;
  }).filter(Boolean);

  const defaultProjectOptions = validation.values.project.map((projectId: any) => {
    const project = projects.find((proj: any) => proj.id === projectId);
    return project ? { value: project.id, label: project.project_name } : null;
  }).filter(Boolean);

  const defaultCategoryOptions = validation.values.category.map((categoryId: any) => {
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category ? { value: category.id, label: category.name } : null;
  }).filter(Boolean);


  const Menu = (props: any) => {
    let currentPage: any, maxPage: any, setPage: any;

    switch (props.selectProps.name) {
      case 'projects':
        currentPage = pageProject;
        maxPage = maxPageProject;
        setPage = setPageProject;
        break;
      case 'company':
        currentPage = pageCompanies;
        maxPage = maxPageCompanies;
        setPage = setPageCompanies;
        break;
      case 'category':
        currentPage = pageCategories;
        maxPage = maxPageCategories;
        setPage = setPageCategories;
        break;
      case 'responsible_person':
      case 'ordering_person':
      case 'owner':
        currentPage = pageEmployeeManangement;
        maxPage = maxPageEmployeeManangement;
        setPage = setPageEmployeeManangement;
        break;
      default:
        break;
    }
    return (
      <components.Menu {...props}>
          {currentPage > 1 && (
              <div
                  style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
                  onClick={() => setPage((prevPage: number) => Math.max(prevPage - 1, 1))}
              >
                  ▲ Previous Page
              </div>
          )}
          {props.children}
          {currentPage < maxPage && (
              <div
                  style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
                  onClick={() => setPage((prevPage: number) => Math.min(prevPage + 1, maxPage))}
              >
                  ▼ Next Page
              </div>
          )}
      </components.Menu>
  );
  };

  return (
    <Form onSubmit={validation.handleSubmit}>
      <div className="modal-body">

        <div className="mb-3">
          <Label for="product_name">Product Name</Label>
          <Input
            id="product_name"
            name="product_name"
            type="text"
            value={validation.values.product_name}
            onChange={validation.handleChange}
            invalid={!!validation.errors.product_name}
          />
          {validation.errors.product_name && <FormFeedback>{String(validation.errors.product_name)}</FormFeedback>}
        </div>

        <div className="mb-3">
          <Label for="description">Description</Label>
          <Input
            id="description"
            name="description"
            type="textarea"
            value={validation.values.description}
            onChange={validation.handleChange}
            invalid={!!validation.errors.description}
          />
          {validation.errors.description && <FormFeedback>{String(validation.errors.description)}</FormFeedback>}
        </div>

        <div className="mb-3">
            <Label className="form-label" htmlFor="project">Project Name</Label>
            <AsyncSelect
                id="project"
                name="project"
                cacheOptions
                loadOptions={handleProjectSearchChange}
                value={defaultProjectOptions}
                defaultOptions={projects.map((project: any) => ({
                    value: project.id,
                    label: project.project_name,
                }))}
                onChange={(selectedOption: any) =>
                    validation.setFieldValue('project', selectedOption ? selectedOption.map((option: any) => option.value) : [])
                }
                isMulti
                components={{ Menu }}
            />
            {validation.touched.project && validation.errors.project ? (
                <FormFeedback type="invalid">{String(validation.errors.project)}</FormFeedback>
            ) : null}
        </div>

        <div className="mb-3">
            <Label className="form-label" htmlFor="category">Category Name</Label>
            <AsyncSelect
                id="category"
                name="category"
                cacheOptions
                loadOptions={handleCategorySearchChange}
                value={defaultCategoryOptions}
                defaultOptions={categories.map((category: any) => ({
                    value: category.id,
                    label: category.name,
                }))}
                onChange={(selectedOption: any) =>
                    validation.setFieldValue('category', selectedOption ? selectedOption.map((option: any) => option.value) : [])
                }
                isMulti
                components={{ Menu }}
            />
            {validation.touched.category && validation.errors.category ? (
                <FormFeedback type="invalid">{String(validation.errors.category)}</FormFeedback>
            ) : null}
        </div>

        <div className="mb-3">
          <Label for="satin_alinan_tarih">Buy Day</Label>
          <Input
            id="satin_alinan_tarih"
            name="satin_alinan_tarih"
            type="date"
            value={validation.values.satin_alinan_tarih}
            onChange={validation.handleChange}
            invalid={!!validation.errors.satin_alinan_tarih}
          />
          {validation.errors.satin_alinan_tarih && <FormFeedback>{String(validation.errors.satin_alinan_tarih)}</FormFeedback>}
        </div>

        <div className="mb-3">
          <Label for="count">Count</Label>
          <Input
            id="count"
            name="count"
            type="number"
            value={validation.values.count}
            onChange={validation.handleChange}
            invalid={!!validation.errors.count}
          />
          {validation.errors.count && <FormFeedback>{String(validation.errors.count)}</FormFeedback>}
        </div>

        <div className="mb-3">
          <Label for="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={validation.values.price}
            onChange={validation.handleChange}
            invalid={!!validation.errors.price}
          />
          {validation.errors.price && <FormFeedback>{String(validation.errors.price)}</FormFeedback>}
        </div>

        <div className="mb-3">
          <Label for="account">Account</Label>
          <Input
            id="account"
            name="account"
            type="text"
            value={validation.values.account}
            onChange={validation.handleChange}
            invalid={!!validation.errors.account}
          />
          {validation.errors.account && <FormFeedback>{String(validation.errors.account)}</FormFeedback>}
        </div>

        <div className="mb-3">
          <Label for="e_commerce_site">E-Commerce Site</Label>
          <Input
            id="e_commerce_site"
            name="e_commerce_site"
            type="url"
            value={validation.values.e_commerce_site}
            onChange={validation.handleChange}
            invalid={!!validation.errors.e_commerce_site}
          />
          {validation.errors.e_commerce_site && <FormFeedback>{String(validation.errors.e_commerce_site)}</FormFeedback>}
        </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="company">Company Name</Label>
          <AsyncSelect
              id="company"
              name="company"
              cacheOptions
              loadOptions={handleCompanySearchChange}
              defaultOptions={companies.map((company: any) => ({
                  value: company.id,
                  label: company.company_name,
              }))}
              value={
                  validation.values.company
                      ? {
                          value: validation.values.company,
                          label: companies.find((company: any) => company.id === validation.values.company)?.company_name || ''
                      }
                      : null
              }
              onChange={(selectedOption: any) =>
                  validation.setFieldValue('company', selectedOption ? selectedOption.value : '')
              }
              components={{ Menu }}
          />
          {validation.touched.company && validation.errors.company ? (
              <FormFeedback type="invalid">{String(validation.errors.company)}</FormFeedback>
          ) : null}
      </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="owner">Owner Name</Label>
          <AsyncSelect
              id="owner"
              name="owner"
              cacheOptions
              loadOptions={handleEmployeeManangementSearchChange}
              defaultOptions={employeeManangement.map((ems: any) => ({
                  value: ems.id,
                  label: ems.username,
              }))}
              value={
                  validation.values.owner
                      ? {
                          value: validation.values.owner,
                          label: employeeManangement.find((emp: any) => emp.id === validation.values.owner)?.username || ''
                      }
                      : null
              }
              onChange={(selectedOption: any) =>
                  validation.setFieldValue('owner', selectedOption ? selectedOption.value : '')
              }
              components={{ Menu }}
          />
          {validation.touched.owner && validation.errors.owner ? (
              <FormFeedback type="invalid">{String(validation.errors.owner)}</FormFeedback>
          ) : null}
      </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="responsible_person">Responsible Person Name</Label>
          <AsyncSelect
              id="responsible_person"
              name="responsible_person"
              cacheOptions
              loadOptions={handleEmployeeManangementSearchChange}
              defaultOptions={employeeManangement.map((ems: any) => ({
                  value: ems.id,
                  label: ems.username,
              }))}
              value={
                  validation.values.responsible_person
                      ? {
                          value: validation.values.responsible_person,
                          label: employeeManangement.find((emp: any) => emp.id === validation.values.responsible_person)?.username || ''
                      }
                      : null
              }
              onChange={(selectedOption: any) =>
                  validation.setFieldValue('responsible_person', selectedOption ? selectedOption.value : '')
              }
              components={{ Menu }}
          />
          {validation.touched.responsible_person && validation.errors.responsible_person ? (
              <FormFeedback type="invalid">{String(validation.errors.responsible_person)}</FormFeedback>
          ) : null}
      </div>

        <div className="mb-3">
            <Label className="form-label" htmlFor="ordering_person">Ordering Person Name</Label>
            <AsyncSelect
                id="ordering_person"
                name="ordering_person"
                cacheOptions
                loadOptions={handleEmployeeManangementSearchChange}
                value={defaultEmployeeOptions}
                defaultOptions={employeeManangement.map((ems: any) => ({
                    value: ems.id,
                    label: ems.username,
                }))}
                onChange={(selectedOption: any) =>
                    validation.setFieldValue('ordering_person', selectedOption ? selectedOption.map((option: any) => option.value) : [])
                }
                isMulti
                components={{ Menu }}
            />
            {validation.touched.ordering_person && validation.errors.ordering_person ? (
                <FormFeedback type="invalid">{String(validation.errors.ordering_person)}</FormFeedback>
            ) : null}
        </div>
          
        <div className="mb-3">
          <Label for="status">Status</Label>
          <AsyncSelect
            id="status"
            name="status"
            cacheOptions
            loadOptions={() => Promise.resolve(statusOptions)}
            defaultOptions={statusOptions}
            value={statusOptions.find(option => option.value === validation.values.status) || null}
            onChange={handleStatusChange}
          />
          {validation.touched.status && validation.errors.status ? (
            <FormFeedback type="invalid">{String(validation.errors.status)}</FormFeedback>
          ) : null}
        </div>

        <Button color="primary" type="submit">Save</Button>
      </div>
    </Form>
  );
};

export default PurchaseEditModal;
