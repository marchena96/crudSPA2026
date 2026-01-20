import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { getContact, createContact, updateContact } from "../services/ContactService";

function ContactForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado inicial limpio
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Para el botón de guardado

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
        setIsSubmitting(true); // Bloqueamos el botón de guardado

        try {
            if (id) {
                // SENIOR TIP: Forzamos que el objeto enviado tenga el ID correcto como número
                // Esto evita el error 'id != contact.Id' en tu controlador de ASP.NET
                const dataToUpdate = { ...formData, id: parseInt(id) };
                await updateContact(id, dataToUpdate);
                toast.success("¡Contacto actualizado con éxito!");
            } else {
                await createContact(formData);
                toast.success("¡Contacto creado con éxito!");
            }
            navigate("/");
        } catch (error) {
            console.error("Error saving contact:", error);
            // Si el backend envía un error específico (ej. email duplicado), lo mostramos
            const serverMsg = error.response?.data?.message || "Error al guardar los cambios.";
            toast.error(serverMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando datos...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm border-0">
                <div className={`card-header text-white ${id ? "bg-warning" : "bg-success"}`}>
                    <h4 className="mb-0">
                        <i className={`bi ${id ? "bi-pencil-square" : "bi-person-plus-fill"} me-2`}></i>
                        {id ? "Editar Contacto" : "Nuevo Contacto"}
                    </h4>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Nombre Completo</label>
                                <input
                                    name="name"
                                    className="form-control form-control-lg"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Correo Electrónico</label>
                                <input
                                    name="email"
                                    type="email"
                                    className="form-control form-control-lg"
                                    placeholder="juan@correo.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Teléfono</label>
                                <input
                                    name="phone"
                                    className="form-control"
                                    placeholder="+34 600 000 000"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold">Dirección</label>
                                <input
                                    name="address"
                                    className="form-control"
                                    placeholder="Calle Falsa 123"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="btn btn-outline-secondary px-4"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-5"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar Contacto"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactForm;