import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, FormFeedback, Button } from 'reactstrap';
import { addDrive, fetchCloud, fetchEmployeeManangement } from '../../slices/thunks';
import { useAppDispatch } from '../hooks';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { useSelector } from 'react-redux';


interface DriveAddModalProps {
  toggleAdd: () => void;
  pageZero: () => void;
}

const DriveAddModal: React.FC<DriveAddModalProps> = ({ toggleAdd, pageZero }) => {
  const dispatch = useAppDispatch();
  const { employeeManangement, count: employeeManangementCount } = useSelector((state: any) => state.employeeManangement);
  const { cloud, count: cloudCount } = useSelector((state: any) => state.cloud);
  
  const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
  const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
  const [pageCloud, setPageCloud] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const maxPageEmployeeManangement = Math.ceil(employeeManangementCount / 5);
  const maxPageCloud = Math.ceil(cloudCount / 5);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      description: '',
      cloud: [],
      owner_id: '',
    },
    validationSchema: Yup.object({
      owner_id: Yup.string().required('Please select an owner'),
      cloud: Yup.string().min(1, 'Please select at least one cloud'),
      name: Yup.string()
        .min(1, 'dRIVE name must be at least 1 character')
        .max(50, 'dRIVE name must be at most 50 characters')
        .required('Please enter your dRIVE name'),
      description: Yup.string(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(addDrive(values));
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

  const loadCloud = async (page: number) => {
    if (isFetching) return;
    setIsFetching(true);
    await dispatch(fetchCloud(page));
    setIsFetching(false);
  };

  useEffect(() => {
    loadCloud(pageCloud);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCloud, dispatch]);

  const Menu = (props: any) => {
    let currentPage: number, maxPage: number, setPage: React.Dispatch<React.SetStateAction<number>>;

    switch (props.selectProps.name) {
      case 'cloud':
        currentPage = pageCloud;
        maxPage = maxPageCloud;
        setPage = setPageCloud;
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
            Drive Name
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
          <Label className="form-label" htmlFor="cloud">
            Cloud
          </Label>
          <AsyncSelect
            id="cloud"
            name="cloud"
            cacheOptions
            defaultOptions={cloud.map((drive: any) => ({
              value: drive.id,
              label: drive.name,
            }))}
            onChange={(selectedOption: any) =>
              validation.setFieldValue('cloud', selectedOption ? selectedOption.value : '')
            }
            components={{ Menu }}
          />
          {validation.touched.cloud && validation.errors.cloud ? (
            <FormFeedback type="invalid">{validation.errors.cloud}</FormFeedback>
          ) : null}
        </div>

        <Button type="submit" color="primary">
          Add Drive
        </Button>
      </Form>
    </div>
  );
};

export default DriveAddModal;
