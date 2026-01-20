import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
// Verifica que el archivo sea 'contactService.js' en minúsculas
import { getContacts, deleteContact } from "../services/contactService";

function ContactForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", address: ""
    });
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (id) loadContact();
    }, [id]);

    const loadContact = async () => {
        setLoading(true);
        try {
            const data = await getContact(id);
            setFormData(data);
        } catch (error) {
            toast.error("No se pudo cargar el contacto.");
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
        setIsSubmitting(true);
        try {
            if (id) {
                const dataToUpdate = { ...formData, id: parseInt(id) };
                await updateContact(id, dataToUpdate);
                toast.success("¡Contacto actualizado!");
            } else {
                await createContact(formData);
                toast.success("¡Contacto creado!");
            }
            navigate("/");
        } catch (error) {
            toast.error("Error al guardar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border text-primary" role="status"></div>
        </div>
    );

    return (
        /* Flexbox para centrar la tarjeta en el espacio de pantalla completa */
        <div className="d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: '900px' }}>
                <div className={`card-header p-4 border-0 rounded-top-4 text-white ${id ? "bg-primary" : "bg-success"}`}>
                    <h3 className="mb-0 fw-bold">
                        {id ? "Actualizar Información" : "Nuevo Registro"}
                    </h3>
                </div>
                <div className="card-body p-4 p-md-5 bg-white rounded-bottom-4">
                    <form onSubmit={handleSubmit}>
                        {/* CSS Grid (Bootstrap Row) para el layout moderno */}
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Nombre Completo</label>
                                <input name="name" className="form-control form-control-lg"
                                    value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Email</label>
                                <input name="email" type="email" className="form-control form-control-lg"
                                    value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Teléfono</label>
                                <input name="phone" className="form-control form-control-lg"
                                    value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Dirección</label>
                                <input name="address" className="form-control form-control-lg"
                                    value={formData.address} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-3 mt-5">
                            <button type="button" onClick={() => navigate("/")}
                                className="btn btn-outline-secondary btn-lg px-4 border-0">
                                Cancelar
                            </button>
                            <button type="submit" disabled={isSubmitting}
                                className="btn btn-dark btn-lg px-5 shadow">
                                {isSubmitting ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</>
                                ) : "Guardar Registro"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactForm;