import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button, Spinner } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerUser, resetRegisterFlag } from "../../slices/thunks";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";
import axiosInstance from '../../config/axiosConfig'

const Register = () => {
    const [loader, setLoader] = useState<boolean>(false);
    const [companyOptions, setCompanyOptions] = useState<{ id: number, name: string }[]>([]);
    const [jobTitleOptions, setJobTitleOptions] = useState<{ id: number, title: string }[]>([]);
    const history = useNavigate();
    const dispatch = useDispatch<any>();
    const [loading, setLoading] = useState<boolean>(true); // Yüklenme durumunu yönetmek için state

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Yüklenmeye başladığını işaretle

                // Şirketleri API'den çek
                const companyResponse = await axiosInstance.get('company/list'); 
                setCompanyOptions(companyResponse.data.results); 

                // İş unvanlarını API'den çek
                const jobResponse = await axiosInstance.get('/jobs/list'); 
                setJobTitleOptions(jobResponse.data.results); 

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); 
            }
        };
        console.log(companyOptions);
        
        fetchData();
    }, []);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: '',
            email: null,
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
            email: Yup.string().email("Invalid email format"),
            password1: Yup.string().required("Please enter your password"),
            password2: Yup.string()
                .oneOf([Yup.ref("password1")], "Passwords do not match")
                .required("Please confirm your password"),
            user_type: Yup.string().required("Please select your user type"),
            first_name: Yup.string().required("Please enter your first name"),
            last_name: Yup.string().required("Please enter your last name"),
            company_name: Yup.number().required("Please select your company name"), // pk değeri olarak sayı bekleniyor
            job_title: Yup.number().required("Please select your job title"),       // pk değeri olarak sayı bekleniyor
            job_start_date: Yup.date().required("Please enter your job start date"),
        }),
        onSubmit: (values) => {
            const formattedDate = new Date(values.job_start_date).toISOString();
            values.job_start_date = formattedDate    
            console.log(values);
                    
            dispatch(registerUser(values, history));
            setLoader(true);
        }
    });

    const selectLayoutState = (state: any) => state.Account;
    const registerdatatype = createSelector(
        selectLayoutState,
        (account) => ({
            success: account.success,
            error: account.error
        })
    );

    const { error, success } = useSelector(registerdatatype);

    useEffect(() => {
        if (success) {
            setTimeout(() => history("/login"), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);


    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Create New Account</h5>
                                            <p className="text-muted">Get your free velzon account now</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                className="needs-validation"
                                            >
                                                {success && (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully and Your Redirect To Login Page...
                                                        </Alert>
                                                    </>
                                                )}

                                                {error && (
                                                    <Alert color="danger">
                                                        <div>
                                                            Email has been Register Before, Please Use Another Email Address...
                                                        </div>
                                                    </Alert>
                                                )}

                                                <div className="mb-3">
                                                    <Label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="Enter username"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.username || ""}
                                                        invalid={validation.touched.username && validation.errors.username ? true : false}
                                                    />
                                                    {validation.touched.username && validation.errors.username && (
                                                        <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email address"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={validation.touched.email && validation.errors.email ? true : false}
                                                    />
                                                    {validation.touched.email && validation.errors.email && (
                                                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="password1" className="form-label">Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="password1"
                                                        name="password1"
                                                        type="password"
                                                        placeholder="Enter password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password1 || ""}
                                                        invalid={validation.touched.password1 && validation.errors.password1 ? true : false}
                                                    />
                                                    {validation.touched.password1 && validation.errors.password1 && (
                                                        <FormFeedback type="invalid">{validation.errors.password1}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="password2" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="password2"
                                                        name="password2"
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password2 || ""}
                                                        invalid={validation.touched.password2 && validation.errors.password2 ? true : false}
                                                    />
                                                    {validation.touched.password2 && validation.errors.password2 && (
                                                        <FormFeedback type="invalid">{validation.errors.password2}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="user_type" className="form-label">User Type <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="user_type"
                                                        name="user_type"
                                                        type="select"
                                                        className="form-control"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.user_type || ""}
                                                        invalid={validation.touched.user_type && validation.errors.user_type ? true : false}
                                                    >
                                                        <option value="">_____</option>
                                                        <option value="AU">Admin</option>
                                                        <option value="NU">User</option>
                                                    </Input>
                                                    {validation.touched.user_type && validation.errors.user_type && (
                                                        <FormFeedback type="invalid">{validation.errors.user_type}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="first_name" className="form-label">First Name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="first_name"
                                                        name="first_name"
                                                        className="form-control"
                                                        placeholder="Enter first name"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.first_name || ""}
                                                        invalid={validation.touched.first_name && validation.errors.first_name ? true : false}
                                                    />
                                                    {validation.touched.first_name && validation.errors.first_name && (
                                                        <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="last_name" className="form-label">Last Name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="last_name"
                                                        name="last_name"
                                                        className="form-control"
                                                        placeholder="Enter last name"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.last_name || ""}
                                                        invalid={validation.touched.last_name && validation.errors.last_name ? true : false}
                                                    />
                                                    {validation.touched.last_name && validation.errors.last_name && (
                                                        <FormFeedback type="invalid">{validation.errors.last_name}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="company_name" className="form-label">Company Name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="company_name"
                                                        name="company_name"
                                                        type="select"
                                                        className="form-control"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.company_name || ""}
                                                        invalid={validation.touched.company_name && validation.errors.company_name ? true : false}
                                                    >
                                                        <option value="">Select a company</option>
                                                        {companyOptions.map((company) => (
                                                            <option key={company.id} value={company.id}>{company.name}</option>
                                                        ))}
                                                    </Input>
                                                    {validation.touched.company_name && validation.errors.company_name && (
                                                        <FormFeedback type="invalid">{validation.errors.company_name}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="job_title" className="form-label">Job Title <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="job_title"
                                                        name="job_title"
                                                        type="select"
                                                        className="form-control"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.job_title || ""}
                                                        invalid={validation.touched.job_title && validation.errors.job_title ? true : false}
                                                    >
                                                        <option value="">Select a job title</option>
                                                        {jobTitleOptions.map((job) => (
                                                            <option key={job.id} value={job.id}>{job.title}</option>
                                                        ))}
                                                    </Input>
                                                    {validation.touched.job_title && validation.errors.job_title && (
                                                        <FormFeedback type="invalid">{validation.errors.job_title}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="job_start_date" className="form-label">Job Start Date <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="job_start_date"
                                                        name="job_start_date"
                                                        type="date"
                                                        className="form-control"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.job_start_date || ""}
                                                        invalid={validation.touched.job_start_date && validation.errors.job_start_date ? true : false}
                                                    />
                                                    {validation.touched.job_start_date && validation.errors.job_start_date && (
                                                        <FormFeedback type="invalid">{validation.errors.job_start_date}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" className="w-100" type="submit" disabled={loader}>
                                                        {loader && <Spinner size="sm" className='me-2'> Loading... </Spinner>}
                                                        Sign Up
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account? <Link to="/login" className="fw-semibold text-primary text-decoration-underline">Sign In</Link></p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Register;
