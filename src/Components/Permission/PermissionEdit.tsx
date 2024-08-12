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
          Permisson_name: props.Permisson_name || '',
          id: props.id
      },
      validationSchema: Yup.object({
          Permisson_name: Yup.string().required("Please Enter Your Permisson Name"),
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
                  <Label htmlFor="Permisson_name" className="form-label">Permisson Name</Label>
                  <Input
                      name="Permisson_name"
                      className="form-control"
                      placeholder="Enter Permisson name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.Permisson_name }
                      invalid={validation.touched.Permisson_name && !!validation.errors.Permisson_name}
                  />
                  {validation.touched.Permisson_name && validation.errors.Permisson_name && (
                    <FormFeedback>
                      {typeof validation.errors.Permisson_name === 'object'
                        ? Object.values(validation.errors.Permisson_name).join(', ')
                        : validation.errors.Permisson_name}
                    </FormFeedback>
                  )}   
              </div>
              <Button  type="submit" color="primary">Edit  Compony</Button>
          </Form>
      </div>
  );
};

export default PermissonEditModal;
