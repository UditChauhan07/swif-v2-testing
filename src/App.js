import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Header from "./Components/Header/Header";
import Dashboard from './Super_Admin/Pages/DashBoard/DashBoard';
import CreateCompany from "./Super_Admin/Pages/Companies/CreateCompany/CreateCompany";
import Companies from "./Super_Admin/Pages/Companies/Companies/Companies";
import CompanyAccess from "./Super_Admin/Pages/Companies/Access/CompanyAccess";
import Create from "./Admin/Users/Office_Users/Create/Create";
import SuperAdmin from "./utils/Super_Admin/SuperAdmin";
import StaffAdmin from "./Admin/Users/Office_Users/Staff_Admin/StaffAdmin";
import Accountant from "./utils/Accountant/Accountant";
import Manager from "./utils/Manager/Manager";
import HumanResource from "./utils/Human_Resource/HumanResource";
import OtherUsers from "./Admin/Users/Office_Users/Other_Users/OtherUsers";
import CreateFieldUser from "./Admin/Users/Field_Users/Create/CreateFieldUser";
import FieldUserList from "./Admin/Users/Field_Users/Filed_user_list/FieldUserList";
import ImportFieldUser from "./Admin/Users/Field_Users/Import_User/ImportFieldUser";
import CreateCustomer from "./Admin/Pages/Customers/CreateCustomer/CreateCustomer";
import CustomerList from "./Admin/Pages/Customers/CustomerList/CustomerList";
import ProspectsCustomer from "./Admin/Pages/Customers/ProspectsCustomer/ProspectsCustomer";
import CustomerImport from "./Admin/Pages/Customers/CustomerImport/CustomerImport";
import ChangePassword from "./Super_Admin/Pages/ChangePassword/ChangePassword";
import PrivateRoute from "./PrivateRoute";
import Roles from "./Super_Admin/Pages/Settings/Roles/Roles";
import CreateRole from "./Super_Admin/Pages/Settings/Roles/CreateRole/CreateRole";
import "./i18n"; 
import AdminRoles from "./Admin/Pages/Settings/Roles/AdminRoles";
import CreateAdminRole from "./Admin/Pages/Settings/Roles/CreateAdminRole/CreateAdminRole";
import FieldUserDetails from "./Admin/Users/Field_Users/Filed_user_list/FieldUserDetails";
import CompanyDetails from "./Super_Admin/Pages/Companies/Companies/CompanyDetails/CompanyDetails";
import EditCompany from "./Super_Admin/Pages/Companies/Companies/EditCompany/EditCompany";
import EditRoles from "./Super_Admin/Pages/Settings/Roles/EditRoles/EditRoles";
import UpdateFieldUser from "./Admin/Users/Field_Users/Filed_user_list/UpdateFieldUser ";
import OfficeUserDetails from "./Admin/Users/Office_Users/Staff_Admin/OfficeUserDetails";
import EditOfficeUser from "./Admin/Users/Office_Users/Staff_Admin/EditOfficeUser";
import CustomerDetails from "./Admin/Pages/Customers/CustomerList/CustomerDetails/CustomerDetails";
import CustomerEdit from "./Admin/Pages/Customers/CustomerList/CustomerEdit/CustomerEdit";
import EditAdminRole from "./Admin/Pages/Settings/Roles/EditAdminRole/EditAdminRole";
import CreateWorkOrder from "./Admin/Pages/WorkOrders/CreateWorkOrder/CreateWorkOrder";
import WorkOrderList from './Admin/Pages/WorkOrders/WorkOrderList/WorkOrderList';
import DraftWorkOrder from './Admin/Pages/WorkOrders/DraftWorkOrder/DraftWorkOrder';
import AdminDashboard from "./Admin/Pages/DashBoard/adminDashBoard";
import WorkOrderEdit from "./Admin/Pages/WorkOrders/WorkOrderList/WorkOrderEdit/WorkOrderEdit";
import WorkOrderDetails from "./Admin/Pages/WorkOrders/WorkOrderList/WorkOrderDetails/WorkOrderDetails";
import WorkOrderTime from "./Admin/Pages/Settings/WorkOrderTime/WorkOrderTime";
import WorkOrderImport from "./Admin/Pages/WorkOrders/WorkOrderImport/WorkOrderImport";
import AdminProfile from "./Admin/Pages/AdminProfile/AdminProfile";
import LanguageChange from "./Admin/Pages/Settings/LanguageChange/LanguageChange";
import WorkOrderReport from "./Super_Admin/Pages/Reports/WorkOrderReport/WorkOrderReport";
import CompanyWOreport from "./Admin/Pages/CompanyReports/WorkOrderReport/CompanyWOreport";
import FieldUserAttenderReport from "./Super_Admin/Pages/Reports/FieldUserAttenderReport/FieldUserAttenderReport";
import LoginLogoutReport from "./Super_Admin/Pages/Reports/LoginLogoutReport/LoginLogoutReport";
import FieldUserAttendece from "./Admin/Pages/CompanyReports/Attedence/FieldUserAttendece";
import DefaultPricingStructure from "./Super_Admin/Pages/BillingSystem/PricingStructure/DefaultPricingStructure";
import UsageLimitStrc from './Super_Admin/Pages/BillingSystem/UsageLimitStrc/UsageLimitStrc';
import CurrencyMangment from './Super_Admin/Pages/BillingSystem/CurrencyManagment/CurrencyMangment';
import CustomPricingOption from './Super_Admin/Pages/BillingSystem/PricingOption/CustomPricingOption';
import PackageCreateSys from './Super_Admin/Pages/BillingSystem/PackageCreateSys/PackageCreateSys';
import PackagesList from "./Super_Admin/Pages/BillingSystem/PackageCreateSys/PackagesList";
import TaxationSetting from "./Super_Admin/Pages/TaxationSetting/TaxationSetting";


function App() {

  return (
    <>
      <Router>
        <Routes>
        <Route path="/changepassword" element={<ChangePassword />} />

          {/*-------------- Super Admin */}
          <Route path="/" element={<Login />} />

          {/* <Route path="/header" element={<Header />} /> */}

          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} /> 
          {/* <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} /> */}

          {/* Companies */}
          <Route path="/company/create" element={<PrivateRoute element={CreateCompany } />} />
          <Route path="/company/companies" element={<PrivateRoute element={Companies } />} />
          <Route path="/company/companies/details" element={<PrivateRoute element={CompanyDetails} />} />
          <Route path="/company/companies/edit" element={<PrivateRoute element={EditCompany } />} />
          <Route path="/company/access" element={<PrivateRoute element={CompanyAccess} />} />

          {/* Settings */}
          <Route path="/settings/roles" element={<PrivateRoute element={Roles} /> } />
          <Route path="/settings/roles/create" element={<PrivateRoute element={CreateRole} /> } />
          <Route path="/settings/roles/edit" element={<PrivateRoute element={EditRoles } /> } />

          {/* Reports */}
          <Route path="/reports/workorder" element={<PrivateRoute element={WorkOrderReport } />} />
          <Route path="/reports/fieldattendence" element={<PrivateRoute element={FieldUserAttenderReport} />} />
          <Route path="/reports/login-logout" element={<PrivateRoute element={LoginLogoutReport} />} />

          {/* Taxation Setting */}
          <Route path="/taxation-setting" element={<PrivateRoute element={TaxationSetting} />} />


          {/* Billings System */}
          <Route path="/billings/pricing-structure" element={<DefaultPricingStructure />} />
          <Route path="/billings/usage-limit" element={<UsageLimitStrc />} />
          <Route path="/billings/currency-management" element={<CurrencyMangment />} />
          <Route path="/billings/pricing-option" element={<CustomPricingOption />} />
          <Route path="/billings/package-creation" element={<PackageCreateSys />} />
          <Route path="/billings/package-List" element={<PackagesList/>} />

          {/*----------- Admin */}

          {/* DashBoard */}
          <Route path="/dashboard/admin" element={<PrivateRoute element={AdminDashboard} />} />
          {/* Admin Company Profile Detail */}
          <Route path="/company/profile" element={<PrivateRoute element={AdminProfile } />} />


          {/* Users */}
          {/* Ofice */}
          <Route path="/users/office/create" element={<PrivateRoute element={Create } /> } />
          <Route path="/users/office/super-admin" element={<PrivateRoute element={SuperAdmin } /> } />
          <Route path="/users/office/:roleName" element={<PrivateRoute element={StaffAdmin } /> } />
          <Route path="/users/office/list/view" element={<PrivateRoute element={OfficeUserDetails} /> } />
          <Route path="/users/office/edit" element={<PrivateRoute element={EditOfficeUser} /> } />
          <Route path="/users/office/human-resource" element={<PrivateRoute element={HumanResource } /> } />
          <Route path="/users/office/other-users" element={<PrivateRoute element={OtherUsers } /> } />
          {/* Field */}
          <Route path="/users/field/create" element={<PrivateRoute element={CreateFieldUser } /> } />
          <Route path="/users/field/list" element={<PrivateRoute element={FieldUserList } /> } />
          <Route path="/users/field/edit" element={<PrivateRoute element={UpdateFieldUser} /> } />
          <Route path="/users/field/list/view" element={<PrivateRoute element={FieldUserDetails} /> } />
          <Route path="/users/field/import" element={<PrivateRoute element={ImportFieldUser } /> } />

          {/* Customers */}
          <Route path="/customers/create" element={<PrivateRoute element={CreateCustomer } />} />
          <Route path="/customers/list" element={<PrivateRoute element={CustomerList } />} />
          <Route path="/customers/list/details" element={<PrivateRoute element={CustomerDetails } />} />
          <Route path="/customers/list/edit" element={<PrivateRoute element={CustomerEdit } />} />
          {/* <Route path="/customers/list/address" element={<CustomerList />} /> */}
          <Route path="/customers/prospects" element={<PrivateRoute element={ProspectsCustomer } />} />
          <Route path="/customers/import" element={<PrivateRoute element={CustomerImport } />} />

          {/* Work Order */}
          <Route path="/workorder/create" element={<PrivateRoute element={CreateWorkOrder } />} />
          <Route path="/workorder/list" element={<PrivateRoute element={WorkOrderList } />} />
          <Route path="/workorder/list/details" element={<PrivateRoute element={WorkOrderDetails } />} />
          <Route path="/workorder/list/edit" element={<PrivateRoute element={WorkOrderEdit } />} />
          <Route path="/workorder/draft" element={<PrivateRoute element={DraftWorkOrder } />} />
          <Route path="/workorder/import" element={<PrivateRoute element={WorkOrderImport } />} />



          {/* Settings */}
          {/* Roles */}
          <Route path="/settings/admin/roles" element={<PrivateRoute element={AdminRoles } />} />
          <Route path="/settings/admin/roles/create" element={<PrivateRoute element={CreateAdminRole} />} />
          <Route path="/settings/admin/roles/edit" element={<PrivateRoute element={EditAdminRole } />} />
          {/* Work Order Time */}
          <Route path="/settings/admin/workOrderTime" element={<PrivateRoute element={WorkOrderTime } />} />
          {/* Language Change */}
          <Route path="/settings/admin/language" element={<PrivateRoute element={LanguageChange } />} />


          {/* Reports */}
          <Route path="/reports/company/workorder" element={<PrivateRoute element={CompanyWOreport } />} />
          <Route path="/reports/company/fielduser-attendence" element={<PrivateRoute element={FieldUserAttendece } />} />

          
        </Routes>
      </Router>
    </>
  );
}

export default App;
