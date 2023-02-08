window.addEventListener('DOMContentLoaded', e => {
    const form = document.getElementById('signup-form')

    form.addEventListener('submit', e => {
        e.preventDefault()
        const fullName = form.querySelector("#fullname")?.value
        const username = form.querySelector("#username")?.value
        const password = form.querySelector("#password")?.value

        if (!Boolean(fullName) || !Boolean(username) || !Boolean(password)) {
            return handleShowError('Full Name, username & password are required!')
        }

        const loginLoader = document.getElementById("login-loader")
        loginLoader.style.display = 'inline-block'

        API.request(
            () => API.users.create(JSON.stringify({ fullName, username, password })),
            (user) => {
                loginLoader.style.display = 'none'
                console.log("User created", { user });
                if (confirm("User created: Login now?")){
                     window.location.href = ("/login.html")
                }
            },
            error => {
                loginLoader.style.display = 'none'

                console.error("User not created", { error });
            }
        )
    })
})