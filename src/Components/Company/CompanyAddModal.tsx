import React, {  useState } from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label,  Form, FormFeedback,  } from 'reactstrap';


const CompanyAddModal = () => {
    
    const [userLogin, setUserLogin] = useState<any>([]);
    const [passwordShow, setPasswordShow] = useState<boolean>(false);    
    console.log('addmodal acildi ');
    
    
    const validation: any = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            username: userLogin.username  || '',
            password: userLogin.password  || '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: (values) => {
            
            console.log(values);
            
        }
    });


  return (
    <div>
        <div>
            <div id="task-error-msg" className="alert alert-danger py-2">
               <h1>
                Edit Modal
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure in quae corporis nam, illo repudiandae tempore amet quam praesentium pariatur!
               </h1>
               <Form
                    onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                    }}
                    action="#">

                    <div className="mb-3">
                        <Label htmlFor="username" className="form-label">Email</Label>
                        <Input
                            name="username"
                            className="form-control"
                            placeholder="Enter username"

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

                        <Label className="form-label" htmlFor="password-input">Password</Label>
                        <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                                name="password"
                                value={validation.values.password || ""}
                                type={passwordShow ? "text" : "password"}
                                className="form-control pe-5"
                                placeholder="Enter Password"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                    validation.touched.password && validation.errors.password ? true : false
                                }
                            />
                            {validation.touched.password && validation.errors.password ? (
                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                            ) : null}
                            <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" onClick={() => setPasswordShow(!passwordShow)} type="button" id="password-addon"><i className="ri-eye-fill align-middle"></i></button>
                        </div>
                    </div>

                    <div className="form-check">
                        <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                        <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                    </div>


                </Form>
            </div>

        </div>        
    </div>

  )
};

export default CompanyAddModal;
