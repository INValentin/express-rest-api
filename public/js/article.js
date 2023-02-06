window.addEventListener("DOMContentLoaded", async e => {

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

    let article = await (await API.blogs.get(articleId)).json()
    console.log({article});
    
    if (!article) {
        window.alert("Article not found")
        window.location.href = "./blog.html"
    }
    getComments()

    if (articleDelete) {

        articleDelete.addEventListener("click", async e => {
            if (window.confirm("Confirm Delete?")) {
                API.request(() => API.blogs.delete(articleId), () => {
                    console.log("blog deleted");
                    window.location.href = "./blog.html"
                }, (error) => console.error("Delete blog", { error }))
            }
        })

    }

    commentForm.addEventListener("submit", async e => {
        e.preventDefault()
        const message = commentMessage.value

        if (message.trim() === "") {
            return alert("Comment is required!")
        }
        const comment = { comment: message }
        // console.log({comment})
        commentForm.reset()
        API.request(
            () => API.blogs.commentToAblog(articleId, JSON.stringify(comment)),
            (cmt) => {
                console.log("comment created", { cmt })
                getComments()
            },
            error => console.error("comment create failed", { error })
        )
    })


    articleTitle.innerHTML = article.title
    articleBody.innerHTML = article.content

    async function getComments() {
        /**@type {Array} */
        let comments = await (await API.blogs.getBlogComments(articleId)).json() || article.comments
        commentList.innerHTML = ""

        if (comments.length === 0) {
            commentList.innerHTML = `<h4>No comments yet.</h4>`

            return
        }

        comments.reverse().forEach((comment) => {
            let commentEl = commentTemp.content.firstElementChild.cloneNode(true)

            commentEl.querySelector(".comment-author-name").innerHTML = "comment"
            commentEl.querySelector(".comment-date").innerHTML = comment.user
            commentEl.querySelector(".comment-message").innerHTML = comment.comment
            const commentDelete = commentEl.querySelector(".comment-delete")
            if (commentDelete) {
                commentDelete.addEventListener("click", async e => {
                    if (confirm("Confirm delete comment?")) {
                        commentEl.remove();
                        API.request(() => API.blogs.commentToAblog(articleId), () => {
                            console.log("comment deleted");
                        }, error => console.error("Comment delete failed", { error }))
                    }

                })
            }
            commentList.appendChild(commentEl)
        })


    }


})