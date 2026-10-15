import { Routes, Route } from "react-router-dom";
import RegistrationPage from "./RegistrationPage";
import HomePage from "./HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;