import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {  resetProfileFlag } from "../../slices/thunks";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserProfileEdit = () => {
  const dispatch = useDispatch<any>();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  const { success, error } = useSelector((state: any) => state.Profile);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      try {
        const obj = JSON.parse(storedUser);
        setUserData({
          firstName: obj.first_name,
          lastName: obj.last_name,
          email: obj.email,
          username: obj.username,
        });
      } catch (error) {
        console.error("Error parsing authUser from sessionStorage:", error);
      }
    }

    if (success) {
      toast.success("Profile updated successfully!");
    }

    if (error) {
      toast.error(`Error: ${error}`);
    }

    setTimeout(() => {
      dispatch(resetProfileFlag());
    }, 3000);
  }, [dispatch, success, error]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userData.firstName || "",
      last_name: userData.lastName || "",
      username: userData.username || "",
      email: userData.email || "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please Enter Your First Name"),
      last_name: Yup.string().required("Please Enter Your Last Name"),
      username: Yup.string().required("Please Enter Your Username"),
      email: Yup.string().email("Invalid email format").required("Please Enter Your Email"),
    }),
    onSubmit: (values) => {
console.log(values);
    },
  });

  return (
    <Container fluid>
      <ToastContainer />
      <Row>
        <Col lg="12">
          <Card>
            <CardBody>
              <Form
                className="form-horizontal"
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <div className="form-group">
                  <Label>First Name</Label>
                  <Input
                    name="first_name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.first_name}
                    invalid={!!(validation.touched.first_name && validation.errors.first_name)}
                  />
                  <FormFeedback>{validation.errors.first_name}</FormFeedback>
                </div>
                <div className="form-group">
                  <Label>Last Name</Label>
                  <Input
                    name="last_name"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.last_name}
                    invalid={!!(validation.touched.last_name && validation.errors.last_name)}
                  />
                  <FormFeedback>{validation.errors.last_name}</FormFeedback>
                </div>
                <div className="form-group">
                  <Label>Username</Label>
                  <Input
                    name="username"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.username}
                    invalid={!!(validation.touched.username && validation.errors.username)}
                  />
                  <FormFeedback>{validation.errors.username}</FormFeedback>
                </div>
                <div className="form-group">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.email}
                    invalid={!!(validation.touched.email && validation.errors.email)}
                  />
                  <FormFeedback>{validation.errors.email}</FormFeedback>
                </div>
                <div className="text-center mt-4">
                  <Button type="submit" color="primary">
                    Update Profile
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfileEdit;
