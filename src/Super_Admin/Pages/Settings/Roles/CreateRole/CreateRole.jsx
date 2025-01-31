import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Row,
  Col,
  Button,
  Table,
} from "react-bootstrap";
import Header from "../../../../../Components/Header/Header";
import { createUserRole } from "../../../../../lib/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateRole = () => {
  const navigate = useNavigate();
  const [roleType, setRoleType] = useState("saas");
  const [permissions, setPermissions] = useState({});
  const company_id=localStorage.getItem("companyId")||null;
  const [userId, setuserId] = useState(localStorage.getItem("userId"));
  const [errors, setErrors] = useState({
    roleName: "",
    roleDescription: "",
    permissions: "",
  });

  const saasModules = [
    {
      name: "SAAS Customer Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "SAAS Reports Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "SAAS Setting Module",
      actions: ["view", "create", "edit", "delete"],
    },
    { name: "Company Office User Module", actions: ["view", "create", "edit"] },
    {
      name: "Company Customers Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Company Quotations Module",
      actions: ["view", "create", "edit", "delete"],
    },
    { name: "Company Contract Module", actions: ["view", "create", "edit"] },
    { name: "Company Work Order Module", actions: ["view", "create", "edit"] },
    {
      name: "Company Field User Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Company Request Work Order Module (Rescheduled/Cancelled)",
      actions: ["view", "edit"],
    },
    { name: "Company Reports Module", actions: ["view", "create", "edit"] },
    {
      name: "Company Master Setting Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Company HR Setting Module",
      actions: ["view", "create", "edit", "delete"],
    },
  ];

  const companyModules = [
    { name: "Company Office User Module", actions: ["view", "create", "edit"] },
    {
      name: "Company Customers Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Company Quotations Module",
      actions: ["view", "create", "edit", "delete"],
    },
    { name: "Company Contract Module", actions: ["view", "create", "edit"] },
    { name: "Company Work Order Module", actions: ["view", "create", "edit"] },
    {
      name: "Company Field User Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Company Request Work Order Module (Rescheduled/Cancelled)",
      actions: ["view", "edit"],
    },
    { name: "Company Reports Module", actions: ["view", "create", "edit"] },
    {
      name: "Company Master Setting Module",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: "Company HR Setting Module",
      actions: ["view", "create", "edit", "delete"],
    },
  ];

  const handleRoleTypeChange = (type) => {
    setRoleType(type);
    setPermissions({}); // Reset permissions when role type changes
  };

  const handlePermissionChange = (module, action) => {
    setPermissions((prev) => {
      const updatedPermissions = {
        ...prev,
        [module]: {
          ...prev[module],
          [action]: !prev[module]?.[action],
        },
      };

      // Check if at least one checkbox is selected and clear the error
      const permissionsSelected = Object.values(updatedPermissions).some(
        (mod) => Object.values(mod).some((act) => act)
      );

      if (permissionsSelected) {
        setErrors((prevErrors) => ({ ...prevErrors, permissions: "" }));
      }

      return updatedPermissions;
    });
  };

  const renderModules = (modules) =>
    modules.map((module, index) => (
      <tr key={index}>
        <td>{module.name}</td>
        <td>
          {module.actions.includes("view") && (
            <Form.Check
              inline
              label="View"
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "view")}
              checked={permissions[module.name]?.view || false}
            />
          )}
          {module.actions.includes("create") && (
            <Form.Check
              inline
              label="Create"
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "create")}
              checked={permissions[module.name]?.create || false}
            />
          )}
          {module.actions.includes("edit") && (
            <Form.Check
              inline
              label="Edit"
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "edit")}
              checked={permissions[module.name]?.edit || false}
            />
          )}
          {module.actions.includes("delete") && (
            <Form.Check
              inline
              label="Delete"
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "delete")}
              checked={permissions[module.name]?.delete || false}
            />
          )}
        </td>
      </tr>
    ));

  // Updated handleOnChange to clear specific error field
  const handleOnChange = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleName = e.target[0].value;
    const roleDescription = e.target[1].value;
    const createdBy = userId;

    let isValid = true;
    let newErrors = { roleName: "", roleDescription: "", permissions: "" };

    if (!roleName) {
      newErrors.roleName = "Role Name is required";
      isValid = false;
      window.scroll(0, 0);
    }

    if (!roleDescription) {
      newErrors.roleDescription = "Role Description is required";
      isValid = false;
      window.scroll(0, 0);
    }

    const permissionsSelected = Object.values(permissions).some((module) =>
      Object.values(module).some((action) => action)
    );

    if (!permissionsSelected) {
      newErrors.permissions = "Please select at least one checkbox!";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const roleData = {
      roleName,
      roleDescription,
      roleLevel: roleType.charAt(0).toUpperCase() + roleType.slice(1),
      permissions: Object.keys(permissions).map((moduleName) => {
        const actions = Object.keys(permissions[moduleName])
          .filter((action) => permissions[moduleName][action])
          .map((action) => action.charAt(0).toUpperCase() + action.slice(1));
        return { moduleName, actions };
      }),
      created_by: createdBy,
      company_id: company_id||null,
    };

    // Confirm action before proceeding
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to create this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    });

    if (!result.isConfirmed) {
      console.log("Role creation was cancelled");
      return;
    }

    Swal.fire({
      title: "Processing...",
      text: "Creating role, please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await createUserRole(roleData);

      Swal.close();

      if (response.status === true) {
        e.target.reset();
        setPermissions({});
        setErrors({ roleName: "", roleDescription: "", permissions: "" });

        Swal.fire({
          title: "Success!",
          text: "Role created successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/settings/roles"); // Navigate after confirmation
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.message || "There was an error creating the role.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      // Close SweetAlert loading spinner and show error
      Swal.close();
      console.error("API Error:", error);

      Swal.fire({
        title: "API Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box">
        <Container
          className="mt-4 pages-box"
          style={{
            backgroundColor: "white",
            borderRadius: "22px",
            padding: "25px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="form-header mb-4"
            style={{
              backgroundColor: "#8d28dd",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            <h4 className="mb-0">Enter Staff Role Details</h4>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Role Name"
                    onChange={() => handleOnChange("roleName")}
                    isInvalid={!!errors.roleName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.roleName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Role Description"
                    onChange={() => handleOnChange("roleDescription")}
                    isInvalid={!!errors.roleDescription}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.roleDescription}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <Form.Check
                  inline
                  type="radio"
                  label="SAAS Level Role"
                  name="roleType"
                  id="saasRole"
                  checked={roleType === "saas"}
                  onChange={() => handleRoleTypeChange("saas")}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Company Role"
                  name="roleType"
                  id="companyRole"
                  checked={roleType === "company"}
                  onChange={() => handleRoleTypeChange("company")}
                />
              </Col>
            </Row>
            <Table bordered>
              <thead>
                <tr>
                  <th>Module Name</th>
                  <th>Module Actions</th>
                </tr>
              </thead>
              <tbody>
                {roleType === "saas"
                  ? renderModules(saasModules)
                  : renderModules(companyModules)}
              </tbody>
            </Table>
            <div className="mb-2">
              {errors.permissions && (
                <Form.Text className="text-danger">
                  {errors.permissions}
                </Form.Text>
              )}
            </div>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default CreateRole;
