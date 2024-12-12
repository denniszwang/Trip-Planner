import { BrowserRouter, Routes, Route } from "react-router-dom";

import Search from "./pages/Search";
import Flight from "./pages/Flight";
import Hotel from "./pages/Hotel";
import Table from "./components/Table";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/flight" element={<Flight />} />
          <Route path="/hotel" element={<Hotel />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
