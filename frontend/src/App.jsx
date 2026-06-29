import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import AIDoctor from "./pages/AIDoctor";
import Diagnosis from "./pages/Diagnosis";
import Diabetes from "./pages/AIDiagnosis/Diabetes";
import DiabetesPredict from "./pages/AIDiagnosis/Diabetes_predict";
import Malaria from "./pages/AIDiagnosis/Malaria";
import MalariaPredict from "./pages/AIDiagnosis/Malaria_predict";
import Pneumonia from "./pages/AIDiagnosis/Pneumonia";
import PneumoniaPredict from "./pages/AIDiagnosis/Pneumonia_predict";
import Stroke from "./pages/AIDiagnosis/Stroke";
import StrokePredict from "./pages/AIDiagnosis/Stroke_predict";
import Skin from "./pages/AIDiagnosis/Skin";
import SkinPredict from "./pages/AIDiagnosis/Skin_predict";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/ai-doctor" element={<AIDoctor />} />
        <Route path="/diagnosis" element={<Diagnosis />}>
          <Route path="diabetes" element={<Diabetes />} />
          <Route path="diabetes-predict" element={<DiabetesPredict />} />
          <Route path="malaria" element={<Malaria />} />
          <Route path="malaria-predict" element={<MalariaPredict />} />
          <Route path="pneumonia" element={<Pneumonia />} />
          <Route path="pneumonia-predict" element={<PneumoniaPredict />} />
          <Route path="stroke" element={<Stroke />} />
          <Route path="stroke-predict" element={<StrokePredict />} />
          <Route path="skin" element={<Skin />} />
          <Route path="skin-predict" element={<SkinPredict />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
