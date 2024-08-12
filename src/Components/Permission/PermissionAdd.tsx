import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addPermission } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface PermissionAddModalProps {
    toggleAdd: () => void;
    pageZero: () => void;
}

const PermissionAddModal: React.FC<PermissionAddModalProps> = ({ toggleAdd ,pageZero}) => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            Permission_name: '',
        },
        validationSchema: Yup.object({
            Permission_name: Yup.string().required("Please Enter Your Permission Name"),
        }),
        onSubmit: async (Permission_name, { resetForm }) => {
            try {
                await dispatch(addPermission(Permission_name));
                resetForm();
                pageZero()
                toggleAdd()
            } catch (error) {
                console.error('Failed to add Permission:', error);
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
                    <Label htmlFor="Permission_name" className="form-label">Permission Name</Label>
                    <Input
                        name="Permission_name"
                        className="form-control"
                        placeholder="Enter Permission name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.Permission_name}
                        invalid={validation.touched.Permission_name && !!validation.errors.Permission_name}
                    />
                    {validation.touched.Permission_name && validation.errors.Permission_name && (
                        <FormFeedback type="invalid">{validation.errors.Permission_name}</FormFeedback>
                    )}
                </div>
                <Button type="submit" color="primary">Add Permission</Button>
            </Form>
        </div>
    );
};

export default PermissionAddModal;
