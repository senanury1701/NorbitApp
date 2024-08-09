import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { editJobs } from '../../slices/thunks';
import { useAppDispatch } from '../hooks'; 

interface JobsEditModalProps {
    rowData: any;
    toggleEdit: () => void;
  }

const JobsEdit: React.FC<JobsEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData
  


  const validation = useFormik({
      enableReinitialize: true,
      initialValues: {
          job_title: props.job_title || '',
          id: props.id
      },
      validationSchema: Yup.object({
        job_title: Yup.string().required("Please Enter Your Jobs Name"),
      }),
      onSubmit: async (values, { resetForm }) => {
          try {
              await dispatch(editJobs(values));
              resetForm();
              toggleEdit();

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
                      name="job_title"
                      className="form-control"
                      placeholder="Enter Jobs name"
                      type="text"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.job_title }
                      invalid={validation.touched.job_title && !!validation.errors.job_title}
                  />
                  {validation.touched.job_title && validation.errors.job_title && (
                    <FormFeedback>
                      {typeof validation.errors.job_title === 'object'
                        ? Object.values(validation.errors.job_title).join(', ')
                        : validation.errors.job_title}
                    </FormFeedback>
                  )}   
              </div>
              <Button type="submit" color="primary">Edit  Jobs</Button>
          </Form>
      </div>
  );
};

export default JobsEdit;
