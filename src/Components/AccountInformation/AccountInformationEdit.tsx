import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editAccountInformation } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface AccountInformationEditModalProps {
    rowData: any;
    toggleEdit: () => void;
}
  
const AccountInformationEditModal: React.FC<AccountInformationEditModalProps> = ({ rowData, toggleEdit }) => {
    const dispatch = useAppDispatch();
    const props = rowData;

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            website_name: props.website_name || '',
            website_link: props.website_link || '',
            e_mail: props.e_mail || '',
            password: props.password || '',
            id: props.id,
        },
        validationSchema: Yup.object({
            website_name: Yup.string().required("Please Enter the Website Name"),
            website_link: Yup.string().url("Please Enter a Valid URL").required("Please Enter the Website Link"),
            e_mail: Yup.string().email("Please Enter a Valid Email").required("Please Enter Your Email"),
            password: Yup.string().required("Please Enter the Password"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                await dispatch(editAccountInformation(values));
                resetForm();
                toggleEdit();
            } catch (error) {
                console.error('Failed to update company:', error);
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
                    <Label htmlFor="website_name" className="form-label">Website Name</Label>
                    <Input
                        name="website_name"
                        className="form-control"
                        placeholder="Enter website name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.website_name}
                        invalid={validation.touched.website_name && !!validation.errors.website_name}
                    />
                    {validation.touched.website_name && validation.errors.website_name && (
                        <FormFeedback type="invalid">
                            {String(validation.errors.website_name)}
                        </FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="website_link" className="form-label">Website Link</Label>
                    <Input
                        name="website_link"
                        className="form-control"
                        placeholder="Enter website link"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.website_link}
                        invalid={validation.touched.website_link && !!validation.errors.website_link}
                    />
                    {validation.touched.website_link && validation.errors.website_link && (
                        <FormFeedback type="invalid">
                            {String(validation.errors.website_link)}
                        </FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="e_mail" className="form-label">Email</Label>
                    <Input
                        name="e_mail"
                        className="form-control"
                        placeholder="Enter your email"
                        type="email"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.e_mail}
                        invalid={validation.touched.e_mail && !!validation.errors.e_mail}
                    />
                    {validation.touched.e_mail && validation.errors.e_mail && (
                        <FormFeedback type="invalid">
                            {String(validation.errors.e_mail)}
                        </FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="password" className="form-label">Password</Label>
                    <Input
                        name="password"
                        className="form-control"
                        placeholder="Enter password"
                        type="password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.password}
                        invalid={validation.touched.password && !!validation.errors.password}
                    />
                    {validation.touched.password && validation.errors.password && (
                        <FormFeedback type="invalid">
                            {String(validation.errors.password)}
                        </FormFeedback>
                    )}
                </div>

                <Button type="submit" color="primary">Edit Account Information</Button>
            </Form>
        </div>
    );
};

export default AccountInformationEditModal;
