import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getContacts, deleteContact } from "../services/ContactService";

function ContactList() {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]); // Para el buscador
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadContacts();
    }, []);

    // Cada vez que cambie la búsqueda o la lista original, filtramos
    useEffect(() => {
        const results = contacts.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredContacts(results);
    }, [searchTerm, contacts]);

    const loadContacts = async () => {
        try {
            const data = await getContacts();
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            toast.error("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
            try {
                await deleteContact(id);
                toast.info("Contacto eliminado correctamente.");
                // OPTIMIZACIÓN: Filtramos localmente para no mostrar el spinner de carga de nuevo
                setContacts(contacts.filter(c => c.id !== id));
            } catch (error) {
                toast.error("No se pudo eliminar el contacto.");
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
                <div className="spinner-grow text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 pb-5">
            <div className="row align-items-center mb-4">
                <div className="col-md-6">
                    <h2 className="text-primary fw-bold mb-0">Gestión de Contactos</h2>
                </div>
                <div className="col-md-6 text-md-end mt-3 mt-md-0">
                    <button onClick={() => navigate("/create")} className="btn btn-primary btn-lg shadow-sm">
                        <i className="bi bi-person-plus-fill me-2"></i> Nuevo Contacto
                    </button>
                </div>
            </div>

            {/* Barra de Búsqueda */}
            <div className="card mb-4 border-0 shadow-sm">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Buscar por nombre o email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card shadow border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Nombre</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.length > 0 ? (
                                filteredContacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-dark">{contact.name}</div>
                                            <div className="small text-muted">{contact.address || 'Sin dirección'}</div>
                                        </td>
                                        <td>{contact.email}</td>
                                        <td>{contact.phone}</td>
                                        <td className="text-center">
                                            <button
                                                onClick={() => navigate(`/edit/${contact.id}`)}
                                                className="btn btn-outline-info btn-sm me-2"
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="btn btn-outline-danger btn-sm"
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <i className="bi bi-emoji-frown display-4 text-muted"></i>
                                        <p className="mt-3 text-muted">No se encontraron contactos que coincidan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ContactList;