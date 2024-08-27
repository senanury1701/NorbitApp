import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addCloud } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';
import { fetchEmployeeManangement, fetchDrive } from '../../slices/thunks';
import { useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';

interface CloudAddModalProps {
  toggleAdd: () => void;
  pageZero: () => void;
}

const CloudAddModal: React.FC<CloudAddModalProps> = ({ toggleAdd, pageZero }) => {
  const dispatch = useAppDispatch();
  const { employeeManangement, count: employeeManangementCount } = useSelector((state: any) => state.employeeManangement);
  const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
  const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { drive, count: driveCount } = useSelector((state: any) => state.drive);
  const [pageDrive, setPageDrive] = useState<number>(1);
  
  const maxPageEmployeeManangement = Math.ceil(employeeManangementCount / 5);
  const maxPageDrive = Math.ceil(driveCount / 5);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      driver: [],
      owner_id: '',
    },
    validationSchema: Yup.object({
      owner_id: Yup.string().required('Please select an owner'),
      driver: Yup.array().of(Yup.number()).notRequired(),
      name: Yup.string()
        .min(1, 'Cloud name must be at least 1 character')
        .max(50, 'Cloud name must be at most 50 characters')
        .required('Please enter your Cloud name'),
      description: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addCloud(values));
        resetForm();
        pageZero();
        toggleAdd();
      } catch (error) {
        console.error('Failed to add Cloud:', error);
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
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
        action="#"
      >
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
              validation.setFieldValue('owner_id', selectedOption ? selectedOption.value : '')
            }
            components={{ Menu }}
          />
          {validation.touched.owner_id && validation.errors.owner_id ? (
            <FormFeedback type="invalid">{validation.errors.owner_id}</FormFeedback>
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
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.name}
            invalid={validation.touched.name && !!validation.errors.name}
          />
          {validation.touched.name && validation.errors.name && (
            <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
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
            onChange={validation.handleChange}
            onBlur={validation.handleBlur}
            value={validation.values.description}
            invalid={validation.touched.description && !!validation.errors.description}
          />
          {validation.touched.description && validation.errors.description && (
            <FormFeedback type="invalid">{validation.errors.description}</FormFeedback>
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
            defaultOptions={drive.map((drive: any) => ({
              value: drive.id,
              label: drive.name,
            }))}
            onChange={(selectedOption: any) =>
              validation.setFieldValue('driver', selectedOption ? selectedOption.map((option: any) => option.value) : [])
            }
            isMulti
            components={{ Menu }}
          />
          {validation.touched.driver && validation.errors.driver ? (
            <FormFeedback type="invalid">{validation.errors.driver}</FormFeedback>
          ) : null}
        </div>

        <Button type="submit" color="primary">
          Add Cloud
        </Button>
      </Form>
    </div>
  );
};

export default CloudAddModal;
