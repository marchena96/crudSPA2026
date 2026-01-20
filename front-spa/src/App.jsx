import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ¡Vital para evitar errores!
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <Router>
      {/* min-vh-100 asegura que la app ocupe todo el alto del navegador */}
      <div className="min-vh-100 d-flex flex-column bg-light">
        <ToastContainer theme="colored" position="top-right" autoClose={3000} />

        <nav className="navbar navbar-dark bg-dark shadow-sm py-3 px-4">
          <div className="container-fluid">
            <a className="navbar-brand fw-bold d-flex align-items-center fs-4" href="/">
              <i className="bi bi-person-rolodex me-2"></i>
              SISTEMA DE CONTACTOS 2026
            </a>
          </div>
        </nav>

        {/* main flex-grow-1 estira el contenido para llenar la pantalla completa */}
        <main className="flex-grow-1 container-fluid p-4">
          <Routes>
            <Route path="/" element={<ContactList />} />
            <Route path="/create" element={<ContactForm />} />
            <Route path="/edit/:id" element={<ContactForm />} />
          </Routes>
        </main>

        <footer className="bg-white border-top py-3 text-center text-muted">
          <small>Diseño Full-Width Responsivo &copy; 2026</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;