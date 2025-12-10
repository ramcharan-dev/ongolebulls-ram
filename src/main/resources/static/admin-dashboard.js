// === Backend API base URL ===
const ADMINDASHBOARD_API = 'http://localhost:8080/api';
const IMAGE_BASE_URL = 'http://localhost:8080/assets/';

const admindashboardToken = localStorage.getItem('admindashboard_jwt') || localStorage.getItem('jwt');
const admindashboardAuthHeaders = () => admindashboardToken ? { 'Authorization': 'Bearer ' + admindashboardToken } : {};

// === Template Cloning Utilities ===
function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    return template.content.cloneNode(true);
}

function setElementContent(element, selector, content) {
    const el = element.querySelector(selector);
    if (el) el.textContent = content;
}

function setElementAttribute(element, selector, attribute, value) {
    const el = element.querySelector(selector);
    if (el) el.setAttribute(attribute, value);
}

// === Utility Functions ===
async function admindashboardGet(path, fallback) {
    try {
        const res = await fetch(ADMINDASHBOARD_API + path, { headers: admindashboardAuthHeaders() });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return await res.json();
    } catch (e) {
        console.error('GET failed', path, e);
        return fallback;
    }
}

function admindashboardHighlight(route) {
    document.querySelectorAll('#admindashboardNav .admindashboard-nav').forEach(a => {
        if (a.getAttribute('data-route') === route) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
    });
}

function showLoadingCard(title) {
    const container = document.getElementById('admindashboardView');
    const clone = cloneTemplate('loadingCardTemplate');
    setElementContent(clone, '[data-title]', title);
    container.innerHTML = '';
    container.appendChild(clone);
}

function showErrorCard(title, message) {
    const container = document.getElementById('admindashboardView');
    const clone = cloneTemplate('errorCardTemplate');
    setElementContent(clone, '[data-title]', title);
    setElementContent(clone, '[data-message]', message);
    container.innerHTML = '';
    container.appendChild(clone);
}

// === Close Sidebar (Mobile) ===
function closeSidebar() {
    const sidebar = document.querySelector('.admindashboard-sidebar');
    const backdrop = document.getElementById('admindashboardBackdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('show');
}

// === Dashboard Renderer ===
function admindashboardRender(kpi, sip, risk, goals, leaderboard, alerts) {
    const view = document.getElementById('admindashboardView');
    view.innerHTML = '';

    const mainTemplate = cloneTemplate('dashboardMainTemplate');
    view.appendChild(mainTemplate);

    const kpiContainer = document.getElementById('kpiContainer');
    const kpiData = [
        { icon: 'bi-people-fill', label: 'Total Clients', value: kpi.totalClients },
        { icon: 'bi-graph-up', label: 'Active Investments', value: kpi.activeInvestments },
        { icon: 'bi-cash-coin', label: 'Monthly SIPs', value: kpi.monthlySips },
        { icon: 'bi-shield-fill-check', label: 'Risk Profiles', value: kpi.riskProfilesCompleted },
        { icon: 'bi-trophy-fill', label: 'RM Conversion', value: (kpi.rmConversionRate ?? '—') + '%' }
    ];

    kpiData.forEach(item => {
        const kpiClone = cloneTemplate('kpiCardTemplate');
        const icon = kpiClone.querySelector('[data-icon]');
        icon.className = `bi ${item.icon}`;
        icon.removeAttribute('data-icon');
        setElementContent(kpiClone, '[data-label]', item.label);
        setElementContent(kpiClone, '[data-value]', item.value);
        kpiContainer.appendChild(kpiClone);
    });

    const chartsContainer = document.getElementById('chartsContainer');

    const sipChartClone = cloneTemplate('chartCardTemplate');
    const sipIcon = sipChartClone.querySelector('[data-icon]');
    sipIcon.className = 'bi bi-bar-chart-fill';
    sipIcon.removeAttribute('data-icon');
    setElementContent(sipChartClone, '[data-title]', 'SIP Planned vs Executed');
    const sipCanvas = sipChartClone.querySelector('[data-canvas]');
    sipCanvas.id = 'admindashboard-chart-sip';
    sipCanvas.setAttribute('aria-label', 'SIP chart');
    sipCanvas.removeAttribute('data-canvas');
    chartsContainer.appendChild(sipChartClone);

    const riskChartClone = cloneTemplate('chartCardTemplate');
    const riskIcon = riskChartClone.querySelector('[data-icon]');
    riskIcon.className = 'bi bi-pie-chart-fill';
    riskIcon.removeAttribute('data-icon');
    setElementContent(riskChartClone, '[data-title]', 'Risk Distribution');
    const riskCanvas = riskChartClone.querySelector('[data-canvas]');
    riskCanvas.id = 'admindashboard-chart-risk';
    riskCanvas.setAttribute('aria-label', 'Risk chart');
    riskCanvas.removeAttribute('data-canvas');
    chartsContainer.appendChild(riskChartClone);

    const goalsChartClone = cloneTemplate('chartCardTemplate');
    const goalsIcon = goalsChartClone.querySelector('[data-icon]');
    goalsIcon.className = 'bi bi-pie-chart';
    goalsIcon.removeAttribute('data-icon');
    setElementContent(goalsChartClone, '[data-title]', 'Goal Categories');
    const goalsCanvas = goalsChartClone.querySelector('[data-canvas]');
    goalsCanvas.id = 'admindashboard-chart-goals';
    goalsCanvas.setAttribute('aria-label', 'Goal chart');
    goalsCanvas.removeAttribute('data-canvas');
    chartsContainer.appendChild(goalsChartClone);

    const leaderboardClone = cloneTemplate('leaderboardCardTemplate');
    chartsContainer.appendChild(leaderboardClone);

    const leaderboardList = document.getElementById('leaderboardList');
    leaderboard.forEach((item, index) => {
        const rowClone = cloneTemplate('leaderboardRowTemplate');
        setElementContent(rowClone, '[data-rank]', index + 1);
        setElementContent(rowClone, '[data-name]', item.name);
        setElementContent(rowClone, '[data-value]', (item.aum || 0).toLocaleString());
        leaderboardList.appendChild(rowClone);
    });

    const alertsCard = document.getElementById('alertsCard');
    const alertsClone = cloneTemplate('alertsCardTemplate');
    alertsCard.appendChild(alertsClone);

    const alertsActions = document.getElementById('alertsActions');
    const actions = [
        { class: 'primary', icon: 'bi-person-plus-fill', text: 'Add New Client', id: 'admindashboardAddClient' },
        { class: 'secondary', icon: 'bi-file-earmark-bar-graph', text: 'Generate RM Report', id: 'admindashboardRmReport' },
        { class: '', icon: 'bi-megaphone-fill', text: 'Broadcast Email/SMS', id: 'admindashboardBroadcast' },
        { class: '', icon: 'bi-cloud-arrow-down-fill', text: 'Download Compliance Summary', id: 'admindashboardCompliance' }
    ];

    actions.forEach(action => {
        const btnClone = cloneTemplate('actionButtonTemplate');
        const btn = btnClone.querySelector('[data-button]');
        btn.className = `admindashboard-btn ${action.class}`;
        btn.id = action.id;
        btn.removeAttribute('data-button');
        const icon = btnClone.querySelector('[data-icon]');
        icon.className = `bi ${action.icon}`;
        icon.removeAttribute('data-icon');
        setElementContent(btnClone, '[data-text]', action.text);
        alertsActions.appendChild(btnClone);
    });

    const alertsList = document.getElementById('alertsList');
    alerts.forEach(alert => {
        const alertClone = cloneTemplate('alertItemTemplate');
        setElementContent(alertClone, '[data-title]', alert.title);
        setElementContent(alertClone, '[data-detail]', alert.detail);
        alertsList.appendChild(alertClone);
    });

    new Chart(document.getElementById('admindashboard-chart-sip'), {
        type: 'bar',
        data: {
            labels: sip.labels,
            datasets: [
                { label: 'Planned', data: sip.planned, backgroundColor: '#93c5fd', borderRadius: 6 },
                { label: 'Executed', data: sip.executed, backgroundColor: '#60a5fa', borderRadius: 6 }
            ]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { y: { beginAtZero: true } } }
    });

    new Chart(document.getElementById('admindashboard-chart-risk'), {
        type: 'pie',
        data: {
            labels: risk.labels,
            datasets: [{ data: risk.values, backgroundColor: ['#86efac','#93c5fd','#fca5a5'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    new Chart(document.getElementById('admindashboard-chart-goals'), {
        type: 'pie',
        data: {
            labels: goals.labels,
            datasets: [{ data: goals.values, backgroundColor: ['#fde68a','#a7f3d0','#c7d2fe','#f5d0fe','#fca5a5'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    document.getElementById('admindashboardAddClient').onclick = () => location.hash = '#/clients';
    document.getElementById('admindashboardRmReport').onclick = () => window.open(ADMINDASHBOARD_API + '/reports/rm?format=pdf','_blank');
    document.getElementById('admindashboardBroadcast').onclick = () => alert('Open broadcast dialog here');
    document.getElementById('admindashboardCompliance').onclick = () => window.open(ADMINDASHBOARD_API + '/reports/compliance?period=month','_blank');
}

// === Dashboard Loader ===
async function admindashboardLoad() {
    showLoadingCard('Loading Dashboard...');

    try {
        const [kpi, sip, risk, goals, leaderboard, alerts] = await Promise.all([
            admindashboardGet('/kpi', { totalClients:0, activeInvestments:0, monthlySips:0, riskProfilesCompleted:0, rmConversionRate:0 }),
            admindashboardGet('/charts/sip', { labels:['Jan','Feb','Mar'], planned:[40,45,50], executed:[38,43,49] }),
            admindashboardGet('/charts/risk', { labels:['Conservative','Moderate','Aggressive'], values:[35,50,15] }),
            admindashboardGet('/charts/goals', { labels:['Child Education','Retirement','House'], values:[28,34,22] }),
            admindashboardGet('/leaderboard', []),
            admindashboardGet('/alerts', [])
        ]);
        admindashboardRender(kpi, sip, risk, goals, leaderboard, alerts);
    } catch (e) {
        showErrorCard('Dashboard', 'Failed to load data.');
    }
}

// === Clients Section ===
let allClients = [];

async function admindashboardLoadClients(searchQuery = '') {
    showLoadingCard('Loading Clients...');

    try {
        if (allClients.length === 0 || !searchQuery) {
            const res = await fetch(`${ADMINDASHBOARD_API}/clients`, {
                headers: admindashboardAuthHeaders()
            });

            if (!res.ok) throw new Error(`Failed to load clients: HTTP ${res.status}`);
            allClients = await res.json();
        }

        if (!Array.isArray(allClients)) {
            throw new Error("API did not return an array");
        }

        const filteredClients = searchQuery
            ? allClients.filter(client => {
                const search = searchQuery.toLowerCase();
                return (
                    (client.fullName && client.fullName.toLowerCase().includes(search)) ||
                    (client.email && client.email.toLowerCase().includes(search)) ||
                    (client.phone && client.phone.includes(search)) ||
                    (client.panCard && client.panCard.toLowerCase().includes(search))
                );
            })
            : allClients;

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'admindashboard-card-head';
        container.appendChild(headerDiv);

        const h2 = document.createElement('h2');
        const icon = document.createElement('i');
        icon.className = 'bi bi-people-fill';
        h2.appendChild(icon);
        h2.appendChild(document.createTextNode(' Clients Management'));
        headerDiv.appendChild(h2);

        const addBtn = document.createElement('button');
        addBtn.className = 'admindashboard-btn primary';
        addBtn.id = 'addClientBtn';
        const btnIcon = document.createElement('i');
        btnIcon.className = 'bi bi-person-plus-fill';
        addBtn.appendChild(btnIcon);
        addBtn.appendChild(document.createTextNode(' Add New Client'));
        headerDiv.appendChild(addBtn);

        const formTemplate = document.getElementById('clientFormTemplate');
        if (formTemplate) {
            const formClone = formTemplate.content.cloneNode(true);
            const formContainer = formClone.querySelector('#clientFormContainer');
            formContainer.style.display = 'none';
            container.appendChild(formClone);
        }

        const tableCard = document.createElement('div');
        tableCard.className = 'admindashboard-card';
        tableCard.style.marginTop = '20px';

        const table = document.createElement('table');
        table.className = 'admindashboard-table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        ['Full Name', 'Email', 'Phone', 'Actions'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        tbody.id = 'clientsTableBody';
        table.appendChild(tbody);

        tableCard.appendChild(table);
        container.appendChild(tableCard);

        if (filteredClients.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = searchQuery
                ? 'No clients found matching your search.'
                : 'No clients available. Click "Add New Client" to get started.';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            cell.style.color = 'var(--muted)';
            row.appendChild(cell);
            tbody.appendChild(row);
        } else {
            filteredClients.forEach(client => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.setAttribute('data-label', 'Full Name');
                nameCell.textContent = client.fullName || '—';
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.setAttribute('data-label', 'Email');
                emailCell.textContent = client.email || '—';
                row.appendChild(emailCell);

                const phoneCell = document.createElement('td');
                phoneCell.setAttribute('data-label', 'Phone');
                phoneCell.textContent = client.phone || '—';
                row.appendChild(phoneCell);

                const actionsCell = document.createElement('td');
                actionsCell.setAttribute('data-label', 'Actions');
                actionsCell.className = 'action-buttons';

                const editBtn = document.createElement('button');
                editBtn.className = 'admindashboard-btn-small primary';
                const editIcon = document.createElement('i');
                editIcon.className = 'bi bi-pencil';
                editBtn.appendChild(editIcon);
                editBtn.appendChild(document.createTextNode(' Edit'));
                editBtn.onclick = () => openEditClientForm(client.id);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'admindashboard-btn-small danger';
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'bi bi-trash';
                deleteBtn.appendChild(deleteIcon);
                deleteBtn.appendChild(document.createTextNode(' Delete'));
                deleteBtn.onclick = () => deleteClient(client.id);

                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(document.createTextNode(' '));
                actionsCell.appendChild(deleteBtn);
                row.appendChild(actionsCell);

                tbody.appendChild(row);
            });
        }

        setupClientButtons();

    } catch (err) {
        showErrorCard('Clients', `Error loading clients: ${err.message}`);
        console.error(err);
    }
}

function setupClientButtons() {
    const addClientBtn = document.getElementById('addClientBtn');
    if (addClientBtn) {
        addClientBtn.onclick = () => openEditClientForm();
    }

    const cancelBtn = document.getElementById('cancelClientBtn');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            const form = document.getElementById('clientForm');
            const formContainer = document.getElementById('clientFormContainer');
            if (form) form.reset();
            if (formContainer) formContainer.style.display = 'none';
        };
    }

    const clientForm = document.getElementById('clientForm');
    if (clientForm && !clientForm.dataset.listenerAttached) {
        clientForm.onsubmit = handleClientFormSubmit;
        clientForm.dataset.listenerAttached = 'true';
    }
}

async function openEditClientForm(id) {
    const formContainer = document.getElementById('clientFormContainer');
    const form = document.getElementById('clientForm');

    if (!formContainer || !form) {
        console.error('Client form elements not found');
        alert('Form not found. Please refresh the page.');
        return;
    }

    form.reset();
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let formTitle = formContainer.querySelector('h3');
    if (!formTitle) {
        formTitle = document.createElement('h3');
        form.insertBefore(formTitle, form.firstChild);
    }

    if (!id) {
        form.dataset.editingId = '';

        const icon = document.createElement('i');
        icon.className = 'bi bi-person-plus-fill';
        formTitle.innerHTML = '';
        formTitle.appendChild(icon);
        formTitle.appendChild(document.createTextNode(' Add New Client'));

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const saveIcon = document.createElement('i');
            saveIcon.className = 'bi bi-save';
            submitBtn.innerHTML = '';
            submitBtn.appendChild(saveIcon);
            submitBtn.appendChild(document.createTextNode(' Add Client'));
        }
        return;
    }

    const icon = document.createElement('i');
    icon.className = 'bi bi-pencil-fill';
    formTitle.innerHTML = '';
    formTitle.appendChild(icon);
    formTitle.appendChild(document.createTextNode(' Edit Client'));

    try {
        const res = await fetch(`${ADMINDASHBOARD_API}/clients/${id}`, {
            headers: admindashboardAuthHeaders()
        });

        if (!res.ok) throw new Error('Failed to load client data');
        const client = await res.json();

        form.dataset.editingId = client.id || '';

        const setFieldValue = (name, value) => {
            const field = form.querySelector(`[name="${name}"]`);
            if (field) field.value = value || '';
        };

        setFieldValue('fullName', client.fullName);
        setFieldValue('email', client.email);
        setFieldValue('phone', client.phone);
        setFieldValue('aadhaar', client.aadhaar);
        setFieldValue('panCard', client.panCard);
        setFieldValue('address', client.address);
        setFieldValue('city', client.city);
        setFieldValue('state', client.state);
        setFieldValue('pinCode', client.pinCode);
        setFieldValue('occupation', client.occupation);
        setFieldValue('annualIncome', client.annualIncome);
        setFieldValue('investmentExperience', client.investmentExperience);
        setFieldValue('riskProfile', client.riskProfile);
        setFieldValue('preferredInvestments', client.preferredInvestments);
        setFieldValue('bankAccountDetails', client.bankAccountDetails);
        setFieldValue('nomineeName', client.nomineeName);
        setFieldValue('nomineeRelation', client.nomineeRelation);
        setFieldValue('resetToken', client.resetToken);

        const emailVerifiedField = form.querySelector('[name="emailVerified"]');
        if (emailVerifiedField && client.emailVerified != null) {
            emailVerifiedField.value = client.emailVerified.toString();
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const saveIcon = document.createElement('i');
            saveIcon.className = 'bi bi-save';
            submitBtn.innerHTML = '';
            submitBtn.appendChild(saveIcon);
            submitBtn.appendChild(document.createTextNode(' Update Client'));
        }

    } catch (err) {
        alert('Error loading client: ' + err.message);
        formContainer.style.display = 'none';
    }
}

async function handleClientFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const clientData = {};

    formData.forEach((value, key) => {
        if (key !== 'id') {
            clientData[key] = value;
        }
    });

    if (clientData.emailVerified === 'true') {
        clientData.emailVerified = true;
    } else if (clientData.emailVerified === 'false') {
        clientData.emailVerified = false;
    } else {
        delete clientData.emailVerified;
    }

    const editingId = form.dataset.editingId;
    const url = editingId
        ? `${ADMINDASHBOARD_API}/clients/${editingId}`
        : `${ADMINDASHBOARD_API}/clients`;
    const method = editingId ? 'PUT' : 'POST';

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...admindashboardAuthHeaders()
            },
            body: JSON.stringify(clientData)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error ${res.status}`);
        }

        alert(editingId ? 'Client updated successfully!' : 'Client added successfully!');

        form.reset();
        document.getElementById('clientFormContainer').style.display = 'none';

        allClients = [];
        admindashboardLoadClients();

    } catch (err) {
        alert(`Failed to ${editingId ? 'update' : 'add'} client: ${err.message}`);
        submitBtn.textContent = originalContent;
    } finally {
        submitBtn.disabled = false;
    }
}

async function deleteClient(id) {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        return;
    }

    try {
        const res = await fetch(`${ADMINDASHBOARD_API}/clients/${id}`, {
            method: 'DELETE',
            headers: admindashboardAuthHeaders()
        });

        if (!res.ok) throw new Error(`Failed to delete client: HTTP ${res.status}`);

        alert('Client deleted successfully');

        allClients = [];
        admindashboardLoadClients();

    } catch (err) {
        alert('Error deleting client: ' + err.message);
    }
}

window.openEditClientForm = openEditClientForm;
window.deleteClient = deleteClient;

// === Blogs Loader ===
async function admindashboardLoadBlogs() {
    showLoadingCard('Loading Blogs...');

    try {
        const response = await fetch(ADMINDASHBOARD_API + '/blogs', {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const blogs = await response.json();

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const blogsContainer = cloneTemplate('blogsContainerTemplate');
        container.appendChild(blogsContainer);

        const grid = document.getElementById('blogsGrid');
        const addBtn = document.getElementById('addBlogBtn');

        if (addBtn) {
            addBtn.onclick = () => {
                location.hash = '#/blogs/new';
            };
        }

        if (blogs.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No blogs found. Click "+ Add Blog" to create your first blog.';
            emptyMsg.style.color = 'var(--muted)';
            emptyMsg.style.padding = '20px';
            grid.appendChild(emptyMsg);
            return;
        }

        blogs.forEach(blog => {
            const cardClone = cloneTemplate('blogCardTemplate');

            const img = cardClone.querySelector('[data-image]');

            if (blog.image) {
                img.src = IMAGE_BASE_URL + blog.image;
                img.alt = blog.title || 'Blog image';

                img.onerror = function() {
                    this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                };
            } else {
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23ddd" width="300" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                img.alt = 'No image available';
            }
            img.removeAttribute('data-image');

            setElementContent(cardClone, '[data-title]', blog.title);
            setElementContent(cardClone, '[data-description]', blog.shortDescription);
            setElementContent(cardClone, '[data-meta]', `By ${blog.author} | ${new Date(blog.createdAt).toLocaleDateString()}`);

            const editBtn = cardClone.querySelector('[data-edit]');
            editBtn.removeAttribute('data-edit');
            editBtn.onclick = () => {
                location.hash = `#/blogs/edit/${blog.id}`;
            };

            const deleteBtn = cardClone.querySelector('[data-delete]');
            deleteBtn.removeAttribute('data-delete');
            deleteBtn.onclick = async () => {
                if (confirm('Are you sure you want to delete this blog?')) {
                    try {
                        const res = await fetch(`${ADMINDASHBOARD_API}/blogs/${blog.id}`, {
                            method: 'DELETE',
                            headers: admindashboardAuthHeaders()
                        });
                        if (res.ok) {
                            alert('Blog deleted successfully');
                            admindashboardLoadBlogs();
                        } else {
                            alert('Failed to delete blog');
                        }
                    } catch (err) {
                        alert('Error deleting blog: ' + err.message);
                    }
                }
            };

            grid.appendChild(cardClone);
        });

    } catch (error) {
        showErrorCard('Blogs', 'Error loading blogs: ' + error.message);
    }
}

async function showBlogForm(blogId = null) {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';

    const loadingClone = cloneTemplate('loadingCardTemplate');
    setElementContent(loadingClone, '[data-title]', blogId ? 'Loading Blog...' : 'Preparing Form...');
    container.appendChild(loadingClone);

    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        container.innerHTML = '';
        const formTemplate = cloneTemplate('blogFormTemplate');
        container.appendChild(formTemplate);






        const form = document.getElementById('blogForm');
        const messageDiv = document.getElementById('blogFormMessage');
        const formTitle = document.querySelector('[data-form-title]');
        const imagePreview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        const fileInput = form.querySelector('input[name="imageFile"]');



        // Remove any other instances if needed (optional, good practice)
        if (window.blogContentEditor && window.blogContentEditor.destroy) {
            window.blogContentEditor.destroy();
        }
        ClassicEditor
            .create(document.getElementById('blogFullContent'), {
                toolbar: [
                    'heading',
                    '|',
                    'undo', 'redo',
                    '|',
                    'bold', 'italic',
                    'link', 'unlink',
                    '|',
                    'bulletedList', 'numberedList',
                    'blockQuote', 'code',
                    '|',
                    'alignment',
                    'horizontalLine'
                ]
            })
            .then(editor => {
                window.blogContentEditor = editor;
            })
            .catch(error => {
                console.error(error);
            });




        if (blogId) {
            formTitle.textContent = 'Edit Blog';
            const response = await fetch(`${ADMINDASHBOARD_API}/blogs/${blogId}`, {
                headers: admindashboardAuthHeaders()
            });

            if (!response.ok) throw new Error('Blog not found');

            const blog = await response.json();

            form.querySelector('input[name="title"]').value = blog.title || '';
            form.querySelector('textarea[name="shortDescription"]').value = blog.shortDescription || '';
            form.querySelector('textarea[name="fullContent"]').value = blog.fullContent || '';
            form.querySelector('input[name="author"]').value = blog.author || '';
            form.querySelector('input[name="metaTitle"]').value = blog.metaTitle || '';
            form.querySelector('input[name="metaKeywords"]').value = blog.metaKeywords || '';
            form.querySelector('textarea[name="metaDescription"]').value = blog.metaDescription || '';

            if (blog.image) {
                previewImg.src = IMAGE_BASE_URL + blog.image;
                previewImg.onerror = function() {
                    this.style.display = 'none';
                };
                imagePreview.style.display = 'block';
            } else {
                previewImg.src = '';
                imagePreview.style.display = 'none';
            }

            form.dataset.editingId = blogId;
        } else {
            formTitle.textContent = 'Add New Blog';
            form.reset();
            form.dataset.editingId = '';
            previewImg.src = '';
            imagePreview.style.display = 'none';
        }

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    fileInput.value = '';
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    alert('File size should be less than 5MB');
                    fileInput.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    previewImg.src = event.target.result;
                    imagePreview.style.display = 'block';
                };
                reader.onerror = () => {
                    alert('Failed to read file');
                    fileInput.value = '';
                };
                reader.readAsDataURL(file);
            } else {
                previewImg.src = '';
                imagePreview.style.display = 'none';
            }
        });

        document.getElementById('backToBlogsBtn').onclick = () => {
            location.hash = '#/blogs';
        };

        document.getElementById('cancelBlogBtn').onclick = () => {
            location.hash = '#/blogs';
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageDiv.textContent = '';
            messageDiv.style.color = '';

            const formData = new FormData(form);
            const editingId = form.dataset.editingId;

            let url = `${ADMINDASHBOARD_API}/blogs`;
            let method = 'POST';

            if (editingId) {
                url += `/${editingId}`;
                method = 'PUT';
            }

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: admindashboardAuthHeaders(),
                    body: formData
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || `HTTP error ${res.status}`);
                }

                await res.json();

                messageDiv.style.color = '#22c55e';
                messageDiv.textContent = editingId ? 'Blog updated successfully!' : 'Blog created successfully!';

                setTimeout(() => {
                    location.hash = '#/blogs';
                }, 1500);
            } catch (err) {
                messageDiv.style.color = '#ef4444';
                messageDiv.textContent = `Failed to ${editingId ? 'update' : 'create'} blog: ${err.message}`;
            }
        });

    } catch (err) {
        showErrorCard('Blog Form', err.message || 'Failed to load blog form.');
    }
}

// === SEO Settings Loader ===
const API_BASE_SEO = 'http://localhost:8080/api/adminseo';

async function loadSeoSettings() {
    showLoadingCard('Loading SEO Settings...');

    try {
        const response = await fetch(API_BASE_SEO, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to fetch SEO settings');
        const seoList = await response.json();

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const seoContainerClone = cloneTemplate('seoContainerTemplate');
        container.appendChild(seoContainerClone);

        const seoEntriesList = document.getElementById('seoEntriesList');
        const seoFormCard = document.getElementById('seoFormCard');
        const seoForm = document.getElementById('seoForm');
        const seoFormMessage = document.getElementById('seoFormMessage');
        const addNewSeoBtn = document.getElementById('addNewSeoBtn');
        const cancelSeoFormBtn = document.getElementById('cancelSeoFormBtn');
        const cancelSeoBtn = document.getElementById('cancelSeoBtn');

        if (seoList.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'admindashboard-empty';
            emptyMsg.textContent = 'No SEO entries found. Click "Add New SEO Entry" to create your first entry.';
            seoEntriesList.appendChild(emptyMsg);
        } else {
            seoList.forEach(seo => {
                const entryClone = cloneTemplate('seoEntryCardTemplate');

                setElementContent(entryClone, '[data-slug]', seo.slug || 'N/A');
                setElementContent(entryClone, '[data-meta-title]', seo.metaTitle || 'Not set');
                setElementContent(entryClone, '[data-meta-description]',
                    seo.metaDescription ?
                    (seo.metaDescription.length > 100 ? seo.metaDescription.substring(0, 100) + '...' : seo.metaDescription)
                    : 'Not set'
                );
                setElementContent(entryClone, '[data-robots]', seo.robotsTag || 'index,follow');

                const editBtn = entryClone.querySelector('[data-edit-seo]');
                editBtn.removeAttribute('data-edit-seo');
                editBtn.onclick = () => loadSeoEntryForEdit(seo.id);

                const deleteBtn = entryClone.querySelector('[data-delete-seo]');
                deleteBtn.removeAttribute('data-delete-seo');
                deleteBtn.onclick = () => deleteSeoEntry(seo.id);

                seoEntriesList.appendChild(entryClone);
            });
        }

        addNewSeoBtn.onclick = () => {
            seoForm.reset();
            document.getElementById('seoId').value = '';
            document.getElementById('seoFormTitle').textContent = 'Add New SEO Entry';
            seoFormCard.style.display = 'block';
            seoFormMessage.textContent = '';

            seoFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        cancelSeoFormBtn.onclick = cancelSeoBtn.onclick = () => {
            seoFormCard.style.display = 'none';
            seoForm.reset();
            seoFormMessage.textContent = '';
        };

        seoForm.onsubmit = async (e) => {
            e.preventDefault();
            seoFormMessage.textContent = '';

            const payload = {
                id: document.getElementById('seoId').value || null,
                slug: document.getElementById('seoSlug').value.trim(),
                metaTitle: document.getElementById('seoMetaTitle').value.trim(),
                metaDescription: document.getElementById('seoMetaDescription').value.trim(),
                metaKeywords: document.getElementById('seoMetaKeywords').value.trim(),
                robotsTag: document.getElementById('seoRobotsTag').value,
                schemaJson: document.getElementById('seoSchemaJson').value.trim()
            };

            if (!payload.slug || !payload.slug.startsWith('/')) {
                seoFormMessage.style.color = '#ef4444';
                seoFormMessage.textContent = 'Slug must start with / (e.g., /about-us)';
                return;
            }

            if (payload.schemaJson) {
                try {
                    JSON.parse(payload.schemaJson);
                } catch (err) {
                    seoFormMessage.style.color = '#ef4444';
                    seoFormMessage.textContent = 'Invalid JSON in Schema field: ' + err.message;
                    return;
                }
            }

            const submitBtn = seoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            try {
                const res = await fetch(`${API_BASE_SEO}/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...admindashboardAuthHeaders()
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || `HTTP error ${res.status}`);
                }

                seoFormMessage.style.color = '#22c55e';
                seoFormMessage.textContent = payload.id ? 'SEO entry updated successfully!' : 'SEO entry created successfully!';

                setTimeout(() => {
                    seoFormCard.style.display = 'none';
                    loadSeoSettings();
                }, 1500);

            } catch (err) {
                seoFormMessage.style.color = '#ef4444';
                seoFormMessage.textContent = `Failed to save: ${err.message}`;
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        };

    } catch (err) {
        showErrorCard('SEO Settings', 'Failed to load SEO settings: ' + err.message);
        console.error(err);
    }
}

async function loadSeoEntryForEdit(id) {
    const seoFormCard = document.getElementById('seoFormCard');
    const seoForm = document.getElementById('seoForm');
    const seoFormMessage = document.getElementById('seoFormMessage');
    const seoFormTitle = document.getElementById('seoFormTitle');

    seoFormMessage.textContent = 'Loading...';
    seoFormMessage.style.color = '#3b82f6';
    seoFormCard.style.display = 'block';
    seoFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
        const response = await fetch(`${API_BASE_SEO}/${id}`, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load SEO entry');
        const seo = await response.json();

        document.getElementById('seoId').value = seo.id || '';
        document.getElementById('seoSlug').value = seo.slug || '';
        document.getElementById('seoMetaTitle').value = seo.metaTitle || '';
        document.getElementById('seoMetaDescription').value = seo.metaDescription || '';
        document.getElementById('seoMetaKeywords').value = seo.metaKeywords || '';
        document.getElementById('seoRobotsTag').value = seo.robotsTag || 'index,follow';
        document.getElementById('seoSchemaJson').value = seo.schemaJson || '';

        seoFormTitle.textContent = 'Edit SEO Entry';
        seoFormMessage.textContent = '';

    } catch (err) {
        seoFormMessage.style.color = '#ef4444';
        seoFormMessage.textContent = 'Error loading SEO entry: ' + err.message;
    }
}

async function deleteSeoEntry(id) {
    if (!confirm('Are you sure you want to delete this SEO entry? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_SEO}/${id}`, {
            method: 'DELETE',
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to delete SEO entry');

        alert('SEO entry deleted successfully');
        loadSeoSettings();

    } catch (err) {
        alert('Error deleting SEO entry: ' + err.message);
    }
}

// === Edit Admin Profile Loader ===
async function admindashboardLoadAdminDetails() {
    const container = document.getElementById("admindashboardView");
    container.innerHTML = "";

    const loadingClone = cloneTemplate("loadingCardTemplate");
    setElementContent(loadingClone, "[data-title]", "Loading Profile…");
    container.appendChild(loadingClone);

    const editProfileLink = document.getElementById('editProfileLink');
    const profileMenu = document.getElementById('adminProfileMenu');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', e => {
            e.preventDefault();
            if (profileMenu) profileMenu.style.display = 'none';
            location.hash = '#/admin-details'; // important to include the '#'
        });
    }

        container.innerHTML = "";
        const formTemplate = cloneTemplate("editAdminTemplate");
        container.appendChild(formTemplate);


        const response = await fetch(`${ADMINDASHBOARD_API}/admin/${adminId}`, {
            headers: admindashboardAuthHeaders()
        });

    setupAdminDetailsEvents();
}

        const data = await response.json();
        document.getElementById("adminEmail").value = data.email || "";
        document.getElementById("adminPassword").value = "";
        document.getElementById("adminName").value = data.name || "";

        form.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById("adminSaveBtn");
            submitBtn.disabled = true;
            messageDiv.innerText = "Updating…";
            messageDiv.style.color = "#2563eb";

            const email = document.getElementById("adminEmail").value.trim();
            const password = document.getElementById("adminPassword").value.trim();
            const name = document.getElementById("adminName").value.trim();

            if (!email || !name) {
                messageDiv.innerText = "Email and Name are required";
                messageDiv.style.color = "#ef4444";
                submitBtn.disabled = false;
                return;
            }



    if (!form) {
        console.error("Form not found. Template may not be loaded.");
        return;
    }

    // Load current admin details
    fetch(`${API}/${adminId}`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch admin details");
            return res.json();
        })
        .then(data => {
            document.getElementById("adminEmail").value = data.email || "";
            document.getElementById("adminPassword").value = data.password || "";
            document.getElementById("adminName").value = data.name || "";
        })
        .catch(err => {
            messageDiv.innerText = err.message;
            messageDiv.style.color = "red";
        });

                const nameEl = document.getElementById("adminNameDisplay");
                if (nameEl) nameEl.textContent = name;

                document.getElementById("adminPassword").value = "";

        fetch(`${API}/update/${adminId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                messageDiv.innerText = data.message;
                messageDiv.style.color = data.success ? "green" : "red";

                // ✅ Reload latest updated data
                loadUpdatedAdminDetails();
                refreshAdminHeader();
            })
            .catch(err => {
                messageDiv.innerText = err.message;
                messageDiv.style.color = "red";
            });
    });
}

// ✅ helper reload function
function loadUpdatedAdminDetails() {
    const adminId = 1;

    fetch(`/api/admin/${adminId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("adminEmail").value = data.email;
            document.getElementById("adminPassword").value = data.password;
            document.getElementById("adminName").value = data.name;
        });
}



function refreshAdminHeader() {
    fetch("/api/admin/1")
        .then(res => res.json())
        .then(data => {
            const label = document.getElementById("adminNameDisplay");
            if (label) {
                label.innerText = data.name;
            }
        });
}







// === Careers Loader ===
async function admindashboardLoadCareers() {
    showLoadingCard('Loading Careers...');

    try {
        const jobs = await admindashboardGet('/jobs', []);
        if (!Array.isArray(jobs)) throw new Error("API did not return an array");

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const careersContainer = cloneTemplate('careersContainerTemplate');
        container.appendChild(careersContainer);

        const tbody = document.getElementById('careersTableBody');

        jobs.forEach(job => {
            const rowClone = cloneTemplate('careerRowTemplate');
            setElementContent(rowClone, '[data-title]', job.title || '');
            setElementContent(rowClone, '[data-department]', job.department || '');
            setElementContent(rowClone, '[data-location]', job.location || '');
            setElementContent(rowClone, '[data-experience]', job.experience || '');
            setElementContent(rowClone, '[data-employmenttype]', job.employmentType || '');

            const editBtn = rowClone.querySelector('[data-edit]');
            editBtn.removeAttribute('data-edit');
            editBtn.addEventListener('click', () => handleEditJob(job));

            const deleteBtn = rowClone.querySelector('[data-delete]');
            deleteBtn.removeAttribute('data-delete');
            deleteBtn.addEventListener('click', () => handleDeleteJob(job.id));

            tbody.appendChild(rowClone);
        });

        const form = document.getElementById('addJobForm');
        const messageDiv = document.getElementById('jobFormMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageDiv.textContent = '';

            const formData = new FormData(form);
            const jobData = {};
            formData.forEach((value, key) => jobData[key] = value);

            const editingId = form.dataset.editingId;
            let url = `${ADMINDASHBOARD_API}/jobs`;
            let method = 'POST';

            if (editingId) {
                url += `/${editingId}`;
                method = 'PUT';
            }

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        ...admindashboardAuthHeaders()
                    },
                    body: JSON.stringify(jobData)
                });

                if (!res.ok) {
                    const errorJson = await res.json();
                    throw new Error(errorJson.message || `HTTP error ${res.status}`);
                }

                await res.json();

                messageDiv.style.color = '#22c55e';
                messageDiv.textContent = editingId ? 'Job updated successfully!' : 'Job added successfully!';

                delete form.dataset.editingId;
                form.querySelector('button[type="submit"]').textContent = 'Add Job';
                form.reset();

                admindashboardLoadCareers();
            } catch (err) {
                messageDiv.style.color = '#ef4444';
                messageDiv.textContent = `Failed to ${editingId ? 'update' : 'add'} job: ${err.message}`;
            }
        });
    } catch (err) {
        showErrorCard('Careers', 'Failed to load careers data.');
        console.error(err);
    }
}

function handleEditJob(job) {
    const form = document.getElementById('addJobForm');
    form.querySelector('input[name="title"]').value = job.title || '';
    form.querySelector('input[name="department"]').value = job.department || '';
    form.querySelector('input[name="location"]').value = job.location || '';
    form.querySelector('input[name="experience"]').value = job.experience || '';
    form.querySelector('input[name="employmentType"]').value = job.employmentType || '';
    form.querySelector('textarea[name="description"]').value = job.description || '';
    form.querySelector('input[name="qualification"]').value = job.qualification || '';
    form.querySelector('input[name="salaryRange"]').value = job.salaryRange || '';
    form.querySelector('input[name="postedDate"]').value = job.postedDate ? job.postedDate.split('T')[0] : '';
    form.querySelector('input[name="applyDeadline"]').value = job.applyDeadline ? job.applyDeadline.split('T')[0] : '';
    form.querySelector('input[name="remoteType"]').value = job.remoteType || '';
    form.querySelector('textarea[name="skillsRequired"]').value = job.skillsRequired || '';
    form.querySelector('textarea[name="keyResponsibility"]').value = job.keyResponsibility || '';
    form.querySelector('textarea[name="rolesAndResponsibilities"]').value = job.rolesAndResponsibilities || '';

    form.dataset.editingId = job.id;
    form.querySelector('button[type="submit"]').textContent = 'Update Job';
    form.scrollIntoView({ behavior: 'smooth' });
}

async function handleDeleteJob(jobId) {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
        const res = await fetch(`${ADMINDASHBOARD_API}/jobs/${jobId}`, {
            method: 'DELETE',
            headers: {
                ...admindashboardAuthHeaders()
            }
        });
        if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);

        alert('Job deleted successfully');
        admindashboardLoadCareers();
    } catch (err) {
        alert('Error deleting job: ' + err.message);
    }
}

// === Placeholder Pages ===
function showPlaceholderPage(title) {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';
    const clone = cloneTemplate('placeholderPageTemplate');
    setElementContent(clone, '[data-page-title]', title);
    container.appendChild(clone);
}

// === Search Handler ===
let searchTimeout;
function handleSearch() {
    const searchInput = document.getElementById('admindashboardTopSearch');
    const searchQuery = searchInput.value.trim();




// === Search Handler ===
let searchTimeout;
function handleSearch() {
    const searchInput = document.getElementById('admindashboardTopSearch');
    const searchQuery = searchInput.value.trim();

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        const currentHash = location.hash || '#/dashboard';

        if (currentHash === '#/clients') {
            admindashboardLoadClients(searchQuery);
        } else if (searchQuery) {
            // If user is searching but not on clients page, navigate to clients
            location.hash = '#/clients';
            setTimeout(() => {
                admindashboardLoadClients(searchQuery);
            }, 100);
        }
    }, 300);
}

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('adminName') || 'Admin';
    const nameEl = document.getElementById('adminNameDisplay');
    if (nameEl) nameEl.textContent = name;

    const profileBtn = document.getElementById('adminProfileBtn');
    const profileMenu = document.getElementById('adminProfileMenu');

    profileBtn.addEventListener('click', e => {
        e.stopPropagation();
        const isVisible = profileMenu.style.display === 'block';
        profileMenu.style.display = isVisible ? 'none' : 'block';
        profileBtn.setAttribute('aria-expanded', !isVisible);
    });

    document.addEventListener('click', () => {
        profileMenu.style.display = 'none';
        profileBtn.setAttribute('aria-expanded', 'false');
    });

    profileMenu.addEventListener('click', e => e.stopPropagation());

    const editProfileLink = document.getElementById('editProfileLink');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            profileMenu.style.display = 'none';
            location.hash = '#/admin-details';
        });
    }

    document.getElementById('dashboardLogoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('admindashboard_jwt');
        localStorage.removeItem('admindashboard_roles');
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        localStorage.removeItem('adminName');
        window.location.href = 'adminlogin.html';
    });

    document.getElementById('admindashboardBtnLogout').addEventListener('click', () => {
        localStorage.removeItem('admindashboard_jwt');
        localStorage.removeItem('admindashboard_roles');
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        localStorage.removeItem('adminName');
        location.href = 'adminlogin.html';
    });

    const burger = document.getElementById('admindashboardBurger');
    const sidebar = document.querySelector('.admindashboard-sidebar');
    const backdrop = document.getElementById('admindashboardBackdrop');

    if (burger) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            backdrop.classList.toggle('show');
        });
    }

    // Close sidebar when clicking backdrop
    if (backdrop) {
        backdrop.addEventListener('click', () => {
            closeSidebar();
        });
    }

    const searchInput = document.getElementById('admindashboardTopSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);

        // Clear search when navigating away from clients
        window.addEventListener('hashchange', () => {
            const currentHash = location.hash || '#/dashboard';
            if (currentHash !== '#/clients') {
                searchInput.value = '';
                allClients = [];
            }
        });
    }

    admindashboardRouter();
});

window.addEventListener('hashchange', admindashboardRouter);





// ========== FIXED SERVICES SECTION - SIMPLE DIRECT APPROACH ==========
// ========== COMPLETE SERVICES SECTION - FIXED ==========

let allServices = [];
let currentServiceId = null;
let currentSectionId = null;
let currentServiceTitle = '';

// Load all services
async function admindashboardLoadServices() {
    showLoadingCard('Loading Services...');

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/services`, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to load services: HTTP ${response.status}`);
        allServices = await response.json();

        if (!Array.isArray(allServices)) {
            throw new Error("API did not return an array");
        }

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const servicesContainer = cloneTemplate('servicesContainerTemplate');
        container.appendChild(servicesContainer);

        const grid = document.getElementById('servicesGrid');

        if (allServices.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'admindashboard-empty';
            emptyMsg.textContent = 'No services available. Click "Add Service" to get started.';
            grid.appendChild(emptyMsg);
        } else {
            allServices.forEach(service => {
                const cardClone = cloneTemplate('serviceCardTemplate');

                setElementContent(cardClone, '[data-title]', service.title || 'Untitled Service');
                setElementContent(cardClone, '[data-subtitle]', service.subtitle || 'Comprehensive solutions tailored to your goals');

                let cleanSlug = service.slug || '';
                if (cleanSlug.startsWith('/')) {
                    cleanSlug = cleanSlug.substring(1);
                }

                const slugEl = cardClone.querySelector('[data-slug]');
                slugEl.innerHTML = '<span style="color: var(--muted); font-size: 13px;">Slug:</span> <code>services.html?service=' + cleanSlug + '</code>';
                slugEl.removeAttribute('data-slug');

                const viewBtn = cardClone.querySelector('[data-view]');
                viewBtn.removeAttribute('data-view');
                viewBtn.onclick = () => window.open(`services.html?service=${cleanSlug}`, '_blank');

                const manageSectionsBtn = cardClone.querySelector('[data-manage-sections]');
                manageSectionsBtn.removeAttribute('data-manage-sections');
                manageSectionsBtn.onclick = () => loadServiceSections(service.id, service.title);

                const editBtn = cardClone.querySelector('[data-edit]');
                editBtn.removeAttribute('data-edit');
                editBtn.onclick = () => showServiceForm(service.id);

                const deleteBtn = cardClone.querySelector('[data-delete]');
                deleteBtn.removeAttribute('data-delete');
                deleteBtn.onclick = () => deleteService(service.id);

                grid.appendChild(cardClone);
            });
        }

        const addServiceBtn = document.getElementById('addServiceBtn');
        if (addServiceBtn) {
            addServiceBtn.onclick = () => showServiceForm();
        }

    } catch (err) {
        showErrorCard('Services', `Error loading services: ${err.message}`);
        console.error(err);
    }
}

// Show service form (create/edit)
async function showServiceForm(serviceId = null) {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';

    const formClone = cloneTemplate('serviceFormTemplate');
    container.appendChild(formClone);

    const form = container.querySelector('#serviceForm');
    const messageDiv = container.querySelector('#serviceFormMessage');
    const formTitle = container.querySelector('[data-form-title]');
    const submitText = container.querySelector('[data-submit-text]');

    if (!form || !messageDiv || !formTitle || !submitText) {
        console.error('Service form elements not found');
        showErrorCard('Service Form', 'Form template is missing required elements');
        return;
    }

    if (serviceId) {
        formTitle.textContent = 'Edit Service';
        submitText.textContent = 'Update Service';

        try {
            const response = await fetch(`${ADMINDASHBOARD_API}/services/${serviceId}`, {
                headers: admindashboardAuthHeaders()
            });

            if (!response.ok) throw new Error('Service not found');
            const service = await response.json();

            form.querySelector('[name="title"]').value = service.title || '';
            form.querySelector('[name="subtitle"]').value = service.subtitle || '';
            form.querySelector('[name="slug"]').value = service.slug || '';
            form.querySelector('[name="bannerImage"]').value = service.bannerImage || '';
            form.querySelector('[name="isActive"]').checked = service.active !== false;
            form.querySelector('[name="metaTitle"]').value = service.metaTitle || '';
            form.querySelector('[name="metaDescription"]').value = service.metaDescription || '';
            form.querySelector('[name="metaKeywords"]').value = service.metaKeywords || '';

            form.dataset.editingId = serviceId;
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = 'Error loading service: ' + err.message;
        }
    } else {
        formTitle.textContent = 'Add New Service';
        submitText.textContent = 'Create Service';
    }

    document.getElementById('backToServicesBtn').onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        admindashboardLoadServices();
    };

    document.getElementById('cancelServiceBtn').onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        admindashboardLoadServices();
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';

        const formData = new FormData(form);
        const serviceData = {
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            slug: formData.get('slug'),
            bannerImage: formData.get('bannerImage'),
            active: formData.get('isActive') === 'on',
            metaTitle: formData.get('metaTitle'),
            metaDescription: formData.get('metaDescription'),
            metaKeywords: formData.get('metaKeywords')
        };

        const editingId = form.dataset.editingId;
        const url = editingId
            ? `${ADMINDASHBOARD_API}/services/${editingId}`
            : `${ADMINDASHBOARD_API}/services`;
        const method = editingId ? 'PUT' : 'POST';

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...admindashboardAuthHeaders()
                },
                body: JSON.stringify(serviceData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            messageDiv.style.color = '#22c55e';
            messageDiv.textContent = editingId ? 'Service updated successfully!' : 'Service created successfully!';

            setTimeout(() => {
                admindashboardLoadServices();
            }, 1500);
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = `Failed to ${editingId ? 'update' : 'create'} service: ${err.message}`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    };
}

// Delete service
async function deleteService(serviceId) {
    if (!confirm('Are you sure you want to delete this service? This will also delete all associated sections and items.')) {
        return;
    }

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/services/${serviceId}`, {
            method: 'DELETE',
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to delete: HTTP ${response.status}`);

        alert('Service deleted successfully');
        allServices = [];
        admindashboardLoadServices();
    } catch (err) {
        alert('Error deleting service: ' + err.message);
    }
}

// ========== SECTIONS MANAGEMENT - FIXED ==========
async function loadServiceSections(serviceId, serviceTitle) {
    currentServiceId = serviceId;
    currentServiceTitle = serviceTitle;
    showLoadingCard('Loading Sections...');

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/service-sections/service/${serviceId}`, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load sections');
        const sections = await response.json();

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const sectionsClone = cloneTemplate('sectionsManagementTemplate');
        container.appendChild(sectionsClone);

        setElementContent(sectionsClone, '[data-service-title]', serviceTitle);

        const sectionsList = document.getElementById('sectionsList');

        if (sections.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'admindashboard-empty';
            emptyMsg.textContent = 'No sections found. Click "Add Section" to create your first section.';
            sectionsList.appendChild(emptyMsg);
        } else {
            sections.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            sections.forEach(section => {
                const cardClone = cloneTemplate('sectionCardTemplate');

                const typeIcon = getSectionTypeIcon(section.sectionType);
                const iconEl = cardClone.querySelector('[data-type-icon]');
                iconEl.className = typeIcon;
                iconEl.removeAttribute('data-type-icon');

                setElementContent(cardClone, '[data-title]', section.title || section.sectionType);
                setElementContent(cardClone, '[data-type]', section.sectionType);

                const subtitleEl = cardClone.querySelector('[data-subtitle]');
                if (section.subtitle) {
                    subtitleEl.textContent = section.subtitle;
                } else {
                    subtitleEl.style.display = 'none';
                }
                subtitleEl.removeAttribute('data-subtitle');

                const manageItemsBtn = cardClone.querySelector('[data-manage-items]');
                manageItemsBtn.removeAttribute('data-manage-items');
                manageItemsBtn.onclick = () => loadSectionItems(section.id, section.title, serviceId, serviceTitle);

                const editBtn = cardClone.querySelector('[data-edit]');
                editBtn.removeAttribute('data-edit');
                editBtn.onclick = () => showSectionForm(serviceId, serviceTitle, section.id);

                const deleteBtn = cardClone.querySelector('[data-delete]');
                deleteBtn.removeAttribute('data-delete');
                deleteBtn.onclick = () => deleteSection(section.id, serviceId, serviceTitle);

                sectionsList.appendChild(cardClone);
            });
        }

        // CRITICAL FIX: Attach button handlers after DOM is fully rendered
        setTimeout(() => {
            const addSectionBtn = document.getElementById('addSectionBtn');
            if (addSectionBtn) {
                addSectionBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showSectionForm(serviceId, serviceTitle);
                };
            }

            // THE KEY FIX: Direct function call instead of hash change
            const backToServicesBtn = document.getElementById('backToServicesFromSections');
            if (backToServicesBtn) {
                backToServicesBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Back to Services clicked - loading services directly');
                    admindashboardLoadServices(); // Direct function call
                };
            }
        }, 100);

    } catch (err) {
        showErrorCard('Sections', 'Error loading sections: ' + err.message);
    }
}

function getSectionTypeIcon(type) {
    const icons = {
        hero: 'bi bi-star-fill',
        features: 'bi bi-grid-3x3-gap-fill',
        steps: 'bi bi-list-ol',
        why_choose_us: 'bi bi-patch-check-fill',
        faq: 'bi bi-question-circle-fill',
        cta: 'bi bi-megaphone-fill'
    };
    return icons[type] || 'bi bi-file-text';
}

// Show section form
async function showSectionForm(serviceId, serviceTitle, sectionId = null) {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';

    const formClone = cloneTemplate('sectionFormTemplate');
    container.appendChild(formClone);

    const form = container.querySelector('#sectionForm');
    const messageDiv = container.querySelector('#sectionFormMessage');
    const formTitle = container.querySelector('[data-form-title]');
    const submitText = container.querySelector('[data-submit-text]');

    if (!form || !messageDiv || !formTitle || !submitText) {
        console.error('Section form elements not found');
        showErrorCard('Section Form', 'Form template is missing required elements');
        return;
    }

    form.querySelector('[name="serviceId"]').value = serviceId;

    if (sectionId) {
        formTitle.textContent = 'Edit Section';
        submitText.textContent = 'Update Section';

        try {
            const response = await fetch(`${ADMINDASHBOARD_API}/service-sections/${sectionId}`, {
                headers: admindashboardAuthHeaders()
            });

            if (!response.ok) throw new Error('Section not found');
            const section = await response.json();

            form.querySelector('[name="sectionType"]').value = section.sectionType || '';
            form.querySelector('[name="title"]').value = section.title || '';
            form.querySelector('[name="subtitle"]').value = section.subtitle || '';
            form.querySelector('[name="orderIndex"]').value = section.orderIndex || 0;
            form.querySelector('[name="metaTitle"]').value = section.metaTitle || '';
            form.querySelector('[name="metaKeywords"]').value = section.metaKeywords || '';
            form.querySelector('[name="metaDescription"]').value = section.metaDescription || '';

            form.dataset.editingId = sectionId;
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = 'Error loading section: ' + err.message;
        }
    } else {
        formTitle.textContent = 'Add New Section';
        submitText.textContent = 'Create Section';
    }

    setTimeout(() => {
        const backToSectionsBtn = document.getElementById('backToSectionsBtn');
        if (backToSectionsBtn) {
            backToSectionsBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                loadServiceSections(serviceId, serviceTitle);
            };
        }

        const cancelSectionBtn = document.getElementById('cancelSectionBtn');
        if (cancelSectionBtn) {
            cancelSectionBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                loadServiceSections(serviceId, serviceTitle);
            };
        }
    }, 100);

    form.onsubmit = async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';

        const formData = new FormData(form);
        const sectionData = {
            serviceId: formData.get('serviceId'),
            sectionType: formData.get('sectionType'),
            title: formData.get('title'),
            subtitle: formData.get('subtitle'),
            orderIndex: parseInt(formData.get('orderIndex')) || 0,
            metaTitle: formData.get('metaTitle'),
            metaKeywords: formData.get('metaKeywords'),
            metaDescription: formData.get('metaDescription')
        };

        const editingId = form.dataset.editingId;
        const url = editingId
            ? `${ADMINDASHBOARD_API}/service-sections/${editingId}`
            : `${ADMINDASHBOARD_API}/service-sections`;
        const method = editingId ? 'PUT' : 'POST';

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...admindashboardAuthHeaders()
                },
                body: JSON.stringify(sectionData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            messageDiv.style.color = '#22c55e';
            messageDiv.textContent = editingId ? 'Section updated successfully!' : 'Section created successfully!';

            setTimeout(() => {
                loadServiceSections(serviceId, serviceTitle);
            }, 1500);
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = `Failed to ${editingId ? 'update' : 'create'} section: ${err.message}`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    };
}

async function deleteSection(sectionId, serviceId, serviceTitle) {
    if (!confirm('Are you sure you want to delete this section? This will also delete all items in this section.')) {
        return;
    }

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/service-sections/${sectionId}`, {
            method: 'DELETE',
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to delete: HTTP ${response.status}`);

        alert('Section deleted successfully');
        loadServiceSections(serviceId, serviceTitle);
    } catch (err) {
        alert('Error deleting section: ' + err.message);
    }
}

// ========== SECTION ITEMS MANAGEMENT ==========

async function loadSectionItems(sectionId, sectionTitle, serviceId, serviceTitle) {
    currentSectionId = sectionId;
    showLoadingCard('Loading Items...');

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/section-items/section/${sectionId}`, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to load items');
        const items = await response.json();

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const itemsClone = cloneTemplate('sectionItemsManagementTemplate');
        container.appendChild(itemsClone);

        setElementContent(itemsClone, '[data-section-title]', sectionTitle);

        const itemsGrid = document.getElementById('sectionItemsGrid');

        if (items.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'admindashboard-empty';
            emptyMsg.textContent = 'No items found. Click "Add Item" to create your first item.';
            itemsGrid.appendChild(emptyMsg);
        } else {
            items.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

            items.forEach(item => {
                const cardClone = cloneTemplate('sectionItemCardTemplate');

                const iconEl = cardClone.querySelector('[data-icon]');
                iconEl.className = item.icon || 'bi bi-star';
                iconEl.removeAttribute('data-icon');

                setElementContent(cardClone, '[data-title]', item.title || 'Untitled');
                setElementContent(cardClone, '[data-description]', item.description || 'No description');

                const editBtn = cardClone.querySelector('[data-edit]');
                editBtn.removeAttribute('data-edit');
                editBtn.onclick = () => showItemForm(sectionId, sectionTitle, serviceId, serviceTitle, item.id);

                const deleteBtn = cardClone.querySelector('[data-delete]');
                deleteBtn.removeAttribute('data-delete');
                deleteBtn.onclick = () => deleteItem(item.id, sectionId, sectionTitle, serviceId, serviceTitle);

                itemsGrid.appendChild(cardClone);
            });
        }

        setTimeout(() => {
            const addItemBtn = document.getElementById('addItemBtn');
            if (addItemBtn) {
                addItemBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    showItemForm(sectionId, sectionTitle, serviceId, serviceTitle);
                };
            }

            const backToSectionsFromItemsBtn = document.getElementById('backToSectionsFromItems');
            if (backToSectionsFromItemsBtn) {
                backToSectionsFromItemsBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    loadServiceSections(serviceId, serviceTitle);
                };
            }
        }, 100);

    } catch (err) {
        showErrorCard('Items', 'Error loading items: ' + err.message);
    }
}

// Show item form
async function showItemForm(sectionId, sectionTitle, serviceId, serviceTitle, itemId = null) {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';

    const formClone = cloneTemplate('sectionItemFormTemplate');
    container.appendChild(formClone);

    const form = container.querySelector('#itemForm');
    const messageDiv = container.querySelector('#itemFormMessage');
    const formTitle = container.querySelector('[data-form-title]');
    const submitText = container.querySelector('[data-submit-text]');

    if (!form || !messageDiv || !formTitle || !submitText) {
        console.error('Item form elements not found');
        showErrorCard('Item Form', 'Form template is missing required elements');
        return;
    }

    form.querySelector('[name="sectionId"]').value = sectionId;

    if (itemId) {
        formTitle.textContent = 'Edit Item';
        submitText.textContent = 'Update Item';

        try {
            const response = await fetch(`${ADMINDASHBOARD_API}/section-items/section/${sectionId}`, {
                headers: admindashboardAuthHeaders()
            });

            if (!response.ok) throw new Error('Failed to load items');
            const items = await response.json();
            const item = items.find(i => i.id === itemId);

            if (!item) throw new Error('Item not found');

            form.querySelector('[name="icon"]').value = item.icon || '';
            form.querySelector('[name="title"]').value = item.title || '';
            form.querySelector('[name="description"]').value = item.description || '';
            form.querySelector('[name="orderIndex"]').value = item.orderIndex || 0;
            form.querySelector('[name="metaTitle"]').value = item.metaTitle || '';
            form.querySelector('[name="metaKeywords"]').value = item.metaKeywords || '';
            form.querySelector('[name="metaDescription"]').value = item.metaDescription || '';

            form.dataset.editingId = itemId;
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = 'Error loading item: ' + err.message;
        }
    } else {
        formTitle.textContent = 'Add New Item';
        submitText.textContent = 'Create Item';
    }

    setTimeout(() => {
        const backToItemsBtn = document.getElementById('backToItemsBtn');
        if (backToItemsBtn) {
            backToItemsBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                loadSectionItems(sectionId, sectionTitle, serviceId, serviceTitle);
            };
        }

        const cancelItemBtn = document.getElementById('cancelItemBtn');
        if (cancelItemBtn) {
            cancelItemBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                loadSectionItems(sectionId, sectionTitle, serviceId, serviceTitle);
            };
        }
    }, 100);

    form.onsubmit = async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';

        const formData = new FormData(form);
        const itemData = {
            sectionId: formData.get('sectionId'),
            icon: formData.get('icon'),
            title: formData.get('title'),
            description: formData.get('description'),
            orderIndex: parseInt(formData.get('orderIndex')) || 0,
            metaTitle: formData.get('metaTitle'),
            metaKeywords: formData.get('metaKeywords'),
            metaDescription: formData.get('metaDescription')
        };

        const editingId = form.dataset.editingId;
        const url = editingId
            ? `${ADMINDASHBOARD_API}/section-items/${editingId}`
            : `${ADMINDASHBOARD_API}/section-items`;
        const method = editingId ? 'PUT' : 'POST';

        if (!editingId) {
            itemData.id = generateUUID();
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...admindashboardAuthHeaders()
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            messageDiv.style.color = '#22c55e';
            messageDiv.textContent = editingId ? 'Item updated successfully!' : 'Item created successfully!';

            setTimeout(() => {
                loadSectionItems(sectionId, sectionTitle, serviceId, serviceTitle);
            }, 1500);
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = `Failed to ${editingId ? 'update' : 'create'} item: ${err.message}`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    };
}

async function deleteItem(itemId, sectionId, sectionTitle, serviceId, serviceTitle) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/section-items/${itemId}`, {
            method: 'DELETE',
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to delete: HTTP ${response.status}`);

        alert('Item deleted successfully');
        loadSectionItems(sectionId, sectionTitle, serviceId, serviceTitle);
    } catch (err) {
        alert('Error deleting item: ' + err.message);
    }
}

// Helper function to generate UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}




// ========== SETTINGS MANAGEMENT SECTION ==========
// Add this code to your admin-dashboard.js file

// Load all settings
async function admindashboardLoadSettings() {
    showLoadingCard('Loading Settings...');

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/settings`, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to load settings: HTTP ${response.status}`);
        const settings = await response.json();

        if (!Array.isArray(settings)) {
            throw new Error("API did not return an array");
        }

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const settingsContainerClone = cloneTemplate('settingsContainerTemplate');
        container.appendChild(settingsContainerClone);

        const grid = document.getElementById('settingsGrid');

        if (settings.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = 'admindashboard-empty';
            emptyMsg.textContent = 'No settings available. Click "Add Settings" to get started.';
            grid.appendChild(emptyMsg);
        } else {
            settings.forEach(setting => {
                const cardClone = cloneTemplate('settingCardTemplate');

                setElementContent(cardClone, '[data-site-name]', setting.siteName || 'Unnamed Setting');
                setElementContent(cardClone, '[data-contact-email]', setting.contactEmail || 'No email set');
                setElementContent(cardClone, '[data-contact-phone]', setting.contactPhone || 'Not set');
                setElementContent(cardClone, '[data-address]', setting.address || 'Not set');
                setElementContent(cardClone, '[data-seo-title]', setting.seoTitle || 'Not set');

                const editBtn = cardClone.querySelector('[data-edit]');
                editBtn.removeAttribute('data-edit');
                editBtn.onclick = () => showSettingsForm(setting.id);

                const deleteBtn = cardClone.querySelector('[data-delete]');
                deleteBtn.removeAttribute('data-delete');
                deleteBtn.onclick = () => deleteSetting(setting.id);

                grid.appendChild(cardClone);
            });
        }

        const addSettingBtn = document.getElementById('addSettingBtn');
        if (addSettingBtn) {
            addSettingBtn.onclick = () => showSettingsForm();
        }

    } catch (err) {
        showErrorCard('Settings', `Error loading settings: ${err.message}`);
        console.error(err);
    }
}

// Show settings form (create/edit)
async function showSettingsForm(settingId = null) {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';

    const formClone = cloneTemplate('settingsFormTemplate');
    container.appendChild(formClone);

    const form = container.querySelector('#settingsForm');
    const messageDiv = container.querySelector('#settingsFormMessage');
    const formTitle = container.querySelector('[data-form-title]');
    const submitText = container.querySelector('[data-submit-text]');

    if (!form || !messageDiv || !formTitle || !submitText) {
        console.error('Settings form elements not found');
        showErrorCard('Settings Form', 'Form template is missing required elements');
        return;
    }

    // ---- BACK BUTTON HANDLER ----
    const backToSettingsBtn = container.querySelector('#backToSettingsBtn');
    if (backToSettingsBtn) {
        backToSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Call the load function directly instead of using hash
            admindashboardLoadSettings();
        });
    }

    // ---- CANCEL BUTTON HANDLER ----
    const cancelSettingsBtn = container.querySelector('#cancelSettingsBtn');
    if (cancelSettingsBtn) {
        cancelSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Call the load function directly instead of using hash
            admindashboardLoadSettings();
        });
    }

    // Load settings if editing
    if (settingId) {
        formTitle.textContent = 'Edit Settings';
        submitText.textContent = 'Update Settings';

        try {
            const response = await fetch(`${ADMINDASHBOARD_API}/settings/${settingId}`, {
                headers: admindashboardAuthHeaders()
            });

            if (!response.ok) throw new Error('Settings not found');
            const setting = await response.json();

            form.querySelector('[name="siteName"]').value = setting.siteName || '';
            form.querySelector('[name="logoUrl"]').value = setting.logoUrl || '';
            form.querySelector('[name="faviconUrl"]').value = setting.faviconUrl || '';
            form.querySelector('[name="contactEmail"]').value = setting.contactEmail || '';
            form.querySelector('[name="contactPhone"]').value = setting.contactPhone || '';
            form.querySelector('[name="address"]').value = setting.address || '';
            form.querySelector('[name="facebookUrl"]').value = setting.facebookUrl || '';
            form.querySelector('[name="instagramUrl"]').value = setting.instagramUrl || '';
            form.querySelector('[name="linkedInUrl"]').value = setting.linkedInUrl || '';
            form.querySelector('[name="twitterUrl"]').value = setting.twitterUrl || '';
            form.querySelector('[name="seoTitle"]').value = setting.seoTitle || '';
            form.querySelector('[name="seoKeywords"]').value = setting.seoKeywords || '';
            form.querySelector('[name="seoDescription"]').value = setting.seoDescription || '';

            form.dataset.editingId = settingId;
        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = 'Error loading settings: ' + err.message;
        }
    } else {
        formTitle.textContent = 'Add New Settings';
        submitText.textContent = 'Create Settings';
    }

    // Submit handler
    form.onsubmit = async (e) => {
        e.preventDefault();
        messageDiv.textContent = '';

        const formData = new FormData(form);
        const settingsData = Object.fromEntries(formData.entries());

        const editingId = form.dataset.editingId;
        const url = editingId
            ? `${ADMINDASHBOARD_API}/settings/${editingId}`
            : `${ADMINDASHBOARD_API}/settings`;
        const method = editingId ? 'PUT' : 'POST';

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Saving...';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...admindashboardAuthHeaders()
                },
                body: JSON.stringify(settingsData)
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}`);
            }

            messageDiv.style.color = '#22c55e';
            messageDiv.textContent = editingId
                ? 'Settings updated successfully!'
                : 'Settings created successfully!';

            setTimeout(() => {
                admindashboardLoadSettings();
            }, 1200);

        } catch (err) {
            messageDiv.style.color = '#ef4444';
            messageDiv.textContent = `Failed to ${editingId ? 'update' : 'create'} settings: ${err.message}`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    };
}

// Delete setting
async function deleteSetting(settingId) {
    if (!confirm('Are you sure you want to delete these settings? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${ADMINDASHBOARD_API}/settings/${settingId}`, {
            method: 'DELETE',
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to delete: HTTP ${response.status}`);

        alert('Settings deleted successfully');
        admindashboardLoadSettings();
    } catch (err) {
        alert('Error deleting settings: ' + err.message);
    }
}








// ========== UPDATE ROUTER ==========
// Update your existing admindashboardRouter function to include services

function admindashboardRouter() {
    const h = location.hash || '#/dashboard';

    admindashboardHighlight(h);
    closeSidebar();





    if (h.startsWith('#/blogs/edit/')) {
        const blogId = h.split('/')[3];
        showBlogForm(blogId);
        return;
    }
    if (h === '#/blogs/new') {
        showBlogForm(null);
        return;
    }

    switch(h) {
        case '#/dashboard':
            admindashboardLoad();
            break;
        case '#/clients':
            admindashboardLoadClients();
            break;
        case '#/services':
            admindashboardLoadServices();
            break;
        case '#/plans':
            showPlaceholderPage('Plans Page (to implement)');
            break;
        case '#/investments':
            showPlaceholderPage('Investments Page (to implement)');
            break;
        case '#/blogs':
            admindashboardLoadBlogs();
            break;
        case '#/seo':
            loadSeoSettings();
            break;
        case '#/settings':
            admindashboardLoadSettings();
            break;
        case '#/documents':
            showPlaceholderPage('Documents Page (to implement)');
            break;
        case '#/careers':
            admindashboardLoadCareers();
            break;
        case '#/admin-details':
            admindashboardLoadAdminDetails();
            break;
        case '#/services':
            loadServices();
        default:
            showPlaceholderPage('Page Not Found');
    }
}

// === Auth Guard ===
let admindashboardRoles = [];
try {
    admindashboardRoles = JSON.parse(localStorage.getItem('admindashboard_roles') || localStorage.getItem('roles') || '[]');
} catch (e) {
    console.error('Invalid roles in localStorage', e);
}
const admindashboardJwt = localStorage.getItem('admindashboard_jwt') || localStorage.getItem('jwt');
const admindashboardIsAdmin = admindashboardRoles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_SUPER_ADMIN');
if (!admindashboardJwt || !admindashboardIsAdmin) {
    window.location.href = 'adminlogin.html';
}
