
document.addEventListener('DOMContentLoaded',
    async function() {
        await setCurrentUserNavbar()
        await fillTableOfUsers()
        await fillCurrentUserTable()
        await createUserForm()

    })

const ROLE_USER = {id: 1, role: "ROLE_USER"}
const ROLE_ADMIN = {id: 2, role: "ROLE_ADMIN"}

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
    const users = await findAllUsers()

    let usersTableHTML = ''
    for (let user of users) {
        usersTableHTML +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles?.map(role => role.role.substring(5)).join(' ')}</td>
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
    const currentUser = await findCurrentUser()

    table.innerHTML = `<tr>
            <td>${currentUser.id}</td>
            <td>${currentUser.firstName}</td>
            <td>${currentUser.lastName}</td>
            <td>${currentUser.age}</td>
            <td>${currentUser.email}</td>
            <td>${currentUser.roles?.map(role => role.role.substring(5)).join(' ')}</td>
        </tr>`
}

// set user data in navbar

async function setCurrentUserNavbar() {
    const currentUserNavbar = document.getElementById('currentUserNavbar')
    const currentUser = await findCurrentUser()

    currentUserNavbar.innerHTML =
        `<strong>${currentUser.email}</strong>
                 with roles: 
                 ${currentUser.roles?.map(role => role.role.substring(5)).join(' ')}`
}

// create user form

async function createUserForm() {
    const addUserForm = document.getElementById("addNewUser")

    addUserForm.addEventListener('submit',
        async function(event) {
            event.preventDefault()

            const firstName = addUserForm.querySelector("#firstName").value.trim()
            const lastName = addUserForm.querySelector("#lastName").value.trim()
            const age = addUserForm.querySelector("#age").value.trim()
            const email = addUserForm.querySelector("#email").value.trim()
            const password = addUserForm.querySelector("#password").value.trim()

            const selectedRole = document.getElementById("role")

            let roles = []

            for (let option of selectedRole.selectedOptions) {
                if (option.value === ROLE_USER.role) {
                    roles.push(ROLE_USER)
                }
                if (option.value === ROLE_ADMIN.role) {
                    roles.push(ROLE_ADMIN)
                }
            }

            const newUserData = {
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: password,
                roles: roles
            };

            await createUser(newUserData)
            addUserForm.reset()
            document.querySelector("a#home-tab").click()
            await fillTableOfUsers()
        })
}