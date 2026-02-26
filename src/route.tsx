import { Route, Routes } from "react-router-dom";
import { Header } from "./assets/components/header";
import { Home } from "./pages/home";

function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
