const menuBtn = document.querySelector("#menu-btn")
const menuCloseBtn = document.querySelector("#menu-close")
const nav = document.querySelector("nav")
const navBtnUl = document.querySelector("#ul-btn-nav")
let logoutBtn = document.querySelector("#logout-btn")

menuCloseBtn.addEventListener("click", e => {
    nav.style.display = "none"
})

menuBtn.addEventListener("click", e => {
    let display = nav.style.display
    if (display === "flex") {
        nav.style.display = "none"
    } else {
        nav.style.display = "flex"
    }
})
if (typeof window.localStorage.getItem('authToken') === 'string') {
    if (!logoutBtn) {
        logoutBtn = navBtnUl.querySelector('li a').cloneNode(true)
        logoutBtn.href = "#!"
        logoutBtn.innerHTML = 'Logout'
        const liEl = document.createElement('li')
        liEl.appendChild(logoutBtn)
        navBtnUl.innerHTML = ''
        navBtnUl.appendChild(liEl)
    }
    logoutBtn.addEventListener("click", e => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('isAdmin')
        window.location.href = '/login.html'
    })

}