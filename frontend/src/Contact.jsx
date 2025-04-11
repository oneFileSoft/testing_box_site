import React, { useState } from "react";
import axios from 'axios';
import "./App.css";
import { ToastContainer } from "react-toastify";
import { showToastSuccess, showToastError } from './utils/toastUtils';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    yourWebsite: "",
    yourEmail: "",
    email: "contact@arbatrade.us",
    message: ""
  });
  const [errors, setErrors] = useState({});

//   const validateField = (name, value) => {
//     let error = "";
//     if (name === "firstName") {
//       if (!value) error = "First name is required";
//       else if (value.length > 100) error = "First name is too long";
//     } else if (name === "lastName") {
//       if (!value) error = "Last name is required";
//       else if (value.length > 100) error = "Last name is too long";
//     } else if (name === "yourWebsite") {
//       if (!value) error = "Your website is required";
//     } else if (name === "yourEmail") {
//       if (!value) error = "Your email is required";
//     } else if (name === "message") {
//       if (!value) error = "Message is required";
//       else if (value.length > 2000) error = "Message is too long";
//     }
//     setErrors(prevErrors => ({ ...prevErrors, [name]: error }));
//   };
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   const handleBlur = (e) => {
//     validateField(e.target.name, e.target.value);
//   };

const validateField = (name, value) => {
  let error = "";
  if (name === "firstName") {
    if (!value) error = "First name is required";
    else if (value.length > 100) error = "First name is too long";
  } else if (name === "lastName") {
    if (!value) error = "Last name is required";
    else if (value.length > 100) error = "Last name is too long";
  } else if (name === "yourWebsite") {
    if (!value) error = "Your website is required";
  } else if (name === "yourEmail") {
    if (!value) error = "Your email is required";
  } else if (name === "message") {
    if (!value) error = "Message is required";
    else if (value.length > 2000) error = "Message is too long";
  }
  // Set the error message to placeholder instead of errors state
  setFormData(prevFormData => ({
    ...prevFormData,
    [`${name}Placeholder`]: error || ""
  }));
};

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleBlur = (e) => {
  validateField(e.target.name, e.target.value);
};

  const handleDoubleClick = () => {
      // Check if the message in the textarea is 'hello world'
      if (formData.message === "hello world") {
        // Trigger the popup or any other action you want when 'hello world' is detected
        alert("Slava Plakhin...\nhey there!");
      }
      // Focus the textarea
      document.getElementById("message").focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let tempErrors = {};
    Object.keys(formData).forEach(field => {
      validateField(field, formData[field]);
      if (errors[field]) tempErrors[field] = errors[field];
    });

    if (Object.keys(tempErrors).length === 0) {
      try {
        if (formData.firstName.length === 0 || formData.lastName.length === 0 || formData.yourEmail.length === 0 || formData.message.length === 0 )  {
            showToastError("Please, fill out all required fields!");
        } else {
            const response = await axios.post("/send-email", {
              name: formData.firstName + " " + formData.lastName,
              email: formData.email,
              message: "Person: " + formData.firstName + " " + formData.lastName + "\nWebsite: " + formData.yourWebsite + "\nPerson's email: " + formData.yourEmail + "\nMessage:\n\n" + formData.message
            });
    
            if (response.data.success) {
              showToastSuccess(formData.firstName + " " + formData.lastName + "\nYour email has been sent successfully!");
              setFormData({
                firstName: "",
                lastName: "",
                yourWebsite: "",
                yourEmail: "",
                email: "contact@arbatrade.us",
                message: ""
              });
            } else {
              showToastError("Failed to send email: " + response.data.message);
            }
        }    
      } catch (error) {
        showToastError("Failed to send email: " + error.message);
      }
    }
  };

return (
    
    <div className="contact-form-container w-f mx-auto p-6 border rounded-lg shadow-lg bg-white">
    <form onSubmit={handleSubmit}  style={{ width: "100%", height: "100%" }}>
    <table style={{ width: "100%" }} className="table-style">
      <tr> <td colspan="6"><h2 className="text-2xl font-bold text-center mb-4">Contact Us</h2></td> </tr>
      <tr>
        {/* LEFT TABLE */}
        <td style={{ height: "100%", verticalAlign: "top", width: "30%" }}>
                        <table style={{ width: "100%", height: "100%" }}>
                            <tr  style={{ border: "1px solid black"}}>
                             <td style={{ textAlign: "left"}}>
                                <label className="block text-sm font-medium text-gray-700">&nbsp;First name</label>
                             </td>
                             <td>
                                <input type="text" name="firstName" placeholder={formData.firstNamePlaceholder} value={formData.firstName} onChange={handleChange} onBlur={handleBlur}
                                  className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-style ${errors.firstName ? 'input-error' : ''}`} />
                             </td>
                            </tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>
                             <td style={{ textAlign: "left"}}>
                              <label className="block text-sm font-medium text-gray-700">&nbsp;Last name</label>
                             </td>
                             <td >
                              <input type="text" name="lastName" placeholder={formData.lastNamePlaceholder} value={formData.lastName} onChange={handleChange} onBlur={handleBlur}
                              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-style ${errors.lastName ? 'input-error' : ''}`} />
                             </td>
                            </tr>
                            <tr><td>&nbsp;</td></tr>
                            <tr>
                             <td style={{ textAlign: "left"}}>
                              <label className="block text-sm font-medium text-gray-700">&nbsp;Your Website</label>
                             </td>
                             <td>
                              <input type="text" name="yourWebsite" placeholder={formData.yourWebsitePlaceholder} value={formData.yourWebsite} onChange={handleChange} onBlur={handleBlur}
                              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-style ${errors.yourWebsite ? 'input-error' : ''}`} />
                             </td>
                            </tr>  
                            <tr><td>&nbsp;</td></tr>
                            <tr >
                             <td style={{ textAlign: "left" }}>
                              <label className="block text-sm font-medium text-gray-700">&nbsp;Your Email</label>
                             </td>
                             <td>
                              <input type="email" name="yourEmail" placeholder={formData.yourEmailPlaceholder} value={formData.yourEmail} onChange={handleChange} onBlur={handleBlur}
                              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input-field-style ${errors.yourEmail ? 'input-error' : ''}`} />
                             </td>
                            </tr>  
                        </table>
        </td>
        {/* RIGHT TABLE */}
        <td style={{ height: "100%", verticalAlign: "top", width: "70%" }}>
                  <table  style={{ width: "100%", height: "100%" }}>
                    <tr style={{ height: "10%" }} collspan="2">
                         <td>
                          <select name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" style={{ width: "100%" }}>
                            <option value="jenkins_agent@testingbox.pw">General box: contact us</option>
                            <option value="jenkins_agent@testingbox.pw"> Company Management </option>
                            <option value="jenkins_agent@testingbox.pw"> Technical Support </option>
                          </select>
                         </td>
                    </tr>     
                    <tr style={{ height: "70%" }} >
                      <td style={{ height: "100%", verticalAlign: "top", padding: 0 }}>
                        <div style={{ height: "100%", display: "flex" }}>
                          <textarea  name="message" value={formData.message} onChange={handleChange} onBlur={handleBlur}
                            className={`w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.message ? 'input-error' : ''}`}
                            rows={10} // Ensures at least 5 rows of text
                            style={{
                              flexGrow: 1,       // Makes textarea expand within its parent
                              minHeight: "5em",  // Minimum height for 5 rows
                              height: "100%",    // Allows stretching within parent
                            }}
                            placeholder={formData.messagePlaceholder}
                            onDoubleClick={handleDoubleClick} ></textarea>
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: "10%" }} collspan="2"> <td>&nbsp;</td></tr>
                  </table>  
        </td> 
      </tr>
  
              <tr><td colspan="6">&nbsp;</td></tr>
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                        <button type="submit" className="bg-teal-800 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-teal-900" 
                            style={{ width: '70%', borderRadius: '10px', backgroundColor: '#406bb4' }}
                        > Submit </button>
                        
                    </td>
                </tr>            
            
      <tr><td colspan="6">&nbsp;</td></tr>
      <tr> 
        <td colspan="6"><div className="line"><h2 className="text-2xl font-bold text-center mb-4">    (866) 650-0102    </h2></div></td>
      </tr>
      <tr><td colspan="6">&nbsp;</td></tr>
    </table>  
      
    </form>
    <ToastContainer />
    </div>
);
};

export default Contact;
