import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, Button, FormFeedback } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { useAppDispatch } from '../hooks'; 
import { editCloud, fetchEmployeeManangement, fetchDrive } from '../../slices/thunks';
import { useSelector } from 'react-redux';

interface CloudEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const CloudEditModal: React.FC<CloudEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const { employeeManangement } = useSelector((state: any) => state.employeeManangement);
  const { drive } = useSelector((state: any) => state.drive);
  
  const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
  const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
  const [pageDrive, setPageDrive] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const validationSchema = Yup.object({
    owner_id: Yup.string().required('Please select an owner'),
    driver: Yup.array().of(Yup.string()).notRequired(),
    name: Yup.string()
      .min(1, 'Cloud name must be at least 1 character')
      .max(50, 'Cloud name must be at most 50 characters')
      .required('Please enter your Cloud name'),
    description: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: rowData.id,
      name: rowData.name || '',
      description: rowData.description || '',
      driver: rowData.driver || [],
      owner_id: rowData.owner_id || '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(editCloud(values)); 
        resetForm();
        toggleEdit(); 
      } catch (error) {
        console.error('Failed to edit Cloud:', error);
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
    let currentPage: any, maxPage: any, setPage: any;

    switch (props.selectProps.name) {
      case 'driver':
        currentPage = pageDrive;
        maxPage = Math.ceil(drive.length / 5); // Adjust this according to your data
        setPage = setPageDrive;
        break;
      case 'owner_id':
        currentPage = pageEmployeeManangement;
        maxPage = Math.ceil(employeeManangement.length / 5); // Adjust this according to your data
        setPage = setPageEmployeeManangement;
        break;
      default:
        break;
    }

    return (
      <components.Menu {...props}>
        {currentPage > 1 && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => setPage((prevPage: number) => Math.max(prevPage - 1, 1))}
          >
            ▲ Previous Page
          </div>
        )}
        {props.children}
        {currentPage < maxPage && (
          <div
            style={{ cursor: 'pointer', padding: '8px', textAlign: 'center' }}
            onClick={() => setPage((prevPage: number) => Math.min(prevPage + 1, maxPage))}
          >
            ▼ Next Page
          </div>
        )}
      </components.Menu>
    );
  };

  return (
    <div>
      <Form onSubmit={formik.handleSubmit}>
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
            value={employeeManangement.find((ems: any) => ems.id === formik.values.owner_id) || null}
            components={{ Menu }}
          />
          {formik.touched.owner_id && formik.errors.owner_id ? (
            <FormFeedback>{String(formik.errors.owner_id)}</FormFeedback>
          ) : null}
        </div>

        <div className="mb-3">
          <Label htmlFor="name" className="form-label">
            Cloud Name
          </Label>
          <Input
            name="name"
            className="form-control"
            placeholder="Enter Cloud name"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            invalid={formik.touched.name && !!formik.errors.name}
          />
          {formik.touched.name && formik.errors.name && (
            <FormFeedback>{String(formik.errors.name)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="description" className="form-label">
            Description
          </Label>
          <Input
            name="description"
            className="form-control"
            placeholder="Enter Cloud description"
            type="textarea"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            invalid={formik.touched.description && !!formik.errors.description}
          />
          {formik.touched.description && formik.errors.description && (
            <FormFeedback>{String(formik.errors.description)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label className="form-label" htmlFor="driver">
            Driver
          </Label>
          <AsyncSelect
            id="driver"
            name="driver"
            cacheOptions
            defaultOptions={drive.map((drv: any) => ({
              value: drv.id,
              label: drv.name,
            }))}
            onChange={(selectedOption: any) =>
              formik.setFieldValue('driver', selectedOption ? selectedOption.map((option: any) => option.value) : [])
            }
            value={drive.filter((drv: any) => formik.values.driver.includes(drv.id)).map((drv: any) => ({
              value: drv.id,
              label: drv.name,
            }))}
            isMulti
            components={{ Menu }}
          />
          {formik.touched.driver && formik.errors.driver ? (
            <FormFeedback>{String(formik.errors.driver)}</FormFeedback>
          ) : null}
        </div>

        <Button type="submit" color="primary" className="mt-3">
          Edit Cloud
        </Button>
      </Form>
    </div>
  );
};

export default CloudEditModal;
