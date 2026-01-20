import { useState, useEffect } from 'react';
import { ContactService } from '../services/ContactService';

export function useContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshContacts = async () => {
        try {
            const data = await ContactService.getAll();
            setContacts(data);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshContacts();
    }, []);

    const removeContact = async (id) => {
        await ContactService.delete(id);
        await refreshContacts();
    };

    // Return only what the component needs to know
    return { contacts, loading, removeContact, refreshContacts };
}