import React, {  } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addKnowhow } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';
interface KnowhowAddModalProps {
  toggleAdd: () => void;
  pageZero: () => void;
}

const KnowhowAddModal: React.FC<KnowhowAddModalProps> = ({ toggleAdd, pageZero }) => {
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    problem: Yup.string()
      .min(1, 'Knowhow name must be at least 1 character')
      .max(50, 'Knowhow name must be at most 50 characters')
      .required('Please enter your Knowhow name'),
    solve_text: Yup.string()
      .required('Please enter the solve text'),
    file_1: Yup.mixed().notRequired()
      .test('fileSize', 'File size must be less than 2MB', (value) => {
        if (!value) return true; // File is optional
        const file = value as File; // Cast to File type
        return file.size <= 2 * 1024 * 1024; // 2MB size limit
      }),
    file_2: Yup.mixed().notRequired()
      .test('fileSize', 'File size must be less than 2MB', (value) => {
        if (!value) return true; // File is optional
        const file = value as File; // Cast to File type
        return file.size <= 2 * 1024 * 1024; // 2MB size limit
      }),
    file_3: Yup.mixed().notRequired()
      .test('fileSize', 'File size must be less than 2MB', (value) => {
        if (!value) return true; // File is optional
        const file = value as File; // Cast to File type
        return file.size <= 2 * 1024 * 1024; // 2MB size limit
      }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      problem: '',
      solve_text: '',
      file_1: null,
      file_2: null,
      file_3: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('problem', values.problem);
      formData.append('solve_text', values.solve_text);
      if (values.file_1) formData.append('file_1', values.file_1);
      if (values.file_2) formData.append('file_2', values.file_2);
      if (values.file_3) formData.append('file_3', values.file_3);

      try {
        await dispatch(addKnowhow(formData));
        resetForm();
        pageZero();
        toggleAdd();
      } catch (error) {
        console.error('Failed to add Knowhow:', error);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files) {
      formik.setFieldValue(field, event.currentTarget.files[0]);
    }
  };

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
          return false;
        }}
        action="#"
      >
        <div className="mb-3">
          <Label htmlFor="problem" className="form-label">
            Knowhow Name
          </Label>
          <Input
            name="problem"
            className="form-control"
            placeholder="Enter Knowhow name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.problem}
            invalid={formik.touched.problem && !!formik.errors.problem}
          />
          {formik.touched.problem && formik.errors.problem && (
            <FormFeedback type="invalid">{formik.errors.problem}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="solve_text" className="form-label">
            Solve Text
          </Label>
          <Input
            name="solve_text"
            className="form-control"
            placeholder="Enter Knowhow solve text"
            type="textarea"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.solve_text}
            invalid={formik.touched.solve_text && !!formik.errors.solve_text}
          />
          {formik.touched.solve_text && formik.errors.solve_text && (
            <FormFeedback type="invalid">{formik.errors.solve_text}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="file_1" className="form-label">
            File 1 (Optional)
          </Label>
          <Input
            name="file_1"
            type="file"
            onChange={(e) => handleFileChange(e, 'file_1')}
            invalid={formik.touched.file_1 && !!formik.errors.file_1}
          />
          {formik.touched.file_1 && formik.errors.file_1 && (
            <FormFeedback type="invalid">{formik.errors.file_1}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="file_2" className="form-label">
            File 2 (Optional)
          </Label>
          <Input
            name="file_2"
            type="file"
            onChange={(e) => handleFileChange(e, 'file_2')}
            invalid={formik.touched.file_2 && !!formik.errors.file_2}
          />
          {formik.touched.file_2 && formik.errors.file_2 && (
            <FormFeedback type="invalid">{formik.errors.file_2}</FormFeedback>
          )}
        </div>
        <div className="mb-3">
          <Label htmlFor="file_3" className="form-label">
            File 3 (Optional)
          </Label>
          <Input
            name="file_3"
            type="file"
            onChange={(e) => handleFileChange(e, 'file_3')}
            invalid={formik.touched.file_3 && !!formik.errors.file_3}
          />
          {formik.touched.file_3 && formik.errors.file_3 && (
            <FormFeedback type="invalid">{formik.errors.file_3}</FormFeedback>
          )}
        </div>
        <Button type="submit" color="primary">
          Add Knowhow
        </Button>
      </Form>
    </div>
  );
};

export default KnowhowAddModal;
