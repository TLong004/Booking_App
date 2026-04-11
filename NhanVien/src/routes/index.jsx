import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import Login from '../pages/Login/login';
import ServiceDeskPage from '../pages/ServiceDeskPage/ServiceDeskPage';
import NurseStationPage from '../pages/NurseStationPage/NurseStationPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gioi-thieu" element={<HomePage />} /> 
      <Route path="/quay-dich-vu" element={<ServiceDeskPage />} />
      <Route path="/nurse-station" element={<NurseStationPage />} />
    </Routes>
  );
};

export default AppRouter;