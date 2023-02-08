if (JSON.parse(localStorage.getItem('isAdmin')) !== true) {
    window.location.href = '/index.html'
}