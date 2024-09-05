import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card,  Container, Input, Label, Form, FormFeedback, Button, Spinner } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser, resetRegisterFlag, fetchCompanies, fetchJobs } from "../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import BreadCrumb from 'Components/Common/BreadCrumb';
import UiContent from 'Components/Common/UiContent';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';

const Dashboard = () => {
    const [loader, setLoader] = useState<boolean>(false);
    const history = useNavigate();
    const dispatch = useDispatch<any>();
    const { companies, count: companyCount } = useSelector((state: any) => state.company);
    const { jobs, count: jobsCount } = useSelector((state: any) => state.jobs);
    const [searchInput, setSearchInput] = useState<string>('');
    const [searchInputJobs, setSearchInputJobs] = useState<string>('');
    const [pageCompanies, setPageCompanies] = useState<number>(1);
    const [pageJobs, setPageJobs] = useState<number>(1);
    const [isFetching, setIsFetching] = useState<boolean>(false);

    const maxPageCompanies = Math.ceil(companyCount / 5);
    const maxPageJobs = Math.ceil(jobsCount / 5);

    const { error, success } = useSelector((state: any) => state.Account);

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

    const handleJobsSearchChange = async (inputValue: string) => {
        setSearchInputJobs(inputValue);
        setPageJobs(1);
        const fetchedJobs = await dispatch(fetchJobs(1, inputValue));
        return fetchedJobs.map((job: any) => ({
            value: job.id,
            label: job.job_title,
        }));
    };

    const loadJobs = async (page: number) => {
        if (isFetching) return;
        setIsFetching(true);
        await dispatch(fetchJobs(page, searchInputJobs));
        setIsFetching(false);
    };

    useEffect(() => {
        loadJobs(pageJobs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageJobs, searchInputJobs, dispatch]);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: '',
            email: '',
            password1: '',
            password2: '',
            user_type: '',
            first_name: '',
            last_name: '',
            company_name: '',
            job_title: '',
            job_start_date: ''
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please enter your username"),
            email: Yup.string().email("Invalid email format").required("Please enter your email"),
            password1: Yup.string().required("Please enter your password"),
            password2: Yup.string()
                .oneOf([Yup.ref("password1")], "Passwords do not match")
                .required("Please confirm your password"),
            user_type: Yup.string().required("Please select your user type"),
            first_name: Yup.string().required("Please enter your first name"),
            last_name: Yup.string().required("Please enter your last name"),
            company_name: Yup.string().required("Please select your company name"), // Change to Yup.string()
            job_title: Yup.number().required("Please select your job title"),
            job_start_date: Yup.date().required("Please enter your job start date"),
        }),
        onSubmit: (values) => {
            const jobStartDate = new Date(values.job_start_date);
            const formattedDate = jobStartDate.toISOString();

            const formattedValues = {
                ...values,
                job_start_date: formattedDate
            };

            console.log(formattedValues);
            dispatch(registerUser(formattedValues));
            setLoader(true);
        }
    });

    useEffect(() => {
        if (success) {
            setTimeout(() => history("/employeeManangement"), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);
    }, [dispatch, success, error, history]);

    useEffect(() => {
        dispatch(fetchCompanies(1, searchInput));
        
    }, [dispatch, searchInput]);

    useEffect(() => {
        dispatch(fetchJobs(1, searchInputJobs));
    }, [dispatch, searchInputJobs]);

    const Menu = (props: any) => {
        const isJobSearch = Boolean(props.selectProps.inputValue);
        const currentPage = isJobSearch ? pageJobs : pageCompanies;
        const maxPage = isJobSearch ? maxPageJobs : maxPageCompanies;
        const setPage = isJobSearch ? setPageJobs : setPageCompanies;

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
            <UiContent />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="User Registration" pageTitle="Pages" />
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card>
                                <CardBody className="registration-form">
                                    <Form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            validation.handleSubmit();
                                            return false;
                                        }}
                                    >
                                        {loader ? (
                                            <Spinner color="primary"> Loading... </Spinner>
                                        ) : (
                                            <>
                                                <ToastContainer />
                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="username">Username<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="Enter username"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.username || ""}
                                                        invalid={
                                                            validation.touched.username && validation.errors.username ? true : false
                                                        }
                                                    />
                                                    {validation.touched.username && validation.errors.username ? (
                                                        <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="email">Email<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="password1">Password<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password1"
                                                        className="form-control"
                                                        placeholder="Enter password"
                                                        type="password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password1 || ""}
                                                        invalid={
                                                            validation.touched.password1 && validation.errors.password1 ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password1 && validation.errors.password1 ? (
                                                        <FormFeedback type="invalid">{validation.errors.password1}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="password2">Confirm Password<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password2"
                                                        className="form-control"
                                                        placeholder="Confirm password"
                                                        type="password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password2 || ""}
                                                        invalid={
                                                            validation.touched.password2 && validation.errors.password2 ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password2 && validation.errors.password2 ? (
                                                        <FormFeedback type="invalid">{validation.errors.password2}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="user_type">User Type<span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="user_type"
                                                        name="user_type"
                                                        type="select"
                                                        className="form-select"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.user_type || ""}
                                                        invalid={
                                                            validation.touched.user_type && validation.errors.user_type ? true : false
                                                        }
                                                    >
                                                        <option value="">Select User Type</option>
                                                        <option value="AU">Admin</option>
                                                        <option value="NU">Normal </option>
                                                    </Input>
                                                    {validation.touched.user_type && validation.errors.user_type ? (
                                                        <FormFeedback type="invalid">{validation.errors.user_type}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="first_name">First Name<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="first_name"
                                                        className="form-control"
                                                        placeholder="Enter first name"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.first_name || ""}
                                                        invalid={
                                                            validation.touched.first_name && validation.errors.first_name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.first_name && validation.errors.first_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="last_name">Last Name<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="last_name"
                                                        className="form-control"
                                                        placeholder="Enter last name"
                                                        type="text"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.last_name || ""}
                                                        invalid={
                                                            validation.touched.last_name && validation.errors.last_name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.last_name && validation.errors.last_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.last_name}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="company_name">company Name<span className="text-danger">*</span></Label>
                                                    <AsyncSelect
                                                        id="company_name"
                                                        name="company_name"
                                                        cacheOptions
                                                        loadOptions={handleCompanySearchChange}
                                                        defaultOptions={companies.map((company: any) => ({
                                                            value: company.id,
                                                            label: company.company_name,
                                                        }))}
                                                        onChange={(selectedOption: any) => {
                                                            console.log("Selected Company Option:", selectedOption);
                                                            validation.setFieldValue('company_name', selectedOption?.value);
                                                        }}
                                                        components={{ Menu }}
                                                    />
                                                    {validation.touched.company_name && validation.errors.company_name ? (
                                                        <FormFeedback type="invalid">{validation.errors.company_name}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="job_title">Job Title<span className="text-danger">*</span></Label>
                                                    <AsyncSelect
                                                        id="job_title"
                                                        name="job_title"
                                                        cacheOptions
                                                        loadOptions={handleJobsSearchChange}
                                                        defaultOptions={jobs.map((job: any) => ({
                                                            value: job.id,
                                                            label: job.job_title,
                                                        }))}
                                                        onChange={(selectedOption: any) =>
                                                            validation.setFieldValue('job_title', selectedOption?.value)
                                                        }
                                                        components={{ Menu }}
                                                    />
                                                    {validation.touched.job_title && validation.errors.job_title ? (
                                                        <FormFeedback type="invalid">{validation.errors.job_title}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="job_start_date">Job Start Date<span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="job_start_date"
                                                        className="form-control"
                                                        placeholder="Enter job start date"
                                                        type="date"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.job_start_date || ""}
                                                        invalid={
                                                            validation.touched.job_start_date && validation.errors.job_start_date ? true : false
                                                        }
                                                    />
                                                    {validation.touched.job_start_date && validation.errors.job_start_date ? (
                                                        <FormFeedback type="invalid">{validation.errors.job_start_date}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="text-center mt-4">
                                                    <Button color="primary" type="submit">Register</Button>
                                                </div>
                                            </>
                                        )}
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Dashboard;
