if (typeof window.localStorage.getItem('authToken') === 'string'){
    // window.location.href('./dashboard')
    // handleShowError("You're already logged in!")
}

window.addEventListener('DOMContentLoaded', async e => {
    const form = document.getElementById('loginForm')
    form.addEventListener('submit', e => {
        e.preventDefault()
        const username = form.querySelector('#login-username')?.value
        const password = form.querySelector('#login-password')?.value

        if (!Boolean(username) && !Boolean(password)) {
            return handleShowError("Username & password are required!")
        }
        
        const loginLoader = document.getElementById("login-loader")
        loginLoader.style.display = 'inline-block'
       API.request( 
        () => API.login(JSON.stringify({username, password})),
        ({token, isAdmin}) => {
            localStorage.setItem('authToken', token)
            localStorage.setItem('isAdmin', JSON.stringify(isAdmin ?? false))
            loginLoader.style.display = 'none'
            if (isAdmin) {
                window.location.href = '/dashboard.html'
            } else {
                window.location.href = '/index.html'
            }
        },
        error => {
            loginLoader.style.display = 'none'
            console.error("Login failed", {error})
        }
       )
    })

})