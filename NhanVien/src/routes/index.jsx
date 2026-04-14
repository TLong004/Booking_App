import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import Login from '../pages/Login/login';
import ServiceDeskPage from '../pages/ServiceDeskPage/ServiceDeskPage';
import NurseStationPage from '../pages/NurseStationPage/NurseStationPage';
import MedicalExamPage from '../pages/MedicalExamPage/MedicalExamPage';
import ExamQueuePage from '../pages/MedicalExamPage/Examqueuepage';
import ExamPage from '../pages/MedicalExamPage/Exampage';
import ScheduleTab from '../pages/MedicalExamPage/ScheduleTab';
import ScheduleList from '../pages/MedicalExamPage/ScheduleList';
import CreateSchedule from '../pages/MedicalExamPage/CreateSchedule';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/gioi-thieu" element={<HomePage />} />
      <Route path="/quay-dich-vu" element={<ServiceDeskPage />} />
      <Route path="/nurse-station" element={<NurseStationPage />} />
      <Route path="/kham-benh" element={<MedicalExamPage />}>
        <Route index element={<ExamQueuePage />} />
        <Route path="kham" element={<ExamPage />} />
        <Route path="lich-truc" element={<ScheduleTab />} />
        <Route path="danh-sach-lich" element={<ScheduleList />} />
        <Route path="tao-lich-truc" element={<CreateSchedule />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;