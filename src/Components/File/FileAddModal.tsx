import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addFile, fetchEmployeeManangement, fetchDrive } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { useSelector } from 'react-redux';

interface FileAddModalProps {
  toggleAdd: () => void;
  pageZero: () => void;
}

const FileAddModal: React.FC<FileAddModalProps> = ({ toggleAdd, pageZero }) => {
  const dispatch = useAppDispatch();
  const { employeeManangement, count: employeeManangementCount } = useSelector((state: any) => state.employeeManangement);
  const { drive, count: driveCount } = useSelector((state: any) => state.drive);

  const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
  const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
  const [pageDrive, setPageDrive] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const maxPageEmployeeManangement = Math.ceil(employeeManangementCount / 5);
  const maxPageDrive = Math.ceil(driveCount / 5);

  const validationSchema = Yup.object({
    owner_id: Yup.string().required('Please select an owner'),
    drive: Yup.string(),
    name: Yup.string()
      .min(1, 'File name must be at least 1 character')
      .max(50, 'File name must be at most 50 characters')
      .required('Please enter your File name'),
    file: Yup.mixed().notRequired()
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files) {
      formik.setFieldValue(field, event.currentTarget.files[0]);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      drive: '',
      owner_id: '',
      file: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('owner_id', values.owner_id);
      formData.append('drive', values.drive);

      if (values.file) {
        formData.append('file', values.file);
      }
      console.log(formData);
      
      try {
        await dispatch(addFile(formData));
        resetForm();
        pageZero();
        toggleAdd();
      } catch (error) {
        console.error('Failed to add File:', error);
      }
    },
  });

  const handleEmployeeManangementSearchChange = async (inputValue: string) => {
    setSearchInputEmployeeManangement(inputValue);
    setPageEmployeeManangement(1);
    const fetchedEmployeeManangement = await dispatch(fetchEmployeeManangement(1, inputValue));
    return fetchedEmployeeManangement.map((ems: any) => ({
      value: ems.id,
      label: ems.username,
    }));
  };

  const loadEmployeeManangement = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchEmployeeManangement(page, searchInputEmployeeManangement));
    setIsFetching(false);
  };

  useEffect(() => {
    loadEmployeeManangement(pageEmployeeManangement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageEmployeeManangement, searchInputEmployeeManangement, dispatch]);

  const loadDrive = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchDrive(page));
    setIsFetching(false);
  };

  useEffect(() => {
    loadDrive(pageDrive);    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageDrive, dispatch]);


  const Menu = (props: any) => {
    let currentPage: number, maxPage: number, setPage: React.Dispatch<React.SetStateAction<number>>;

    switch (props.selectProps.name) {
      case 'drive':
        currentPage = pageDrive;
        maxPage = maxPageDrive;
        setPage = setPageDrive;
        break;
      case 'owner_id':
        currentPage = pageEmployeeManangement;
        maxPage = maxPageEmployeeManangement;
        setPage = setPageEmployeeManangement;
        break;
      default:
        return <components.Menu {...props} />;
    }

    return (
      <components.Menu {...props}>
        {currentPage > 1 && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
          >
            ▲ Previous Page
          </div>
        )}
        {props.children}
        {currentPage < maxPage && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => setPage(prevPage => Math.min(prevPage + 1, maxPage))}
          >
            ▼ Next Page
          </div>
        )}
      </components.Menu>
    );
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
        encType="multipart/form-data"
      >
        <div className="mb-3">
          <Label htmlFor="name" className="form-label">
            File Name
          </Label>
          <Input
            name="name"
            className="form-control"
            placeholder="Enter File name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            invalid={formik.touched.name && !!formik.errors.name}
          />
          {formik.touched.name && formik.errors.name && (
            <FormFeedback type="invalid">{formik.errors.name}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="owner_id">
            Owner Name
          </Label>
          <AsyncSelect
            id="owner_id"
            name="owner_id"
            cacheOptions
            loadOptions={handleEmployeeManangementSearchChange}
            defaultOptions={employeeManangement.map((ems: any) => ({
              value: ems.id,
              label: ems.username,
            }))}
            onChange={(selectedOption: any) =>
              formik.setFieldValue('owner_id', selectedOption ? selectedOption.value : '')
            }
            components={{ Menu }}
          />
          {formik.touched.owner_id && formik.errors.owner_id ? (
            <FormFeedback type="invalid">{formik.errors.owner_id}</FormFeedback>
          ) : null}
        </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="drive">
            Drive
          </Label>
          <AsyncSelect
            id="drive"
            name="drive"
            cacheOptions
            defaultOptions={drive.map((drive: any) => ({
              value: drive.id,
              label: drive.name,
            }))}
            onChange={(selectedOption: any) =>
              formik.setFieldValue('drive', selectedOption ? selectedOption.value : '')
            }
            
            components={{ Menu }}
          />
          {formik.touched.drive && formik.errors.drive ? (
            <FormFeedback type="invalid">{formik.errors.drive}</FormFeedback>
          ) : null}
        </div>

        <div className="mb-3">
          <Label htmlFor="file" className="form-label">
            File 
          </Label>
          <Input
            name="file"
            type="file"
            onChange={(e) => handleFileChange(e, 'file')}
            invalid={formik.touched.file && !!formik.errors.file}
          />
          {formik.touched.file && formik.errors.file && (
            <FormFeedback type="invalid">{formik.errors.file}</FormFeedback>
          )}
        </div>

        <Button type="submit" color="primary">
          Add File
        </Button>
      </Form>
    </div>
  );
};

export default FileAddModal;
