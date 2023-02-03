const storeKey = "blogs";

if (localStorage.getItem(storeKey) === null) {
    localStorage.setItem(storeKey, '[]')
}

/**@type {Array} */
let blogs = JSON.parse(localStorage.getItem(storeKey))


const blogListEl = document.querySelector(".blog-list")
/**@type {HTMLTemplateElement} */
const blogTemp = document.getElementById("blog-template")

// show blogs if any
showBlogs()

function showBlogs() {
    blogListEl.innerHTML = `<h3>All blogs.</h3>`

    if (blogs.length === 0) {
        blogListEl.innerHTML += `<h3 style="color: var(--secondary)">No Blogs yet.</h3>`
        return
    }

    blogs.reverse().forEach((blog, i) => {
        let blogEl = blogTemp.content.firstElementChild.cloneNode(true)
        blogEl.querySelector(".blog-name").innerHTML = blog.names
        blogEl.querySelector(".blog-email").innerHTML = blog.email
        blogEl.querySelector(".blog-message").innerHTML = blog.message.slice(0, 100)
        blogEl.querySelector(".blog-like .blog-count").innerHTML = blog.likes ?? 0
        blogEl.querySelector(".blog-comment .blog-count").innerHTML = blog.comments?.length ?? 0
        blogEl.querySelector(".blog-readmore").href += blog.id
        //blogEl.querySelector(".blog-readmore-admin").href += blog.id
        blogEl.querySelector(".blog-like").addEventListener("click", e => {
            blogs[i].likes = (blogs[i].likes ?? 0) + 1
            localStorage.setItem(storeKey, JSON.stringify(blogs))
            showBlogs()
        })

        blogEl.querySelector(".blog-comment").addEventListener("click", e => {
            blogEl.querySelector(".blog-readmore").click()
        })

        blogListEl.appendChild(blogEl)
    })
}










