import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addCategory } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface CategoryAddModalProps {
    toggleAdd: () => void;
    pageZero: () => void;
}

const CategoryAdd: React.FC<CategoryAddModalProps> = ({ toggleAdd ,pageZero}) => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Please Enter Your Category Name"),
        }),
        onSubmit: async (name, { resetForm }) => {
            try {
                await dispatch(addCategory(name));
                resetForm();
                pageZero()
                toggleAdd()
            } catch (error) {
                console.error('Failed to add category:', error);
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
                    <Label htmlFor="name" className="form-label">Category Name</Label>
                    <Input
                        name="name"
                        className="form-control"
                        placeholder="Enter category name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name}
                        invalid={validation.touched.name && !!validation.errors.name}
                    />
                    {validation.touched.name && validation.errors.name && (
                        <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                    )}
                </div>
                <Button type="submit" color="primary">Add Category</Button>
            </Form>
        </div>
    );
};

export default CategoryAdd;
