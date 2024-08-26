import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editEmployeeManangement } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';

interface EmployeeManangement {
    id: number;
    job_title: number[];
    company_name: number[];
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    user: string;
    profile_pic: string | null;
    skills: string;
    about: string;
    files: string | null;
    links: string;
    job_start_date: string | null;
    job_end_date: string | null;
    created_at: string;
    updated_at: string;
}

interface EmployeeManangementEditModalProps {
    rowData: EmployeeManangement;
    toggleEdit: () => void;
}

const formatDate = (dateString: any) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

const EmployeeManangementEditModal: React.FC<EmployeeManangementEditModalProps> = ({ rowData, toggleEdit }) => {
    const dispatch = useAppDispatch();
    console.log(rowData);
    
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            job_title: rowData.job_title || [],
            company_name: rowData.company_name || [],
            username: rowData.username || '',
            first_name: rowData.first_name || '',
            last_name: rowData.last_name || '',
            email: rowData.email || '',
            user: rowData.user || '',  
            profile_pic: rowData.profile_pic || '',
            skills: rowData.skills || '',
            about: rowData.about || '',
            links: rowData.links || '',
            job_start_date: formatDate(rowData.job_start_date) || '',
            job_end_date: formatDate(rowData.job_end_date) || '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please Enter Username"),
            first_name: Yup.string().required("Please Enter First Name"),
            last_name: Yup.string().required("Please Enter Last Name"),
            email: Yup.string().email("Invalid email format").required("Please Enter Email"),
            user: Yup.string().oneOf(['Admin', 'User'], "Invalid User Type").required("Please Select User Type"),
            job_start_date: Yup.date().nullable().notRequired(),
            job_end_date: Yup.date().nullable().notRequired(),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const formattedValues = {
                    id: rowData.id,
                    ...values,
                    job_start_date: new Date(values.job_start_date).toISOString(),
                    job_end_date: new Date(values.job_end_date).toISOString(),
                  };
                await dispatch(editEmployeeManangement(formattedValues));
                resetForm();
                toggleEdit();
            } catch (error) {
                console.error('Failed to update EmployeeManangement:', error);
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
                {/* Username */}
                <div className="mb-3">
                    <Label htmlFor="username" className="form-label">Username</Label>
                    <Input
                        name="username"
                        className="form-control"
                        placeholder="Enter Username"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.username}
                        invalid={validation.touched.username && !!validation.errors.username}
                    />
                    <FormFeedback>{validation.errors.username}</FormFeedback>
                </div>

                {/* First Name */}
                <div className="mb-3">
                    <Label htmlFor="first_name" className="form-label">First Name</Label>
                    <Input
                        name="first_name"
                        className="form-control"
                        placeholder="Enter First Name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.first_name}
                        invalid={validation.touched.first_name && !!validation.errors.first_name}
                    />
                    <FormFeedback>{validation.errors.first_name}</FormFeedback>
                </div>

                {/* Last Name */}
                <div className="mb-3">
                    <Label htmlFor="last_name" className="form-label">Last Name</Label>
                    <Input
                        name="last_name"
                        className="form-control"
                        placeholder="Enter Last Name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.last_name}
                        invalid={validation.touched.last_name && !!validation.errors.last_name}
                    />
                    <FormFeedback>{validation.errors.last_name}</FormFeedback>
                </div>

                {/* Email */}
                <div className="mb-3">
                    <Label htmlFor="email" className="form-label">Email</Label>
                    <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter Email"
                        type="email"
                        value={validation.values.email}
                        invalid={validation.touched.email && !!validation.errors.email}
                    />
                    <FormFeedback>{validation.errors.email}</FormFeedback>
                </div>

                {/* User Type */}
                <div className="mb-3">
                    <Label htmlFor="user" className="form-label">User Type</Label>
                    <Input
                        type="select"
                        name="user"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.user}
                        invalid={validation.touched.user && !!validation.errors.user}
                    >
                        <option value="">.....</option>
                        <option value="NU">Normal User</option>
                        <option value="AU">Admin User</option>
                    </Input>
                    <FormFeedback>{validation.errors.user}</FormFeedback>
                </div>

                {/* Profile Picture */}
                <div className="mb-3">
                    <Label htmlFor="profile_pic" className="form-label">Profile Picture URL</Label>
                    <Input
                        name="profile_pic"
                        className="form-control"
                        placeholder="Enter Profile Picture URL"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.profile_pic}
                        invalid={validation.touched.profile_pic && !!validation.errors.profile_pic}
                    />
                    <FormFeedback>{validation.errors.profile_pic}</FormFeedback>
                </div>

                {/* Skills */}
                <div className="mb-3">
                    <Label htmlFor="skills" className="form-label">Skills</Label>
                    <Input
                        name="skills"
                        className="form-control"
                        placeholder="Enter Skills"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.skills}
                        invalid={validation.touched.skills && !!validation.errors.skills}
                    />
                    <FormFeedback>{validation.errors.skills}</FormFeedback>
                </div>

                {/* About */}
                <div className="mb-3">
                    <Label htmlFor="about" className="form-label">About</Label>
                    <Input
                        name="about"
                        className="form-control"
                        placeholder="Enter About Information"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.about}
                        invalid={validation.touched.about && !!validation.errors.about}
                    />
                    <FormFeedback>{validation.errors.about}</FormFeedback>
                </div>

                {/* Links */}
                <div className="mb-3">
                    <Label htmlFor="links" className="form-label">Links</Label>
                    <Input
                        name="links"
                        className="form-control"
                        placeholder="Enter Links"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.links}
                        invalid={validation.touched.links && !!validation.errors.links}
                    />
                    <FormFeedback>{validation.errors.links}</FormFeedback>
                </div>

                <div className="mb-3">
                  <Label htmlFor="job_start_date" className="form-label">job Start Date</Label>
                  <Input
                    name="job_start_date"
                    className="form-control"
                    placeholder="Enter job start date"
                    type="date"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.job_start_date}
                    invalid={validation.touched.job_start_date && !!validation.errors.job_start_date}
                  />
                  {validation.touched.job_start_date && validation.errors.job_start_date && (
                    <FormFeedback>{String(validation.errors.job_start_date)}</FormFeedback>
                  )}
                </div>
                <div className="mb-3">
                  <Label htmlFor="job_end_date" className="form-label">job End Date</Label>
                  <Input
                    name="job_end_date"
                    className="form-control"
                    placeholder="Enter job end date"
                    type="date"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.job_end_date}
                    invalid={validation.touched.job_end_date && !!validation.errors.job_end_date}
                  />
                  {validation.touched.job_end_date && validation.errors.job_end_date && (
                    <FormFeedback>{String(validation.errors.job_end_date)}</FormFeedback>
                  )}
                </div>


                <Button type="submit" color="primary">Edit Employee Management</Button>
            </Form>
        </div>
    );
};

export default EmployeeManangementEditModal;
