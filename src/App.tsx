/* src/App.tsx */
// #section Imports
import { Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
// #end-section
// #component App
function App() {
  // #section return
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
  // #end-section
}
export default App;
// #end-component