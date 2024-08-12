import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editJobs } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface InventoryEditModalProps {
    rowData: any;
    toggleEdit: () => void;
  }
  
const InventoryEditModal: React.FC<InventoryEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const data = rowData.rowData
  


  const validation = useFormik({
      enableReinitialize: true,
      initialValues: {
          username: data.username || '',
          id: data.id
      },
      validationSchema: Yup.object({
        username: Yup.string().required("Please Enter Your Jobs Name"),
      }),
      onSubmit: async (values, { resetForm }) => {
          try {
              await dispatch(editJobs(values));
              resetForm();
          } catch (error) {
              console.error('Failed to update Jobs:', error);
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
                  <Label htmlFor="name" className="form-label">Jobs Name</Label>
                  <Input
                      name="username"
                      className="form-control"
                      placeholder="Enter Jobs name"
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
              <Button type="submit" color="primary">Edit  Jobs</Button>
          </Form>
      </div>
  );
};

export default InventoryEditModal;
