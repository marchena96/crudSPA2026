import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "../services/contactService";

function ContactList({ onEdit }) {
    const [contacts, setContacts] = useState([]);

    // Load data when component mounts
    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {

        const data = await getContacts();
        setContacts(data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            await deleteContact(id);
            loadContacts(); // Refresh list after delete
        }
    };

    return (
        <div className="container">
            <h2>Contacts List</h2>
            <button onClick={() => onEdit(null)} className="btn-primary">
                Create New
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.email}</td>
                            <td>{contact.phone}</td>
                            <td>
                                <button onClick={() => onEdit(contact)}>Edit</button>
                                <button onClick={() => handleDelete(contact.id)} style={{ marginLeft: "10px", color: "red" }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ContactList;