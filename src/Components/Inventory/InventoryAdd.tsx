import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addInventories,fetchCompanies, fetchCategory, fetchEmployeeManangement, fetchProjects  } from '../../slices/thunks';
import { useSelector, useDispatch } from "react-redux";
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';

interface InventoriesAddModalProps {
    toggleAdd: () => void;
    pageZero: () => void;
}

const InventoriesAdd: React.FC<InventoriesAddModalProps> = ({ toggleAdd ,pageZero}) => {
    const dispatch = useDispatch<any>();
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

    const maxPageCompanies = Math.ceil(companyCount / 5);
    const maxPageEmployeeManangement = Math.ceil(employeeManangementCount / 5);
    const maxPageProject = Math.ceil(projectCount / 5);
    const maxPageCategories = Math.ceil(categoryCount / 5);

    const handleCategorySearchChange = async (inputValue: string) => {
        console.log(maxPageCategories);
        
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
        setPageCompanies(1);
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
        loadCompanies(pageCompanies);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageCompanies, searchInput, dispatch]);

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

    



    const validation = useFormik({
        initialValues: {
            project: [],
            category: [],
            product_name: '',
            satin_alinan_tarih: new Date().toISOString(),
            count: '',
            price: '',
            description: '',
            account: '',
            e_commerce_site: '',
            company: '',
            where_in_the_office: '',
            responsible_person: '',
            ordering_person: [],
        },
        validationSchema: Yup.object({
            product_name: Yup.string().required("Please Enter Product Name"),
            project: Yup.array().of(Yup.number()).required("Please Enter Project Name"),
            price: Yup.number().required("Please Enter Price"),
            where_in_the_office: Yup.string().required("Please Enter Where in the Office"),
            account: Yup.string().required("Please Enter Account"),
            e_commerce_site: Yup.string().url('Enter a valid URL').required("Please Enter E-commerce Site"),
            company: Yup.number().required("Please Enter Company"),
            ordering_person: Yup.array().of(Yup.number()).required("Please Enter Owner"),
            responsible_person: Yup.number().required("Please Enter Responsible Person"),
            category: Yup.array().of(Yup.number()).required("Please Enter Category"),
            description: Yup.string().required("Please Enter Description"),
            count: Yup.number().required("Please Enter Count"),
          }),
          
          onSubmit: async (values, { resetForm }) => {
            console.log('Form gönderildi:', values); // Bu satır, form submit edildiğinde çalışmalıdır.
            try {
                await dispatch(addInventories(values));
                resetForm(); 
                pageZero(); 
                toggleAdd(); 
            } catch (error) {
                console.error('Failed to add inventory:', error); // Hata mesajını konsola yazar.
            }
        },
        
    });
    validation.handleSubmit = async (e) => {
        console.log("handleSubmit tetiklendi"); // Bu log görünüyor mu?
       
    };

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
                action="#"
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
                        <FormFeedback type="invalid">{validation.errors.product_name}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label className="form-label" htmlFor="ordering_person">Ordering Person Name<span className="text-danger">*</span></Label>
                    <AsyncSelect
                        id="ordering_person"
                        name="ordering_person"
                        cacheOptions
                        loadOptions={handleEmployeeManangementSearchChange}
                        defaultOptions={employeeManangement.map((ems: any) => ({
                            value: ems.id,
                            label: ems.username,
                        }))}
                        onChange={(selectedOption: any) =>
                            validation.setFieldValue('ordering_person', selectedOption?.value)
                        }
                        components={{ Menu }}
                    />
                    {validation.touched.ordering_person && validation.errors.ordering_person ? (
                        <FormFeedback type="invalid">{validation.errors.ordering_person}</FormFeedback>
                    ) : null}
                </div>

                <div className="mb-3">
                    <Label className="form-label" htmlFor="responsible_person">Ordering Person Name<span className="text-danger">*</span></Label>
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
                            validation.setFieldValue('responsible_person', selectedOption?.value)
                        }
                        components={{ Menu }}
                    />
                    {validation.touched.responsible_person && validation.errors.responsible_person ? (
                        <FormFeedback type="invalid">{validation.errors.responsible_person}</FormFeedback>
                    ) : null}
                </div>


                <div className="mb-3">
                    <Label className="form-label" htmlFor="project">Project Name<span className="text-danger">*</span></Label>
                    <AsyncSelect
                        id="project"
                        name="project"
                        cacheOptions
                        loadOptions={handleProjectSearchChange}
                        defaultOptions={projects.map((project: any) => ({
                            value: project.id,
                            label: project.project_name,
                        }))}
                        onChange={(selectedOption: any) =>
                            validation.setFieldValue('project', selectedOption?.value)
                        }
                        components={{ Menu }}
                    />
                    {validation.touched.project && validation.errors.project ? (
                        <FormFeedback type="invalid">{validation.errors.project}</FormFeedback>
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
                        <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
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
                        <FormFeedback type="invalid">{validation.errors.where_in_the_office}</FormFeedback>
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
                        <FormFeedback type="invalid">{validation.errors.account}</FormFeedback>
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
                        <FormFeedback type="invalid">{validation.errors.e_commerce_site}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label className="form-label" htmlFor="company">Company Name<span className="text-danger">*</span></Label>
                    <AsyncSelect
                        id="company"
                        name="company"
                        cacheOptions
                        loadOptions={handleCompanySearchChange}
                        defaultOptions={companies.map((company: any) => ({
                            value: company.id,
                            label: company.company_name,
                        }))}
                        onChange={(selectedOption: any) =>
                            validation.setFieldValue('company', selectedOption?.value)
                        }
                        components={{ Menu }}
                    />
                    {validation.touched.company && validation.errors.company ? (
                        <FormFeedback type="invalid">{validation.errors.company}</FormFeedback>
                    ) : null}
                </div>


                <div className="mb-3">
                    <Label className="form-label" htmlFor="categories">Category Name<span className="text-danger">*</span></Label>
                    <AsyncSelect
                        id="categories"
                        name="categories"
                        cacheOptions
                        loadOptions={handleCategorySearchChange}
                        defaultOptions={categories.map((categories: any) => ({
                            value: categories.id,
                            label: categories.name,
                        }))}
                        onChange={(selectedOption: any) =>
                            validation.setFieldValue('category', selectedOption?.value)
                        }
                        components={{ Menu }}
                    />
                    {validation.touched.category && validation.errors.category ? (
                        <FormFeedback type="invalid">{validation.errors.category}</FormFeedback>
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
                        <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
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
                        <FormFeedback type="invalid">{validation.errors.count}</FormFeedback>
                    )}
                </div>

                <Button type="submit" color="primary">Add Inventory</Button>
            </Form>
        </div>
    );
};

export default InventoriesAdd;
