import React, { useState } from "react";
import "./contact.css";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("user");
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    spaceName: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let errors = {};
    let validEmail = /\S+@\S+\.\S+/;
    let validPhone = /^\d{10}$/;

    // Validate common fields
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!validEmail.test(formValues.email)) {
      errors.email = "Invalid email format";
    }

    if (!formValues.phone) {
      errors.phone = "Phone is required";
    } else if (!validPhone.test(formValues.phone)) {
      errors.phone = "Phone number must be 10 digits";
    }

    if (!formValues.message) {
      errors.message = "Message is required";
    }

    // Validate specific fields based on the active tab
    if (activeTab === "user") {
      if (!formValues.firstName) {
        errors.firstName = "First Name is required";
      }
      if (!formValues.lastName) {
        errors.lastName = "Last Name is required";
      }
    } else {
      if (!formValues.spaceName) {
        errors.spaceName = "Space Name is required";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted successfully", formValues);
      alert("Form submitted successfully!!");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-wrapper">
      <h1 className="contact-header">Contact Us</h1>
        <div className="contact-tab-switch">
          <button className={`contact-tab ${activeTab === "user" ? "active" : ""}`} onClick={() => handleTabChange("user")}>User</button>
          <button className={`contact-tab ${activeTab === "space" ? "active" : ""}`} onClick={() => handleTabChange("space")}>Space Owner</button>
        </div>
        <form onSubmit={handleSubmit}>
          {activeTab === "user" && (
            <>
              <input className={`contact-input ${formErrors.firstName ? "error" : ""}`} type="text" name="firstName" placeholder="First Name" value={formValues.firstName} onChange={handleChange} />
              {formErrors.firstName && <div className="contact-error-message">{formErrors.firstName}</div>}
              <input className={`contact-input ${formErrors.lastName ? "error" : ""}`} type="text" name="lastName" placeholder="Last Name" value={formValues.lastName} onChange={handleChange} />
              {formErrors.lastName && <div className="contact-error-message">{formErrors.lastName}</div>}
            </>
          )}
          {activeTab === "space" && (
            <>
              <input className={`contact-input ${formErrors.spaceName ? "error" : ""}`} type="text" name="spaceName" placeholder="Space Name" value={formValues.spaceName} onChange={handleChange} />
              {formErrors.spaceName && <div className="contact-error-message">{formErrors.spaceName}</div>}
            </>
          )}
          <input className={`contact-input ${formErrors.email ? "error" : ""}`} type="email" name="email" placeholder="Email" value={formValues.email} onChange={handleChange} />
          {formErrors.email && <div className="contact-error-message">{formErrors.email}</div>}
          <input className={`contact-input ${formErrors.phone ? "error" : ""}`} type="text" name="phone" placeholder="Phone" value={formValues.phone} onChange={handleChange} />
          {formErrors.phone && <div className="contact-error-message">{formErrors.phone}</div>}
          <textarea className={`contact-textarea ${formErrors.message ? "error" : ""}`} name="message" placeholder="Message" value={formValues.message} onChange={handleChange}></textarea>
          {formErrors.message && <div className="contact-error-message">{formErrors.message}</div>}
          <button type="submit" className="contact-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
