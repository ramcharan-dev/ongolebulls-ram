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

// === Clients Loader with Search ===
let allClients = [];

async function admindashboardLoadClients(searchQuery = '') {
    showLoadingCard('Loading Clients...');

    try {
        if (allClients.length === 0) {
            allClients = await admindashboardGet('/clients', []);
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
                    (client.phone && client.phone.includes(search))
                );
            })
            : allClients;

        const container = document.getElementById('admindashboardView');
        container.innerHTML = '';

        const tableClone = cloneTemplate('clientsTableTemplate');
        container.appendChild(tableClone);

        const tbody = document.getElementById('clientsTableBody');

        if (filteredClients.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 3;
            cell.textContent = searchQuery ? 'No clients found matching your search.' : 'No clients available.';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            cell.style.color = 'var(--muted)';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        filteredClients.forEach(client => {
            const rowClone = cloneTemplate('clientRowTemplate');
            const cells = rowClone.querySelectorAll('td');

            cells[0].setAttribute('data-label', 'Full Name');
            setElementContent(rowClone, '[data-fullname]', client.fullName || '');

            cells[1].setAttribute('data-label', 'Email');
            setElementContent(rowClone, '[data-email]', client.email || '');

            cells[2].setAttribute('data-label', 'Phone');
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

// === Edit Profile Loader ===
// async function admindashboardLoadEditProfile() {
//     const container = document.getElementById("admindashboardView");
//     container.innerHTML = "";
//
//     // show a loading card
//     const loadingClone = cloneTemplate("loadingCardTemplate");
//     setElementContent(loadingClone, "[data-title]", "Loading Profile…");
//     container.appendChild(loadingClone);
//
//     try {
//         await new Promise((resolve) => setTimeout(resolve, 100));
//
//         // replace loader with form
//         container.innerHTML = "";
//         const formTemplate = cloneTemplate("editProfileTemplate");
//         container.appendChild(formTemplate);
//
//         const adminId = 1;
//         const form = document.getElementById("editAdminForm");
//         const messageDiv = document.getElementById("responseMessage");
//
//         // load existing admin data
//         const response = await fetch(`${ADMINDASHBOARD_API}/admin/${adminId}`);
//         if (!response.ok) throw new Error("Failed to fetch admin details");
//
//         const data = await response.json();
//         document.getElementById("adminEmail").value = data.email || "";
//         document.getElementById("adminPassword").value = data.password || "";
//         document.getElementById("adminName").value = data.name || "";
//
//         // handle form submission
//         form.onsubmit = async (e) => {
//             e.preventDefault();
//             const submitBtn = form.querySelector("button[type='submit']");
//             submitBtn.disabled = true;
//             messageDiv.innerText = "Updating…";
//             messageDiv.style.color = "#2563eb";
//
//             const email = document.getElementById("adminEmail").value.trim();
//             const password = document.getElementById("adminPassword").value.trim();
//             const name = document.getElementById("adminName").value.trim();
//
//             try {
//                 const res = await fetch(`${ADMINDASHBOARD_API}/admin/update/${adminId}`, {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ email, password, name }),
//                 });
//
//                 const result = await res.json();
//                 if (!res.ok || !result.success) throw new Error(result.message || "Update failed");
//
//                 messageDiv.innerText = result.message || "Profile updated successfully";
//                 messageDiv.style.color = "#22c55e";
//
//                 localStorage.setItem("adminName", name);
//                 const nameEl = document.getElementById("adminNameDisplay");
//                 if (nameEl) nameEl.textContent = name;
//
//                 setTimeout(() => (messageDiv.innerText = ""), 3000);
//             } catch (err) {
//                 messageDiv.innerText = "Error: " + err.message;
//                 messageDiv.style.color = "#ef4444";
//             } finally {
//                 submitBtn.disabled = false;
//             }
//         };
//     } catch (err) {
//         showErrorCard("Edit Profile", err.message || "Failed to load profile.");
//     }
// }



function admindashboardLoadAdminDetails() {
    const view = document.getElementById("admindashboardView");
    const template = document.getElementById("editAdminTemplate");


    const editProfileLink = document.getElementById('editProfileLink');
    const profileMenu = document.getElementById('adminProfileMenu');
    if (editProfileLink) {
        editProfileLink.addEventListener('click', e => {
            e.preventDefault();
            if (profileMenu) profileMenu.style.display = 'none';
            location.hash = '#/admin-details'; // important to include the '#'
        });
    }



    view.innerHTML = "";
    view.appendChild(template.content.cloneNode(true));

    setupAdminDetailsEvents();
}

function setupAdminDetailsEvents() {
    const adminId = 1;
    const form = document.getElementById("editAdminForm");
    const messageDiv = document.getElementById("responseMessage");
    const API = "/api/admin";




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

    // Save changes
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const payload = {
            email: document.getElementById("adminEmail").value,
            password: document.getElementById("adminPassword").value,
            name: document.getElementById("adminName").value
        };

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






    // document.getElementById('editProfileLink').addEventListener('click', (e) => {
    //     e.preventDefault();
    //     menu.style.display = 'none';
    //     location.hash = '#/edit-profile';
    // });

    // Logout from profile menu
    document.getElementById('dashboardLogoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('admindashboard_jwt');
        localStorage.removeItem('admindashboard_roles');
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        localStorage.removeItem('adminName');
        window.location.href = 'adminlogin.html';
    });

    // Sidebar logout button
    document.getElementById('admindashboardBtnLogout').addEventListener('click', () => {
        localStorage.removeItem('admindashboard_jwt');
        localStorage.removeItem('admindashboard_roles');
        localStorage.removeItem('jwt');
        localStorage.removeItem('roles');
        localStorage.removeItem('adminName');
        location.href = 'adminlogin.html';
    });

    // Sidebar toggle for mobile
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

    // Close sidebar when clicking nav links (handled in router now)
    const navLinks = document.querySelectorAll('.admindashboard-nav');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Router will handle closing sidebar
        });
    });

    // Search functionality
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

    // Initialize router
    admindashboardRouter();
});

window.addEventListener('hashchange', admindashboardRouter);




// === SPA Router ===
function admindashboardRouter() {
    const h = location.hash || '#/dashboard';

    const hash = location.hash || '#/dashboard'; // default route
    // hide or show elements based on route
    if (hash === '#/admin-details') {
        admindashboardLoadAdminDetails();
    }
    admindashboardHighlight(h);

    // Close sidebar on navigation (for mobile)
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
            showPlaceholderPage('Settings Page (to implement)');
            break;
        case '#/documents':
            showPlaceholderPage('Documents Page (to implement)');
            break;
        case '#/careers':
            admindashboardLoadCareers();
            break;
        case '#/admin-details':   //<--- ✅ NEW
            admindashboardLoadAdminDetails();
            break;
        default:
            showPlaceholderPage('Page Not Found');
    }
}




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


// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// Documents Page Handler - DYNAMIC
function loadDocumentsPage() {
    const view = document.getElementById('admindashboardView');
    const template = document.getElementById('documentsContainerTemplate');
    const clone = template.content.cloneNode(true);
    view.innerHTML = '';
    view.appendChild(clone);



const API_BASE_SEO = 'http://localhost:8080/api/adminseo'; // Change as per backend URL

async function loadSeoSettings() {
    const container = document.getElementById('admindashboardView');
    container.innerHTML = '';

    // Copy link button
    document.getElementById('copyLinkBtn').addEventListener('click', copyUploadLink);

    // Filters
    document.getElementById('statusFilter').addEventListener('change', filterDocuments);
    document.getElementById('searchDocuments').addEventListener('input', filterDocuments);
}

function copyUploadLink() {
    const link = window.location.origin + '/customer-document-upload.html';
    navigator.clipboard.writeText(link).then(() => {
        alert('Upload link copied to clipboard!\n\n' + link);
    }).catch(() => {
        prompt('Copy this link:', link);
    });
}

// DYNAMIC: Load stats from backend
async function loadDocumentStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/documents/stats`);
        if (!response.ok) throw new Error('Failed to load stats');

        const stats = await response.json();

        document.getElementById('pendingCount').textContent = stats.pending || 0;
        document.getElementById('approvedCount').textContent = stats.approved || 0;
        document.getElementById('underReviewCount').textContent = stats.underReview || 0;
        document.getElementById('totalSubmissions').textContent = stats.total || 0;
    } catch (error) {
        console.error('Error loading stats:', error);
        // Show default values
        document.getElementById('pendingCount').textContent = '0';
        document.getElementById('approvedCount').textContent = '0';
        document.getElementById('underReviewCount').textContent = '0';
        document.getElementById('totalSubmissions').textContent = '0';
    }
}

// DYNAMIC: Load document submissions from backend
async function loadDocumentSubmissions(status = '', search = '') {
    try {
        let url = `${API_BASE_URL}/admin/documents?`;
        if (status) url += `status=${status}&`;
        if (search) url += `search=${search}&`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to load documents');

        const documents = await response.json();
        renderDocumentsTable(documents);
    } catch (error) {
        console.error('Error loading documents:', error);
        document.getElementById('documentsTableBody').innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <i class="bi bi-exclamation-circle" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
                    Failed to load documents. Please check your connection and try again.
                </td>
            </tr>
        `;
    }
}

function renderDocumentsTable(documents) {
    const tbody = document.getElementById('documentsTableBody');

    if (documents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <i class="bi bi-inbox" style="font-size: 48px; display: block; margin-bottom: 12px;"></i>
                    No document submissions found
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';

    documents.forEach(doc => {
        let statusClass = 'warning';
        if (doc.status === 'Approved') statusClass = 'success';
        if (doc.status === 'Rejected') statusClass = 'danger';
        if (doc.status === 'Under Review') statusClass = 'secondary';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${doc.id}</strong></td>
            <td><strong>${doc.investorName}</strong></td>
            <td>${doc.panNumber}</td>
            <td>${doc.investorEmail}</td>
            <td>${doc.investorPhone}</td>
            <td>${doc.bankAccountNumber ? doc.bankAccountNumber.substring(0, 4) + 'XXXXX' + doc.bankAccountNumber.slice(-4) : 'N/A'}</td>
            <td>
                <span class="admindashboard-badge secondary">
                    ${doc.nomineesCount || 0} Nominee${doc.nomineesCount > 1 ? 's' : ''}
                </span>
            </td>
            <td>${formatDate(doc.submittedDate)}</td>
            <td>
                <span class="admindashboard-badge ${statusClass}">
                    ${doc.status}
                </span>
            </td>
            <td class="actions-cell">
                <button class="admindashboard-btn secondary" style="font-size: 11px; padding: 4px 8px;" onclick="viewDocumentDetails(${doc.id})">
                    <i class="bi bi-eye-fill"></i> View
                </button>
                ${doc.status === 'Pending' || doc.status === 'Under Review' ? `
                    <button class="admindashboard-btn primary" style="font-size: 11px; padding: 4px 8px;" onclick="approveDocument(${doc.id})">
                        <i class="bi bi-check-circle-fill"></i> Approve
                    </button>
                    <button class="admindashboard-btn danger" style="font-size: 11px; padding: 4px 8px;" onclick="rejectDocument(${doc.id})">
                        <i class="bi bi-x-circle-fill"></i> Reject
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function filterDocuments() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchDocuments').value;
    loadDocumentSubmissions(statusFilter, searchTerm);
}

// DYNAMIC: View document details
async function viewDocumentDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/documents/${id}`);
        if (!response.ok) throw new Error('Failed to load document details');

        const doc = await response.json();

        const modal = document.getElementById('documentDetailModal');
        const body = document.getElementById('documentDetailBody');

        body.innerHTML = `
            <h4 style="margin-bottom: 20px;">Investor Information</h4>
            <div class="document-detail-grid">
                <div class="document-detail-item">
                    <div class="document-detail-label">Full Name</div>
                    <div class="document-detail-value">${doc.investorName}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Email</div>
                    <div class="document-detail-value">${doc.investorEmail}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Phone</div>
                    <div class="document-detail-value">${doc.investorPhone}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Date of Birth</div>
                    <div class="document-detail-value">${formatDate(doc.investorDob)}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">PAN Number</div>
                    <div class="document-detail-value">${doc.panNumber}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Aadhaar Number</div>
                    <div class="document-detail-value">${doc.aadhaarNumber}</div>
                </div>
                <div class="document-detail-item" style="grid-column: 1 / -1;">
                    <div class="document-detail-label">Address</div>
                    <div class="document-detail-value">${doc.investorAddress}</div>
                </div>
            </div>

            <h4 style="margin: 30px 0 20px 0;">Bank Details</h4>
            <div class="document-detail-grid">
                <div class="document-detail-item">
                    <div class="document-detail-label">Account Name</div>
                    <div class="document-detail-value">${doc.bankAccountName}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Bank Name</div>
                    <div class="document-detail-value">${doc.bankName}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Account Number</div>
                    <div class="document-detail-value">${doc.bankAccountNumber}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">IFSC Code</div>
                    <div class="document-detail-value">${doc.bankIfsc}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Branch</div>
                    <div class="document-detail-value">${doc.bankBranch}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Account Type</div>
                    <div class="document-detail-value">${doc.bankAccountType}</div>
                </div>
            </div>

            ${doc.nominees && doc.nominees.length > 0 ? `
                <h4 style="margin: 30px 0 20px 0;">Nominees</h4>
                ${doc.nominees.map((nominee, index) => `
                    <div class="document-detail-grid" style="background: var(--color-secondary); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                        <div class="document-detail-item">
                            <div class="document-detail-label">Nominee ${index + 1}</div>
                            <div class="document-detail-value">${nominee.nomineeName}</div>
                        </div>
                        <div class="document-detail-item">
                            <div class="document-detail-label">Relationship</div>
                            <div class="document-detail-value">${nominee.relationship}</div>
                        </div>
                        <div class="document-detail-item">
                            <div class="document-detail-label">Date of Birth</div>
                            <div class="document-detail-value">${formatDate(nominee.dateOfBirth)}</div>
                        </div>
                        <div class="document-detail-item">
                            <div class="document-detail-label">Allocation</div>
                            <div class="document-detail-value">${nominee.allocationPercentage}%</div>
                        </div>
                        ${nominee.isMinor ? `
                            <div class="document-detail-item" style="grid-column: 1 / -1;">
                                <div class="document-detail-label">Guardian</div>
                                <div class="document-detail-value">${nominee.guardianName} (${nominee.guardianRelationship}) - PAN: ${nominee.guardianPan}</div>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            ` : ''}

            <h4 style="margin: 30px 0 20px 0;">Uploaded Documents</h4>
            <div class="document-files-grid">
                ${doc.panCardFileUrl ? `
                    <div class="document-file-card" onclick="window.open('${doc.panCardFileUrl}', '_blank')">
                        <i class="bi bi-file-pdf-fill"></i>
                        <div class="document-file-name">PAN Card</div>
                    </div>
                ` : ''}
                ${doc.aadhaarCardFileUrl ? `
                    <div class="document-file-card" onclick="window.open('${doc.aadhaarCardFileUrl}', '_blank')">
                        <i class="bi bi-file-pdf-fill"></i>
                        <div class="document-file-name">Aadhaar Card</div>
                    </div>
                ` : ''}
                ${doc.photographFileUrl ? `
                    <div class="document-file-card" onclick="window.open('${doc.photographFileUrl}', '_blank')">
                        <i class="bi bi-file-image-fill"></i>
                        <div class="document-file-name">Photograph</div>
                    </div>
                ` : ''}
                ${doc.bankProofFileUrl ? `
                    <div class="document-file-card" onclick="window.open('${doc.bankProofFileUrl}', '_blank')">
                        <i class="bi bi-file-pdf-fill"></i>
                        <div class="document-file-name">Bank Proof</div>
                    </div>
                ` : ''}
                ${doc.signatureFileUrl ? `
                    <div class="document-file-card" onclick="window.open('${doc.signatureFileUrl}', '_blank')">
                        <i class="bi bi-file-image-fill"></i>
                        <div class="document-file-name">Signature</div>
                    </div>
                ` : ''}
            </div>

            <h4 style="margin: 30px 0 20px 0;">Declarations</h4>
            <div class="document-detail-grid">
                <div class="document-detail-item">
                    <div class="document-detail-label">Tax Residency</div>
                    <div class="document-detail-value">${doc.taxResidencyCountry}</div>
                </div>
                <div class="document-detail-item">
                    <div class="document-detail-label">Risk Profile</div>
                    <div class="document-detail-value">${doc.riskProfile}</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading document details:', error);
        alert('Failed to load document details: ' + error.message);
    }
}

function closeDocumentModal() {
    document.getElementById('documentDetailModal').classList.remove('active');
}

// DYNAMIC: Approve document
async function approveDocument(id) {
    if (!confirm('Are you sure you want to approve this document submission?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/documents/${id}/approve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to approve');
        }

        alert('Document approved successfully! Investor will receive confirmation email.');
        loadDocumentSubmissions();
        loadDocumentStats();
    } catch (error) {
        console.error('Error approving document:', error);
        alert('Error approving document: ' + error.message);
    }
}

// DYNAMIC: Reject document
async function rejectDocument(id) {
    const reason = prompt('Please enter rejection reason:');
    if (!reason || reason.trim() === '') {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/documents/${id}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason: reason.trim() })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reject');
        }

        alert('Document rejected! Investor will receive an email with the reason.');
        loadDocumentSubmissions();
        loadDocumentStats();
    } catch (error) {
        console.error('Error rejecting document:', error);
        alert('Error rejecting document: ' + error.message);
    }
}

// Utility function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('documentDetailModal');
    if (e.target === modal) {
        closeDocumentModal();
    }
});


const response = await fetch(`${API_BASE_URL}/customer-documents/submit`, {
    method: 'POST',
    body: formData
});

if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Submission failed');
}

const result = await response.json();

if (result.success) {
    showAlert(`✅ ${result.message} Reference ID: ${result.id}`, 'success');
    this.reset();
} else {
    showAlert(result.message, 'error');
}
