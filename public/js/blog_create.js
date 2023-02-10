const storeKey = "blogs";

if (localStorage.getItem(storeKey) === null) {
    localStorage.setItem(storeKey, '[]')
}

/**@type {Array} */
let blogs = []

const blogListEl = document.querySelector(".blog-list")
/**@type {HTMLTemplateElement} */
const blogTemp = document.getElementById("blog-template")


// elements
const form = document.getElementById("blog-form")
const nameInput = document.getElementById("blog-names")
const emailInput = document.getElementById("blog-email")
const messageInput = document.getElementById("blog-message")
/**@type {HTMLInputElement} */
const imageInput = document.getElementById("blog-image")

form.addEventListener("submit", e => {
    e.preventDefault()
    addBlog()
})


const init = async () => {
    blogListEl.innerHTML = `<span class="loader"></span>`
    API.request(API.blogs.list, (blogs => {
        // show blogs if any
        blogs = blogs.slice(0, 10)
        showBlogs(blogs)
    }), (error) => {
        console.error({ error });
    })
}
init()


async function addBlog() {
    const title = nameInput.value
    const content = messageInput.value

    if ([title, content].some(value => value.trim() === "")) {
        return alert("Please fill all the fields!")
    }

    const blogData = new FormData()
    blogData.append('title', title)
    blogData.append('content', content)

    if (imageInput.files.length) {
        blogData.append('blogimage', imageInput.files.item(0))
        console.log("Send binary", imageInput.files.item(0));
    }


    const blogCreate = () => fetch(BASE_URL + '/blogs', {
        method: 'POST',
        body: blogData,
        headers: {
            'Authorization': 'Basic ' + (localStorage.getItem('authToken') ?? '')
        }
    })

    API.request(
        () => blogCreate(),
        async blog => {
            form.reset()
            await init()
            console.log("Blog created", { blog })
        },
        error => console.error("Blog create failed", { error })
    )
}



function showBlogs(blogs) {
    blogListEl.innerHTML = `<h3>All blogs.</h3>`

    if (blogs.length === 0) {
        blogListEl.innerHTML += `<h3 style="color: var(--secondary)">No Blogs yet.</h3>`
        return
    }

    blogs.forEach((blog, i) => {
        let blogEl = blogTemp.content.firstElementChild.cloneNode(true)
        blogEl.querySelector(".blog-name").innerHTML = blog.title
        blogEl.querySelector(".blog-email").innerHTML = ''
        blogEl.querySelector(".blog-message").innerHTML = blog.content.slice(0, 200) + (blog.content.length > 200 ? '...' : '')
        if (blog.image) {
            blogEl.querySelector(".blog-image").src =   BASE_URL + '/' + blog.image
        }
        // blogEl.querySelector(".blog-comment .blog-count").innerHTML = blog.comments.length
        blogEl.querySelector(".blog-readmore").href += blog._id
        // blogEl.querySelector(".blog-like").addEventListener("click", e => {
        //     // TODO: LIKE
        // })
        blogEl.querySelector(".blog-remove").addEventListener("click", e => {
            if (window.confirm("Confirm Delete?")) {
                API.request(() => API.blogs.delete(blog._id),
                    () => {
                        blogEl.remove()
                        console.log("Blog deleted");
                    },
                    error => console.error("Blog not deleted", { error })
                )
            }
        })

        // blogEl.querySelector(".blog-comment").addEventListener("click", e => {
        //     blogEl.querySelector(".blog-readmore").click()
        // })

        blogListEl.appendChild(blogEl)
    })
}

// function showBlogs() {
//     blogListEl.innerHTML = `<h3>Mange blogs.</h3>`

//     if (blogs.length === 0) {
//         blogListEl.innerHTML += `<h3 style="color: var(--secondary)">No Blogs yet.</h3>`
//         return
//     }


//     blogs.forEach((blog, i) => {
//         let blogEl = blogTemp.content.firstElementChild.cloneNode(true)
//         blogEl.querySelector(".blog-name").innerHTML = blog.names
//         blogEl.querySelector(".blog-email").innerHTML = blog.email
//         blogEl.querySelector(".blog-message").innerHTML = blog.message.slice(0, 100)
//         blogEl.querySelector(".blog-readmore").href += blog.id
//         blogEl.querySelector(".blog-remove").addEventListener("click", e => {
//             if (window.confirm("Confirm Delete?")) {
//                 blogs.splice(i, 1)
//                 localStorage.setItem(storeKey, JSON.stringify(blogs))
//                 showBlogs()
//             }
//         })

//         blogListEl.appendChild(blogEl)
//     })
// }










