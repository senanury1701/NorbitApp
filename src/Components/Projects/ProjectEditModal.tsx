import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editCompany } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface ProjectEditModalProps {
    rowData: any;
    toggleEdit: () => void;
  }
  
  const ProjectEditModal: React.FC<ProjectEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData

  


  const validation = useFormik({
      enableReinitialize: true,
      initialValues: {
          company_name: props.company_name || '',
          id: props.id
      },
      validationSchema: Yup.object({
          company_name: Yup.string().required("Please Enter Your Company Name"),
      }),
      onSubmit: async (values, { resetForm }) => {
          try {
              await dispatch(editCompany(values));
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
                  <Label htmlFor="company_name" className="form-label">Company Name</Label>
                  <Input
                      name="company_name"
                      className="form-control"
                      placeholder="Enter company name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.company_name }
                      invalid={validation.touched.company_name && !!validation.errors.company_name}
                  />
                  {validation.touched.company_name && validation.errors.company_name && (
                    <FormFeedback>
                      {typeof validation.errors.company_name === 'object'
                        ? Object.values(validation.errors.company_name).join(', ')
                        : validation.errors.company_name}
                    </FormFeedback>
                  )}   
              </div>
              <Button  type="submit" color="primary">Edit  Compony</Button>
          </Form>
      </div>
  );
};

export default ProjectEditModal;
