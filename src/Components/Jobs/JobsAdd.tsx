import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addJobs } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

const JobsAdd = () => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            job_title: '',
        },
        validationSchema: Yup.object({
            job_title: Yup.string().required("Please Enter Your Jobs Name"),
        }),
        onSubmit: async (job_title, { resetForm }) => {
            try {
                await dispatch(addJobs(job_title));
                resetForm();
            } catch (error) {
                console.error('Failed to add Jobs:', error);
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
                    <Label htmlFor="name" className="form-label">Jobs Name</Label>
                    <Input
                        name="job_title"
                        className="form-control"
                        placeholder="Enter Jobs name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.job_title}
                        invalid={validation.touched.job_title && !!validation.errors.job_title}
                    />
                    {validation.touched.job_title && validation.errors.job_title && (
                        <FormFeedback type="invalid">{validation.errors.job_title}</FormFeedback>
                    )}
                </div>
                <Button type="submit" color="primary">Add Jobs</Button>
            </Form>
        </div>
    );
};

export default JobsAdd;
