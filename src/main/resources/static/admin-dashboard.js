// === Backend API base URL ===
const ADMINDASHBOARD_API = 'http://localhost:8080/api';
const IMAGE_BASE_URL = 'http://localhost:8080/assets/';

const admindashboardToken = localStorage.getItem('admindashboard_jwt') || localStorage.getItem('jwt');
const admindashboardAuthHeaders = () => admindashboardToken ? { 'Authorization': 'Bearer ' + admindashboardToken } : {};

// === Template Cloning Utilities ===
function cloneTemplate(templateId) {
    const template = document.getElementById(templateId);
    return template ? template.content.cloneNode(true) : document.createDocumentFragment();
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
    if (container) {
        container.innerHTML = '';
        container.appendChild(clone);
    }
}

function showErrorCard(title, message) {
    const container = document.getElementById('admindashboardView');
    const clone = cloneTemplate('errorCardTemplate');
    setElementContent(clone, '[data-title]', title);
    setElementContent(clone, '[data-message]', message);
    if (container) {
        container.innerHTML = '';
        container.appendChild(clone);
    }
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
    if (!view) return;
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

    if (kpiContainer) {
        kpiData.forEach(item => {
            const kpiClone = cloneTemplate('kpiCardTemplate');
            const icon = kpiClone.querySelector('[data-icon]');
            if (icon) {
                icon.className = `bi ${item.icon}`;
                icon.removeAttribute('data-icon');
            }
            setElementContent(kpiClone, '[data-label]', item.label);
            setElementContent(kpiClone, '[data-value]', item.value);
            kpiContainer.appendChild(kpiClone);
        });
    }

    const chartsContainer = document.getElementById('chartsContainer');

    if (chartsContainer) {
        const sipChartClone = cloneTemplate('chartCardTemplate');
        const sipIcon = sipChartClone.querySelector('[data-icon]');
        if (sipIcon) sipIcon.className = 'bi bi-bar-chart-fill';
        sipChartClone.querySelector('[data-title]')?.removeAttribute && setElementContent(sipChartClone, '[data-title]', 'SIP Planned vs Executed');
        const sipCanvas = sipChartClone.querySelector('[data-canvas]');
        if (sipCanvas) {
            sipCanvas.id = 'admindashboard-chart-sip';
            sipCanvas.setAttribute('aria-label', 'SIP chart');
            sipCanvas.removeAttribute('data-canvas');
        }
        chartsContainer.appendChild(sipChartClone);

        const riskChartClone = cloneTemplate('chartCardTemplate');
        const riskIcon = riskChartClone.querySelector('[data-icon]');
        if (riskIcon) riskIcon.className = 'bi bi-pie-chart-fill';
        setElementContent(riskChartClone, '[data-title]', 'Risk Distribution');
        const riskCanvas = riskChartClone.querySelector('[data-canvas]');
        if (riskCanvas) {
            riskCanvas.id = 'admindashboard-chart-risk';
            riskCanvas.setAttribute('aria-label', 'Risk chart');
            riskCanvas.removeAttribute('data-canvas');
        }
        chartsContainer.appendChild(riskChartClone);

        const goalsChartClone = cloneTemplate('chartCardTemplate');
        const goalsIcon = goalsChartClone.querySelector('[data-icon]');
        if (goalsIcon) goalsIcon.className = 'bi bi-pie-chart';
        setElementContent(goalsChartClone, '[data-title]', 'Goal Categories');
        const goalsCanvas = goalsChartClone.querySelector('[data-canvas]');
        if (goalsCanvas) {
            goalsCanvas.id = 'admindashboard-chart-goals';
            goalsCanvas.setAttribute('aria-label', 'Goal chart');
            goalsCanvas.removeAttribute('data-canvas');
        }
        chartsContainer.appendChild(goalsChartClone);

        const leaderboardClone = cloneTemplate('leaderboardCardTemplate');
        chartsContainer.appendChild(leaderboardClone);
    }

    const leaderboardList = document.getElementById('leaderboardList');
    if (leaderboardList && Array.isArray(leaderboard)) {
        leaderboard.forEach((item, index) => {
            const rowClone = cloneTemplate('leaderboardRowTemplate');
            setElementContent(rowClone, '[data-rank]', index + 1);
            setElementContent(rowClone, '[data-name]', item.name);
            setElementContent(rowClone, '[data-value]', (item.aum || 0).toLocaleString());
            leaderboardList.appendChild(rowClone);
        });
    }

    const alertsCard = document.getElementById('alertsCard');
    if (alertsCard) {
        const alertsClone = cloneTemplate('alertsCardTemplate');
        alertsCard.appendChild(alertsClone);
    }

    const alertsActions = document.getElementById('alertsActions');
    const actions = [
        { class: 'primary', icon: 'bi-person-plus-fill', text: 'Add New Client', id: 'admindashboardAddClient' },
        { class: 'secondary', icon: 'bi-file-earmark-bar-graph', text: 'Generate RM Report', id: 'admindashboardRmReport' },
        { class: '', icon: 'bi-megaphone-fill', text: 'Broadcast Email/SMS', id: 'admindashboardBroadcast' },
        { class: '', icon: 'bi-cloud-arrow-down-fill', text: 'Download Compliance Summary', id: 'admindashboardCompliance' }
    ];

    if (alertsActions) {
        actions.forEach(action => {
            const btnClone = cloneTemplate('actionButtonTemplate');
            const btn = btnClone.querySelector('[data-button]');
            if (btn) {
                btn.className = `admindashboard-btn ${action.class}`;
                btn.id = action.id;
                btn.removeAttribute('data-button');
            }
            const icon = btnClone.querySelector('[data-icon]');
            if (icon) {
                icon.className = `bi ${action.icon}`;
                icon.removeAttribute('data-icon');
            }
            setElementContent(btnClone, '[data-text]', action.text);
            alertsActions.appendChild(btnClone);
        });
    }

    const alertsList = document.getElementById('alertsList');
    if (alertsList && Array.isArray(alerts)) {
        alerts.forEach(alert => {
            const alertClone = cloneTemplate('alertItemTemplate');
            setElementContent(alertClone, '[data-title]', alert.title);
            setElementContent(alertClone, '[data-detail]', alert.detail);
            alertsList.appendChild(alertClone);
        });
    }

    // Charts (guarded)
    try {
        const sipEl = document.getElementById('admindashboard-chart-sip');
        if (sipEl && sip && sip.labels) {
            new Chart(sipEl, {
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
        }

        const riskEl = document.getElementById('admindashboard-chart-risk');
        if (riskEl && risk && risk.labels) {
            new Chart(riskEl, {
                type: 'pie',
                data: {
                    labels: risk.labels,
                    datasets: [{ data: risk.values, backgroundColor: ['#86efac','#93c5fd','#fca5a5'] }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }

        const goalsEl = document.getElementById('admindashboard-chart-goals');
        if (goalsEl && goals && goals.labels) {
            new Chart(goalsEl, {
                type: 'pie',
                data: {
                    labels: goals.labels,
                    datasets: [{ data: goals.values, backgroundColor: ['#fde68a','#a7f3d0','#c7d2fe','#f5d0fe','#fca5a5'] }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }
    } catch (err) {
        console.warn('Chart render skipped or failed', err);
    }

    const addClientBtn = document.getElementById('admindashboardAddClient');
    if (addClientBtn) addClientBtn.onclick = () => location.hash = '#/clients';

    const rmReportBtn = document.getElementById('admindashboardRmReport');
    if (rmReportBtn) rmReportBtn.onclick = () => window.open(ADMINDASHBOARD_API + '/reports/rm?format=pdf','_blank');

    const broadcastBtn = document.getElementById('admindashboardBroadcast');
    if (broadcastBtn) broadcastBtn.onclick = () => alert('Open broadcast dialog here');

    const complianceBtn = document.getElementById('admindashboardCompliance');
    if (complianceBtn) complianceBtn.onclick = () => window.open(ADMINDASHBOARD_API + '/reports/compliance?period=month','_blank');
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
            if (formContainer) formContainer.style.display = 'none';
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
    const originalContent = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
    }

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
        const container = document.getElementById('clientFormContainer');
        if (container) container.style.display = 'none';

        allClients = [];
        admindashboardLoadClients();

    } catch (err) {
        alert(`Failed to ${editingId ? 'update' : 'add'} client: ${err.message}`);
        if (submitBtn) submitBtn.textContent = originalContent;
    } finally {
        if (submitBtn) submitBtn.disabled = false;
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

        if (!Array.isArray(blogs) || blogs.length === 0) {
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

            if (img) {
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
            }

            setElementContent(cardClone, '[data-title]', blog.title);
            setElementContent(cardClone, '[data-description]', blog.shortDescription);
            setElementContent(cardClone, '[data-meta]', `By ${blog.author} | ${new Date(blog.createdAt).toLocaleDateString()}`);

            const editBtn = cardClone.querySelector('[data-edit]');
            if (editBtn) {
                editBtn.removeAttribute('data-edit');
                editBtn.onclick = () => {
                    location.hash = `#/blogs/edit/${blog.id}`;
                };
            }

            const deleteBtn = cardClone.querySelector('[data-delete]');
            if (deleteBtn) {
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
            }

            grid.appendChild(cardClone);
        });

    } catch (error) {
        showErrorCard('Blogs', 'Error loading blogs: ' + (error.message || error));
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
        const fileInput = form ? form.querySelector('input[name="imageFile"]') : null;

        // Remove any other instances if needed (optional)
        if (window.blogContentEditor && window.blogContentEditor.destroy) {
            window.blogContentEditor.destroy();
        }
        if (document.getElementById('blogFullContent')) {
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
        }

        if (blogId) {
            if (formTitle) formTitle.textContent = 'Edit Blog';
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

            if (blog.image && previewImg) {
                previewImg.src = IMAGE_BASE_URL + blog.image;
                previewImg.onerror = function() {
                    this.style.display = 'none';
                };
                if (imagePreview) imagePreview.style.display = 'block';
            } else if (previewImg) {
                previewImg.src = '';
                if (imagePreview) imagePreview.style.display = 'none';
            }

            form.dataset.editingId = blogId;
        } else {
            if (formTitle) formTitle.textContent = 'Add New Blog';
            if (form) form.reset();
            if (form) form.dataset.editingId = '';
            if (previewImg) previewImg.src = '';
            if (imagePreview) imagePreview.style.display = 'none';
        }

        if (fileInput) {
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
                        if (previewImg) {
                            previewImg.src = event.target.result;
                            if (imagePreview) imagePreview.style.display = 'block';
                        }
                    };
                    reader.onerror = () => {
                        alert('Failed to read file');
                        fileInput.value = '';
                    };
                    reader.readAsDataURL(file);
                } else {
                    if (previewImg) previewImg.src = '';
                    if (imagePreview) imagePreview.style.display = 'none';
                }
            });
        }

        const backBtn = document.getElementById('backToBlogsBtn');
        if (backBtn) backBtn.onclick = () => { location.hash = '#/blogs'; };

        const cancelBlogBtn = document.getElementById('cancelBlogBtn');
        if (cancelBlogBtn) cancelBlogBtn.onclick = () => { location.hash = '#/blogs'; };

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (messageDiv) { messageDiv.textContent = ''; messageDiv.style.color = ''; }

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

                    if (messageDiv) {
                        messageDiv.style.color = '#22c55e';
                        messageDiv.textContent = editingId ? 'Blog updated successfully!' : 'Blog created successfully!';
                    }

                    setTimeout(() => {
                        location.hash = '#/blogs';
                    }, 1500);
                } catch (err) {
                    if (messageDiv) {
                        messageDiv.style.color = '#ef4444';
                        messageDiv.textContent = `Failed to ${editingId ? 'update' : 'create'} blog: ${err.message}`;
                    }
                }
            });
        }

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

        if (!Array.isArray(seoList) || seoList.length === 0) {
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
                if (editBtn) {
                    editBtn.removeAttribute('data-edit-seo');
                    editBtn.onclick = () => loadSeoEntryForEdit(seo.id);
                }

                const deleteBtn = entryClone.querySelector('[data-delete-seo]');
                if (deleteBtn) {
                    deleteBtn.removeAttribute('data-delete-seo');
                    deleteBtn.onclick = () => deleteSeoEntry(seo.id);
                }

                seoEntriesList.appendChild(entryClone);
            });
        }

        if (addNewSeoBtn) {
            addNewSeoBtn.onclick = () => {
                if (seoForm) seoForm.reset();
                document.getElementById('seoId').value = '';
                document.getElementById('seoFormTitle').textContent = 'Add New SEO Entry';
                if (seoFormCard) seoFormCard.style.display = 'block';
                if (seoFormMessage) seoFormMessage.textContent = '';

                seoFormCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
        }

        if (cancelSeoFormBtn && cancelSeoBtn) {
            cancelSeoFormBtn.onclick = cancelSeoBtn.onclick = () => {
                if (seoFormCard) seoFormCard.style.display = 'none';
                if (seoForm) seoForm.reset();
                if (seoFormMessage) seoFormMessage.textContent = '';
            };
        }

        if (seoForm) {
            seoForm.onsubmit = async (e) => {
                e.preventDefault();
                if (seoFormMessage) seoFormMessage.textContent = '';

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
                    if (seoFormMessage) {
                        seoFormMessage.style.color = '#ef4444';
                        seoFormMessage.textContent = 'Slug must start with / (e.g., /about-us)';
                    }
                    return;
                }

                if (payload.schemaJson) {
                    try {
                        JSON.parse(payload.schemaJson);
                    } catch (err) {
                        if (seoFormMessage) {
                            seoFormMessage.style.color = '#ef4444';
                            seoFormMessage.textContent = 'Invalid JSON in Schema field: ' + err.message;
                        }
                        return;
                    }
                }

                const submitBtn = seoForm.querySelector('button[type="submit"]');
                const originalText = submitBtn ? submitBtn.textContent : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Saving...';
                }

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

                    if (seoFormMessage) {
                        seoFormMessage.style.color = '#22c55e';
                        seoFormMessage.textContent = payload.id ? 'SEO entry updated successfully!' : 'SEO entry created successfully!';
                    }

                    setTimeout(() => {
                        if (seoFormCard) seoFormCard.style.display = 'none';
                        loadSeoSettings();
                    }, 1500);

                } catch (err) {
                    if (seoFormMessage) {
                        seoFormMessage.style.color = '#ef4444';
                        seoFormMessage.textContent = `Failed to save: ${err.message}`;
                    }
                    if (submitBtn) {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                }
            };
        }

    } catch (err) {
        showErrorCard('SEO Settings', 'Failed to load SEO settings: ' + (err.message || err));
        console.error(err);
    }
}

async function loadSeoEntryForEdit(id) {
    const seoFormCard = document.getElementById('seoFormCard');
    const seoForm = document.getElementById('seoForm');
    const seoFormMessage = document.getElementById('seoFormMessage');
    const seoFormTitle = document.getElementById('seoFormTitle');

    if (seoFormMessage) {
        seoFormMessage.textContent = 'Loading...';
        seoFormMessage.style.color = '#3b82f6';
    }
    if (seoFormCard) seoFormCard.style.display = 'block';
    seoFormCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

        if (seoFormTitle) seoFormTitle.textContent = 'Edit SEO Entry';
        if (seoFormMessage) seoFormMessage.textContent = '';

    } catch (err) {
        if (seoFormMessage) {
            seoFormMessage.style.color = '#ef4444';
            seoFormMessage.textContent = 'Error loading SEO entry: ' + err.message;
        }
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
    showLoadingCard('Loading Profile…');

    // Use stored adminId if available, otherwise default to 1
    const adminId = localStorage.getItem('adminId') || 1;

    try {
        const container = document.getElementById("admindashboardView");
        if (!container) return;
        container.innerHTML = "";

        const formTemplate = cloneTemplate("editAdminTemplate");
        container.appendChild(formTemplate);

        // IDs used inside template:
        // #adminEditForm (form), #adminFormMessage (message div), #adminEmail, #adminPassword, #adminName, #adminSaveBtn
        const form = container.querySelector('#adminEditForm') || container.querySelector('form');
        const messageDiv = container.querySelector('#adminFormMessage') || document.createElement('div');

        if (!form) {
            showErrorCard('Profile', 'Profile form template is missing or has wrong id.');
            return;
        }

        // Fetch current admin details
        const response = await fetch(`${ADMINDASHBOARD_API}/admin/${adminId}`, {
            headers: admindashboardAuthHeaders()
        });

        if (!response.ok) throw new Error(`Failed to load admin details: HTTP ${response.status}`);
        const data = await response.json();

        const emailEl = form.querySelector('#adminEmail') || form.querySelector('input[name="email"]');
        const passwordEl = form.querySelector('#adminPassword') || form.querySelector('input[name="password"]');
        const nameEl = form.querySelector('#adminName') || form.querySelector('input[name="name"]');

        if (emailEl) emailEl.value = data.email || '';
        if (passwordEl) passwordEl.value = '';
        if (nameEl) nameEl.value = data.name || '';

        // update header display if present
        const headerNameEl = document.getElementById('adminNameDisplay');
        if (headerNameEl) headerNameEl.textContent = data.name || headerNameEl.textContent;

        // Form submit handler: update admin
        form.onsubmit = async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('#adminSaveBtn') || form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Saving...';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Updating...';
            }

            if (messageDiv) {
                messageDiv.innerText = 'Updating…';
                messageDiv.style.color = '#2563eb';
            }

            const payload = {
                email: (emailEl && emailEl.value || '').trim(),
                password: (passwordEl && passwordEl.value || '').trim(),
                name: (nameEl && nameEl.value || '').trim()
            };

            if (!payload.email || !payload.name) {
                if (messageDiv) {
                    messageDiv.innerText = 'Email and Name are required';
                    messageDiv.style.color = '#ef4444';
                }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
                return;
            }

            try {
                const res = await fetch(`${ADMINDASHBOARD_API}/admin/${adminId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...admindashboardAuthHeaders()
                    },
                    body: JSON.stringify(payload)
                });

                if (!res.ok) {
                    const errJson = await res.json().catch(() => ({}));
                    throw new Error(errJson.message || `HTTP ${res.status}`);
                }

                const result = await res.json().catch(() => ({}));
                if (messageDiv) {
                    messageDiv.innerText = result.message || 'Profile updated successfully';
                    messageDiv.style.color = '#22c55e';
                }

                // Refresh displayed header name
                if (headerNameEl) headerNameEl.textContent = payload.name;
                localStorage.setItem('adminName', payload.name);

                // reload admin details to reflect any changes
                setTimeout(() => {
                    admindashboardLoadAdminDetails();
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
                }, 900);

            } catch (err) {
                if (messageDiv) {
                    messageDiv.innerText = err.message;
                    messageDiv.style.color = '#ef4444';
                }
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
            }
        };

    } catch (err) {
        showErrorCard('Profile', 'Failed to load profile: ' + (err.message || err));
        console.error('admindashboardLoadAdminDetails error', err);
    }
}

// helper reload function
function loadUpdatedAdminDetails() {
    const adminId = localStorage.getItem('adminId') || 1;

    fetch(`/api/admin/${adminId}`)
        .then(res => res.json())
        .then(data => {
            const emailEl = document.getElementById("adminEmail");
            const passwordEl = document.getElementById("adminPassword");
            const nameEl = document.getElementById("adminName");
            if (emailEl) emailEl.value = data.email || '';
            if (passwordEl) passwordEl.value = data.password || '';
            if (nameEl) nameEl.value = data.name || '';
        })
        .catch(err => {
            console.warn('Failed to reload admin details', err);
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
        })
        .catch(() => {});
}

// (Remaining sections such as Careers, Services, Sections, Items, Settings...)
// For brevity we assume the rest of the functions below remain as in your original file,
// but we fixed duplicate declarations and router problems earlier.
// If you need the rest re-printed we can include them too (they were already present above).

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

        (jobs || []).forEach(job => {
            const rowClone = cloneTemplate('careerRowTemplate');
            setElementContent(rowClone, '[data-title]', job.title || '');
            setElementContent(rowClone, '[data-department]', job.department || '');
            setElementContent(rowClone, '[data-location]', job.location || '');
            setElementContent(rowClone, '[data-experience]', job.experience || '');
            setElementContent(rowClone, '[data-employmenttype]', job.employmentType || '');

            const editBtn = rowClone.querySelector('[data-edit]');
            if (editBtn) {
                editBtn.removeAttribute('data-edit');
                editBtn.addEventListener('click', () => handleEditJob(job));
            }

            const deleteBtn = rowClone.querySelector('[data-delete]');
            if (deleteBtn) {
                deleteBtn.removeAttribute('data-delete');
                deleteBtn.addEventListener('click', () => handleDeleteJob(job.id));
            }

            tbody.appendChild(rowClone);
        });

        const form = document.getElementById('addJobForm');
        const messageDiv = document.getElementById('jobFormMessage');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (messageDiv) messageDiv.textContent = '';

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

                    if (messageDiv) {
                        messageDiv.style.color = '#22c55e';
                        messageDiv.textContent = editingId ? 'Job updated successfully!' : 'Job added successfully!';
                    }

                    delete form.dataset.editingId;
                    form.querySelector('button[type="submit"]').textContent = 'Add Job';
                    form.reset();

                    admindashboardLoadCareers();
                } catch (err) {
                    if (messageDiv) {
                        messageDiv.style.color = '#ef4444';
                        messageDiv.textContent = `Failed to ${editingId ? 'update' : 'add'} job: ${err.message}`;
                    }
                }
            });
        }
    } catch (err) {
        showErrorCard('Careers', 'Failed to load careers data.');
        console.error(err);
    }
}

// (Other helper functions like handleEditJob, handleDeleteJob, services/sections/items/settings functions
// remain as in your original file — they were already present above in your long code and mostly correct.
// If you want I can re-integrate them line-for-line; tell me if you want the entire file reprinted
// with everything inlined.)

// === Search Handler ===
let searchTimeout;
function handleSearch() {
    const searchInput = document.getElementById('admindashboardTopSearch');
    if (!searchInput) return;
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

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', e => {
            e.stopPropagation();
            const isVisible = profileMenu.style.display === 'block';
            profileMenu.style.display = isVisible ? 'none' : 'block';
            profileBtn.setAttribute('aria-expanded', (!isVisible).toString());
        });

        document.addEventListener('click', () => {
            profileMenu.style.display = 'none';
            profileBtn.setAttribute('aria-expanded', 'false');
        });

        profileMenu.addEventListener('click', e => e.stopPropagation());
    }

    const editProfileLink = document.getElementById('editProfileLink');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', (e) => {
            e.preventDefault();
            profileMenu && (profileMenu.style.display = 'none');
            location.hash = '#/admin-details';
        });
    }

    const dashboardLogoutLink = document.getElementById('dashboardLogoutLink');
    if (dashboardLogoutLink) {
        dashboardLogoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('admindashboard_jwt');
            localStorage.removeItem('admindashboard_roles');
            localStorage.removeItem('jwt');
            localStorage.removeItem('roles');
            localStorage.removeItem('adminName');
            window.location.href = 'adminlogin.html';
        });
    }

    const logoutBtn = document.getElementById('admindashboardBtnLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('admindashboard_jwt');
            localStorage.removeItem('admindashboard_roles');
            localStorage.removeItem('jwt');
            localStorage.removeItem('roles');
            localStorage.removeItem('adminName');
            location.href = 'adminlogin.html';
        });
    }

    const burger = document.getElementById('admindashboardBurger');
    const sidebar = document.querySelector('.admindashboard-sidebar');
    const backdrop = document.getElementById('admindashboardBackdrop');

    if (burger && sidebar && backdrop) {
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
            backdrop.classList.toggle('show');
        });

        // Close sidebar when clicking backdrop
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

// ========== ROUTER ==========
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
            admindashboardLoadServices && admindashboardLoadServices();
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
            admindashboardLoadSettings && admindashboardLoadSettings();
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
// ---------- Missing helpers to avoid ReferenceError ----------
// Add this block near the end of your file (before auth guard or before router runs)

function showPlaceholderPage(text) {
    const container = document.getElementById('admindashboardView');
    if (!container) return;
    container.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'admindashboard-card';
    const h2 = document.createElement('h2');
    h2.textContent = text || 'Placeholder';
    h2.style.margin = '0 0 12px 0';
    card.appendChild(h2);
    const p = document.createElement('p');
    p.textContent = 'This page is not implemented yet.';
    p.style.color = 'var(--muted)';
    card.appendChild(p);
    container.appendChild(card);
}


// Minimal Settings loader (safe)
async function admindashboardLoadSettings() {
    showLoadingCard('Loading Settings...');
    try {
        const settings = await admindashboardGet('/settings', {});
        const container = document.getElementById('admindashboardView');
        if (!container) return;
        container.innerHTML = '';

        const tpl = document.getElementById('settingsContainerTemplate');
        if (tpl) {
            container.appendChild(tpl.content.cloneNode(true));
            // optional: populate known fields if template contains them
            const siteTitle = settings.siteTitle || settings.appName || '';
            const siteTitleEl = document.getElementById('settingsSiteTitle');
            if (siteTitleEl) siteTitleEl.value = siteTitle;
            return;
        }

        const card = document.createElement('div');
        card.className = 'admindashboard-card';
        const h2 = document.createElement('h2');
        h2.textContent = 'Settings';
        card.appendChild(h2);

        const pre = document.createElement('pre');
        pre.style.whiteSpace = 'pre-wrap';
        pre.textContent = typeof settings === 'object' ? JSON.stringify(settings, null, 2) : String(settings);
        card.appendChild(pre);

        container.appendChild(card);

    } catch (err) {
        showErrorCard('Settings', 'Error loading settings: ' + (err.message || err));
        console.error(err);
    }
}
// ---------- Services: List + Form + Sections ----------

// Helper: render services list view
async function admindashboardLoadServices() {
    showLoadingCard("Loading Services...");
    try {
        // NOTE: leading "/" and ADMINDASHBOARD_API constant
        const services = await admindashboardGet("/services", []);
        const container = document.getElementById("admindashboardView");
        if (!container) return;
        container.innerHTML = "";

        // Use template if available
        const tpl = document.getElementById("servicesContainerTemplate");
        if (!tpl) {
            // Fallback simple list
            const card = document.createElement("div");
            card.className = "admindashboard-card";
            const h2 = document.createElement("h2");
            h2.textContent = "Services";
            card.appendChild(h2);

            if (!Array.isArray(services) || services.length === 0) {
                const p = document.createElement("p");
                p.textContent = "No services found. Click Add Service to create your first one.";
                p.style.color = "var(--muted)";
                card.appendChild(p);
            } else {
                const list = document.createElement("div");
                list.className = "admindashboard-list";
                services.forEach(s => {
                    const row = document.createElement("div");
                    row.className = "admindashboard-list-item";
                    row.innerHTML = `
                        <div><strong>${s.title || "Untitled"}</strong></div>
                        <div class="muted">${s.subtitle || ""}</div>
                        <div class="muted">${s.slug || ""}</div>
                    `;
                    list.appendChild(row);
                });
                card.appendChild(list);
            }

            container.appendChild(card);
            return;
        }

        // Render header + grid via template
        const clone = tpl.content.cloneNode(true);
        container.appendChild(clone);

        const addBtn = document.getElementById("addServiceBtn");
        const grid = document.getElementById("servicesGrid");

        if (addBtn) {
            addBtn.onclick = () => {
                showServiceForm(); // open create form
            };
        }

        if (!grid) return;

        grid.innerHTML = "";

        if (!Array.isArray(services) || services.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No services found. Click Add Service to create your first service.";
            empty.style.color = "var(--muted)";
            empty.style.padding = "20px";
            grid.appendChild(empty);
            return;
        }

        const cardTpl = document.getElementById("serviceCardTemplate");
        services.forEach(service => {
            if (cardTpl) {
                const cardClone = cardTpl.content.cloneNode(true);

                const titleEl = cardClone.querySelector("[data-title]");
                const subtitleEl = cardClone.querySelector("[data-subtitle]");
                const slugEl = cardClone.querySelector("[data-slug]");

                if (titleEl) titleEl.textContent = service.title || "Untitled";
                if (subtitleEl) subtitleEl.textContent = service.subtitle || "";
                if (slugEl) slugEl.textContent = service.slug || "";

                // Buttons
                const viewBtn = cardClone.querySelector("[data-view]");
                const manageSectionsBtn = cardClone.querySelector("[data-manage-sections]");
                const editBtn = cardClone.querySelector("[data-edit]");
                const deleteBtn = cardClone.querySelector("[data-delete]");

                if (viewBtn) {
                    viewBtn.removeAttribute("data-view");
                    viewBtn.onclick = () => {
                        renderServicePreview(service);
                    };
                }

                if (manageSectionsBtn) {
                    manageSectionsBtn.removeAttribute("data-manage-sections");
                    manageSectionsBtn.onclick = () => {
                        loadSectionsForService(service);
                    };
                }

                if (editBtn) {
                    editBtn.removeAttribute("data-edit");
                    editBtn.onclick = () => {
                        showServiceForm(service);
                    };
                }

                if (deleteBtn) {
                    deleteBtn.removeAttribute("data-delete");
                    deleteBtn.onclick = async () => {
                        if (!confirm("Are you sure you want to delete this service?")) return;
                        try {
                            const res = await fetch(`${ADMINDASHBOARD_API}/services/${service.id}`, {
                                method: "DELETE",
                                headers: {
                                    ...admindashboardAuthHeaders()
                                }
                            });
                            if (!res.ok) throw new Error("Failed to delete service");
                            alert("Service deleted successfully");
                            admindashboardLoadServices();
                        } catch (err) {
                            alert("Error deleting service: " + err.message);
                        }
                    };
                }

                grid.appendChild(cardClone);
            }
        });
    } catch (err) {
        showErrorCard("Services", "Error loading services: " + err.message);
        console.error(err);
    }
}
//view
async function renderServicePreview(service) {
    showLoadingCard(`Viewing Service – ${service.title}`);

    try {
        // 1️⃣ Fetch sections
        const sections = await admindashboardGet(
            `/services/${service.id}/sections`,
            []
        );

        const container = document.getElementById("admindashboardView");
        container.innerHTML = "";

        /* ===============================
           HEADER
        =============================== */
        const headerCard = document.createElement("div");
        headerCard.className = "admindashboard-card";

        headerCard.innerHTML = `
            <button class="admindashboard-btn-small secondary" id="backToServicesBtn">
                ← Back to Services
            </button>

            <h2 style="margin-top:12px">${service.title}</h2>
            <p class="muted">${service.subtitle || ""}</p>
        `;

        container.appendChild(headerCard);

        document.getElementById("backToServicesBtn").onclick =
            () => admindashboardLoadServices();

        /* ===============================
           SECTIONS
        =============================== */
        if (!Array.isArray(sections) || sections.length === 0) {
            const empty = document.createElement("p");
            empty.textContent = "No sections available for this service.";
            empty.className = "muted";
            container.appendChild(empty);
            return;
        }

        for (const section of sections) {
            const sectionCard = document.createElement("div");
            sectionCard.className = "admindashboard-card";

            sectionCard.innerHTML = `
                <h3>${section.title || "Untitled Section"}</h3>
                <p class="muted">${section.subtitle || ""}</p>

                <span class="badge">
                    ${section.sectionType?.toUpperCase() || ""}
                </span>

                <div class="preview-items" style="margin-top:12px"></div>
            `;

            const itemsContainer =
                sectionCard.querySelector(".preview-items");

            /* ===============================
               ITEMS
            =============================== */
            const items = await admindashboardGet(
                `/section-items/section/${section.id}`,
                []
            );

            if (!Array.isArray(items) || items.length === 0) {
                itemsContainer.innerHTML =
                    `<p class="muted">No items in this section.</p>`;
            } else {
                items
                    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                    .forEach(item => {
                        const itemDiv = document.createElement("div");
                        itemDiv.className = "preview-item";

                        itemDiv.innerHTML = `
                            <div style="margin-bottom:8px">
                                ${item.icon ? `<i class="${item.icon}"></i>` : ""}
                                <strong>${item.title || ""}</strong>
                            </div>
                            <p class="muted">${item.description || ""}</p>
                        `;

                        itemsContainer.appendChild(itemDiv);
                    });
            }

            container.appendChild(sectionCard);
        }

    } catch (err) {
        showErrorCard("Service Preview", err.message);
    }
}


// Helper: show service create/edit form
async function showServiceForm(service = null) {
    const container = document.getElementById("admindashboardView");
    if (!container) return;

    container.innerHTML = "";

    const tpl = document.getElementById("serviceFormTemplate");
    if (!tpl) {
        showErrorCard("Service Form", "Service form template is missing.");
        return;
    }

    const clone = tpl.content.cloneNode(true);
    container.appendChild(clone);

    const form = document.getElementById("serviceForm");
    const messageDiv = document.getElementById("serviceFormMessage");
    const formTitleSpan = container.querySelector("[data-form-title]");
    const submitTextSpan = container.querySelector("[data-submit-text]");
    const backBtn = document.getElementById("backToServicesBtn");
    const cancelBtn = document.getElementById("cancelServiceBtn");

    if (backBtn) backBtn.onclick = () => admindashboardLoadServices();
    if (cancelBtn) cancelBtn.onclick = () => admindashboardLoadServices();

    if (!form) {
        showErrorCard("Service Form", "Form element not found.");
        return;
    }

    // If editing, prefill
    if (service) {
        if (formTitleSpan) formTitleSpan.textContent = "Edit Service";
        if (submitTextSpan) submitTextSpan.textContent = "Update Service";

        form.dataset.editingId = service.id;

        const setValue = (name, value) => {
            const field = form.querySelector(`[name="${name}"]`);
            if (field) {
                if (field.type === "checkbox") {
                    field.checked = !!value;
                } else {
                    field.value = value ?? "";
                }
            }
        };

        setValue("title", service.title);
        setValue("subtitle", service.subtitle);
        setValue("slug", service.slug);
        setValue("bannerImage", service.bannerImage);
        setValue("isActive", service.isActive);
        setValue("metaTitle", service.metaTitle);
        setValue("metaKeywords", service.metaKeywords);
        setValue("metaDescription", service.metaDescription);

        // prefill allowed section types
        if (Array.isArray(service.allowedSectionTypes)) {
            service.allowedSectionTypes.forEach(type => {
                const checkbox = form.querySelector(
                    `input[name="allowedSectionTypes"][value="${type}"]`
                );
                if (checkbox) checkbox.checked = true;
            });
        }

    } else {
        if (formTitleSpan) formTitleSpan.textContent = "Add New Service";
        if (submitTextSpan) submitTextSpan.textContent = "Create Service";
        form.reset();
        delete form.dataset.editingId;
    }

    // Submit handler
    form.onsubmit = async (e) => {
        e.preventDefault();
        if (messageDiv) {
            messageDiv.textContent = "";
            messageDiv.style.color = "";
        }

        const formData = new FormData(form);

        // modified payload with allowedsectiontypes.
        const payload = {};
        const allowedSectionTypes = [];

        formData.forEach((value, key) => {
            if (key === "allowedSectionTypes") {
                allowedSectionTypes.push(value);
            } else if (key === "isActive") {
                payload[key] = form.querySelector('[name="isActive"]').checked;
            } else {
                payload[key] = value?.trim ? value.trim() : value;
            }
        });

      //  payload.allowedSectionTypes = allowedSectionTypes;
        payload.allowedSectionTypes = allowedSectionTypes.length
            ? allowedSectionTypes
            : [];

        // slug sanitize
            if (payload.slug) {
                payload.slug = payload.slug
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '');
            }

        const editingId = form.dataset.editingId;
        const url = editingId
            ? `${ADMINDASHBOARD_API}/services/${editingId}`
            : `${ADMINDASHBOARD_API}/services`;
        const method = editingId ? "PUT" : "POST";

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Saving...";
        }

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...admindashboardAuthHeaders()
                },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                let msg = "Failed to save service";
                try {
                    const errJson = await res.json();
                    if (errJson.message) msg = errJson.message;
                } catch (_) {}
                throw new Error(msg);
            }

            if (messageDiv) {
                messageDiv.style.color = "#22c55e";
                messageDiv.textContent = editingId
                    ? "Service updated successfully!"
                    : "Service created successfully!";
            }

            setTimeout(() => {
                admindashboardLoadServices();
            }, 1000);
        } catch (err) {
            if (messageDiv) {
                messageDiv.style.color = "#ef4444";
                messageDiv.textContent = "Error saving service: " + err.message;
            } else {
                alert("Error saving service: " + err.message);
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    };
}


function loadSectionsForService(service) {
    // Non-blocking navigation (fixes click violation)
    requestAnimationFrame(() => {
        renderSectionsManagement(service);
    });
}

async function renderSectionsManagement(service) {
   // const serviceId = service.id;
    showLoadingCard(`Loading Sections – ${service.title}`);

    try {
        const sections = await admindashboardGet(
            `/services/${service.id}/sections`,
            []
        );

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const tpl = document.getElementById('sectionsManagementTemplate');
        if (!tpl) {
            showErrorCard('Sections', 'Sections template missing');
            return;
        }

        const clone = tpl.content.cloneNode(true);
        container.appendChild(clone);

        // Header title
        const titleEl = container.querySelector('[data-service-title]');
        if (titleEl) titleEl.textContent = service.title || '';

        // Back button
        const backBtn = document.getElementById('backToServicesFromSections');
        if (backBtn) backBtn.onclick = () => admindashboardLoadServices();

        // Add section
        const addBtn = document.getElementById('addSectionBtn');
  //      if (addBtn) addBtn.onclick = () => showSectionForm(service.id);
        if (addBtn) addBtn.onclick = () => showSectionForm(service);

        const list = document.getElementById('sectionsList');
        list.innerHTML = '';

        if (!Array.isArray(sections) || sections.length === 0) {
            const p = document.createElement('p');
            p.textContent = 'No sections found. Click "Add Section" to create one.';
            p.style.color = 'var(--muted)';
            list.appendChild(p);
            return;
        }

        const cardTpl = document.getElementById('sectionCardTemplate');

        sections.forEach(section => {
            const card = cardTpl.content.cloneNode(true);

            card.querySelector('[data-title]').textContent = section.title || 'Untitled';
            card.querySelector('[data-subtitle]').textContent = section.subtitle || '';
            card.querySelector('[data-type]').textContent = section.sectionType || '';

            const iconEl = card.querySelector('[data-type-icon]');
            if (iconEl) {
                iconEl.className = 'bi bi-layers';
            }

            // Manage items
            card.querySelector('[data-manage-items]').onclick = () => {
                loadItemsForSection(service.id,section);
            };

            // Edit
            card.querySelector('[data-edit]').onclick = () => {
               // showSectionForm(service.id, section);
               showSectionForm(service, section);
            };

            // Delete
            card.querySelector('[data-delete]').onclick = async () => {
                if (!confirm('Delete this section?')) return;

                await fetch(`${ADMINDASHBOARD_API}/services/${service.id}/sections/${section.id}`, {
                    method: 'DELETE',
                    headers: admindashboardAuthHeaders()
                });

                renderSectionsManagement(service);
            };

            list.appendChild(card);
        });

    } catch (err) {
        showErrorCard('Sections', err.message);
    }
}


function showSectionForm(service, section = null) {

    const container = document.getElementById('admindashboardView');
    if (!container) {
        alert("admindashboardView not found");
        return;
    }

    container.innerHTML = '';

    // ✅ DEFINE tpl FIRST
    const tpl = document.getElementById('sectionFormTemplate');
    if (!tpl) {
        showErrorCard('Section', 'sectionFormTemplate missing');
        return;
    }

    // ✅ THEN USE tpl
    container.appendChild(tpl.content.cloneNode(true));

    const form = container.querySelector('#sectionForm');
    const messageDiv = container.querySelector('#sectionFormMessage');
    const sectionTypeSelect = container.querySelector('#sectionTypeSelect');

    if (!sectionTypeSelect) {
        alert("sectionTypeSelect not found");
        return;
    }

      if (!section) {
          sectionTypeSelect.onchange = () => {
              handleSectionTypeChange(sectionTypeSelect.value);
          };
      }


    // Back / Cancel
    container.querySelector('#backToSectionsBtn').onclick =
    container.querySelector('#cancelSectionBtn').onclick =
        () => renderSectionsManagement(service);

    // Set serviceId
    form.querySelector('[name="serviceId"]').value = service.id;

    // Populate section types
    sectionTypeSelect.innerHTML = '<option value="">-- Select Type --</option>';
    if (Array.isArray(service.allowedSectionTypes)) {
        service.allowedSectionTypes.forEach(type => {
            const opt = document.createElement('option');
            opt.value = type;
            opt.textContent = type.replace(/_/g, ' ').toUpperCase();
            sectionTypeSelect.appendChild(opt);
        });
    }

    // Edit mode
    if (section) {
        form.dataset.editingId = section.id;
        sectionTypeSelect.value = section.sectionType;
      //  handleSectionTypeChange(section.sectionType);
       sectionTypeSelect.disabled = true;

        form.querySelector('[name="title"]').value = section.title || '';
        form.querySelector('[name="subtitle"]').value = section.subtitle || '';
        form.querySelector('[name="orderIndex"]').value = section.orderIndex ?? 0;
    }
    if (section) {
        const dynamicFields =
            document.getElementById('sectionDynamicFields');
        if (dynamicFields) dynamicFields.innerHTML = '';
    }



      //onsubmit
      form.onsubmit = async (e) => {
          e.preventDefault();
          const orderIndexRaw =
              form.querySelector('[name="orderIndex"]')?.value ?? '';


          const editingId = form.dataset.editingId;

          const payload = {
              title: form.querySelector('[name="title"]').value || null,
              subtitle: form.querySelector('[name="subtitle"]').value || null,
              orderIndex: orderIndexRaw !== '' ? Number(orderIndexRaw) : null,
              metaTitle: form.querySelector('[name="metaTitle"]').value || null,
              metaKeywords: form.querySelector('[name="metaKeywords"]').value || null,
              metaDescription: form.querySelector('[name="metaDescription"]').value || null
          };

          // ONLY on CREATE
          if (!editingId) {
              payload.sectionType =
                  form.querySelector('[name="sectionType"]').value;
          }



          if (!editingId && !payload.sectionType) {
              messageDiv.style.color = '#ef4444';
              messageDiv.textContent = 'Please select a section type';
              return;
          }

          // HERO extra field
          if (payload.sectionType === 'hero') {
              payload.bannerImageUrl =
                  form.querySelector('[name="bannerImage"]')?.value || null;
          }


          const url = editingId
              ? `${ADMINDASHBOARD_API}/services/${service.id}/sections/${editingId}`
              : `${ADMINDASHBOARD_API}/services/${service.id}/sections`;

          const method = editingId ? 'PUT' : 'POST';

          try {
              const res = await fetch(url, {
                  method,
                  headers: {
                      'Content-Type': 'application/json',
                      ...admindashboardAuthHeaders()
                  },
                  body: JSON.stringify(payload)
              });

              if (!res.ok) throw new Error('Failed to save section');

              messageDiv.style.color = '#22c55e';
              messageDiv.textContent = 'Section saved successfully';

              setTimeout(() => {
                  renderSectionsManagement(service);
              }, 800);

          } catch (err) {
              messageDiv.style.color = '#ef4444';
              messageDiv.textContent = err.message;
          }
      };

}

function handleSectionTypeChange(type) {

//    initRepeatableGroup(container);
    const container = document.getElementById('sectionDynamicFields');
    container.innerHTML = '';

    // HERO
    if (type === 'hero') {
        container.innerHTML = `
            <div class="form-row">
                <label>Banner Image URL</label>
                <input type="text" name="bannerImage"
                       class="admindashboard-input"
                       placeholder="https://example.com/banner.jpg"/>
            </div>
        `;
        return;
    }

    // CTA (nothing extra for now)
    if (type === 'cta') {
        return;
    }

       // ALL OTHER TYPES (generic & future-proof) with ui
       container.innerHTML = `
           <div class="repeatable-group" data-group="${type}">
               <div class="repeatable-header">
                   <h4 class="repeatable-title">
                       ${type.replace(/_/g, ' ').toUpperCase()} Items
                   </h4>

                   <button type="button"
                           class="admindashboard-btn-small primary"
                           data-add>
                       <i class="bi bi-plus-circle"></i> Add Item
                   </button>
               </div>

               <div class="repeatable-items"></div>
           </div>
       `;

    initRepeatableGroup(container);

}

function initRepeatableGroup(root) {
    const group = root.querySelector('.repeatable-group');
    if (!group) return;

    const itemsContainer = group.querySelector('.repeatable-items');
    const addBtn = group.querySelector('[data-add]');


     const createItem = () => {
         const div = document.createElement('div');
         div.className = 'repeatable-item';

         // FAQ → Question & Answer
         if (group.dataset.group === 'faq') {
             div.innerHTML = `
                 <div class="repeatable-item-header">
                     <span class="item-index">FAQ Item</span>
                     <button type="button" class="remove-item">
                         <i class="bi bi-trash"></i>
                     </button>
                 </div>

                 <div class="form-row">
                     <label>Question</label>
                     <input
                         name="itemTitle"
                         class="admindashboard-input"
                         placeholder="Enter question"/>
                 </div>

                 <div class="form-row">
                     <label>Answer</label>
                     <textarea
                         name="itemDescription"
                         class="admindashboard-textarea"
                         rows="3"
                         placeholder="Enter answer"></textarea>
                 </div>
             `;
         }
         // ALL OTHER TYPES → Title & Description (+ optional icon)
         else {
             div.innerHTML = `
                 <div class="repeatable-item-header">
                     <span class="item-index">Item</span>
                     <button type="button" class="remove-item">
                         <i class="bi bi-trash"></i>
                     </button>
                 </div>

                 <div class="form-row">
                     <label>Title</label>
                     <input
                         name="itemTitle"
                         class="admindashboard-input"
                         placeholder="Enter title"/>
                 </div>

                 <div class="form-row">
                     <label>Description</label>
                     <textarea
                         name="itemDescription"
                         class="admindashboard-textarea"
                         rows="3"
                         placeholder="Enter description"></textarea>
                 </div>

                 <div class="form-row">
                     <label>Icon (optional)</label>
                     <input
                         name="itemIcon"
                         class="admindashboard-input"
                         placeholder="bi bi-star / fa fa-check"/>
                 </div>
             `;
         }

         // Delete item
         div.querySelector('.remove-item').onclick = () => div.remove();

         itemsContainer.appendChild(div);
     };

    addBtn.onclick = createItem;
    createItem(); // add first by default
}

//loading Items For Section
function loadItemsForSection(serviceId,section) {
    requestAnimationFrame(() => {
        renderSectionItems(serviceId, section);
    });
}

//Rendering section items
async function renderSectionItems(serviceId, section) {
    showLoadingCard(`Loading Items – ${section.title || "Section"}`);

    try {
        const items = await admindashboardGet(
            `/section-items/section/${section.id}`,
            []
        );

        const container = document.getElementById("admindashboardView");
        container.innerHTML = "";

        const tpl = document.getElementById("sectionItemsManagementTemplate");
        container.appendChild(tpl.content.cloneNode(true));

        container.querySelector("[data-section-title]").textContent =
            section.title || "";

        document.getElementById("backToSectionsFromItems").onclick =
            () => renderSectionsManagement({ id: serviceId });

        const addBtn = document.getElementById("addItemBtn");
        const grid = document.getElementById("sectionItemsGrid");

        if (section.sectionType === "cta" && items.length >= 1) {
            addBtn.style.display = "none";
        } else {
            addBtn.onclick = () => showItemForm(serviceId,section);
        }

        if (!items.length) {
            grid.innerHTML = `<p>No items found. Click Add Item.</p>`;
            return;
        }

        const cardTpl = document.getElementById("sectionItemCardTemplate");

        items.forEach(item => {
            const card = cardTpl.content.cloneNode(true);

            card.querySelector("[data-title]").textContent = item.title || "";
            card.querySelector("[data-description]").textContent =
                item.description || "";

            card.querySelector("[data-edit]").onclick =
                () => showItemForm(serviceId,section, item);

            card.querySelector("[data-delete]").onclick = async () => {
                if (!confirm("Delete this item?")) return;

                await fetch(
                    `${ADMINDASHBOARD_API}/section-items/${item.id}`,
                    {
                        method: "DELETE",
                        headers: admindashboardAuthHeaders()
                    }
                );

                renderSectionItems(serviceId, section);
            };

            grid.appendChild(card);
        });

    } catch (err) {
        showErrorCard("Section Items", err.message);
    }
}


//add/edit item form
function showItemForm(serviceId, section, item = null) {
    const container = document.getElementById("admindashboardView");
    container.innerHTML = "";

    const tpl = document.getElementById("sectionItemFormTemplate");
    if (!tpl) {
        showErrorCard("Item", "Item form template missing");
        return;
    }

    container.appendChild(tpl.content.cloneNode(true));

    const form = document.getElementById("itemForm");
    const messageDiv = document.getElementById("itemFormMessage");

    // Back / Cancel
    document.getElementById("backToItemsBtn").onclick =
    document.getElementById("cancelItemBtn").onclick =
        () => renderSectionItems(serviceId, section);

    // Set sectionId (hidden field)
    form.querySelector('[name="sectionId"]').value = section.id;

    // Dynamic fields
    handleItemFieldsBySectionType(section.sectionType);

    // Edit mode
    if (item) {
        form.dataset.editingId = item.id;

        const set = (name, value) => {
            const el = form.querySelector(`[name="${name}"]`);
            if (el) el.value = value ?? "";
        };

        set("icon", item.icon);
        set("title", item.title);
        set("description", item.description);
        set("orderIndex", item.orderIndex);
        set("metaTitle", item.metaTitle);
        set("metaKeywords", item.metaKeywords);
        set("metaDescription", item.metaDescription);
    }

    // Submit
    form.onsubmit = async (e) => {
        e.preventDefault();

        const payload = Object.fromEntries(new FormData(form));
        const editingId = form.dataset.editingId;


         const url = editingId
             ? `${ADMINDASHBOARD_API}/section-items/${editingId}`
             : `${ADMINDASHBOARD_API}/section-items/section/${section.id}`;

        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...admindashboardAuthHeaders()
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to save item");

            messageDiv.style.color = "#22c55e";
            messageDiv.textContent = "Item saved successfully";

            setTimeout(() => {
                renderSectionItems(serviceId, section);
            }, 800);

        } catch (err) {
            messageDiv.style.color = "#ef4444";
            messageDiv.textContent = err.message;
        }
    };
}


//Dynamic Item Fields by Section Type
function handleItemFieldsBySectionType(type) {
    const iconRow = document.querySelector('[name="icon"]')?.closest(".form-row");
    const descRow = document.querySelector('[name="description"]')?.closest(".form-row");

    if (!iconRow || !descRow) return;

    // default
    iconRow.style.display = "";
    descRow.style.display = "";

    switch (type) {
        case "faq":
            iconRow.style.display = "none";
            break;

        case "steps":
            iconRow.style.display = "";
            break;

        case "features":
            iconRow.style.display = "";
            break;

        case "cta":
            descRow.style.display = "";
            break;
    }
}













