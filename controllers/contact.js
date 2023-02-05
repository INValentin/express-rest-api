import Contact from '../models/contact';

export async function getAllContacts(req, res) {
    try {
        const contacts = await Contact.find()
        res.json(contacts)
    } catch (error) {
        console.log("Fetch contacts failed: \n", error);
        res.status(500).json({ error: "Can't fetch contacts" })
    }
}

export async function createContact(req, res) {
    try {
        const contact = new Contact({ ...req.body });
        await contact.save()
        res.status(201).json(contact)
    } catch (error) {``
        console.log("Can't create a contact:\n")
        res.status(400).json({ error: error?.message || 'Can\'t create a contact' })
    }
}

export async function getContact(req, res) {
    try {
        const contact = await Contact.findById(req.params.id)
        if (!contact) return res.status(404).json({ error: "Contact not found" })
    } catch (error) {
        console.log("Can't fetch a contact: \n", error);
        res.status(500).json({ error: "Can't fetch contacts" })
    }
}

export async function updateContact(req, res) {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, { ...req.body })
        if (!updatedContact) return res.status(404).json({ error: 'Contact not found' })
        res.json(await Contact.findById(req.params.id))
    } catch (error) {
        console.log("Can't update a contact: \n", error);
        res.status(500).json({ error: "Can't update contacts" })
    }
}

export async function deleteContact(req, res) {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Contact not found' })
        res.status(204).json()
    } catch (error) {
        console.log("Can't delete a contact: \n", error);
        res.status(500).json({ error: "Can't delete contacts" })
    }
}



