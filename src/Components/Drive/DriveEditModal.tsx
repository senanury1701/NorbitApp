import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input, Label, Form, Button, FormFeedback } from 'reactstrap';
import AsyncSelect from 'react-select/async';
import { components } from 'react-select';
import { useAppDispatch } from '../hooks'; 
import { editDrive, fetchEmployeeManangement, fetchCloud } from '../../slices/thunks';
import { useSelector } from 'react-redux';

interface DriveEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const DriveEditModal: React.FC<DriveEditModalProps> = ({ rowData, toggleEdit }) => {
  const dispatch = useAppDispatch();
  const { employeeManangement } = useSelector((state: any) => state.employeeManangement);
  const { cloud } = useSelector((state: any) => state.cloud);
  const [pageEmployeeManangement, setPageEmployeeManangement] = useState<number>(1);
  const [searchInputEmployeeManangement, setSearchInputEmployeeManangement] = useState<string>('');
  const [pageCloud, setPageCloud] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const validationSchema = Yup.object({
    owner_id: Yup.string().required('Please select an owner'),
    cloud: Yup.string().notRequired(),
    name: Yup.string()
      .min(1, 'Drive name must be at least 1 character')
      .max(50, 'Drive name must be at most 50 characters')
      .required('Please enter your Drive name'),
    description: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: rowData.id,
      name: rowData.name || '',
      description: rowData.description || '',
      cloud: rowData.cloud || '',
      owner_id: rowData.owner_id || '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(editDrive(values)); 
        resetForm();
        toggleEdit(); 
      } catch (error) {
        console.error('Failed to edit Drive:', error);
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
  console.log(formik.errors);
  
  useEffect(() => {
    loadCloud(pageCloud);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCloud, dispatch]);

  const defaultEmployeeOption = employeeManangement.find((emp: any) => emp.id === formik.values.owner_id);
  const defaultCloudOption = cloud.find((cld: any) => cld.id === formik.values.cloud);


  const Menu = (props: any) => {
    let currentPage: any, maxPage: any, setPage: any;

    switch (props.selectProps.name) {
      case 'cloud':
        currentPage = pageCloud;
        maxPage = Math.ceil(cloud.length / 5);
        setPage = setPageCloud;
        break;
      case 'owner_id':
        currentPage = pageEmployeeManangement;
        maxPage = Math.ceil(employeeManangement.length / 5);
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
            value={defaultEmployeeOption ? { value: defaultEmployeeOption.id, label: defaultEmployeeOption.username } : null}
            />
          {formik.touched.owner_id && formik.errors.owner_id ? (
            <FormFeedback>{String(formik.errors.owner_id)}</FormFeedback>
          ) : null}
        </div>

        <div className="mb-3">
          <Label htmlFor="name" className="form-label">
            Drive Name
          </Label>
          <Input
            name="name"
            className="form-control"
            placeholder="Enter Drive name"
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
            placeholder="Enter Drive description"
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
          <Label className="form-label" htmlFor="cloud">
            Cloud
          </Label>
          <AsyncSelect
            id="cloud"
            name="cloud"
            cacheOptions
            defaultOptions={cloud.map((cld: any) => ({
              value: cld.id,
              label: cld.name,
            }))}
            onChange={(selectedOption: any) =>
              formik.setFieldValue('cloud', selectedOption ? selectedOption.value : '')
            }
            value={defaultCloudOption ? { value: defaultCloudOption.id, label: defaultCloudOption.name } : null}
            components={{ Menu }}
            
          />
          {formik.touched.cloud && formik.errors.cloud ? (
            <FormFeedback>{String(formik.errors.cloud)}</FormFeedback>
          ) : null}
        </div>

        <Button type="submit" color="primary" className="mt-3">
          Edit Drive
        </Button>
      </Form>
    </div>
  );
};

export default DriveEditModal;
