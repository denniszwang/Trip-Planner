import { BrowserRouter, Routes, Route } from "react-router-dom";

import Search from "./pages/Search";
import Flight from "./pages/Flight";
import Hotel from "./pages/Hotel";
import Plan from "./pages/Plan";
import NavBar from "./components/NavBar";
import Account from "./components/AccountInfo";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Account />} />
          <Route path="/flight" element={<Flight />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/plans" element={<Plan />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
