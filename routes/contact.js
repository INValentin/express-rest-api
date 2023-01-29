import { Router } from 'express'
import { getAllContacts, getContact, updateContact, deleteContact, createContact } from '../controllers/contact'

const router = Router()

router.get('/', getAllContacts)
router.post('/', createContact)
router.get('/:id', getContact)
router.put('/:id', updateContact)
router.delete('/:id', deleteContact)


export default router