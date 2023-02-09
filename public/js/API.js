const BASE_URL = location.hostname !== 'andela-express.onrender.com' ? 'http://localhost:5000' : "";


const login = async (creds) => {
    return request('/auth/login', { method: 'POST', body: creds })
}

const getBlogComments = async (blogId) => {
    return request(`/blogs/${blogId}/comments`)
}

const likeAblog = async (blogId) => {
    return request(`/blogs/${blogId}/like`, { method: 'POST' })
}

const commentToAblog = async (blogId, commentData) => {
    return request(`/blogs/${blogId}/comments`, { body: commentData, method: 'POST' })
}

const updateAblogComment = async (blogId, commentId, newCommentData) => {
    return request(`/blogs/${blogId}/comments/${commentId}`, { method: 'PUT', body: newCommentData })
}

const deleteAblogComment = async (blogId, commentId) => {
    return request(`/blogs/${blogId}/comments/${commentId}`, { method: 'DELETE' })
}

const apiRequest = (func, successCallback, errorCallback) => {
    func().then(async (/**@type {Response} */ res) => {
        let data = res.status === 204 ? {} : await res.json()
        if (res.ok) {
            return successCallback(data)
        } else {
            const errorMsg = data?.error?.toString() || ''
            handleShowError(errorMsg)
            return errorCallback(errorMsg)
        }
    }).catch(error => {
        const errorMsg = (error?.error || error?.message || error || '')?.toString()
        handleShowError(errorMsg)
        errorCallback(errorMsg)
    })
}

const request = (url, options = {}) => {
    return fetch(BASE_URL + url, {
        ...options,
        headers: {
            'Accept': '*/*',
            'Authorization': 'Basic ' + (localStorage.getItem('authToken') ?? ''),
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        }
    })
}

function apiGenerator(route) {

    return {
        list: () => {
            return request(`/${route}`)
        },
        create: (body, headers = {}) => {
            return request(`/${route}`, { body, method: 'POST', headers })
        },
        get: (id) => request(`/${route}/${id}`),
        update: (id, body) => {
            return request(`/${route}/${id}`, { body, method: 'PUT' })
        },
        delete: (id) => {
            return request(`/${route}/${id}`, { method: 'DELETE' })
        }

    }
}

// localStorage.setItem('authToken', 'bmV3Ym95OjEyMw==')

const API = {
    login,
    blogs: {
        ...apiGenerator('blogs'),
        getBlogComments,
        deleteAblogComment,
        likeAblog,
        updateAblogComment,
        commentToAblog
    },
    users: apiGenerator('users'),
    contacts: apiGenerator('contacts'),
    request: apiRequest
}


function handleShowError(/** @type {String} */ error) {
    console.log(error);
    const errorEl = document.querySelector('.error-toast')
    const closeBtn = errorEl.querySelector('button.error-close')

    errorEl.querySelector("span").innerHTML = error === 'Failed to fetch' ? 'Connection failed!' : error
    errorEl.style.display = 'flex'
    let timeout = setTimeout(() => errorEl.style.display = "none", 5000)

    closeBtn.addEventListener("click", e => {
        clearTimeout(timeout)
        errorEl.style.display = "none"
    })
}