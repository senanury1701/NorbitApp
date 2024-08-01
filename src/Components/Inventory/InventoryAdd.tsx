import React, {useEffect} from 'react';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addInventories,fetchCompanies, fetchCategory,fetchEmployeeManangement  } from '../../slices/thunks';
import { useAppDispatch  } from '../hooks';
import { useSelector } from 'react-redux';

const InventoriesAdd = () => {
    const dispatch = useAppDispatch();
    const { companies } = useSelector((state:any) => state.company);
    const { categories } = useSelector((state:any) => state.category)
    const { employeeManangement } = useSelector((state:any) => state.employeeManangement)
    useEffect(() => {
        dispatch(fetchCompanies());
        dispatch(fetchCategory());
        dispatch(fetchEmployeeManangement());
    }, [dispatch]);
    
    const validation = useFormik({
        initialValues: {
            project: [],
            category: [],
            product_name: '',
            satin_alinan_tarih: new Date().toISOString(),
            count: '',
            price: '',
            description: '',
            account: '',
            e_commerce_site: '',
            company: '',
            where_in_the_office: '',
            responsible_person: '',
            ordering_person: [],
        },
        validationSchema: Yup.object({
            product_name: Yup.string().required("Please Enter Product Name"),
            project: Yup.array().of(Yup.number()).required("Please Enter Project Name"),
            price: Yup.number().required("Please Enter Price"),
            where_in_the_office: Yup.string().required("Please Enter Where in the Office"),
            account: Yup.string().required("Please Enter Account"),
            e_commerce_site: Yup.string().url('Enter a valid URL').required("Please Enter E-commerce Site"),
            company: Yup.string().required("Please Enter Company"),
            ordering_person: Yup.array().of(Yup.number()).required("Please Enter Owner"),
            responsible_person: Yup.number().required("Please Enter Responsible Person"),
            category: Yup.array().of(Yup.number()).required("Please Enter Category"),
            description: Yup.string().required("Please Enter Description"),
            count: Yup.number().required("Please Enter Count"),
        }),
        onSubmit: async (values, { resetForm }) => {
            console.log(values);
            dispatch(addInventories(values));
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
                        value={validation.values.product_name || ''}
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
                        onChange={e => validation.setFieldValue('ordering_person', [parseInt(e.target.value)])}
                        onBlur={validation.handleBlur}
                        value={validation.values.ordering_person[0] || ''}
                        invalid={validation.touched.ordering_person && !!validation.errors.ordering_person}
                    >
                        <option  value="">Select a Owner</option>
                        {employeeManangement.map((employeeManangement:any) => (
                            <option key={employeeManangement.id} value={employeeManangement.id}>{employeeManangement.username}</option>
                        ))}
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
                        onChange={e => validation.setFieldValue('responsible_person', parseInt(e.target.value))}
                        onBlur={validation.handleBlur}
                        value={validation.values.responsible_person || ''}
                        invalid={validation.touched.responsible_person && !!validation.errors.responsible_person}
                    >
                        <option  value="">Select a Responsible Person</option>
                        {employeeManangement.map((employeeManangement:any) => (
                            <option key={employeeManangement.id} value={employeeManangement.id}>{employeeManangement.username}</option>
                        ))}
                    </Input>
                    {validation.touched.responsible_person && validation.errors.responsible_person && (
                        <FormFeedback type="invalid">{validation.errors.responsible_person}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="project" className="form-label">project</Label>
                    <Input
                        name="project"
                        className="form-control"
                        type="select"
                        onChange={e => validation.setFieldValue('project', [parseInt(e.target.value)])}
                        onBlur={validation.handleBlur}
                        value={validation.values.project[0] || ''}
                        invalid={validation.touched.project && !!validation.errors.project}
                    >
                        <option >---------</option>
                        <option value="1">sec2</option>
                    </Input>
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
                        value={validation.values.price || ''}
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
                        value={validation.values.where_in_the_office || ''}
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
                        value={validation.values.account || ''}
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
                        value={validation.values.e_commerce_site || ''}
                        invalid={validation.touched.e_commerce_site && !!validation.errors.e_commerce_site}
                    />
                    {validation.touched.e_commerce_site && validation.errors.e_commerce_site && (
                        <FormFeedback type="invalid">{validation.errors.e_commerce_site}</FormFeedback>
                    )}
                </div>

                <div className="mb-3">
                    <Label htmlFor="company" className="form-label">Company Name</Label>
                    <Input
                        id="company"
                        name="company"
                        type="select"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.company || ""}
                        invalid={validation.touched.company && !!validation.errors.company}
                    >
                        <option  value="">Select a company</option>
                        {companies.map((company:any) => (
                            <option key={company.id} value={company.id}>{company.company_name}</option>
                        ))}
                    </Input>
                    {validation.touched.company && validation.errors.company && (
                        <FormFeedback type="invalid">{validation.errors.company}</FormFeedback>
                    )}
                </div>


                <div className="mb-3">
                    <Label htmlFor="category" className="form-label">category Name</Label>
                    <Input
                        id="category"
                        name="category"
                        type="select"
                        className="form-control"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.category || ""}
                        invalid={validation.touched.category && !!validation.errors.category}
                    >
                        <option  value="">Select a category</option>
                        {categories.map((category:any) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </Input>
                    {validation.touched.category && validation.errors.category && (
                        <FormFeedback type="invalid">{validation.errors.category}</FormFeedback>
                    )}
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
                        value={validation.values.description || ''}
                        invalid={validation.touched.description && !!validation.errors.description}
                    />
                    {validation.touched.description && validation.errors.description && (
                        <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
                    )}
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
                        value={validation.values.count || ''}
                        invalid={validation.touched.count && !!validation.errors.count}
                    />
                    {validation.touched.count && validation.errors.count && (
                        <FormFeedback type="invalid">{validation.errors.count}</FormFeedback>
                    )}
                </div>

                <Button type="submit" color="primary">Add Inventory</Button>
            </Form>
        </div>
    );
};

export default InventoriesAdd;
