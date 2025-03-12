import { Route } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/Register';
import UserRoleSelection from '../pages/UserRoleSelection';
import DashboardLayout from '../layouts/DashboardLayout';
import ProfDashboard from '../components/dashbord prof/ProfDashboard'
import Groups from '../components/groups/Groups';


const ProfRoutes = (

  <Route path="/professor-dashboard" element={<DashboardLayout />}>
    <Route path="profDash" element={<ProfDashboard/>}/>
    <Route path="groups" element={<Groups />} />
  </Route>
);

export default ProfRoutes;
