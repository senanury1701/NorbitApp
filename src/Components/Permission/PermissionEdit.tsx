import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editPermission } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface PermissonEditModalProps {
    rowData: any;
    toggleEdit: () => void;
  }
  
const PermissonEditModal: React.FC<PermissonEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData

  


  const validation = useFormik({
      enableReinitialize: true,
      initialValues: {
        username: props.username || '',
          id: props.id
      },
      validationSchema: Yup.object({
          username: Yup.string().required("Please Enter Your Permisson Name"),
      }),
      onSubmit: async (values, { resetForm }) => {
          try {
              await dispatch(editPermission(values));
                resetForm();
                toggleEdit();
          } catch (error) {
              console.error('Failed to update Permisson:', error);
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
                  <Label htmlFor="username" className="form-label">Permisson Name</Label>
                  <Input
                      name="username"
                      className="form-control"
                      placeholder="Enter Permisson name"
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

export default PermissonEditModal;
