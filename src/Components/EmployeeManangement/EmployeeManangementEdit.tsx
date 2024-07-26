import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editEmployeeManangement } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface EmployeeManangementEditModalProps {
    rowData: any;
    toggleEdit: () => void;
  }
  
  const EmployeeManangementEditModal: React.FC<EmployeeManangementEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData

  


  const validation = useFormik({
      enableReinitialize: true,
      initialValues: {
          username: props.username || '',
          id: props.id
      },
      validationSchema: Yup.object({
          username: Yup.string().required("Please Enter Your EmployeeManangement Name"),
      }),
      onSubmit: async (values, { resetForm }) => {
          try {
              await dispatch(editEmployeeManangement(values));
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
              <div className="mb-3">
                  <Label htmlFor="username" className="form-label">EmployeeManangement Name</Label>
                  <Input
                      name="username"
                      className="form-control"
                      placeholder="Enter EmployeeManangement name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.username }
                      invalid={validation.touched.username && !!validation.errors.username}
                  />
                  {validation.touched.username && validation.errors.username && (
                    <FormFeedback>
                      {typeof validation.errors.username === 'object'
                        ? Object.values(validation.errors.username).join(', ')
                        : validation.errors.username}
                    </FormFeedback>
                  )}   
              </div>
              <Button  type="submit" color="primary">Edit  Compony</Button>
          </Form>
      </div>
  );
};

export default EmployeeManangementEditModal;
