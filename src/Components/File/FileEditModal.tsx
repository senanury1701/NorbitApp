import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input, Label, Form, Button, FormFeedback } from "reactstrap";
import { useAppDispatch } from "../hooks";
import { editFile, fetchEmployeeManangement, fetchDrive } from "../../slices/thunks";
import AsyncSelect from "react-select/async";
import { components } from "react-select";
import { useSelector } from "react-redux";

interface FileEditModalProps {
  rowData: any;
  toggleEdit: () => void;
}

const FileEditModal: React.FC<FileEditModalProps> = ({ rowData, toggleEdit }) => {
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
    name: Yup.string()
      .min(1, "File name must be at least 1 character")
      .max(50, "File name must be at most 50 characters")
      .required("Please enter your File name"),
    owner_id: Yup.string().required("Please select an owner"),
    drive: Yup.string(),
    file: Yup.mixed().notRequired(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: rowData.name || "",
      drive: rowData.drive || "",
      owner_id: rowData.owner_id || "",
      file: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("owner_id", values.owner_id);
      formData.append("drive", values.drive);

      if (values.file) {
        formData.append("file", values.file);
      }

      try {
        await dispatch(editFile({ ...values, id: rowData.id }));
        resetForm();
        toggleEdit();
      } catch (error) {
        console.error("Failed to edit File:", error);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.currentTarget.files) {
      formik.setFieldValue(field, event.currentTarget.files[0]);
    }
  };

  const Menu = (props: any) => {
    let currentPage: number, maxPage: number, setPage: React.Dispatch<React.SetStateAction<number>>;

    switch (props.selectProps.name) {
      case "drive":
        currentPage = pageDrive;
        maxPage = maxPageDrive;
        setPage = setPageDrive;
        break;
      case "owner_id":
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
            style={{ cursor: "pointer", padding: "8px", textAlign: "center" }}
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          >
            ▲ Previous Page
          </div>
        )}
        {props.children}
        {currentPage < maxPage && (
          <div
            style={{ cursor: "pointer", padding: "8px", textAlign: "center" }}
            onClick={() => setPage((prevPage) => Math.min(prevPage + 1, maxPage))}
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
          <Label htmlFor="name" className="form-label">File Name</Label>
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
            <FormFeedback>{String(formik.errors.name)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="owner_id" className="form-label">Owner Name</Label>
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
              formik.setFieldValue("owner_id", selectedOption ? selectedOption.value : "")
            }
            components={{ Menu }}
          />
          {formik.touched.owner_id && formik.errors.owner_id && (
            <FormFeedback>{String(formik.errors.owner_id)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="drive" className="form-label">Drive</Label>
          <AsyncSelect
            id="drive"
            name="drive"
            cacheOptions
            defaultOptions={drive.map((drv: any) => ({
              value: drv.id,
              label: drv.name,
            }))}
            onChange={(selectedOption: any) =>
              formik.setFieldValue("drive", selectedOption ? selectedOption.value : "")
            }
            components={{ Menu }}
          />
          {formik.touched.drive && formik.errors.drive && (
            <FormFeedback>{String(formik.errors.drive)}</FormFeedback>
          )}
        </div>

        <div className="mb-3">
          <Label htmlFor="file" className="form-label">File</Label>
          <Input
            name="file"
            type="file"
            onChange={(e) => handleFileChange(e, "file")}
            invalid={formik.touched.file && !!formik.errors.file}
          />
          {formik.touched.file && formik.errors.file && (
            <FormFeedback>{String(formik.errors.file)}</FormFeedback>
          )}
        </div>

        <Button type="submit" color="primary" className="mt-3">
          Edit File
        </Button>
      </Form>
    </div>
  );
};

export default FileEditModal;
