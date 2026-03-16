document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('userTableBody');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    if (users.length === 0) {
        noUsersMessage.style.display = 'block';
        document.getElementById('userTable').style.display = 'none';
    } else {
        users.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)); // Newest first

        users.forEach(user => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = user.fullName;
            
            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            
            const dateCell = document.createElement('td');
            const date = new Date(user.registeredAt);
            dateCell.textContent = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(dateCell);
            
            tableBody.appendChild(row);
        });
    }
});
