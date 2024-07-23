import React from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addInventories } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

const InventoriesAdd = () => {
    const dispatch = useAppDispatch();

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            product_name: '',
            project: '',
            category: '',
            price: 0,
            account: '',
            where_in_the_office: '',
            e_commerce_site: '',
            company: '',
            ordering_person: '',
            responsible_person: '',
            description: '',
            count: 0,
            satin_alinan_tarih: new Date().toISOString()
        },
        validationSchema: Yup.object({
            product_name: Yup.string().required("Please Enter Product Name"),
            project: Yup.string().required("Please Enter Project Name"),
            price: Yup.number().required("Please Enter Price"),
            where_in_the_office: Yup.string().required("Please Enter Where in the Office"),
            account: Yup.string().required("Please Enter Account"),
            e_commerce_site: Yup.string().url('Enter a valid URL').required("Please Enter E-commerce Site"),
            company: Yup.string().required("Please Enter Company"),
            ordering_person: Yup.string().required("Please Enter Owner"),
            responsible_person: Yup.string().required("Please Enter Responsible Person"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const payload = {
                    project: [values.project],
                    category: values.category ? [values.category] : [0],
                    product_name: values.product_name,
                    satin_alinan_tarih: values.satin_alinan_tarih,
                    count: values.count,
                    price: values.price,
                    description: values.description,
                    account: values.account,
                    e_commerce_site: values.e_commerce_site,
                    company: values.company,
                    where_in_the_office: values.where_in_the_office,
                    responsible_person: Number(values.responsible_person),
                    ordering_person: [values.ordering_person],
                };
                await dispatch(addInventories(payload));
                resetForm();
            } catch (error) {
                console.error('Failed to add inventory:', error);
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
            >
                <div className="mb-3">
                    <Label htmlFor="product_name" className="form-label">Product Name</Label>
                    <Input
                        name="product_name"
                        className="form-control"
                        placeholder="Enter Product Name"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.product_name}
                        invalid={validation.touched.product_name && !!validation.errors.product_name}
                    />
                    {validation.touched.product_name && validation.errors.product_name && (
                        <FormFeedback type="invalid">{validation.errors.product_name}</FormFeedback>
                    )}
                </div>
                
                <div className="mb-3">
                    <Label htmlFor="ordering_person" className="form-label">Owner</Label>
                    <Input
                        name="ordering_person"
                        className="form-control"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.ordering_person}
                        invalid={validation.touched.ordering_person && !!validation.errors.ordering_person}
                    >
                        <option value="">Select Owner</option>
                        <option value="SenaNur">SenaNur</option>
                        <option value="NeslihanUcum">NeslihanUcum</option>
                        <option value="Norbit">Norbit</option>
                        <option value="SudenurCoban">SudenurCoban</option>
                    </Input>
                    {validation.touched.ordering_person && validation.errors.ordering_person && (
                        <FormFeedback type="invalid">{validation.errors.ordering_person}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="responsible_person" className="form-label">Responsible Person</Label>
                    <Input
                        name="responsible_person"
                        className="form-control"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.responsible_person}
                        invalid={validation.touched.responsible_person && !!validation.errors.responsible_person}
                    >
                        <option value="">Select Responsible Person</option>
                        <option value="SenaNur">SenaNur</option>
                        <option value="NeslihanUcum">NeslihanUcum</option>
                        <option value="Norbit">Norbit</option>
                        <option value="SudenurCoban">SudenurCoban</option>
                    </Input>
                    {validation.touched.responsible_person && validation.errors.responsible_person && (
                        <FormFeedback type="invalid">{validation.errors.responsible_person}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="project" className="form-label">Project Name</Label>
                    <Input
                        name="project"
                        className="form-control"
                        placeholder="Enter Project Name"
                        type="textarea"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.project}
                        invalid={validation.touched.project && !!validation.errors.project}
                    />
                    {validation.touched.project && validation.errors.project && (
                        <FormFeedback type="invalid">{validation.errors.project}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="price" className="form-label">Price</Label>
                    <Input
                        name="price"
                        className="form-control"
                        placeholder="Enter Price"
                        type="number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.price}
                        invalid={validation.touched.price && !!validation.errors.price}
                    />
                    {validation.touched.price && validation.errors.price && (
                        <FormFeedback type="invalid">{validation.errors.price}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="where_in_the_office" className="form-label">Where in the Office</Label>
                    <Input
                        name="where_in_the_office"
                        className="form-control"
                        placeholder="Enter Where in the Office"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.where_in_the_office}
                        invalid={validation.touched.where_in_the_office && !!validation.errors.where_in_the_office}
                    />
                    {validation.touched.where_in_the_office && validation.errors.where_in_the_office && (
                        <FormFeedback type="invalid">{validation.errors.where_in_the_office}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="account" className="form-label">Account</Label>
                    <Input
                        name="account"
                        className="form-control"
                        placeholder="Enter Account"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.account}
                        invalid={validation.touched.account && !!validation.errors.account}
                    />
                    {validation.touched.account && validation.errors.account && (
                        <FormFeedback type="invalid">{validation.errors.account}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="e_commerce_site" className="form-label">E-commerce Site</Label>
                    <Input
                        name="e_commerce_site"
                        className="form-control"
                        placeholder="Enter E-commerce Site"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.e_commerce_site}
                        invalid={validation.touched.e_commerce_site && !!validation.errors.e_commerce_site}
                    />
                    {validation.touched.e_commerce_site && validation.errors.e_commerce_site && (
                        <FormFeedback type="invalid">{validation.errors.e_commerce_site}</FormFeedback>
                    )}
                </div>
                
                <div className="mb-3">
                    <Label htmlFor="company" className="form-label">Company</Label>
                    <Input
                        name="company"
                        className="form-control"
                        placeholder="Enter Company"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.company}
                        invalid={validation.touched.company && !!validation.errors.company}
                    />
                    {validation.touched.company && validation.errors.company && (
                        <FormFeedback type="invalid">{validation.errors.company}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="category" className="form-label">Category</Label>
                    <Input
                        name="category"
                        className="form-control"
                        placeholder="Enter Category"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.category}
                    />
                </div>

                <div className="mb-3">
                    <Label htmlFor="description" className="form-label">Description</Label>
                    <Input
                        name="description"
                        className="form-control"
                        placeholder="Enter Description"
                        type="text"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.description}
                    />
                </div>

                <div className="mb-3">
                    <Label htmlFor="count" className="form-label">Count</Label>
                    <Input
                        name="count"
                        className="form-control"
                        placeholder="Enter Count"
                        type="number"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.count}
                    />
                </div>

                <Button type="submit" color="primary">Add Inventory</Button>
            </Form>
        </div>
    );
};

export default InventoriesAdd;
