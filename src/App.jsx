import "./App.css";
import Home from "./Components/Home";
import { Routes, Route } from "react-router-dom";
import MovieDetail from "./Components/MovieDetail.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </>
  );
}

export default App;
