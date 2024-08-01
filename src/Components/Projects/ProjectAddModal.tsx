import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addProjects } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface ProjectAddModalProps {
    toggleAdd: () => void;
    pageZero: () => void;
}

const ProjectAddModal: React.FC<ProjectAddModalProps> = ({ toggleAdd ,pageZero}) => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            project_name: '',
        },
        validationSchema: Yup.object({
            project_name: Yup.string().required("Please Enter Your project Name"),
        }),
        onSubmit: async (project_name, { resetForm }) => {
            try {
                await dispatch(addProjects(project_name));
                resetForm();
                pageZero()
                toggleAdd()
            } catch (error) {
                console.error('Failed to add project:', error);
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
                    <Label htmlFor="project_name" className="form-label">project Name</Label>
                    <Input
                        name="project_name"
                        className="form-control"
                        placeholder="Enter project name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.project_name}
                        invalid={validation.touched.project_name && !!validation.errors.project_name}
                    />
                    {validation.touched.project_name && validation.errors.project_name && (
                        <FormFeedback type="invalid">{validation.errors.project_name}</FormFeedback>
                    )}
                </div>
                <Button type="submit" color="primary">Add project</Button>
            </Form>
        </div>
    );
};

export default ProjectAddModal;
