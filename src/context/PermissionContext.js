import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
// import { jwtDecode } from 'jwt-decode';
import { fetch_permissions, fetchRolesList, Url } from "../lib/store";

const PermissionsContext = createContext();
const userDataKey = "companyId";

export const PermissionsProvider = ({ children }) => {
  const [userRole, setUserRole] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [user, setUser] = useState(localStorage.getItem(userDataKey));
  
  const token = localStorage.getItem('UserToken');
  const roleID = localStorage.getItem('roleID');

  console.log("permissions",permissions)

  useEffect(() => {
    if(roleID && token && permissions?.length === 0){
      fetch_permissions(roleID, token)
      .then((res) => {setPermissions(res.data)}).catch((e) => {console.log(e)})
    }
  }, [permissions])

  const getRoles = async (userID) => {
    console.log("hit 2", userID);
    if (userID) {
      try {
        // console.log(`userid: ${userID}  `);
        const token = localStorage.getItem("UserToken");
        const url = `${Url}/srw4rdxkh8/ywqg21sh72?userId=${encodeURIComponent(
          userID
        )}`;
        const response = await fetchRolesList(userID, token);
        // const response = await axios.get(url, {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        console.log("responsesss", response);
        setRoles(response?.data || []);
        setUserRole(response?.data?.data?.roleName || null);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    }
  };
  //   console.log(`permis   : ${permissions}`);

  //   useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         // const decodedToken = jwtDecode(token);
  //         // setUser(decodedToken?.userId);
  //         getRoles(decodedToken?.userId);
  //       } catch (error) {
  //         console.error("Error decoding token:", error);
  //       }
  //     }
  //   }, []);

  useEffect(() => {
    console.log("hit 1", user);
    if (roles.length === 0 && user) {
      getRoles(user);
    }
  }, [user]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === userDataKey) {
        setUser(event.newValue);
        getRoles(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // const hasPermission = (moduleName, action) =>
  //   permissions.permissions?.some(
  //     (perm) => perm.moduleName === moduleName && perm.actions.includes(action)
  //   );
  const hasPermission = (moduleName, action) => {
    if (permissions.permissions) {
      return permissions.permissions.some(
        (perm) => perm.moduleName === moduleName && perm.actions.includes(action)
      );
    } else {
      return false;
    }
  };
  
  return (
    <PermissionsContext.Provider
      value={{ userRole, hasPermission, permissions, getRoles, roles ,setPermissions}}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook for using permissions in any component
export const usePermissions = () => useContext(PermissionsContext);
