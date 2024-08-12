import React, {useEffect, useState} from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addInventories,fetchCompanies, fetchCategory, fetchEmployeeManangement, fetchProject  } from '../../slices/thunks';
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
    const { categories } = useSelector((state: any) => state.category);
    const { projects, count: projectCount } = useSelector((state: any) => state.project);
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
    const [searchProject, setSearchProject] = useState<string>('');
    const [pageCompanies, setPageCompanies] = useState<number>(1);
    const [pageProject, setPageProject] = useState<number>(1);
    const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const maxPageCompanies = Math.ceil(companyCount / 5);
    const maxPageEmployeeManangement = Math.ceil(employeeManangementCount / 5);
    const maxPageProject = Math.ceil(projectCount / 5);

    const handleProjectSearchChange = async (inputValue: string) => {
        setSearchInput(inputValue);
        setPageProject(1);
        const fetchedProject = await dispatch(fetchProject(1, inputValue));
        return fetchedProject.map((Project: any) => ({
            value: Project.id,
            label: Project.Project_name,
        }));
    };

    const loadProject = async (page: number) => {
        if (isFetching) return;
        setIsFetching(true);
        await dispatch(fetchProject(page, searchInput));
        setIsFetching(false);
    };

    useEffect(() => {
        loadCompanies(pageProject);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageProject, searchInput, dispatch]);


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
            company: Yup.string().required("Please Enter Company"),
            ordering_person: Yup.array().of(Yup.number()).required("Please Enter Owner"),
            responsible_person: Yup.number().required("Please Enter Responsible Person"),
            category: Yup.array().of(Yup.number()).required("Please Enter Category"),
            description: Yup.string().required("Please Enter Description"),
            count: Yup.number().required("Please Enter Count"),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log(values);
            dispatch(addInventories(values));
            resetForm();
            pageZero()
            toggleAdd()
        },
    });

    useEffect(() => {
        dispatch(fetchCompanies(1, searchInput));
    }, [dispatch, searchInput]);

    useEffect(() => {
        dispatch(fetchEmployeeManangement(1, searchInputEmployeeManangement));
    }, [dispatch, searchInputEmployeeManangement]);

    const Menu = (props: any) => {
        const isPropsCountSearch = Boolean(props.selectProps.inputValue);
        const currentPage = isPropsCountSearch ? pageEmployeeManangement : pageCompanies : pageProject ;
        const maxPage = isPropsCountSearch ? maxPageEmployeeManangement : maxPageCompanies : maxPageProject;
        const setPage = isPropsCountSearch ? setPageEmployeeManangement : setPageCompanies : setPageProject;

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
                    return false;
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
                    <Label htmlFor="project" className="form-label">project</Label>
                    <Input
                        name="project"
                        className="form-control"
                        type="select"
                        onChange={e => validation.setFieldValue('project', [parseInt(e.target.value)])}
                        onBlur={validation.handleBlur}
                        value={validation.values.project[0] || ''}
                        invalid={validation.touched.project && !!validation.errors.project}
                    >
                        <option >---------</option>
                        <option value="1">sec2</option>
                    </Input>
                    {validation.touched.project && validation.errors.project && (
                        <FormFeedback type="invalid">{validation.errors.project}</FormFeedback>
                    )}
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
                    <Label htmlFor="category" className="form-label">category Name</Label>
                    <Input
                        id="category"
                        name="category"
                        type="select"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.category || ""}
                        invalid={validation.touched.category && !!validation.errors.category}
                    >
                        <option  value="">Select a category</option>
                        {categories.map((category:any) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Input>
                    {validation.touched.category && validation.errors.category && (
                        <FormFeedback type="invalid">{validation.errors.category}</FormFeedback>
                    )}
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
