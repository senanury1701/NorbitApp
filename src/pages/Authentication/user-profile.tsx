import React, { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import { Button,FormFeedback, Card, CardBody, CardHeader, Col, Container, Form, Input, Label, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import classnames from "classnames";
import AsyncSelect from 'react-select/async';
import {  fetchCompanies, fetchJobs } from "../../slices/thunks";
import axiosInstance from '../../config/axiosConfig'
//import images
import progileBg from '../../assets/images/profile-bg.jpg';
import avatar1 from '../../assets/images/users/avatar-1.jpg';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {  resetProfileFlag } from "../../slices/thunks";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import  { components } from 'react-select';

const Settings = () => {
  const dispatch = useDispatch<any>();

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    job_title: [""],
    company_name: [""],
    skills: "",
    about: "",
    files: "",
    links: ""
  });

  const { success, error } = useSelector((state: any) => state.login);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      try {
        const obj = JSON.parse(storedUser);
        setUserData({
          first_name: obj.first_name,
          last_name: obj.last_name,
          username: obj.username,
          email: obj.email,
          job_title: obj.job_title,
          company_name: obj.company_name,
          skills: obj.skills,
          about: obj.about,
          files: obj.files,
          links: obj.links,
        });
      } catch (error) {
        console.error("Error parsing authUser from sessionStorage:", error);
      }
    }

    if (success) {
      toast.success("Profile updated successfully!");
    }

    if (error) {
      toast.error(`Error: ${error}`);
    }

    setTimeout(() => {
      dispatch(resetProfileFlag());
    }, 3000);
  }, [dispatch, success, error]);




  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
      username: userData.username || "",
      email: userData.email || "",
      job_title: userData.job_title || [""],
      company_name: userData.company_name || [""],
      skills: userData.skills || "",
      about: userData.about || "",
      links: userData.links || "",
      files: userData.files || null,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      username: Yup.string().required("Please Enter Your Username"),
      email: Yup.string().email("Invalid email format").notRequired(),
      job_title: Yup.string().required("Please Enter Your Job Title"),
      company_name: Yup.string().required("Please Enter Your Company Name"),
      skills: Yup.string().notRequired(),
      about: Yup.string().notRequired(),
      links: Yup.string().url("Invalid URL format").notRequired(),
      files: Yup.mixed().notRequired()
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('first_name', values.first_name);
        formData.append('last_name', values.last_name);
        formData.append('username', values.username);
        formData.append('email', values.email);
        formData.append('job_title', values.job_title[0]);
        formData.append('company_name', values.company_name[0]);
        formData.append('skills', values.skills);
        formData.append('about', values.about);
        formData.append('links', values.links);
  
        if (values.files) {
          formData.append('files', values.files);
        }
  
        const response = await axiosInstance.put('accounts/user/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          toast.success('Profile updated successfully!');
        } else {
          toast.error('Something went wrong. Please try again.');
        }
      } catch (error) {
        // Hata durumu
        console.error('Error updating profile:', error);
        toast.error('Error updating profile. Please try again.');
      }
    },
  });


  const [activeTab, setActiveTab] = useState("1");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files) {
      validation.setFieldValue(field, event.currentTarget.files[0]);
    }
  };
  const tabChange = (tab: any) => {
      if (activeTab !== tab) setActiveTab(tab);
  };
  const [searchInput, setSearchInput] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const { companies, count: companyCount } = useSelector((state: any) => state.company);

  const { jobs, count: jobsCount } = useSelector((state: any) => state.jobs);
  const [searchInputJobs, setSearchInputJobs] = useState<string>('');
  const [pageCompanies, setPageCompanies] = useState<number>(1);
  const [pageJobs, setPageJobs] = useState<number>(1);

  const maxPageCompanies = Math.ceil(companyCount / 5);
  const maxPageJobs = Math.ceil(jobsCount / 5);

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
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={progileBg} className="profile-wid-img" alt="" />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />
                                        <Label htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light">
                                            <i className="ri-image-edit-line align-bottom me-1"></i> Change Cover
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col xxl={3}>
                            <Card className="mt-n5">
                                <CardBody className="p-4">
                                    <div className="text-center">
                                        <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                                            <img src={avatar1}
                                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                                alt="user-profile" />
                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Input id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Label>
                                            </div>
                                        </div>
                                        <h5 className="fs-16 mb-1">Anna Adame</h5>
                                        <p className="text-muted mb-0">Lead Designer / Developer</p>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
                                <CardHeader>
                                    <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                                        role="tablist">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({ active: activeTab === "1" })}
                                                onClick={() => {
                                                    tabChange("1");
                                                }}>
                                                <i className="fas fa-home"></i>
                                                Personal Details
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink to="#"
                                                className={classnames({ active: activeTab === "2" })}
                                                onClick={() => {
                                                    tabChange("2");
                                                }}
                                                type="button">
                                                <i className="far fa-user"></i>
                                                Change Password
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-4">
                                    <TabContent activeTab={activeTab}>
                                    <TabPane tabId="1">
                                    <Form
                                      className="form-horizontal"
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        validation.handleSubmit();
                                        return false;
                                      }}
                                    >
                                    <div className="form-group">
                                      <Label>First Name</Label>
                                      <Input
                                        name="first_name"
                                        type="text"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.first_name}
                                        invalid={!!(validation.touched.first_name && validation.errors.first_name)}
                                      />
                                      <FormFeedback>{validation.errors.first_name}</FormFeedback>
                                    </div>

                                    <div className="form-group">
                                      <Label>Last Name</Label>
                                      <Input
                                        name="last_name"
                                        type="text"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.last_name}
                                        invalid={!!(validation.touched.last_name && validation.errors.last_name)}
                                      />
                                      <FormFeedback>{validation.errors.last_name}</FormFeedback>
                                    </div>

                                    <div className="form-group">
                                      <Label>Username</Label>
                                      <Input
                                        name="username"
                                        type="text"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.username}
                                        invalid={!!(validation.touched.username && validation.errors.username)}
                                      />
                                      <FormFeedback>{validation.errors.username}</FormFeedback>
                                    </div>

                                    <div className="form-group">
                                      <Label>Email</Label>
                                      <Input
                                        name="email"
                                        type="email"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.email}
                                        invalid={!!(validation.touched.email && validation.errors.email)}
                                      />
                                      <FormFeedback>{validation.errors.email}</FormFeedback>
                                    </div>

                                    <div className="form-group">
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

                                    <div className="form-group">
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

                                    <div className="form-group">
                                      <Label>Skills</Label>
                                      <Input
                                        name="skills"
                                        type="text"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.skills}
                                        invalid={!!(validation.touched.skills && validation.errors.skills)}
                                      />
                                      <FormFeedback>{validation.errors.skills}</FormFeedback>
                                    </div>

                                    <div className="form-group">
                                      <Label>About</Label>
                                      <Input
                                        name="about"
                                        type="textarea"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.about}
                                        invalid={!!(validation.touched.about && validation.errors.about)}
                                      />
                                      <FormFeedback>{validation.errors.about}</FormFeedback>
                                    </div>

                                    <div className="form-group">
                                      <Label>Links</Label>
                                      <Input
                                        name="links"
                                        type="url"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.links}
                                        invalid={!!(validation.touched.links && validation.errors.links)}
                                      />
                                      <FormFeedback>{validation.errors.links}</FormFeedback>
                                    </div>

                                    <div className="mb-3">
                                      <Label htmlFor="files" className="form-label">
                                        Files 
                                      </Label>
                                      <Input
                                        name="files"
                                        type="file"
                                        onChange={(e) => handleFileChange(e, 'files')}
                                        invalid={validation.touched.files && !!validation.errors.files}
                                      />
                                      {validation.touched.files && validation.errors.files && (
                                        <FormFeedback type="invalid">{validation.errors.files}</FormFeedback>
                                      )}
                                    </div>
                                    
                                    <div className="text-center mt-4">
                                      <Button type="submit" color="primary">
                                        Update Profile
                                      </Button>
                                    </div>
                                    </Form>
                                        </TabPane>

                                        <TabPane tabId="2">
                                            <Form>
                                                <Row className="g-2">
                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="oldpasswordInput" className="form-label">Old
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="oldpasswordInput"
                                                                placeholder="Enter current password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="newpasswordInput" className="form-label">New
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="newpasswordInput" placeholder="Enter new password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={4}>
                                                        <div>
                                                            <Label htmlFor="confirmpasswordInput" className="form-label">Confirm
                                                                Password*</Label>
                                                            <Input type="password" className="form-control"
                                                                id="confirmpasswordInput"
                                                                placeholder="Confirm password" />
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="mb-3">
                                                            <Link to="#"
                                                                className="link-primary text-decoration-underline">Forgot
                                                                Password ?</Link>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="text-end">
                                                            <button type="button" className="btn btn-primary">Change
                                                                Password</button>
                                                        </div>
                                                    </Col>

                                                </Row>

                                            </Form>
                                            <div className="mt-4 mb-3 border-bottom pb-2">
                                                <div className="float-end">
                                                    <Link to="#" className="link-secondary">All Logout</Link>
                                                </div>
                                                <h5 className="card-title">Login History</h5>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>iPhone 12 Pro</h6>
                                                    <p className="text-muted mb-0">Los Angeles, United States - March 16 at
                                                        2:47PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-tablet-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Apple iPad Pro</h6>
                                                    <p className="text-muted mb-0">Washington, United States - November 06
                                                        at 10:43AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#" className="link-secondary">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-smartphone-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Galaxy S21 Ultra 5G</h6>
                                                    <p className="text-muted mb-0">Conneticut, United States - June 12 at
                                                        3:24PM</p>
                                                </div>
                                                <div>
                                                    <Link to="#" className="link-secondary">Logout</Link>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 avatar-sm">
                                                    <div className="avatar-title bg-light text-primary rounded-3 fs-18">
                                                        <i className="ri-macbook-line"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h6>Dell Inspiron 14</h6>
                                                    <p className="text-muted mb-0">Phoenix, United States - July 26 at
                                                        8:10AM</p>
                                                </div>
                                                <div>
                                                    <Link to="#" className="link-secondary">Logout</Link>
                                                </div>
                                            </div>
                                        </TabPane>

                                    </TabContent >
                                </CardBody >
                            </Card >
                        </Col >
                    </Row >
                </Container >
            </div >
        </React.Fragment >
    );
};

export default Settings;