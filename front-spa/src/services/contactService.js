// Antes: "https://localhost:44356//api/contacts"
const API_URL = "https://localhost:7143/api/contacts";

export const getContacts = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const getContact = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Contact not found");
    return response.json();
};

export const createContact = async (contact) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
    });
    return response.json();
};

export const updateContact = async (id, contact) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
    });
    // The API returns 204 No Content for PUT, so we don't parse JSON here usually
    return response.ok;
};

export const deleteContact = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });
    return response.ok;
};
