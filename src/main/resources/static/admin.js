
document.addEventListener('DOMContentLoaded',
    async function() {
        await setCurrentUserNavbar()
        await fillTableOfUsers()
        await fillCurrentUserTable()

    })

async function findAllUsers() {
    const response = await fetch('/rest/admin')
    return response.json()
}

async function findCurrentUser() {
    const response = await fetch('rest/user')
    return response.json()
}

async function findUserById(id) {
    const response = await fetch('/rest/admin/${id}')
    return response.json()
}

async function createUser(user) {
    await fetch('rest/admin', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)})
}

async function editUser(user) {
    await fetch('rest/admin', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)})
}

async function deleteUser(id) {
    await fetch('/rest/admin/${id}', {method: 'DELETE'})
}


// fill admin table
async function fillTableOfUsers() {
    const table = document.getElementById('usersTable')
    const users = findAllUsers()

    let usersTableHTML = ''
    for (let user of users) {
        usersTableHTML +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(role => role.toString()).join(' ')}</td>
                <td>
                    <button class="btn btn-info btn-sm text-white"
                            data-bs-toggle="modal"
                            data-bs-target="#editModal"
                            data-user-id="${user.id}">
                        Edit</button>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm btn-delete"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                            data-user-id="${user.id}">                     
                        Delete</button>
                </td>
            </tr>`

    }
    table.innerHTML = usersTableHTML
}

// fill table of current user

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
            <td>${user.roles.map(role => role.toString()).join(' ')}</td>
        </tr>`
    table.innerHTML = currentUserTableHTML
}

// set user data in navbar

async function setCurrentUserNavbar() {
    const currentUserNavbar = document.getElementById('currentUserNavbar')
    const currentUser = findCurrentUser()

    currentUserNavbar.innerHTML =
        `<strong>${currentUser.email}</strong>
                 with roles: 
                 ${currentUser.roles.map(role => role.toString()).join(' ')}`
}

// create user form

async function createUserForm() {

}