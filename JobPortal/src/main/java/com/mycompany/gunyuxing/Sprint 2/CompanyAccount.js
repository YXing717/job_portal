document.addEventListener('DOMContentLoaded', function () {
    const companyList = document.getElementById('company-list');
    const noRecords = document.getElementById('no-records');

    function loadCompanies() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        renderCompanies(companies);
    }

    async function renderCompanies(companies) {
        companyList.innerHTML = '';

        if (companies.length === 0) {
            noRecords.style.display = 'block';
            companyList.appendChild(noRecords);
            return;
        }

        noRecords.style.display = 'none';

        for (const [index, company] of companies.entries()) {
            const card = document.createElement('div');
            card.className = 'company-card';
            card.onclick = () => editCompany(index);

            // Fetch logo from IndexedDB
            const logo = await ImageDB.getImage(`logo_${company['reg-number']}`);
            const logoHtml = logo
                ? `<img src="${logo}" alt="${company['company-name']}">`
                : `<i class="fas fa-building"></i>`;

            card.innerHTML = `
                <div class="company-logo-container">
                    ${logoHtml}
                </div>
                <div class="company-info">
                    <span class="company-name">${company['company-name']}</span>
                </div>
                <button class="btn-delete" onclick="event.stopPropagation(); deleteCompany(${index})">Delete</button>
            `;
            companyList.appendChild(card);
        }
    }

    window.editCompany = function (index) {
        window.location.href = `CompanyProfileCreate.html?id=${index}`;
    };

    window.deleteCompany = async function (index) {
        if (confirm('Are you sure you want to delete this record?')) {
            let companies = JSON.parse(localStorage.getItem('companies')) || [];
            const company = companies[index];
            if (company) {
                // Delete images from IndexedDB
                await ImageDB.deleteImage(`logo_${company['reg-number']}`);
                await ImageDB.deleteImage(`profile_${company['reg-number']}`);
            }
            companies.splice(index, 1);
            localStorage.setItem('companies', JSON.stringify(companies));
            renderCompanies(companies);
        }
    };

    loadCompanies();
});
