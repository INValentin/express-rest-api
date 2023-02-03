const menuBtn  = document.querySelector("#menu-btn")
const menuCloseBtn  = document.querySelector("#menu-close")
const nav = document.querySelector("nav")

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


