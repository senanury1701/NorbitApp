import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane,  } from "reactstrap";
import classnames from "classnames";

// Import Content
import UiContent from 'Components/Common/UiContent';
//import Components
import BreadCrumb from 'Components/Common/BreadCrumb';




const EmployeeManangement = () => {


    // Pills Justified Tabs
    const [justifyPillsTab, setjustifyPillsTab] = useState("1");
    const justifyPillsToggle = (tab:any) => {
        if (justifyPillsTab !== tab) {
            setjustifyPillsTab(tab);
        }
    };

    return (
        <React.Fragment>
            <UiContent />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="EmployeeManangement"  />

                    <Row>
                        <Col xxl={6}>
                            <h5 className="mb-3">Pills Justified Tabs</h5>
                            <Card>
                                <CardBody>
                                    <p className="text-muted">Use <code>nav-pills nav-justified</code> class to generate equal-width elements without borders, all horizontal space will be occupied by nav links.</p>

                                    <Nav pills className="nav-justified mb-3">
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: justifyPillsTab === "1", })} onClick={() => { justifyPillsToggle("1"); }} >
                                                Home
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: justifyPillsTab === "2", })} onClick={() => { justifyPillsToggle("2"); }} >
                                                Profile
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: justifyPillsTab === "3", })} onClick={() => { justifyPillsToggle("3"); }} >
                                                Messages
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink style={{ cursor: "pointer" }} className={classnames({ active: justifyPillsTab === "4", })} onClick={() => { justifyPillsToggle("4"); }} >
                                                Settings
                                            </NavLink>
                                        </NavItem>
                                    </Nav>

                                    <TabContent activeTab={justifyPillsTab} className="text-muted">
                                        <TabPane tabId="1" id="pill-justified-home-1">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    Raw denim you probably haven't heard of them jean shorts Austin.
                                                    Nesciunt tofu stumptown aliqua, retro synth master cleanse.
                                                </div>
                                            </div>
                                            <div className="d-flex mt-2">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    Too much or too little spacing, as in the example below, can make things unpleasant for the reader. The goal is to make your text as comfortable to read as possible.
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="2" id="pill-justified-profile-1">
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    In some designs, you might adjust your tracking to create a certain artistic effect. It can also help you fix fonts that are poorly spaced to begin with.
                                                </div>
                                            </div>
                                            <div className="d-flex mt-2">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart.
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="3" id="pill-justified-messages-1" >
                                            <div className="d-flex">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    Each design is a new, unique piece of art birthed into this world, and while you have the opportunity to be creative and make your own style choices.
                                                </div>
                                            </div>
                                            <div className="d-flex mt-2">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    For that very reason, I went on a quest and spoke to many different professional graphic designers and asked them what graphic design tips they live.
                                                </div>
                                            </div>
                                        </TabPane>

                                        <TabPane tabId="4" id="pill-justified-settings-1">
                                            <div className="d-flex mt-2">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    For that very reason, I went on a quest and spoke to many different professional graphic designers and asked them what graphic design tips they live.
                                                </div>
                                            </div>
                                            <div className="d-flex mt-2">
                                                <div className="flex-shrink-0">
                                                    <i className="ri-checkbox-circle-fill text-success"></i>
                                                </div>
                                                <div className="flex-grow-1 ms-2">
                                                    After gathering lots of different opinions and graphic design basics, I came up with a list of 30 graphic design tips that you can start implementing.
                                                </div>
                                            </div>
                                        </TabPane>
                                    </TabContent>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                </Container>
            </div>
        </React.Fragment>
    );
};

export default EmployeeManangement;
