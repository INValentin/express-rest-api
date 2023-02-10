const storeKey = "blogs";

if (localStorage.getItem(storeKey) === null) {
    localStorage.setItem(storeKey, '[]')
}

/**@type {Array} */
let blogs = []

const blogListEl = document.querySelector(".blog-list")
/**@type {HTMLTemplateElement} */
const blogTemp = document.getElementById("blog-template")
blogListEl.innerHTML = "<span class='loader'></span>"


API.request(API.blogs.list, (blogs => {
    // show blogs if any
    blogs = blogs.slice(0, 10)
    if (blogs) {

        showBlogs(blogs)
    }
}), (error) => {
    console.error({ error });
})

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
            blogEl.querySelector(".blog-image").src = BASE_URL + '/' + blog.image
        }
        blogEl.querySelector(".blog-like .blog-count").innerHTML = blog.likes.length
        blogEl.querySelector(".blog-comment .blog-count").innerHTML = blog.comments.length
        blogEl.querySelector(".blog-readmore").href += blog._id
        blogEl.querySelector(".blog-like").addEventListener("click", e => {
            let likeCount = blogEl.querySelector(".blog-like .blog-count")
            likeCount.innerHTML = `<span class="inline loader"></span>`

            API.request(() => API.blogs.likeAblog(blog._id),
                result => {
                    console.log("Liked a blog", { result });
                    likeCount.innerHTML = result?.likes ?? blog.likes.length + 1
                },
                error => {
                    likeCount.innerHTML = blog.likes.length
                    console.error("Can't like a blog", { error })
                }
            )
        })

        blogEl.querySelector(".blog-comment").addEventListener("click", e => {
            blogEl.querySelector(".blog-readmore").click()
        })

        blogListEl.appendChild(blogEl)
    })
}









