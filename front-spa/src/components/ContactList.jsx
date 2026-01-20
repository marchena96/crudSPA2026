import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Corrected casing to match your filename: ContactService.js
import { getContacts, deleteContact } from "../services/ContactService";

function ContactList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const data = await getContacts();
            setContacts(data);
        } catch (error) {
            console.error("Error fetching contacts:", error);
            alert("Could not load contacts. Please check if the API is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            const success = await deleteContact(id);
            if (success) {
                loadContacts();
            } else {
                alert("Error deleting contact.");
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="text-primary">Contacts List</h2>
                <button
                    onClick={() => navigate("/create")}
                    className="btn btn-primary shadow-sm"
                >
                    <i className="bi bi-plus-lg"></i> Create New Contact
                </button>
            </div>

            <div className="card shadow border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.length > 0 ? (
                                    contacts.map((contact) => (
                                        <tr key={contact.id}>
                                            <td className="ps-4 fw-bold">{contact.name}</td>
                                            <td>{contact.email}</td>
                                            <td>{contact.phone}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => navigate(`/edit/${contact.id}`)}
                                                    className="btn btn-outline-warning btn-sm me-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(contact.id)}
                                                    className="btn btn-outline-danger btn-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">
                                            No contacts found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactList;