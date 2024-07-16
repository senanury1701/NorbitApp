import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addCompany } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

const CompanyAddModal = () => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            company_name: '',
        },
        validationSchema: Yup.object({
            company_name: Yup.string().required("Please Enter Your Company Name"),
        }),
        onSubmit: async (company_name, { resetForm }) => {
            try {
                await dispatch(addCompany(company_name));
                resetForm();
            } catch (error) {
                console.error('Failed to add company:', error);
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
                }}
                action="#"
            >
                <div className="mb-3">
                    <Label htmlFor="company_name" className="form-label">Company Name</Label>
                    <Input
                        name="company_name"
                        className="form-control"
                        placeholder="Enter company name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.company_name}
                        invalid={validation.touched.company_name && !!validation.errors.company_name}
                    />
                    {validation.touched.company_name && validation.errors.company_name && (
                        <FormFeedback type="invalid">{validation.errors.company_name}</FormFeedback>
                    )}
                </div>
                <Button type="submit" color="primary">Add Company</Button>
            </Form>
        </div>
    );
};

export default CompanyAddModal;
