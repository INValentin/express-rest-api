const storeKey = "contacts";

if (localStorage.getItem(storeKey) === null) {
    localStorage.setItem(storeKey, '[]')
}

/**@type {Array} */
let contacts = JSON.parse(localStorage.getItem(storeKey))


const contactListEl = document.querySelector(".contact-list")
/**@type {HTMLTemplateElement} */
const contactTemp = document.getElementById("contact-template")


// elements
const form = document.getElementById("contact-form")
const nameInput = document.getElementById("contact-names")
const emailInput = document.getElementById("contact-email")
const messageInput = document.getElementById("contact-message")

form.addEventListener("submit", e => {
    e.preventDefault()
    addContact()
})


// show contacts if any
showContacts()

function addContact() {
    const names = nameInput.value
    const email = emailInput.value
    const message = messageInput.value

    if ([names, email, message].some(value => value.trim() === "")) {
        return alert("Please fill all the fields!")
    }

    const contact = { names, email, message }

    contacts.push(contact)
    form.reset()
    localStorage.setItem(storeKey, JSON.stringify(contacts))
    alert("Saved!")
    showContacts()
}


function showContacts() {
    contactListEl.innerHTML = `<h3>Saved Contacts!</h3>`

    if (contacts.length === 0) {
        contactListEl.innerHTML += `<h3 style="color: var(--secondary)">No saved contacts!</h3>`
        return
    }


    contacts.forEach((contact, i) => {
        let contactEl = contactTemp.content.firstElementChild.cloneNode(true)
        contactEl.querySelector(".contact-name").innerHTML = contact.names
        contactEl.querySelector(".contact-email").innerHTML = contact.email
        contactEl.querySelector(".contact-message").innerHTML = contact.message
        contactEl.querySelector(".contact-remove").addEventListener("click", e => {
            contacts.splice(i, 1)
            localStorage.setItem(storeKey, JSON.stringify(contacts))
            showContacts()
        })

        contactListEl.appendChild(contactEl)
    })
}










