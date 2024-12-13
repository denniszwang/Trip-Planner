import { BrowserRouter, Routes, Route } from "react-router-dom";

import Flight from "./pages/Flight";
import Hotel from "./pages/Hotel";
import Plan from "./pages/Plan";
import Home from "./pages/Home";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flight" element={<Flight />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/plans" element={<Plan />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
