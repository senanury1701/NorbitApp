import React from "react";
import {   ModalBody, ModalHeader, } from "reactstrap";


const CompanyEditModel = () => {



  return (
    <div>
        <ModalHeader  className="p-3 bg-success-subtle"> Edit </ModalHeader>
        <ModalBody>
            <div id="task-error-msg" className="alert alert-danger py-2">
               <h1>
                Edit Modal
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure in quae corporis nam, illo repudiandae tempore amet quam praesentium pariatur!
               </h1>
                
            </div>

        </ModalBody>        
    </div>

  )
};

export default CompanyEditModel;
