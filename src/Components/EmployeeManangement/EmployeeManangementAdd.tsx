import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addEmployeeManangement } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface EmployeeManangementAddModalProps {
    toggleAdd: () => void;
    pageZero: () => void;
}

const EmployeeManangementAddModal: React.FC<EmployeeManangementAddModalProps> = ({ toggleAdd ,pageZero}) => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please Enter Your EmployeeManangement Name"),
        }),
        onSubmit: async (username, { resetForm }) => {
            try {
                await dispatch(addEmployeeManangement(username));
                resetForm();
                pageZero()
                toggleAdd()
            } catch (error) {
                console.error('Failed to add EmployeeManangement:', error);
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
                    <Label htmlFor="username" className="form-label">EmployeeManangement Name</Label>
                    <Input
                        name="username"
                        className="form-control"
                        placeholder="Enter EmployeeManangement name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username}
                        invalid={validation.touched.username && !!validation.errors.username}
                    />
                    {validation.touched.username && validation.errors.username && (
                        <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                    )}
                </div>
                <Button type="submit" color="primary">Add EmployeeManangement</Button>
            </Form>
        </div>
    );
};

export default EmployeeManangementAddModal;
