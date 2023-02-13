const articleId = new URLSearchParams(location.search.replace("?", "")).get("id")

// elements
const form = document.getElementById("blog-form")
const titleInput = document.getElementById("blog-names")
const emailInput = document.getElementById("blog-email")
const contentInput = document.getElementById("blog-message")
/**@type {HTMLInputElement} */
const imageInput = document.getElementById("blog-image")
const goBackLink = document.getElementById('go-back-link')
if (goBackLink)
    goBackLink.href += articleId

form.addEventListener("submit", e => {
    e.preventDefault()
    addBlog()
})

async function init() {
    API.request(
        () => API.blogs.get(articleId),
        (blog) => {
            titleInput.value = blog.title;
            contentInput.value = blog.content;
        },
        error => {
            console.log('Getting blog failed!', error);
        }
    )
}

init()

async function addBlog() {
    const title = titleInput.value
    const content = contentInput.value

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


    const blogUpdate = () => fetch(BASE_URL + `/blogs/${articleId}/`, {
        method: 'PUT',
        body: blogData,
        headers: {
            'Authorization': 'Basic ' + (localStorage.getItem('authToken') ?? '')
        }
    })

    API.request(
        () => blogUpdate(),
        blog => {
            titleInput.value = blog.title
            contentInput.value = blog.content
            alert("Blog Updated!")
            console.log("Blog updated", { blog })
        },
        error => console.error("Blog update failed", { error })
    )
}








