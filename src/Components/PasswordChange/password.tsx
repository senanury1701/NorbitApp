import React from 'react';
import { Button,FormFeedback, Col,  Form, Input, Label, Row, } from 'reactstrap';
import axiosInstance from '../../config/axiosConfig'
import { ToastContainer } from 'react-toastify';

import * as Yup from "yup";
import { useFormik } from "formik";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Settings = () => {
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            password: '',
            password1: '',
            password2: '',

        },
        validationSchema: Yup.object({
            password: Yup.string().required("Please enter your password"),
            password1: Yup.string().required("Please enter your password"),
            password2: Yup.string()
                .oneOf([Yup.ref("password1")], "Passwords do not match")
                .required("Please confirm your password"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try { 
            const response = await axiosInstance.post('accounts/password/change/', values );
        
            if (response.status === 200) {
              toast.success('Password updated successfully!');
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


      
    return (
    <div>
         <Form 
             onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
            }}>
              <Row className="g-2">
              <ToastContainer />

                  <Col lg={4}>
                      <div>
                      <div className="mb-3">
                            <Label className="form-label" htmlFor="password"> Password<span className="text-danger">*</span></Label>
                            <Input
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                type="password"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.password || ""}
                                invalid={
                                    validation.touched.password && validation.errors.password ? true : false
                                }
                            />
                            {validation.touched.password && validation.errors.password ? (
                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                            ) : null}
                        </div>

                      </div>
                  </Col>
                  <Col lg={4}>
                    <div className="mb-3">
                        <Label className="form-label" htmlFor="password1">New  Password<span className="text-danger">*</span></Label>
                        <Input
                            name="password1"
                            className="form-control"
                            placeholder="Confirm password"
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
                  </Col>
                  <Col lg={4}>
                  <div className="mb-3">
                        <Label className="form-label" htmlFor="password2">New Confirm Password<span className="text-danger">*</span></Label>
                        <Input
                            name="password2"
                            className="form-control"
                            placeholder="Confirm password2"
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
                  </Col>
                  <Col lg={12}>
                      <div className="text-end">
                        <Button color="primary" type="submit">Change Password</Button>
                      </div>
                  </Col>
              </Row>
          </Form>
    </div>

 
      
    );
};

export default Settings;