import { Outlet } from "react-router-dom";
import { Header } from "../header";

function LayoutAdmin() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="container my-4">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;
