import React, { useState } from "react";
import { Container, Form, Row, Col, Button, Table } from "react-bootstrap";
import Header from "../../../../../Components/Header/Header";
import { createUserRole } from "../../../../../lib/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../../../../context/PermissionContext";
import { useTranslation } from "react-i18next";

const CreateAdminRole = () => {
  const { t } = useTranslation();
  const { getRoles } = usePermissions();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState({});
  const company_id = localStorage.getItem("companyId") || null;
  const [userId, setuserId] = useState(localStorage.getItem("userId"));
  const [token, settoken] = useState(localStorage.getItem("UserToken"));
  const [errors, setErrors] = useState({
    roleName: "",
    roleDescription: "",
    permissions: "",
  });

  const companyModules = [
    {
      name: t("Company Office User Module"),
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: t("Company Field User Module"),
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: t("Company Customers Module"),
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: t("Company Work Order Module"),
      actions: ["view", "create", "edit", "delete"],
    },
    {
      name: t("Company Roles Module"),
      actions: ["view", "create"],
    },
    {
      name: t("Company Work Order Time Module"),
      actions: ["view", "edit"],
    },
    {
      name: t("Company Language Change Module"),
      actions: ["view", "edit"],
    },
    {
      name: t("Company Work Order Report Module"),
      actions: ["view"],
    },
    {
      name: t("Company Field User Attendence Report Module"),
      actions: ["view"],
    },
  ];

  const handlePermissionChange = (module, action) => {
    setPermissions((prev) => {
      // For the two specific modules, tie the view and edit checkboxes together.
      if (
        module === t("Company Work Order Time Module") ||
        module === t("Company Language Change Module")
      ) {
        const newValue = !prev[module]?.[action];
        return {
          ...prev,
          [module]: {
            view: newValue,
            edit: newValue,
          },
        };
      } else {
        // For other modules, keep the existing logic
        const newValue = !prev[module]?.[action];
        return {
          ...prev,
          [module]: {
            ...prev[module],
            [action]: newValue,
            ...(["create", "edit", "delete"].includes(action) && {
              view: true, // Automatically check view if create, edit, or delete is checked
            }),
          },
        };
      }
    });

    // Optional: Clear any error messages if a permission is selected.
    const permissionsSelected = Object.values(permissions).some((mod) =>
      Object.values(mod).some((act) => act)
    );
    if (permissionsSelected) {
      setErrors((prevErrors) => ({ ...prevErrors, permissions: "" }));
    }
  };

  const renderModules = (modules) =>
    modules.map((module, index) => (
      <tr key={index}>
        <td>{module.name}</td>
        <td>
          {module.actions.includes("view") && (
            <Form.Check
              inline
              label={t("View")}
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "view")}
              checked={permissions[module.name]?.view || false}
              disabled={
                !!(
                  permissions[module.name]?.create ||
                  permissions[module.name]?.edit ||
                  permissions[module.name]?.delete
                )
              }
            />
          )}
          {module.actions.includes("create") && (
            <Form.Check
              inline
              label={t("Create")}
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "create")}
              checked={permissions[module.name]?.create || false}
            />
          )}
          {module.actions.includes("edit") && (
            <Form.Check
              inline
              label={t("Edit")}
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "edit")}
              checked={permissions[module.name]?.edit || false}
            />
          )}
          {module.actions.includes("delete") && (
            <Form.Check
              inline
              label={t("Delete")}
              type="checkbox"
              onChange={() => handlePermissionChange(module.name, "delete")}
              checked={permissions[module.name]?.delete || false}
            />
          )}
        </td>
      </tr>
    ));

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
      newErrors.roleName = t("Role Name is required");
      isValid = false;
      window.scroll(0, 0);
    }

    if (!roleDescription) {
      newErrors.roleDescription = t("Role Description is required");
      isValid = false;
      window.scroll(0, 0);
    }

    const permissionsSelected = Object.values(permissions).some((module) =>
      Object.values(module).some((action) => action)
    );

    if (!permissionsSelected) {
      newErrors.permissions = t("Please select at least one checkbox!");
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    const roleData = {
      roleName: roleName.trim(),
      roleDescription,
      roleLevel: "Company",
      permissions: Object.keys(permissions).map((moduleName) => {
        const actions = Object.keys(permissions[moduleName])
          .filter((action) => permissions[moduleName][action])
          .map((action) => action.charAt(0).toUpperCase() + action.slice(1));
        return { moduleName, actions };
      }).filter((module) => module.actions.length > 0),
      created_by: createdBy,
      company_id: company_id,
    };

    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to create this role?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, create it!"),
      cancelButtonText: t("No, cancel"),
    });

    if (!result.isConfirmed) {
      console.log("Role creation was cancelled");
      return;
    }

    Swal.fire({
      title: t("Processing..."),
      text: t("Creating role, please wait."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await createUserRole(roleData, token);

      Swal.close();

      if (response.status === true) {
        e.target.reset();
        setPermissions({});
        setErrors({ roleName: "", roleDescription: "", permissions: "" });

        await Swal.fire({
          title: t("Success!"),
          text: t("Role has been created successfully."),
          icon: "success",
          confirmButtonText: t("OK"),
        }).then(() => {
          getRoles(userId);
          navigate("/settings/admin/roles"); // Navigate after confirmation
        });
      } else {
        // Show error message if response is not successful
        await Swal.fire({
          title: "Error!",
          text: response.message || t("There was an error creating the role."),
          icon: "error",
          confirmButtonText: t("Try Again"),
        });
      }
    } catch (error) {
      Swal.close();
      console.error("API Error:", error);

      Swal.fire({
        title: t("API Error!"),
        text: t("Something went wrong. Please try again later."),
        icon: "error",
        confirmButtonText: t("OK"),
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
              backgroundColor: "#2e2e32",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            <h4 className="mb-0">{t("Enter Staff Role Details")}</h4>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t("Role Name")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Enter Role Name")}
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
                  <Form.Label>{t("Role Description")}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={t("Enter Role Description")}
                    onChange={() => handleOnChange("roleDescription")}
                    isInvalid={!!errors.roleDescription}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.roleDescription}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Table bordered>
              <thead>
                <tr>
                  <th>{t("Module Name")}</th>
                  <th>{t("Module Actions")}</th>
                </tr>
              </thead>
              <tbody>{renderModules(companyModules)}</tbody>
            </Table>
            <div className="mb-2">
              {errors.permissions && (
                <Form.Text className="text-danger">
                  {errors.permissions}
                </Form.Text>
              )}
            </div>
            <Button variant="primary" type="submit">
              {t("Submit")}
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default CreateAdminRole;
