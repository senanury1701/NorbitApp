import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editCategory } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

const CategoryEdit = (rowData:any) => {
  const dispatch = useAppDispatch();
  const props = rowData.rowData
  


  const validation = useFormik({
      enableReinitialize: true,
      initialValues: {
          name: props.name || '',
          id: props.id
      },
      validationSchema: Yup.object({
        name: Yup.string().required("Please Enter Your category Name"),
      }),
      onSubmit: async (values, { resetForm }) => {
          try {
              await dispatch(editCategory(values));
              resetForm();
          } catch (error) {
              console.error('Failed to update category:', error);
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
                      value={validation.values.name }
                      invalid={validation.touched.name && !!validation.errors.name}
                  />
                  {validation.touched.name && validation.errors.name && (
                    <FormFeedback>
                      {typeof validation.errors.name === 'object'
                        ? Object.values(validation.errors.name).join(', ')
                        : validation.errors.name}
                    </FormFeedback>
                  )}   
              </div>
              <Button type="submit" color="primary">Edit  Category</Button>
          </Form>
      </div>
  );
};

export default CategoryEdit;
