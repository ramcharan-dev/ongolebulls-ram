// === Backend API base URL ===
const ADMINDASHBOARD_API = 'http://localhost:8080/api';
const JOB_API = 'http://localhost:8080/api/jobs';

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

// === Dashboard Renderer ===
function admindashboardRender(kpi, sip, risk, goals, leaderboard, alerts) {
    const view = document.getElementById('admindashboardView');
    view.innerHTML = '';

    // Clone main dashboard template
    const mainTemplate = cloneTemplate('dashboardMainTemplate');
    view.appendChild(mainTemplate);

    // Render KPIs
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

    // Render Charts
    const chartsContainer = document.getElementById('chartsContainer');

    // SIP Chart
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

    // Risk Chart
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

    // Goals Chart
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

    // Leaderboard
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

    // Alerts Card
    const alertsCard = document.getElementById('alertsCard');
    const alertsClone = cloneTemplate('alertsCardTemplate');
    alertsCard.appendChild(alertsClone);

    // Action Buttons
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

    // Alerts List
    const alertsList = document.getElementById('alertsList');
    alerts.forEach(alert => {
        const alertClone = cloneTemplate('alertItemTemplate');
        setElementContent(alertClone, '[data-title]', alert.title);
        setElementContent(alertClone, '[data-detail]', alert.detail);
        alertsList.appendChild(alertClone);
    });

    // Initialize Charts
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

    // Attach Event Handlers
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

// === Clients Loader ===
async function admindashboardLoadClients() {
    showLoadingCard('Loading Clients...');

    try {
        const clients = await admindashboardGet('/clients', []);
        console.log('API response for /clients:', clients);

        if (!Array.isArray(clients)) {
            throw new Error("API did not return an array");
        }

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const tableClone = cloneTemplate('clientsTableTemplate');
        container.appendChild(tableClone);

        const tbody = document.getElementById('clientsTableBody');
        clients.forEach(client => {
            const rowClone = cloneTemplate('clientRowTemplate');
            setElementContent(rowClone, '[data-fullname]', client.fullName || '');
            setElementContent(rowClone, '[data-email]', client.email || '');
            setElementContent(rowClone, '[data-phone]', client.phone || '');
            tbody.appendChild(rowClone);
        });
    } catch (err) {
        showErrorCard('Clients', `Error loading clients: ${err.message}`);
        console.error(err);
    }
}

// === Blogs Loader ===
async function admindashboardLoadBlogs() {
    showLoadingCard('Loading Blogs...');

    try {
        const response = await fetch('/api/blogs', {
            headers: admindashboardAuthHeaders()
        });
        const blogs = await response.json();

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const blogsContainer = cloneTemplate('blogsContainerTemplate');
        container.appendChild(blogsContainer);

        const grid = document.getElementById('blogsGrid');

        blogs.forEach(blog => {
            const cardClone = cloneTemplate('blogCardTemplate');

            const img = cardClone.querySelector('[data-image]');
            if (blog.image) {
                img.src = `/assets/${blog.image}`;
                img.alt = blog.title;
            } else {
                img.remove();
            }
            img.removeAttribute('data-image');

            setElementContent(cardClone, '[data-title]', blog.title);
            setElementContent(cardClone, '[data-description]', blog.shortDescription);
            setElementContent(cardClone, '[data-meta]', `By ${blog.author} | ${new Date(blog.createdAt).toLocaleDateString()}`);

            const editBtn = cardClone.querySelector('[data-edit]');
            editBtn.removeAttribute('data-edit');
            editBtn.onclick = () => location.href = `#/blogs/edit/${blog.id}`;

            const deleteBtn = cardClone.querySelector('[data-delete]');
            deleteBtn.removeAttribute('data-delete');
            deleteBtn.onclick = async () => {
                if (confirm('Are you sure you want to delete this blog?')) {
                    const res = await fetch(`/api/blogs/${blog.id}`, {
                        method: 'DELETE',
                        headers: admindashboardAuthHeaders()
                    });
                    if (res.ok) admindashboardLoadBlogs();
                    else alert('Failed to delete blog');
                }
            };

            grid.appendChild(cardClone);
        });

        document.getElementById('addBlogBtn').onclick = () => location.href = '#/blogs/new';

    } catch (error) {
        showErrorCard('Blogs', 'Error loading blogs.');
        console.error(error);
    }
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

        // Attach form submit handler
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

// === SPA Router ===
function admindashboardRouter() {
    const h = location.hash || '#/dashboard';
    admindashboardHighlight(h);

    switch(h) {
        case '#/dashboard':
            admindashboardLoad();
            break;
        case '#/clients':
            admindashboardLoadClients();
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
            showPlaceholderPage('SEO Page (to implement)');
            break;
        case '#/settings':
            showPlaceholderPage('Settings Page (to implement)');
            break;
        case '#/careers':
            admindashboardLoadCareers();
            break;
        default:
            showPlaceholderPage('Page Not Found');
    }
}

// === Event Listeners ===
document.addEventListener('DOMContentLoaded', () => {
    // Display admin name
    const name = localStorage.getItem('adminName') || 'Admin';
    const nameEl = document.getElementById('adminNameDisplay');
    if (nameEl) nameEl.textContent = name;

    // Profile menu toggle
    const btn = document.getElementById('adminProfileBtn');
    const menu = document.getElementById('adminProfileMenu');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
    });
    document.addEventListener('click', () => { menu.style.display = 'none'; });
    menu.addEventListener('click', (e) => { e.stopPropagation(); });

    // Logout from profile menu
    document.getElementById('dashboardLogoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('admindashboard_jwt');
        localStorage.removeItem('admindashboard_roles');
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        window.location.href = 'http://localhost:8080/adminlogin.html';
    });

    // Sidebar logout button
    document.getElementById('admindashboardBtnLogout').addEventListener('click', () => {
        localStorage.removeItem('admindashboard_jwt');
        localStorage.removeItem('admindashboard_roles');
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        location.href = 'admin' +
            'login.html';
    });

    // Sidebar toggle for mobile
    const burger = document.getElementById('admindashboardBurger');
    if (burger) {
        burger.addEventListener('click', () => {
            document.querySelector('.admindashboard-sidebar').classList.toggle('open');
        });
    }

    // Initialize router
    admindashboardRouter();
});

window.addEventListener('hashchange', admindashboardRouter);

// === Auth Guard: Check JWT and roles safely ===
let admindashboardRoles = [];
try {
    admindashboardRoles = JSON.parse(localStorage.getItem('admindashboard_roles') || localStorage.getItem('roles') || '[]');
} catch (e) {
    console.error('Invalid roles in localStorage', e);
}
const admindashboardJwt = localStorage.getItem('admindashboard_jwt') || localStorage.getItem('jwt');
const admindashboardIsAdmin = admindashboardRoles.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_SUPER_ADMIN');
if (!admindashboardJwt || !admindashboardIsAdmin) {
    window.location.href = 'admin-login.html';
}