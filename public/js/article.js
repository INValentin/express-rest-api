const articleTitle = document.querySelector(".article-title")
const articleBody = document.querySelector(".article-message")
const articleDelete = document.querySelector(".article-remove")
const articleAuthor = document.querySelector(".article-author")

/**@type {HTMLTemplateElement} */
const commentTemp = document.getElementById("comment-temp")

const commentForm = document.querySelector(".comment-form")
const commentAuthor = document.querySelector("#comment-author")
const commentMessage = document.querySelector("#comment-message")
const commentList = document.querySelector(".comment-list")


const articleId = new URLSearchParams(location.search.replace("?", "")).get("id")

/**@type {Array} */
let blogs = JSON.parse(localStorage.getItem("blogs"))

let article = blogs.find(blog => Number(blog.id) === Number(articleId))

getComments()

if (!article) {
    window.alert("Article not found")
    window.location.href = "./blog.html"
}

if (articleDelete) {

    articleDelete.addEventListener("click", e => {
        if (window.confirm("Confirm Delete?")) {
            localStorage.setItem("blogs", JSON.stringify(
                blogs.filter(blog => Number(blog.id) !== Number(articleId))
            ))

            blogs = JSON.parse(localStorage.getItem("blogs"))

            window.location.href = "./blog.html"
        }
    })

}

commentForm.addEventListener("submit", e => {
    e.preventDefault()
    const author = commentAuthor.value
    const message = commentMessage.value

    if (author === "" || message === "") {
        return alert("Author, and comment are required!")
    }
    const comment = { author, message, date: (new Date).toLocaleString() }
    // console.log({comment})
    const blogIndex = blogs.findIndex(b => b.id === article.id)
    blogs[blogIndex].comments = [...(blogs[blogIndex].comments ?? []), comment]
    localStorage.setItem("blogs", JSON.stringify(blogs))
    commentForm.reset()
    getComments()
})


articleTitle.innerHTML = article.names
articleAuthor.innerHTML = article.email
articleBody.innerHTML = article.message

function getComments() {
    /**@type {Array} */
    console.log(articleId)
    let comments = blogs.find(blog => blog.id === article.id)?.comments || []
    commentList.innerHTML = ""

    if (comments.length === 0) {
        commentList.innerHTML = `<h4>No comments yet.</h4>`

        return
    }

    comments.reverse().forEach((comment, idx) => {
        let commentEl = commentTemp.content.firstElementChild.cloneNode(true)

        commentEl.querySelector(".comment-author-name").innerHTML = comment.author
        commentEl.querySelector(".comment-date").innerHTML = comment.date
        commentEl.querySelector(".comment-message").innerHTML = comment.message
        const commentDelete = commentEl.querySelector(".comment-delete")
        if (commentDelete) {
            commentDelete.addEventListener("click", e => {
                if (confirm("Confirm delete comment?")) {
                    comments.splice(idx, 1)
                    let blogIdx = blogs.findIndex(blg => blg.id === article.id)
                    blogs[blogIdx].comments = comments
                    localStorage.setItem('blogs', JSON.stringify(blogs))
                    getComments()
                }

            })
        }
        commentList.appendChild(commentEl)
    })


}

