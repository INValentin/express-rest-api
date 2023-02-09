const isAdmin = localStorage.getItem('isAdmin') === 'true';
console.log(localStorage.getItem('isAdmin'))

if (isAdmin) {
    if (window.location.href.includes('/contact.html')) {
        console.log("Redirect");
        window.location.href = '/admin-contacts.html'
    }
}

const init = async () => {
    API.request(API.contacts.list,
        contacts => {
            showContacts(contacts)
        },
        error => console.error("List contacts failed", { error })
    )
}
if (isAdmin) {
    init()
}

const contactListEl = document.querySelector(".contact-list")
/**@type {HTMLTemplateElement} */
const contactTemp = document.getElementById("contact-template")

// elements
const form = document.getElementById("contact-form")
const nameInput = document.getElementById("contact-names")
const emailInput = document.getElementById("contact-email")
const messageInput = document.getElementById("contact-message")

if (!isAdmin) {
    console.log(form)
    form.addEventListener("submit", e => {
        e.preventDefault()
        addContact()
    })
}

function addContact() {
    const names = nameInput.value
    const email = emailInput.value
    const message = messageInput.value

    if ([names, email, message].some(value => value.trim() === "")) {
        return handleShowError("Please fill all the fields!")
    }

    const contact = { fullName: names, email, message }

    API.request(
        () => API.contacts.create(JSON.stringify(contact)),
        async contact => {
            console.log("Contact created", { contact });
            alert("Contact was sent successfully!")
            form.reset()
        },
        error => console.error("Contact create failed", { error })
    )
}


function showContacts(contacts) {
    contactListEl.innerHTML = `<h3>Contact Messages!</h3>`

    if (contacts.length === 0) {
        contactListEl.innerHTML += `<h3 style="color: var(--secondary)">No saved contacts!</h3>`
        return
    }


    contacts.forEach((contact, i) => {
        let contactEl = contactTemp.content.firstElementChild.cloneNode(true)
        contactEl.querySelector(".contact-name").innerHTML = contact.fullName
        contactEl.querySelector(".contact-email").innerHTML = contact.email
        contactEl.querySelector(".contact-message").innerHTML = contact.message
        contactEl.querySelector(".contact-remove").addEventListener("click", e => {
            API.request(() => API.contacts.delete(contact._id),
                () => {
                    console.log("Contact deleted");
                    contactEl.remove()
                },
                error => console.error("Contact delete failed", { error })
            )
        })

        contactListEl.appendChild(contactEl)
    })
}










