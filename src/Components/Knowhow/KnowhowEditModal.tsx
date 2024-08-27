import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, Button, FormFeedback } from 'reactstrap';
import { useAppDispatch } from '../hooks'; 
import { editKnowhow } from '../../slices/thunks';

interface KnowhowEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const KnowhowEditModal: React.FC<KnowhowEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const props = rowData;

  const getFilePreview = (file: any) => {
    if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return typeof file === 'string' ? file : null; 
  };

  const [filePreviews, setFilePreviews] = useState({
    file_1: getFilePreview(props.file_1),
    file_2: getFilePreview(props.file_2),
    file_3: getFilePreview(props.file_3),
  });

  const validationSchema = Yup.object({
    problem: Yup.string()
      .min(1, 'Knowhow name must be at least 1 character')
      .max(50, 'Knowhow name must be at most 50 characters')
      .required('Please enter your Knowhow name'),
    solve_text: Yup.string()
      .required('Please enter the solve text'),
    file_1: Yup.mixed().notRequired(),
    file_2: Yup.mixed().notRequired()
      .test('fileSize', 'File size must be less than 2MB', (value) => {
        if (!value) return true; 
        const file = value as File; 
        return file.size <= 2 * 1024 * 1024; 
      }),
    file_3: Yup.mixed().notRequired()
      .test('fileSize', 'File size must be less than 2MB', (value) => {
        if (!value) return true; 
        const file = value as File; 
        return file.size <= 2 * 1024 * 1024; 
      }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: props.id, 
      problem: props.problem || '',
      solve_text: props.solve_text || '',
      file_1: props.file_1 || null,
      file_2: props.file_2 || null,
      file_3: props.file_3 || null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(editKnowhow(values)); 
        resetForm();
        toggleEdit(); 
      } catch (error) {
        console.error('Failed to edit knowhow:', error);
      }
    },
  });
  

  useEffect(() => {
    if (formik.values.file_1) {
      setFilePreviews(prev => ({
        ...prev,
        file_1: getFilePreview(formik.values.file_1),
      }));
    }
    if (formik.values.file_2) {
      setFilePreviews(prev => ({
        ...prev,
        file_2: getFilePreview(formik.values.file_2),
      }));
    }
    if (formik.values.file_3) {
      setFilePreviews(prev => ({
        ...prev,
        file_3: getFilePreview(formik.values.file_3),
      }));
    }
  }, [formik.values.file_1, formik.values.file_2, formik.values.file_3]);

  return (
    <div>
      <Form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <Label htmlFor="problem" className="form-label">Problem</Label>
          <Input
            name="problem"
            className="form-control"
            placeholder="Enter problem"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.problem}
            invalid={formik.touched.problem && !!formik.errors.problem}
          />
          {formik.touched.problem && formik.errors.problem && (
            <FormFeedback>{String(formik.errors.problem)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="solve_text" className="form-label">Solution Description</Label>
          <Input
            name="solve_text"
            className="form-control"
            placeholder="Enter solution description"
            type="textarea"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.solve_text}
            invalid={formik.touched.solve_text && !!formik.errors.solve_text}
          />
          {formik.touched.solve_text && formik.errors.solve_text && (
            <FormFeedback>{String(formik.errors.solve_text)}</FormFeedback>
          )}
        </div>

        {/* File 1 */}
        <div className="mb-3">
          <Label htmlFor="file_1" className="form-label">File 1</Label>
          <Input
            name="file_1"
            className="form-control"
            type="file"
            onChange={(event) => formik.setFieldValue("file_1", event.currentTarget.files?.[0])}
            onBlur={formik.handleBlur}
            invalid={formik.touched.file_1 && !!formik.errors.file_1}
          />
          {formik.touched.file_1 && formik.errors.file_1 && (
            <FormFeedback>{String(formik.errors.file_1)}</FormFeedback>
          )}
          {/* Dosya önizleme */}
          {filePreviews.file_1 && (
            <div className="mt-2">
              <img src={filePreviews.file_1} alt="File 1 Preview" style={{ maxHeight: '100px', maxWidth: '100px' }} />
            </div>
          )}
        </div>

        {/* File 2 */}
        <div className="mb-3">
          <Label htmlFor="file_2" className="form-label">File 2</Label>
          <Input
            name="file_2"
            className="form-control"
            type="file"
            onChange={(event) => formik.setFieldValue("file_2", event.currentTarget.files?.[0])}
            onBlur={formik.handleBlur}
            invalid={formik.touched.file_2 && !!formik.errors.file_2}
          />
          {formik.touched.file_2 && formik.errors.file_2 && (
            <FormFeedback>{String(formik.errors.file_2)}</FormFeedback>
          )}
          {/* Dosya önizleme */}
          {filePreviews.file_2 && (
            <div className="mt-2">
              <img src={filePreviews.file_2} alt="File 2 Preview" style={{ maxHeight: '100px', maxWidth: '100px' }} />
            </div>
          )}
        </div>

        {/* File 3 */}
        <div className="mb-3">
          <Label htmlFor="file_3" className="form-label">File 3</Label>
          <Input
            name="file_3"
            className="form-control"
            type="file"
            onChange={(event) => formik.setFieldValue("file_3", event.currentTarget.files?.[0])}
            onBlur={formik.handleBlur}
            invalid={formik.touched.file_3 && !!formik.errors.file_3}
          />
          {formik.touched.file_3 && formik.errors.file_3 && (
            <FormFeedback>{String(formik.errors.file_3)}</FormFeedback>
          )}
          {/* Dosya önizleme */}
          {filePreviews.file_3 && (
            <div className="mt-2">
              <img src={filePreviews.file_3} alt="File 3 Preview" style={{ maxHeight: '100px', maxWidth: '100px' }} />
            </div>
          )}
        </div>

        <Button type="submit" color="primary" className="mt-3">
          Edit Knowhow
        </Button>
      </Form>
    </div>
  );
};

export default KnowhowEditModal;
