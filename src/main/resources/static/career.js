 async function populateDesignationDropdown() {
    const designationSelect = document.getElementById('designationAppliedFor'); // NEW
    if (!designationSelect) return;

    try {
    // Change this URL to your actual backend endpoint for job titles
    const response = await fetch('http://localhost:8080/api/jobs');
    const jobs = await response.json();

    // Fill the select dropdown with job titles
    designationSelect.innerHTML = '<option value="">Select designation</option>' +
    jobs.map(job => `<option value="${job.title}">${job.title}</option>`).join('');
} catch (err) {
    designationSelect.innerHTML = '<option value="">Could not load options</option>';
}
}



    document.addEventListener("DOMContentLoaded", () => {
    populateDesignationDropdown();
    // This confirms that everything is loaded and ready
    console.log("DOM fully loaded and parsed");
});


    function showApplyForm(position = "") {
    const modal = document.getElementById("applyModal");
    const positionField = document.getElementById("position");
    if (positionField && position) {
    positionField.value = position;
}
    modal.style.display = "flex";
}

    document.getElementById("closeModal").onclick = function() {
    document.getElementById("applyModal").style.display = "none";
};

    // ---- Pagination Logic ----
    const itemsPerPage = 4;  // or set to 10 as needed
    let currentPage = 1;
    let pagedJobs = [];

    // Use this function in place of your old renderJobs call!
    function renderJobsPaged(jobsList) {
    pagedJobs = jobsList;
    showPage(currentPage);
}

    function showPage(page) {
    currentPage = page;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageJobs = pagedJobs.slice(start, end);

    const list = document.getElementById("jobListings");
    list.innerHTML = "";

    pageJobs.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "job-card";

    const detailsId = `job-details-${start + index}`;
    card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h3 style="margin:0 0 8px 0; font-size:1.3rem; font-weight:600; color:#B42710;">${job.title || ""}</h3>
                <div style="color:#3A3331; font-size:15px;">
                    ${job.location || ""} | ${job.employmentType || ""} | Experience: ${job.experience || ""}
                </div>
                <div style="margin-top:6px; color:#B42710; font-size:13px;">
                    <b>Required Skill:</b> ${job.skillsRequired || ""}
                </div>
            </div>
            <button class="toggle-btn" aria-expanded="false" aria-controls="${detailsId}"
                style="background: none; border: none; color: #B42710; font-size: 1.9rem; cursor: pointer; font-weight:bold;">
                +
            </button>
        </div>
        <div id="${detailsId}" class="job-details-content" style="display:none; margin-top:20px;">
            ${
    (job.customInfo || job.jobNumber)
    ? `<div style="color:#3A3331; font-size:13px; margin-bottom:10px;">
                    <strong>Job:</strong> ${job.customInfo || "-"}<br/>
                    <strong>Job Number:</strong> ${job.jobNumber || "-"}
                  </div>`
    : ""
}
            <div>
                <div style="font-weight:600; margin-bottom:4px; color:#B42710;">Job Description</div>
                <div style="margin-bottom:12px;">${job.description || ""}</div>
            </div>
            <div>
                <div style="font-weight:600; margin-bottom:4px; color:#B42710;">Key Responsibility</div>
                <div>${job.keyResponsibility || ""}</div>
            </div>

            <button class="apply-btn"
                    onclick="showApplyForm('${job.title || ''}')"
                    style="margin-top:18px; background: #FFD200; color: #B42710; border: none; padding: 8px 24px; font-size:1rem; border-radius: 6px; cursor:pointer;">
                <i class="fa fa-briefcase"></i> Apply Now
            </button>
        </div>
        `;

    list.appendChild(card);

    const btn = card.querySelector('.toggle-btn');
    const content = card.querySelector(`#${detailsId}`);

    // Toggle job details when clicking anywhere on the card except the Apply Now button
    card.addEventListener('click', (event) => {
    if (event.target.closest('button.apply-btn')) return; // Prevent toggle on Apply Now button click

    const isVisible = content.style.display === 'block';
    content.style.display = isVisible ? 'none' : 'block';

    btn.setAttribute('aria-expanded', !isVisible);
    btn.textContent = isVisible ? "+" : "–";
});


    updatePaginationControls();
}

    function updatePaginationControls() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = '';

    const totalPages = Math.ceil(pagedJobs.length / itemsPerPage);

    // Previous arrow
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '←';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => showPage(currentPage - 1);
    pagination.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('active');
    btn.onclick = () => showPage(i);
    pagination.appendChild(btn);
}

    // Next arrow
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '→';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => showPage(currentPage + 1);
    pagination.appendChild(nextBtn);
}





    async function populateFilterOptions() {
    const endpoints = {
    departmentFilter: "http://localhost:8080/api/jobs/departments",
    locationFilter: "http://localhost:8080/api/jobs/locations",
    experienceFilter: "http://localhost:8080/api/jobs/experiences",
    remoteTypeFilter: "http://localhost:8080/api/jobs/worktypes"
};
    for (const [filterId, url] of Object.entries(endpoints)) {
    const select = document.getElementById(filterId);
    if (!select) continue;
    select.innerHTML = '<option value="">All</option>';
    try {
    const res = await fetch(url);
    const values = await res.json();
    select.innerHTML += values.map(val =>
    `<option value="${val}">${val}</option>`
    ).join('');
} catch (e) {
    // Populate at least 'All'
    select.innerHTML = '<option value="">All</option>';
}
}
}



    document.getElementById('applyForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    // Use FormData for handling file uploads and text fields
    const formData = new FormData(form);

    try {
    const response = await fetch('http://localhost:8080/api/candidate/add', {
    method: 'POST',
    body: formData // No content-type header! Browser will set it
});

    if (response.ok) {
    alert('Successfully Submitted! You will receive an email confirmation.');
    form.reset();
    document.getElementById('position').value = '';
} else {
    const errorText = await response.text();
    alert('Submission failed:\n' + errorText);
}
} catch (err) {
    alert('Network error. Please try again later.');
}
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Application";
});





    const jobsApiUrl = "http://localhost:8080/api/jobs";
    let jobs = [];
    let currentView = "grid"; // "grid" or "list"

    // Fetch jobs dynamically from the backend server
    async function fetchJobsFromAPI() {
    try {
    const response = await fetch(jobsApiUrl);
    if (!response.ok) throw new Error("Network error!");
    jobs = await response.json();
    renderJobs(jobs);
} catch (e) {
    jobs = [];
    renderJobs(jobs);
}
}


    // Add this for filtering
    async function fetchJobsFromAPI() {
    const department = document.getElementById('departmentFilter').value;
    const location = document.getElementById('locationFilter').value;
    const experience = document.getElementById('experienceFilter').value;
    const remoteType = document.getElementById('remoteTypeFilter').value;
    const params = [];
    if (department) params.push("department=" + encodeURIComponent(department));
    if (location) params.push("location=" + encodeURIComponent(location));
    if (experience) params.push("experience=" + encodeURIComponent(experience));
    if (remoteType) params.push("remoteType=" + encodeURIComponent(remoteType));
    let url = "http://localhost:8080/api/jobs";
    if (params.length) url += "?" + params.join("&");
    const response = await fetch(url);
    jobs = await response.json();
    renderJobsPaged(jobs);;
}

    document.addEventListener('DOMContentLoaded', async () => {
    await populateFilterOptions();
    document.getElementById('departmentFilter').addEventListener('change', fetchJobsFromAPI);
    document.getElementById('locationFilter').addEventListener('change', fetchJobsFromAPI);
    document.getElementById('experienceFilter').addEventListener('change', fetchJobsFromAPI);
    document.getElementById('remoteTypeFilter').addEventListener('change', fetchJobsFromAPI);
    fetchJobsFromAPI();
});

    // Initial load
    fetchJobsFromAPI();
    function renderJobs(jobsList) {
    const list = document.getElementById("jobListings");
    const count = document.getElementById("jobs-count");
    list.innerHTML = "";
    if (count) count.textContent = jobsList.length;
    jobsList.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "job-card";
    // Remove inline styles, rely on CSS
    // Unique ID for expansion
    const detailsId = `job-details-${index}`;
    card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="margin:0 0 8px 0; font-size:1.3rem; font-weight:600; color:#B42710;">${job.title || ""}</h3>
                    <div style="color:#3A3331; font-size:15px;">
                        ${job.location || ""} | ${job.employmentType || ""} | Experience: ${job.experience || ""}
                    </div>
                    <div style="margin-top:6px; color:#B42710; font-size:13px;">
                        <b>Required Skill:</b> ${job.skillsRequired || ""}
                    </div>
                </div>
                <button class="toggle-btn" aria-expanded="false" aria-controls="${detailsId}"
                    style="background: none; border: none; color: #B42710; font-size: 1.9rem; cursor: pointer; font-weight:bold;">
                    +
                </button>
            </div>
            <div id="${detailsId}" class="job-details-content" style="display:none; margin-top:20px;">
                ${
    (job.customInfo || job.jobNumber)
    ? `<div style="color:#3A3331; font-size:13px; margin-bottom:10px;">
                        <strong>Job:</strong> ${job.customInfo || "-"}<br/>
                        <strong>Job Number:</strong> ${job.jobNumber || "-"}
                      </div>`
    : ""
}
                <div>
                    <div style="font-weight:600; margin-bottom:4px; color:#B42710;">Job Description</div>
                    <div style="margin-bottom:12px;">${job.description || ""}</div>
                </div>
                <div>
                    <div style="font-weight:600; margin-bottom:4px; color:#B42710;">Key Responsibility</div>
                    <div>${job.keyResponsibility || ""}</div>
                </div>
                <button class="apply-btn" onclick="scrollToApplyForm()" style="margin-top:18px; background: #FFD200; color: #B42710; border: none; padding: 8px 24px; font-size:1rem; border-radius: 6px; cursor:pointer;">
                    <i class="fa fa-briefcase"></i> Apply Now
                </button>
            </div>
        `;
    list.appendChild(card);
    const btn = card.querySelector('.toggle-btn');
    const content = card.querySelector(`#${detailsId}`);
    btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    btn.textContent = expanded ? "+" : "–";
    content.style.display = expanded ? 'none' : 'block';
});
});
    list.className = "jobs-listings list";
}


    //graduation tear
    document.addEventListener('DOMContentLoaded', () => {
    const gradYearSelect = document.getElementById('gradYear');
    if (gradYearSelect) {
    const currentYear = new Date().getFullYear();
    for(let year = currentYear; year >= 1980; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    gradYearSelect.appendChild(option);
}
}
});



    // Toggle between grid and list mode
    function setJobListView(view) {
    currentView = view;
    document.getElementById("gridBtn").classList.toggle("active", view === "grid");
    document.getElementById("listBtn").classList.toggle("active", view === "list");
    renderJobs(jobs);
}

    // Scroll to the apply form
    function scrollToApplyForm() {
    const form = document.getElementById("applynow");
    if (form) {
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.querySelector("input, select, textarea").focus();
}
}

    function searchAndRenderJobs() {
    const query = document.getElementById("searchJobs").value.trim().toLowerCase();
    const filteredJobs = jobs.filter(job =>
    (job.title || "").toLowerCase().includes(query) ||
    (job.location || "").toLowerCase().includes(query) ||
    (job.department || job.category || "").toLowerCase().includes(query) ||
    (job.description || "").toLowerCase().includes(query) ||
    (job.employmentType || "").toLowerCase().includes(query)
    );
    renderJobs(filteredJobs);
}


    // Initial data fetch on page load
    fetchJobsFromAPI();

