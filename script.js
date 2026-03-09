// login form
const form = document.getElementById("loginForm");
if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (username === "admin" && password === "admin123") {
            window.location.href = "home.html";
        } else {
            alert("Invalid username or password");
        }
    });
}


// issue via API
let allIssues = [];
const API = "https://phi-lab-server.vercel.app/api/v1/lab";

async function loadIssues() {
    showLoader();

    const res = await fetch(`${API}/issues`);
    const data = await res.json();

    hideLoader();
    allIssues = data.data;
    renderIssues(allIssues);
}
if(document.getElementById("issuesContainer")){
    loadIssues();
}

// render issues
function renderIssues(issues){
    document.getElementById("issueCount").innerText = issues.length;

    const container = document.getElementById("issuesContainer");
    container.innerHTML = "";

    issues.forEach(issue => {
        const borderColor =
        issue.status === "open"
        ? "border-green-500"
        : "border-purple-500";

        const statusIcon =
        issue.status === "open"
        ? "./assets/Open-Status.png"
        : "./assets/Closed-Status.png";

        // priority badge color 
        let priorityClass = "";
        const priority = issue.priority.toUpperCase();

        if(priority === "HIGH"){
            priorityClass = "bg-red-100 text-red-500";
        }
        else if(priority === "MEDIUM"){
            priorityClass = "bg-yellow-100 text-yellow-600";
        }
        else{
            priorityClass = "bg-gray-200 text-gray-500";
        }


        // label tags 
        let labelsHTML = "";

        if(issue.labels){
            issue.labels.forEach(label => {
                if(label === "bug"){
                    labelsHTML += `<span class="rounded-md p-1 text-red-600 bg-red-200 text-xs"><i class="fa-solid fa-bug"></i>BUG</span>`;
                }
                else if(label === "help wanted"){
                    labelsHTML += `<span class="rounded-md p-1 text-yellow-600 bg-yellow-200 text-xs"><i class="fa-solid fa-life-ring"></i>HELP WANTED</span>`;
                }
                else if(label === "enhancement"){
                    labelsHTML += `<span class="rounded-md p-1 text-green-600 bg-green-200 text-xs"><i class="fa-solid fa-bolt"></i>ENHANCEMENT</span>`;
                }
            });
        }

        // card html
        const card = `
        <div onclick="openIssue(${issue.id})"
        class="bg-white rounded-lg shadow border-t-4 ${borderColor} cursor-pointer">
            <div class="p-4">

                <!-- top row -->
                <div class="flex justify-between items-center mb-2">
                    <img src="${statusIcon}" class="w-6 h-6">
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${priorityClass}">${priority}</span>
                </div>

                <!-- title -->
                <h3 class="font-semibold text-sm mb-2">${issue.title}</h3>

                <!-- description -->
                <p class="text-xs text-gray-500 mb-3">${issue.description}</p>

                <!-- labels -->
                <div class="flex gap-2 text-xs mb-3">${labelsHTML}</div>
            </div>

            <!-- bottom section -->
            <div class="border-t px-4 py-3 text-xs text-gray-400">
                <p>#${issue.id} by ${issue.author}</p>
                <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
            </div>
        </div>`;
        container.innerHTML += card;
    });
}

//filter buttons
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");

function updateActiveButton(activeBtn) {
    [allBtn, openBtn, closedBtn].forEach(btn => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
    });
    activeBtn.classList.remove("btn-outline");
    activeBtn.classList.add("btn-primary");
}

allBtn.addEventListener("click", () => {
    updateActiveButton(allBtn);
    renderIssues(allIssues);
});
openBtn.addEventListener("click", async () => {
    updateActiveButton(openBtn);
    // const res = await fetch(`${API}/issues`);
    // const data = await res.json();
    const openIssues = allIssues.filter(issue => issue.status === "open");
    renderIssues(openIssues);
});
closedBtn.addEventListener("click", async () => {
    updateActiveButton(closedBtn);
    // const res = await fetch(`${API}/issues`);
    // const data = await res.json();
    const closedIssues = allIssues.filter(issue => issue.status === "closed");
    renderIssues(closedIssues);
});


// search function 
document
    .getElementById("searchInput")
    .addEventListener("input", async (e) => {

        const query = e.target.value;

        if (query === "") {
            loadIssues();
            return;
        }

        const res = await fetch(
            `${API}/issues/search?q=${query}`
        );

        const data = await res.json();

        renderIssues(data.data);

    });


// single issue page
async function openIssue(id) {
    const res = await fetch(`${API}/issue/${id}`);
    const data = await res.json();
    const issue = data.data;

    document.getElementById("modalTitle").innerText = issue.title;
    document.getElementById("modalDesc").innerText = issue.description;
    
    const statusBadge = document.getElementById("modalStatus");
    if(issue.status === "open") {
        statusBadge.className = "px-3 py-1 rounded-full text-xs font-semibold bg-green-500 text-white";
        statusBadge.innerText = "Opened";
    } else {
        statusBadge.className = "px-3 py-1 rounded-full text-xs font-semibold bg-purple-500 text-white";
        statusBadge.innerText = "Closed";
    }

    const dateStr = new Date(issue.createdAt).toLocaleDateString();
    document.getElementById("modalMeta").innerText = `• Opened by ${issue.author} • ${dateStr}`;

    document.getElementById("modalAssignee").innerText = issue.author;

    const priorityBadge = document.getElementById("modalPriority");
    const priority = issue.priority.toUpperCase();
    priorityBadge.innerText = priority;
    
    if(priority === "HIGH"){
        priorityBadge.className = "px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-500";
    } else if(priority === "MEDIUM"){
        priorityBadge.className = "px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-600";
    } else {
        priorityBadge.className = "px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-500";
    }

    // Labels
    let labelsHTML = "";
    if(issue.labels){
        issue.labels.forEach(label => {
            if(label === "bug"){
                labelsHTML += `<span class="rounded-md py-1 px-2 text-red-600 bg-red-200 text-xs font-bold uppercase"><i class="fa-solid fa-bug mr-1"></i>BUG</span>`;
            } else if(label === "help wanted"){
                labelsHTML += `<span class="rounded-md py-1 px-2 text-yellow-600 bg-yellow-200 text-xs font-bold uppercase"><i class="fa-solid fa-life-ring mr-1"></i>HELP WANTED</span>`;
            } else if(label === "enhancement"){
                labelsHTML += `<span class="rounded-md py-1 px-2 text-green-600 bg-green-200 text-xs font-bold uppercase"><i class="fa-solid fa-bolt mr-1"></i>ENHANCEMENT</span>`;
            }
        });
    }
    document.getElementById("modalLabels").innerHTML = labelsHTML;
    document.getElementById("issueModal").showModal();
}


// loading circle
function showLoader() {
    document.getElementById("loader")
        .classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader")
        .classList.add("hidden");
}


// active tap highlight
function setActive(button) {

    document
        .querySelectorAll(".filterBtn")
        .forEach(btn =>
            btn.classList.remove("btn-primary")
        );

    button.classList.add("btn-primary");

}