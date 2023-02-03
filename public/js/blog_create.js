const storeKey = "blogs";

if (localStorage.getItem(storeKey) === null) {
    localStorage.setItem(storeKey, '[]')
}

/**@type {Array} */
let blogs = JSON.parse(localStorage.getItem(storeKey))


const blogListEl = document.querySelector(".blog-list")
/**@type {HTMLTemplateElement} */
const blogTemp = document.getElementById("blog-template")


// elements
const form = document.getElementById("blog-form")
const nameInput = document.getElementById("blog-names")
const emailInput = document.getElementById("blog-email")
const messageInput = document.getElementById("blog-message")

form.addEventListener("submit", e => {
    e.preventDefault()
    addBlog()
})


// show blogs if any
showBlogs()

function addBlog() {
    const names = nameInput.value
    const email = emailInput.value
    const message = messageInput.value

    if ([names, email, message].some(value => value.trim() === "")) {
        return alert("Please fill all the fields!")
    }

    const id = Date.now()
    const blog = { id, names, email, message }

    blogs.push(blog)
    form.reset()
    localStorage.setItem(storeKey, JSON.stringify(blogs))
    alert("Saved!")
    showBlogs()
}


function showBlogs() {
    blogListEl.innerHTML = `<h3>Mange blogs.</h3>`

    if (blogs.length === 0) {
        blogListEl.innerHTML += `<h3 style="color: var(--secondary)">No Blogs yet.</h3>`
        return
    }


    blogs.reverse().forEach((blog, i) => {
        let blogEl = blogTemp.content.firstElementChild.cloneNode(true)
        blogEl.querySelector(".blog-name").innerHTML = blog.names
        blogEl.querySelector(".blog-email").innerHTML = blog.email
        blogEl.querySelector(".blog-message").innerHTML = blog.message.slice(0, 100)
        blogEl.querySelector(".blog-readmore").href += blog.id
        blogEl.querySelector(".blog-remove").addEventListener("click", e => {
            if (window.confirm("Confirm Delete?")) {
                blogs.splice(i, 1)
                localStorage.setItem(storeKey, JSON.stringify(blogs))
                showBlogs()
            }
        })

        blogListEl.appendChild(blogEl)
    })
}










