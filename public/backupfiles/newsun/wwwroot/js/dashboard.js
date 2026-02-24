// Dashboard JavaScript functionality
function addUser() {
    const name = prompt('Name:');
    const email = prompt('Email:');
    const role = prompt('Role:');
    const department = prompt('Department:');
    const status = prompt('Status (Active/Inactive):') || 'Active';
    
    if (name && email && role && department) {
        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                email: email,
                role: role,
                department: department,
                joinDate: new Date().toISOString(),
                status: status
            })
        })
        .then(() => location.reload());
    }
}

function editUser(id) {
    fetch(`/api/users/${id}`)
        .then(r => r.json())
        .then(user => {
            const name = prompt('Name:', user.name) || user.name;
            const email = prompt('Email:', user.email) || user.email;
            const role = prompt('Role:', user.role) || user.role;
            const department = prompt('Department:', user.department) || user.department;
            const status = prompt('Status:', user.status) || user.status;
            
            fetch(`/api/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                    name: name,
                    email: email,
                    role: role,
                    department: department,
                    joinDate: user.joinDate,
                    status: status
                })
            })
            .then(() => location.reload());
        });
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${id}`, { method: 'DELETE' })
            .then(() => location.reload());
    }
}
