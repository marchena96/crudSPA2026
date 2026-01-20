import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Added for notifications
import { getContact, createContact, updateContact } from "../services/ContactService";

function ContactForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadContact();
        }
    }, [id]);

    const loadContact = async () => {
        setLoading(true);
        try {
            const data = await getContact(id);
            setFormData(data);
        } catch (error) {
            console.error("Error loading contact:", error);
            toast.error("Contact not found."); // Updated to toast
            navigate("/");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateContact(id, formData);
                toast.success("Contact updated successfully!"); // Added toast
            } else {
                await createContact(formData);
                toast.success("Contact created successfully!"); // Added toast
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving contact:", error);
            toast.error("An error occurred while saving."); // Updated to toast
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
            <div className="card shadow border-0">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">{id ? "Edit Contact" : "Create New Contact"}</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Name</label>
                            <input name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Email</label>
                            <input name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Phone</label>
                            <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Address</label>
                            <input name="address" className="form-control" value={formData.address} onChange={handleChange} />
                        </div>
                        <div className="d-flex justify-content-end gap-2">
                            <button type="button" onClick={() => navigate("/")} className="btn btn-secondary px-4">Cancel</button>
                            <button type="submit" className="btn btn-success px-4">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactForm;