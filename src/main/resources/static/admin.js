
document.addEventListener('DOMContentLoaded',
    async function() {
        await setCurrentUserNavbar()
        await fillTableOfUsers()
        await fillCurrentUserTable()
        await createUserForm()
        await deleteUserModal()
        await editUserModal()
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

async function findUserById(userId) {
    const response = await fetch(`rest/admin/${userId}`)
    return response.json()
}

async function createUser(user) {
    await fetch('rest/admin', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)})
}

async function editUser(user) {
    await fetch('rest/admin', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(user)})
}

async function deleteUser(id) {
    await fetch(`/rest/admin/${id}`, {method: 'DELETE'})
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

// create modal window

async function createModal(modal) {
    modal.addEventListener('show.bs.modal',
        async function(event) {
            const userId = event.relatedTarget.dataset.userId;
            const user = await findUserById(userId)

            const modalBody = modal.querySelector('.modal-body')

            const idInput = modalBody.querySelector("input[data-user-id='id']")
            const firstNameInput = modalBody.querySelector("input[data-user-id='firstName']")
            const lastNameInput = modalBody.querySelector("input[data-user-id='lastName']")
            const ageInput = modalBody.querySelector("input[data-user-id='age']")
            const emailInput = modalBody.querySelector("input[data-user-id='email']")
            const passwordInput = modalBody.querySelector("input[data-user-id='password']")
            if (passwordInput !== null) {
                passwordInput.value = user.password;
            }

            idInput.value = user.id
            firstNameInput.value = user.firstName
            lastNameInput.value = user.lastName
            ageInput.value = user.age
            emailInput.value = user.email

            let rolesSelect = HTMLSelectElement;

            let rolesSelectDelete = modalBody.querySelector("select[data-user-id='rolesDelete']");
            let rolesSelectEdit = modalBody.querySelector("select[data-user-id='rolesEdit']");
            let userRolesHTML = "";

            if (rolesSelectDelete !== null) {
                rolesSelect = rolesSelectDelete;
                for (let i = 0; i < user.roles.length; i++) {
                    userRolesHTML +=
                        `<option value="${user.roles[i].role}">${user.roles[i].role}</option>`;
                }
            } else if (rolesSelectEdit !== null) {
                rolesSelect = rolesSelectEdit;
                userRolesHTML +=
                    `<option value="ROLE_USER">USER</option>
                     <option value="ROLE_ADMIN">ADMIN</option>`
            }

            rolesSelect.innerHTML = userRolesHTML
        })
}

// delete user modal

async function deleteUserModal() {
    const modalDelete = document.getElementById('deleteModal')

    await createModal(modalDelete)

    const formDelete = document.getElementById("modalBodyDelete");

    formDelete.addEventListener("submit",
        async function(event) {
            event.preventDefault();

            const userId = event.target.querySelector("#idDelete").value;
            await deleteUser(userId);
            await fillTableOfUsers();

            const modalBootstrap = bootstrap.Modal.getInstance(modalDelete);
            modalBootstrap.hide();
        }
    )
}

// edit user modal

async function editUserModal() {
    const  modalEdit = document.getElementById("editModal")

    await createModal(modalEdit)

    const formEdit = document.getElementById("modalBodyEdit")

    formEdit.addEventListener("submit",
        async function(event) {
            event.preventDefault()

            const userId = formEdit.querySelector("#id").value.trim()
            const firstName = formEdit.querySelector("#firstName").value.trim()
            const lastName = formEdit.querySelector("#lastName").value.trim()
            const age = formEdit.querySelector("#age").value.trim()
            const email = formEdit.querySelector("#email").value.trim()
            const password = formEdit.querySelector("#password").value.trim()

            const selectedRole = document.getElementById("rolesEdit")

            let roles = []

            for (let option of selectedRole.selectedOptions) {
                if (option.value === ROLE_USER.role) {
                    roles.push(ROLE_USER)
                }
                if (option.value === ROLE_ADMIN.role) {
                    roles.push(ROLE_ADMIN)
                }
            }

            const editedUser = {
                id: userId,
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: password,
                roles: roles
            };

            await editUser(editedUser)
            await fillTableOfUsers()

            const modalBootstrap = bootstrap.Modal.getInstance(modalDelete);
            modalBootstrap.hide();

        })
}