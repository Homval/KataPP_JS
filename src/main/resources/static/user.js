
document.addEventListener('DOMContentLoaded',
    async function() {
        await setCurrentUserNavbar()
        await fillCurrentUserTable()
    })

async function findCurrentUser() {
    const response = await fetch('rest/user')
    return await response.json()
}

async function fillCurrentUserTable() {
    const table = document.getElementById('userData')
    const currentUser = await findCurrentUser()

    let currentUserTableHTML =
        `<tr>
            <td>${currentUser.id}</td>
            <td>${currentUser.firstName}</td>
            <td>${currentUser.lastName}</td>
            <td>${currentUser.age}</td>
            <td>${currentUser.email}</td>
            <td>${currentUser.roles?.map(role => role.role).join(' ')}</td>
        </tr>`
    table.innerHTML = currentUserTableHTML
}

async function setCurrentUserNavbar() {
    const currentUserNavbar = document.getElementById('currentUserNavbar')
    const currentUser = await findCurrentUser()

    currentUserNavbar.innerHTML =
        `<strong>${currentUser.email}</strong> with roles: ${currentUser.roles?.map(role => role.role).join(' ')}`
}