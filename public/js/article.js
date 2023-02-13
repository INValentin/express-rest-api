const isAdmin = window.localStorage.getItem('isAdmin') === 'true'
window.addEventListener("DOMContentLoaded", async e => {

    const articleTitle = document.querySelector(".article-title")
    const articleBody = document.querySelector(".article-message")
    const articleDelete = document.querySelector(".article-remove")
    const articleImage = document.querySelector(".article-img")
    const articleAuthor = document.querySelector(".article-author")

    /**@type {HTMLTemplateElement} */
    const commentTemp = document.getElementById("comment-temp")

    const commentForm = document.querySelector(".comment-form")
    const commentAuthor = document.querySelector("#comment-author")
    const commentMessage = document.querySelector("#comment-message")
    const commentList = document.querySelector(".comment-list")

    const blogLikeBtn = document.querySelector('.blog-like')
    const blogCommentText = document.querySelector('.blog-comment-count')
    const updateArticleLink = document.getElementById('update-link')


    const articleId = new URLSearchParams(location.search.replace("?", "")).get("id")

    if (isAdmin) {
        // wind
    }

    /**@type {Array} */
    let blogs = JSON.parse(localStorage.getItem("blogs"))

    let article = await (await API.blogs.get(articleId)).json()
    console.log({ article });

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
        API.request(
            () => API.blogs.commentToAblog(articleId, JSON.stringify(comment)),
            (cmt) => {
                console.log("comment created", { cmt })
                commentForm.reset()
                getComments()
            },
            error => console.error("comment create failed", { error })
        )
    })


    articleTitle.innerHTML = article.title
    articleBody.innerHTML = article.content
    if (article.image) {
        articleImage.src = BASE_URL + '/' + article.image
    }

    if (!isAdmin) {
        const likeCount = document.querySelector(".blog-like .blog-count")
        likeCount.innerHTML = article.likes.length
        blogLikeBtn.addEventListener("click", e => {
            e.preventDefault()
            likeCount.innerHTML = `<span class="inline loader"></span>`

            API.request(() => API.blogs.likeAblog(article._id),
                result => {
                    console.log("Liked a blog", { result });
                    likeCount.innerHTML = result.likes
                },
                error => {
                    likeCount.innerHTML = article.likes.length
                    console.error("Can't like a blog", { error })
                }
            )
        })
    } else {
        if (blogLikeBtn) {
            blogLikeBtn.style.display = 'none'
        }
        console.log(updateArticleLink)
        if (updateArticleLink) {
            updateArticleLink.href += articleId
        }
    }

    async function getComments() {
        /**@type {Array} */
        let comments = await (await API.blogs.getBlogComments(articleId)).json() || article.comments
        commentList.innerHTML = ""
        blogCommentText.innerHTML = `(${comments?.length}) Add comment`


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
                        API.request(() => API.blogs.deleteAblogComment(articleId, comment.id), () => {
                            commentEl.remove();
                            console.log("comment deleted");
                        }, error => console.error("Comment delete failed", { error }))
                    }

                })
            }
            commentList.appendChild(commentEl)
        })

    }


})