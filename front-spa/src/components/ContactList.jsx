import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
// Ensure casing matches your file exactly: ContactService.js
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
            toast.error("Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            try {
                const success = await deleteContact(id);
                if (success) {
                    toast.info("Contact removed successfully.");
                    loadContacts(); // Refresh the list
                }
            } catch (error) {
                toast.error("Error deleting contact.");
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-primary fw-bold">My Contacts</h2>
                <button
                    onClick={() => navigate("/create")}
                    className="btn btn-primary shadow-sm"
                >
                    + Add New Contact
                </button>
            </div>

            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
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
                                        <td className="ps-4 fw-semibold">{contact.name}</td>
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
                                    <td colSpan="4" className="text-center py-5 text-muted">
                                        No contacts found. Click "Add New Contact" to start.
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