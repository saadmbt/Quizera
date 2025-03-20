import { Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import ProfDashboard from '../components/dashbord prof/ProfDashboard'
import Groups from '../components/groups/Groups';
import Upload from '../pages/Dashboard/uploadpage';
import Quizzespage from '../pages/Dashboard/Quizzespage';


const ProfRoutes = (
<Routes>
<Route path="/professor" element={<DashboardLayout />}>

  <Route path="dashboard" element={<ProfDashboard />} />
  <Route path="groups" element={<Groups />} />
  <Route path="upload" element={<Upload />} />
  <Route path="quizzes" element={<Quizzespage headerSet={false} />} />
</Route>
</Routes>
// {/* <Route path='settings' element={</>}/> */}




  // </Route>
//   <Route path="/professor" element={<DashboardLayout />}>
//   <Route index element={<ProfDashboard />} /> {/* Default route when accessing /professor */}
//   <Route path="dashboard" element={<ProfDashboard />} />
//   <Route path="groups" element={<Groups />} />
//   {/* Add more professor-specific routes here */}
// </Route>
);

export default ProfRoutes;
