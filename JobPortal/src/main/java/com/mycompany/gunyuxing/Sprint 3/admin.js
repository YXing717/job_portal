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

            // Action cell
            const actionCell = document.createElement('td');
            actionCell.style.textAlign = 'center';
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => {
                if(confirm(`Are you sure you want to delete ${user.fullName}?`)) {
                    const updatedUsers = users.filter(u => u.email !== user.email);
                    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
                    location.reload();
                }
            };
            actionCell.appendChild(deleteBtn);

            row.appendChild(nameCell);
            row.appendChild(emailCell);
            row.appendChild(dateCell);
            row.appendChild(actionCell);
            
            tableBody.appendChild(row);
        });
    }
});
