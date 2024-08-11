
document.addEventListener('DOMContentLoaded',
    async function() {
        await setCurrentUserNavbar()
        await fillCurrentUserTable()
    })

async function findCurrentUser() {
    const response = await fetch('rest/user')
    return response.json()
}

async function fillCurrentUserTable() {
    const table = document.getElementById('userData')
    const user = findCurrentUser()

    let currentUserTableHTML =
        `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.password}</td>
            <td>${user.roles.map(role => role.toString()).join(' ')}</td>
        </tr>`
    table.innerHTML = currentUserTableHTML
}

async function setCurrentUserNavbar() {
    const currentUserNavbar = document.getElementById('currentUserNavbar')
    const currentUser = findCurrentUser()

    currentUserNavbar.innerHTML =
        `<strong>${currentUser.email}</strong>
                 with roles: 
                 ${currentUser.roles.map(role => role.toString()).join(' ')}`
}