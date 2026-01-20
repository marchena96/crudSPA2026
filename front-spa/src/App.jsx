import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Trigger Toasts in the Form
import 'react-toastify/dist/ReactToastify.css'; // Trigger Toasts in the Form 
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <a className="navbar-brand" href="/">CrudSPA</a>
        </div>
      </nav>

      <main className="container">
        <Routes>
          {/* The "Index" page */}
          <Route path="/" element={<ContactList />} />

          {/* The "Create" page */}
          <Route path="/create" element={<ContactForm />} />

          {/* The "Edit" page with a parameter */}
          <Route path="/edit/:id" element={<ContactForm />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;