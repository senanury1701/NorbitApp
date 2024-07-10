import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form, FormFeedback, Button, Spinner } from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// action
import { registerUser, resetRegisterFlag } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

//import images 
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { createSelector } from "reselect";

const Register = () => {
    const [loader, setLoader] = useState<boolean>(false);
    const history = useNavigate();
    const dispatch = useDispatch<any>();

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',            
            user_type: '',
            first_name: '',
            last_name : '',
            company_name: '',
            job_title : '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please Enter Your username"),
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please enter your password"),
            confirm_password: Yup.string()
                .oneOf([Yup.ref("password")], "Passwords do not match")
                .required("Please confirm your password"),
            user_type: Yup.string().required("Please Enter Your user type"),
            first_name: Yup.string().required("Please Enter Your first name"),
            last_name: Yup.string().required("Please Enter Your last name"),
            company_name: Yup.string().required("Please Enter Your last company name"),
            job_title: Yup.string().required("Please Enter Your last company job title"),

        }),
        onSubmit: (values) => {
            dispatch(registerUser(values, history));
            setLoader(true)
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
    // Inside your component
    const {
        error, success
    } = useSelector(registerdatatype);


    useEffect(() => {
        if (success) {
            setTimeout(() => history("/login"), 3000);
        }

        setTimeout(() => {
            dispatch(resetRegisterFlag());
        }, 3000);

    }, [dispatch, success, error, history]);

    document.title = "Basic SignUp | Velzon - React Admin & Dashboard Template";

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
                                                className="needs-validation" action="#">

                                                {success && success ? (
                                                    <>
                                                        {toast("Your Redirect To Login Page...", { position: "top-right", hideProgressBar: false, className: 'bg-success text-white', progress: undefined, toastId: "" })}
                                                        <ToastContainer autoClose={2000} limit={1} />
                                                        <Alert color="success">
                                                            Register User Successfully and Your Redirect To Login Page...
                                                        </Alert>
                                                    </>
                                                ) : null}

                                                {error && error ? (
                                                    <Alert color="danger"><div>
                                                        Email has been Register Before, Please Use Another Email Address... </div></Alert>
                                                ) : null}

                                                <div className="mb-3">
                                                    <Label htmlFor="username" className="form-label">Username <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="username"
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="Enter username "
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.username || ""}
                                                        invalid={
                                                            validation.touched.username && validation.errors.username ? true : false
                                                        }
                                                    />
                                                    {validation.touched.username && validation.errors.username ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.username}</div></FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        className="form-control"
                                                        placeholder="Enter email address"
                                                        type="email"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.email || ""}
                                                        invalid={
                                                            validation.touched.email && validation.errors.email ? true : false
                                                        }
                                                    />
                                                    {validation.touched.email && validation.errors.email ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                                                    ) : null}

                                                </div>
                                                
                                                <div className="mb-3">
                                                    <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="password"
                                                        type="password"
                                                        placeholder="Enter Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.password || ""}
                                                        invalid={
                                                            validation.touched.password && validation.errors.password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-2">
                                                    <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label>
                                                    <Input
                                                        name="confirm_password"
                                                        type="password"
                                                        placeholder="Confirm Password"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.confirm_password || ""}
                                                        invalid={
                                                            validation.touched.confirm_password && validation.errors.confirm_password ? true : false
                                                        }
                                                    />
                                                    {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.confirm_password}</div></FormFeedback>
                                                    ) : null}

                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="usertype" className="form-label">Usertype <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="user_type"
                                                        name="user_type"
                                                        className="form-control"
                                                        placeholder="Enter user_type "
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.user_type || ""}
                                                        invalid={
                                                            validation.touched.user_type && validation.errors.user_type ? true : false
                                                        }
                                                    />
                                                    {validation.touched.user_type && validation.errors.user_type ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.user_type}</div></FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="firstname" className="form-label">First name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="first_name"
                                                        name="first_name"
                                                        className="form-control"
                                                        placeholder="Enter first name "
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.first_name || ""}
                                                        invalid={
                                                            validation.touched.first_name && validation.errors.first_name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.first_name && validation.errors.first_name ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.first_name}</div></FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="lastname" className="form-label">Last name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="last_name"
                                                        name="last_name"
                                                        className="form-control"
                                                        placeholder="Enter last name "
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.last_name || ""}
                                                        invalid={
                                                            validation.touched.last_name && validation.errors.last_name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.last_name && validation.errors.last_name ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.last_name}</div></FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="companyname" className="form-label">company name <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="company_name"
                                                        name="company_name"
                                                        className="form-control"
                                                        placeholder="Enter company_name "
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.company_name || ""}
                                                        invalid={
                                                            validation.touched.company_name && validation.errors.company_name ? true : false
                                                        }
                                                    />
                                                    {validation.touched.company_name && validation.errors.company_name ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.company_name}</div></FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label htmlFor="jobtitle" className="form-label">job title <span className="text-danger">*</span></Label>
                                                    <Input
                                                        id="job_title"
                                                        name="job_title"
                                                        className="form-control"
                                                        placeholder="Enter job_title "
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.job_title || ""}
                                                        invalid={
                                                            validation.touched.job_title && validation.errors.job_title ? true : false
                                                        }
                                                    />
                                                    {validation.touched.job_title && validation.errors.job_title ? (
                                                        <FormFeedback type="invalid"><div>{validation.errors.job_title}</div></FormFeedback>
                                                    ) : null}
                                                </div>


                                                <div className="mt-4">
                                                <Button color="success" className="w-100" type="submit" disabled={loader && true}>
                                                        {loader && <Spinner size="sm" className='me-2'> Loading... </Spinner>}
                                                        Sign Up
                                                    </Button>
                                                </div>

                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Already have an account ? <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Signin </Link> </p>
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

