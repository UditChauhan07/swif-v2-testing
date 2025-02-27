import axios from "axios";
// export const Url = "http://localhost:2525";
// export const Url = "https://apiv4-hl3bjt37ia-uc.a.run.app/";
// export const Url = "http://127.0.0.1:5001/swif-v2/us-central1/test"
export const Url = "http://127.0.0.1:5001/swif-v2/us-central1/apiv4"

// Admin Login APi
export const LoginApi = async (formData) => {
  try {
    const response = await axios.post(`${Url}/loa234re5t`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Change Password Api
export const changePasswordApi = async (formData, token) => {
  try {
    const response = await axios.put(`${Url}/cap2mji89f`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//Get Company List
export const getCompanyListApi = async (token) => {
  try {
    const response = await axios.get(`${Url}/gco542s8mz`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Get Admin dashboard Details
export const getSuperAdminDashboardDetails = async (token) => {
  try {
    const response = await axios.get(`${Url}/dcc23we5t6`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};
// Get Super-Admin dashboard Details
export const getAdminDashboardDetails = async (companyId, token) => {
  try {
    const response = await axios.get(`${Url}/cdsj54rt67/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Crete Company
export const createCompanyApi = async (formdata, token) => {
  console.log("dataa", formdata);

  // for (let [key, value] of formdata.entries()) {
  //   console.log(`${key}:`, value);
  // }
  try {
    const response = await axios.post(`${Url}/scc54meki8`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Edit Company Api
export const editCompanyApi = async (companyId, formdata, token) => {
  console.log("companyId: " + companyId);
  try {
    const response = await axios.patch(
      `${Url}/edco542m8u/${companyId}`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Delete Company Api
export const deleteCompanyApi = async (userId, token) => {
  try {
    const response = await axios.delete(`${Url}/ducmk45d7u/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create User Role
// export const createUserRole = async (finalData) => {
//   try {
//     const response = await axios.post(
//       `${Url}/srw4rdxkh8/r31dishdq2`,
//       finalData
//     );
//     // console.log(response.data, "login api data");
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       return error.response.data;
//     }
//     throw new Error("An unexpected error occurred");
//   }
// };

//create office User
export const createOfficeUser = async (finalData, token) => {
  console.log("dasasd", finalData);
  console.log("tt", token);
  try {
    const response = await axios.post(`${Url}/cou34er5t6`, finalData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//fetch roles list for office user
export const fetchRolesList = async (userid, token) => {
  try {
    const response = await axios.get(
      `${Url}/ofmg4j3er6?userId=${encodeURIComponent(userid)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create User Role
export const createUserRole = async (finalData, token) => {
  try {
    const response = await axios.post(`${Url}/cork654m78`, finalData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Get Role List
export const getRoles = async (finalData, token) => {
  // console.log("finalData", finalData);
  const userId = finalData;
  try {
    const response = await axios.get(
      `${Url}/ofmg4j3er6`,
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Edit Role Edit
export const roleEditApi = async (roleId, finalData, token) => {
  try {
    const response = await axios.patch(
      `${Url}/ed6tmki8gy/${roleId}`,
      finalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Create Customer
export const createCustomerApi = async (finalData, token) => {
  try {
    const response = await axios.post(
      `${Url}/cr5mki489n`,
      // `https://test-hl3bjt37ia-uc.a.run.app/cr5mki489n`,
      finalData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Get Customer APi
export const getCustomerList = async (company_id, token) => {
  try {
    const response = await axios.get(`${Url}/pki5m3n8io`, {
      params: { company_id },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Edit Customer Api
export const editCustomerApi = async (customerId, formdata, token) => {
  try {
    const response = await axios.put(
      `${Url}/epa23dr45t/${customerId}`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Delete Customer Api
export const DeleteCustomerApi = async (userId, token, companyId) => {
  try {
    const response = await axios.delete(`${Url}/dcl45m76y8/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { companyId: companyId },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order Create
export const createWorkOrderApi = async (finalData, token) => {
  try {
    const response = await axios.post(`${Url}/cwok431m56`, finalData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order List
export const fetchWorkOrderList = async (companyId, token) => {
  try {
    const response = await axios.get(`${Url}/gwok32m76nh/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order Delete Api
export const workOrderDeleteApi = async (userId, token, company_id) => {
  try {
    const response = await axios.delete(`${Url}/dwo32mt54f/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { companyId: company_id },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//create field user
export const create_FieldUser = async (formdata, token) => {
  try {
    const response = await axios.post(`${Url}/fu6m5k49ij`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//get field users of company
export const fetch_FieldUserOfCompany = async (companyId, token) => {
  try {
    const response = await axios.get(
      `${Url}/gtfr54m78k?company_id=${encodeURIComponent(companyId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//get office users by role id
export const fetch_officeUsersByRoleId = async (roleId, token) => {
  try {
    console.log(roleId);
    const response = await axios.get(
      `${Url}/gor5m9xv04?roleID=${encodeURIComponent(roleId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//delete field user by id
export const delete_FieldUser = async (userId, token, company_id) => {
  console.log("Company ID:", company_id);
  console.log("User ID:", userId);
  console.log("Token:", token);

  try {
    const response = await axios.delete(`${Url}/dfu54mjki9/${userId}`, {
      data: { companyId: company_id }, // include company_id here
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//update field user by id
export const update_FieldUser = async (formdata, token, id) => {
  try {
    const response = await axios.put(`${Url}/edik54m89v/${id}`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const delete_OfficeUser = async (userId, token, company_id) => {
  try {
    const response = await axios.delete(`${Url}/dlofim54rt/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { companyId: company_id },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const edit_OfficeUser = async (formdata, userId, token) => {
  console.log("user", userId);
  try {
    const response = await axios.put(`${Url}/smjg8g43me/${userId}`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Import Field Agent
export const importFieldAgent = async (formdata, token) => {
  try {
    const response = await axios.post(`${Url}/ifu3ws6t5r`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Import Work Order
export const importWorkOrder = async (formdata, token) => {
  try {
    const response = await axios.post(`${Url}/iwo32mm4er`, formdata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order Time Api Update
export const workOrderTimeApi = async (formdata, companyId, token) => {
  try {
    const response = await axios.post(
      `${Url}/wot3m9iszx/${companyId}`,
      formdata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order Time Api Get
export const workOrderTimeGetApi = async (companyId, token) => {
  try {
    const response = await axios.get(`${Url}/gwoct43m9su/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// get Single Company Detail
export const getCompanyDetail = async (companyId, token) => {
  try {
    const response = await axios.get(`${Url}/gscd3m9isd/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Update Single Company
export const updateSingleCompany = async (companyId, token, companyData) => {
  try {
    const response = await axios.put(
      `${Url}/upcom32mw8/${companyId}`,
      companyData, // pass the company data directly as the request body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Language update Api
export const LanguageCompanyUpdateApi = async (companyId, token, language) => {
  try {
    const response = await axios.post(
      `${Url}/dlg2m8ui5r/${companyId}`,
      { language },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order Report All Company
export const workOrderReportAllCompany = async (token) => {
  try {
    const response = await axios.get(`${Url}/scwok24mrd/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Work Order Report Single Company
export const workOrderReportSingleCompany = async (token, companyId) => {
  try {
    const response = await axios.get(`${Url}/csr4m32we4/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Login/Logout Records, Session Records Get
export const getLoginLogoutRecords = async (token) => {
  try {
    const response = await axios.get(`${Url}/h12kd1dks1/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Logout Api For Login/Logout Update
export const LogoutRecordUpdateAPi = async (sessionId, userId, token) => {
  try {
    const response = await axios.get(
      `${Url}/stn54m7d9s?sessionID=${sessionId}&userId=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// field User Attendence report api
export const getFieldUserAttendenceApi = async (companyId, token) => {
  try {
    const response = await axios.get(`${Url}/fuarm3k65m/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Get Taxation Country Details
export const getTaxationDetails = async (token) => {
  try {
    const response = await axios.get(`${Url}/jhs29ksl2s`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

//Update
export const UpdateCountryTaxationDetails = async (payload, token) => {
  try {
    const response = await axios.put(`${Url}/ljsec12bwk`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log(response.data, "login api data");
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetch_permissions = async (roleID, token) => {
  try {
    const response = await axios.get(
      `${Url}/rls1283sd1?roleID=${encodeURIComponent(roleID)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// country currency conversion
export const convertToSelectedCurrency = async (
  countryName,
  currencyCode,
  token
) => {
  try {
    const response = await axios.get(
      `${Url}/87funjqs31?countryName=${encodeURIComponent(
        countryName
      )}&currencyCode=${encodeURIComponent(currencyCode)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(response.data, "login api data");
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};


// Billing System - Get Pricing Structure
export const getPricingStructure = async (token) => {
  try {
    const response = await axios.get(`${Url}/gfpl65m8uj`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ress Data".response);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Billing System - Create Pricing Structure
export const createPricingStructure = async (token, finaldata) => {
  try {
    const response = await axios.post(`${Url}/blngsy5m4e`, finaldata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ress Data".response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Billing System - update Pricing Structure
export const updatePricingStructure = async (token, finaldata, pricingId) => {
  console.log("adasd", token, finaldata, pricingId);
  try {
    const response = await axios.put(
      `${Url}/ed7m5n4rt6/${pricingId}`,
      finaldata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Ress Data".response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Billing System - Get Usage Limit Per Company
export const getUsageLimit = async (token) => {
  try {
    const response = await axios.get(`${Url}/gulm476u4r`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ress Data".response);
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Billing System - Create Usage Limit Per Company
export const createUsageLimit = async (token, finaldata) => {
  try {
    const response = await axios.post(`${Url}/dcp5m43e6t`, finaldata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ress Data".response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};

// Billing System - update Usage Limit Per Company
export const updateUsageLimit = async (token, finaldata) => {
  console.log("adasd", token, finaldata);
  try {
    const response = await axios.put(`${Url}/efum4k3k65`, finaldata, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Ress Data".response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};


//create subscription package
export const CreateSubscriptionPackage = async (token, finaldata) => {

  try {
    const response = await axios.post(
      `${Url}/3ddfhhdu2`,
      finaldata,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("package response Data",response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};


//list subscription package
export const getSubscriptionPackagesList = async (token) => {
  try {
    const response = await axios.get(
      `${Url}/widnr27d4`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("package list response Data",response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};




































































export const editSubscriptionPackages = async (token,payload) => {
  try {
    const response = await axios.put(
      `${Url}/ra7ystemu1`,payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("package edit response Data",response);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};