import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editInventories,fetchCompanies, fetchCategory, fetchEmployeeManangement, fetchProjects  } from '../../slices/thunks';
import { useSelector, useDispatch } from "react-redux";
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

interface InventoryEditModalProps {
    rowData: any;
    toggleEdit: () => void;
  }
  
const InventoryEditModal: React.FC<InventoryEditModalProps> = ({ rowData, toggleEdit }) => {
    const dispatch = useDispatch<any>();
    const data = rowData   
    console.log(data);
    
    const { companies, count: companyCount } = useSelector((state: any) => state.company);
    const { employeeManangement , count: employeeManangementCount } = useSelector((state:any) => state.employeeManangement)
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
//
    const handleCategorySearchChange = async (inputValue: string) => {        
        setPageCategories(1);
        const fetchedCategories = await dispatch(fetchCategory(1));
        return fetchedCategories.map((category: any) => ({
            value: category.id,
            label: category.name,
        }));
    };

    const loadCategories = async (page: number) => {
        if (isFetching) return;
        setIsFetching(true);
        await dispatch(fetchCategory(page));
        setIsFetching(false);
    };

    useEffect(() => {
        loadCategories(pageCategories);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCategories,  dispatch]);

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
        const fetchedCompanies = await dispatch(fetchCompanies(1, inputValue));
        return fetchedCompanies.map((company: any) => ({
          value: company.id,
          label: company.name,
        }));
    };
    
    const loadCompanies = async (page: number) => {
        if (isFetching) return;
        await dispatch(fetchCompanies(page, searchInput));
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
        console.log(defaultCompany);
        
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

//    


    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            project: data.project || [],
            category: data.category || [],
            product_name: data.product_name || "",
            satin_alinan_tarih: data.satin_alinan_tarih || "",
            count: data.count || "",
            price: data.price || "",
            description: data.description || "",
            account: data.account || "",
            e_commerce_site: data.e_commerce_site || "",
            company: data.company || "",
            where_in_the_office: data.where_in_the_office || "",
            responsible_person: data.responsible_person || "",
            ordering_person: data.ordering_person || [],
        },
        validationSchema: Yup.object({
            product_name: Yup.string().required("Please Enter Product Name"),
            project: Yup.array().of(Yup.number()).required("Please Enter Project Name"),
            price: Yup.number(),
            where_in_the_office: Yup.string(),
            account: Yup.string(),
            e_commerce_site: Yup.string().url('Enter a valid URL'),
            company: Yup.number(),
            ordering_person: Yup.array().of(Yup.number()),
            responsible_person: Yup.number(),
            category: Yup.array().of(Yup.number()).required("Please Enter Category"),
            description: Yup.string().required("Please Enter Description"),
            count: Yup.number().required("Please Enter Count"),
            satin_alinan_tarih: Yup.date().nullable(),
          }),
          
          onSubmit: async (values, { resetForm }) => {
            const inventoryDate = new Date(values.satin_alinan_tarih); 
            const formattedDate = inventoryDate.toISOString();
            const formattedValues = {
                id: data.id,
                ...values,
                satin_alinan_tarih: formattedDate,
            };
          try {
              await dispatch(editInventories(formattedValues));
              resetForm(); 
              toggleEdit(); 
          } catch (error) {
              console.error('Failed to add inventory:', error); 
          }
        },
        
    });
    
    const defaultEmployeeOptions = validation.values.ordering_person.map((employeeId: any) => {
        const employee = employeeManangement.find((emp: any) => emp.id === employeeId);
        return employee ? { value: employee.id, label: employee.username } : null;
    }).filter(Boolean);

    const defaultProjectOptions = validation.values.project.map((prjectId: any) => {
        const project = projects.find((project: any) => project.id === prjectId);
        return project ? { value: project.id, label: project.project_name } : null;
    }).filter(Boolean);

    const defaultCategoryOptions = validation.values.category.map((categoryId: any) => {
        const category = categories.find((category: any) => category.id === categoryId);
        return category ? { value: category.id, label: category.name } : null;
    }).filter(Boolean);

    
    const defaultEmployeeResponsibleOption = employeeManangement.find((emp: any) => emp.id === validation.values.responsible_person);


    const Menu = (props: any) => {
        let currentPage:any, maxPage:any, setPage:any;

        switch (props.selectProps.name) {
            case "projects":
                currentPage = pageProject;
                maxPage = maxPageProject;
                setPage = setPageProject;
                break;
            case "company":
                currentPage = pageCompanies;
                maxPage = maxPageCompanies;
                setPage = setPageCompanies;
                break;
            case "categories":
                currentPage = pageCategories;
                maxPage = maxPageCategories;
                setPage = setPageCategories;
                break;
            case "ordering_person":
            case "responsible_person":
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
        <div>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();  
                    console.log(validation.values);                 
                    
                }}
                >

                <div className="mb-3">
                    <Label htmlFor="product_name" className="form-label">Product Name</Label>
                    <Input
                        name="product_name"
                        className="form-control"
                        placeholder="Enter Product Name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.product_name || ''}
                        invalid={validation.touched.product_name && !!validation.errors.product_name}
                    />
                    {validation.touched.product_name && validation.errors.product_name && (
                        <FormFeedback type="invalid">{String(validation.errors.product_name)}</FormFeedback>
                    )}
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
                        onChange={(selectedOption: any) =>
                            validation.setFieldValue('responsible_person', selectedOption ? selectedOption.map((option: any) => option.value) : [])
                        }
                        value={defaultEmployeeResponsibleOption}
                        components={{ Menu }}
                    />
                    {validation.touched.responsible_person && validation.errors.responsible_person ? (
                        <FormFeedback type="invalid">{String(validation.errors.responsible_person)}</FormFeedback>
                    ) : null}
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
                            validation.setFieldValue('projects', selectedOption ? selectedOption.map((option: any) => option.value) : [])
                        }
                        isMulti
                        components={{ Menu }}
                    />
                    {validation.touched.project && validation.errors.project ? (
                        <FormFeedback type="invalid">{String(validation.errors.project)}</FormFeedback>
                    ) : null}
                </div>


                <div className="mb-3">
                    <Label htmlFor="price" className="form-label">Price</Label>
                    <Input
                        name="price"
                        className="form-control"
                        placeholder="Enter Price"
                        type="number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.price || ''}
                        invalid={validation.touched.price && !!validation.errors.price}
                    />
                    {validation.touched.price && validation.errors.price && (
                        <FormFeedback type="invalid">{String(validation.errors.price)}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="where_in_the_office" className="form-label">Where in the Office</Label>
                    <Input
                        name="where_in_the_office"
                        className="form-control"
                        placeholder="Enter Where in the Office"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.where_in_the_office || ''}
                        invalid={validation.touched.where_in_the_office && !!validation.errors.where_in_the_office}
                    />
                    {validation.touched.where_in_the_office && validation.errors.where_in_the_office && (
                        <FormFeedback type="invalid">{String(validation.errors.where_in_the_office)}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="account" className="form-label">Account</Label>
                    <Input
                        name="account"
                        className="form-control"
                        placeholder="Enter Account"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.account || ''}
                        invalid={validation.touched.account && !!validation.errors.account}
                    />
                    {validation.touched.account && validation.errors.account && (
                        <FormFeedback type="invalid">{String(validation.errors.account)}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="e_commerce_site" className="form-label">E-commerce Site</Label>
                    <Input
                        name="e_commerce_site"
                        className="form-control"
                        placeholder="Enter E-commerce Site"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.e_commerce_site || ''}
                        invalid={validation.touched.e_commerce_site && !!validation.errors.e_commerce_site}
                    />
                    {validation.touched.e_commerce_site && validation.errors.e_commerce_site && (
                        <FormFeedback type="invalid">{String(validation.errors.e_commerce_site)}</FormFeedback>
                    )}
                </div>


                <div className="mb-3">
                    <Label className="form-label" htmlFor="company">Company Name</Label>
                    <AsyncSelect
                        id="company"
                        name="company"
                        cacheOptions
                        onBlur={validation.handleBlur}
                        loadOptions={handleCompanySearchChange}
                        defaultOptions={companies.map((company: any) => ({
                            value: company.id,
                            label: company.name,
                        }))}
                        onChange={(selectedOption: any) =>
                            validation.setFieldValue('company', selectedOption?.value)
                        }
                        components={{ Menu }}
                    />
                    {validation.touched.company && validation.errors.company ? (
                        <FormFeedback type="invalid">{String(validation.errors.company)}</FormFeedback>
                    ) : null}
                </div>

                <div className="mb-3">
                    <Label htmlFor="satin_alinan_tarih" className="form-label">Buy Day</Label>
                    <Input
                        name="satin_alinan_tarih"
                        className="form-control"
                        placeholder="Enter project Start Date"
                        type="date"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.satin_alinan_tarih}
                        invalid={validation.touched.satin_alinan_tarih && !!validation.errors.satin_alinan_tarih}
                    />
                    <FormFeedback>{String(validation.errors.satin_alinan_tarih)}</FormFeedback>
                </div>


                <div className="mb-3">
                    <Label className="form-label" htmlFor="categories">Category Name<span className="text-danger">*</span></Label>
                    <AsyncSelect
                        id="categories"
                        name="categories"
                        cacheOptions
                        value={defaultCategoryOptions}
                        loadOptions={handleCategorySearchChange}
                        defaultOptions={categories.map((categories: any) => ({
                            value: categories.id,
                            label: categories.name,
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
                    <Label htmlFor="description" className="form-label">Description</Label>
                    <Input
                        name="description"
                        className="form-control"
                        placeholder="Enter Description"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description || ''}
                        invalid={validation.touched.description && !!validation.errors.description}
                    />
                    {validation.touched.description && validation.errors.description && (
                        <FormFeedback type="invalid">{String(validation.errors.description)}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="count" className="form-label">Count</Label>
                    <Input
                        name="count"
                        className="form-control"
                        placeholder="Enter Count"
                        type="number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.count || ''}
                        invalid={validation.touched.count && !!validation.errors.count}
                    />
                    {validation.touched.count && validation.errors.count && (
                        <FormFeedback type="invalid">{String(validation.errors.count)}</FormFeedback>
                    )}
                </div>

                <Button type="submit" color="primary">Edit Inventory</Button>
            </Form>
        </div>
    );
};
export default InventoryEditModal;
