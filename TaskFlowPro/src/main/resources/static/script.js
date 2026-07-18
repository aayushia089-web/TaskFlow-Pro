/*=========================================
        TASKFLOW PRO
=========================================*/

const API_URL = "http://localhost:8080/api/tasks";

let tasks = [];
let deleteTaskId = null;

/*=========================================
        DOM ELEMENTS
=========================================*/

const taskForm = document.getElementById("taskForm");
const taskTable = document.getElementById("taskTable");

const searchInput = document.getElementById("searchInput");

const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const categoryFilter = document.getElementById("categoryFilter");

const loader = document.getElementById("loader");
const toast = document.getElementById("toast");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressTasks = document.getElementById("progressTasks");
const completedTasks = document.getElementById("completedTasks");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

/*=========================================
        PAGE LOAD
=========================================*/

window.onload = () => {

    setTimeout(() => {
        loader.style.display = "none";
    }, 1200);

    loadTasks();

};

/*=========================================
        LOAD TASKS
=========================================*/

async function loadTasks() {

    try {

        const response = await fetch(API_URL);

        tasks = await response.json();

        displayTasks(tasks);

        updateDashboard(tasks);

    } catch (error) {

        showToast("Unable to connect to backend.");

        console.error(error);

    }

}

/*=========================================
        DISPLAY TASKS
=========================================*/

function displayTasks(taskList) {

    taskTable.innerHTML = "";

    if(taskList.length===0){

        taskTable.innerHTML=`
        <tr>
            <td colspan="7" style="text-align:center;padding:40px;">
                No Tasks Found 🚀
            </td>
        </tr>
        `;

        return;
    }

    taskList.forEach(task=>{

        let priorityClass="low";

        if(task.priority==="HIGH") priorityClass="high";

        if(task.priority==="MEDIUM") priorityClass="medium";

        let statusClass="pending-badge";

        if(task.status==="IN_PROGRESS")
            statusClass="progress-badge";

        if(task.status==="COMPLETED")
            statusClass="completed-badge";

        taskTable.innerHTML+=`

<tr>

<td>${task.title}</td>

<td>${task.description}</td>

<td>

<span class="badge ${priorityClass}">
${task.priority}
</span>

</td>

<td>

<span class="badge ${statusClass}">
${task.status}
</span>

</td>

<td>${task.category}</td>

<td>${task.dueDate}</td>

<td>

<button
class="action-btn edit-btn"
onclick="openEdit('${task.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="action-btn delete-btn"
onclick="openDelete('${task.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}

/*=========================================
        DASHBOARD
=========================================*/

function updateDashboard(list){

totalTasks.innerText=list.length;

const pending=list.filter(
t=>t.status==="PENDING"
).length;

const progress=list.filter(
t=>t.status==="IN_PROGRESS"
).length;

const completed=list.filter(
t=>t.status==="COMPLETED"
).length;

pendingTasks.innerText=pending;

progressTasks.innerText=progress;

completedTasks.innerText=completed;

let percent=0;

if(list.length>0){

percent=Math.round(
(completed/list.length)*100
);

}

progressFill.style.width=percent+"%";

progressPercent.innerHTML=percent+"%";

}

/*=========================================
        TOAST
=========================================*/

function showToast(message){

toast.innerHTML=message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},3000);

}
/*=========================================
        ADD TASK
=========================================*/

taskForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const task = {

        title: document.getElementById("title").value,

        description: document.getElementById("description").value,

        priority: document.getElementById("priority").value,

        status: document.getElementById("status").value,

        category: document.getElementById("category").value,

        dueDate: document.getElementById("dueDate").value

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(task)

        });

        if (!response.ok) {

            throw new Error("Unable to save task");

        }

        showToast("✅ Task Added Successfully");

        taskForm.reset();

        loadTasks();

    }

    catch (error) {

        console.error(error);

        showToast("❌ Error while adding task");

    }

});

/*=========================================
        DELETE MODAL
=========================================*/

function openDelete(id){

    deleteTaskId=id;

    document.getElementById("deleteModal").style.display="flex";

}

document.getElementById("cancelDelete").onclick=function(){

    document.getElementById("deleteModal").style.display="none";

};

/*=========================================
        DELETE TASK
=========================================*/

document.getElementById("confirmDelete").onclick=async function(){

    try{

        const response=await fetch(

            API_URL+"/"+deleteTaskId,

            {

                method:"DELETE"

            }

        );

        if(!response.ok){

            throw new Error();

        }

        document.getElementById("deleteModal").style.display="none";

        showToast("🗑 Task Deleted");

        loadTasks();

    }

    catch(error){

        console.error(error);

        showToast("❌ Delete Failed");

    }

};

/*=========================================
        REFRESH
=========================================*/

function refreshTasks(){

    loadTasks();

    showToast("🔄 Data Refreshed");

}

/*=========================================
        RESET FORM
=========================================*/

function clearForm(){

    taskForm.reset();

    showToast("🧹 Form Cleared");

}

/*=========================================
        CLOSE MODALS
=========================================*/

window.onclick=function(event){

    const edit=document.getElementById("editModal");

    const del=document.getElementById("deleteModal");

    if(event.target===edit){

        edit.style.display="none";

    }

    if(event.target===del){

        del.style.display="none";

    }

};

document.getElementById("closeModal").onclick=function(){

    document.getElementById("editModal").style.display="none";

};

/*=========================================
        ESC KEY
=========================================*/

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        document.getElementById("editModal").style.display="none";

        document.getElementById("deleteModal").style.display="none";

    }

});
/*=========================================
        EDIT TASK
=========================================*/

function openEdit(id) {

    const task = tasks.find(t => t.id === id);

    if (!task) return;

    document.getElementById("editId").value = task.id;
    document.getElementById("editTitle").value = task.title;
    document.getElementById("editDescription").value = task.description;
    document.getElementById("editPriority").value = task.priority;
    document.getElementById("editStatus").value = task.status;
    document.getElementById("editCategory").value = task.category;
    document.getElementById("editDueDate").value = task.dueDate;

    document.getElementById("editModal").style.display = "flex";

}

/*=========================================
        UPDATE TASK
=========================================*/

document.getElementById("editTaskForm").addEventListener("submit", async function(e){

    e.preventDefault();

    const id = document.getElementById("editId").value;

    const updatedTask = {

        title: document.getElementById("editTitle").value,

        description: document.getElementById("editDescription").value,

        priority: document.getElementById("editPriority").value,

        status: document.getElementById("editStatus").value,

        category: document.getElementById("editCategory").value,

        dueDate: document.getElementById("editDueDate").value

    };

    try{

        const response = await fetch(API_URL + "/" + id,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(updatedTask)

        });

        if(!response.ok){

            throw new Error("Update Failed");

        }

        document.getElementById("editModal").style.display="none";

        showToast("✅ Task Updated Successfully");

        loadTasks();

    }

    catch(error){

        console.error(error);

        showToast("❌ Update Failed");

    }

});


/*=========================================
        LIVE SEARCH
=========================================*/

searchInput.addEventListener("keyup",function(){

    applyFilters();

});


/*=========================================
        FILTER EVENTS
=========================================*/

statusFilter.addEventListener("change",applyFilters);

priorityFilter.addEventListener("change",applyFilters);

categoryFilter.addEventListener("change",applyFilters);


/*=========================================
        APPLY FILTERS
=========================================*/

function applyFilters(){

    let filtered = [...tasks];

    const keyword = searchInput.value.trim().toLowerCase();

    const status = statusFilter.value;

    const priority = priorityFilter.value;

    const category = categoryFilter.value;

    /* Search */

    if(keyword !== ""){

        filtered = filtered.filter(task =>

            task.title.toLowerCase().includes(keyword)

            ||

            task.description.toLowerCase().includes(keyword)

        );

    }

    /* Status */

    if(status !== ""){

        filtered = filtered.filter(task=>task.status===status);

    }

    /* Priority */

    if(priority !== ""){

        filtered = filtered.filter(task=>task.priority===priority);

    }

    /* Category */

    if(category !== ""){

        filtered = filtered.filter(task=>task.category===category);

    }

    displayTasks(filtered);

    updateDashboard(filtered);

}


/*=========================================
        RESET FILTERS
=========================================*/

function clearFilters(){

    searchInput.value="";

    statusFilter.value="";

    priorityFilter.value="";

    categoryFilter.value="";

    displayTasks(tasks);

    updateDashboard(tasks);

    showToast("✨ Filters Cleared");

}
/*=========================================
        DARK MODE
=========================================*/

const themeBtn = document.getElementById("themeBtn");

let darkMode = true;

if(themeBtn){

themeBtn.addEventListener("click",()=>{

document.body.classList.toggle("light-theme");

darkMode=!darkMode;

themeBtn.innerHTML=darkMode
?'<i class="fa-solid fa-moon"></i>'
:'<i class="fa-solid fa-sun"></i>';

showToast(darkMode?"🌙 Dark Mode":"☀️ Light Mode");

});

}

/*=========================================
        AUTO REFRESH
=========================================*/

setInterval(()=>{

loadTasks();

},30000);

/*=========================================
        DUE DATE COLORS
=========================================*/

function highlightDueDates(){

const rows=document.querySelectorAll("#taskTable tr");

rows.forEach(row=>{

const dateCell=row.cells[5];

if(!dateCell) return;

const due=new Date(dateCell.innerText);

const today=new Date();

const diff=Math.ceil((due-today)/(1000*60*60*24));

if(diff<0){

dateCell.style.color="#ff4d6d";
dateCell.style.fontWeight="700";

}
else if(diff<=2){

dateCell.style.color="#ffd166";
dateCell.style.fontWeight="700";

}
else{

dateCell.style.color="#80ed99";

}

});

}

/*=========================================
        OVERRIDE DISPLAY
=========================================*/

const oldDisplayTasks = displayTasks;

displayTasks = function(taskList){

oldDisplayTasks(taskList);

highlightDueDates();

checkCompletion();

};

/*=========================================
        ALL COMPLETED
=========================================*/

function checkCompletion(){

if(tasks.length===0) return;

const completed=tasks.filter(
t=>t.status==="COMPLETED"
).length;

if(completed===tasks.length){

celebrate();

}

}

/*=========================================
        SIMPLE CELEBRATION
=========================================*/

function celebrate(){

const colors=[
"#8b5cf6",
"#3b82f6",
"#22c55e",
"#ffd166",
"#ef476f"
];

for(let i=0;i<80;i++){

const piece=document.createElement("div");

piece.style.position="fixed";
piece.style.width="10px";
piece.style.height="10px";
piece.style.left=Math.random()*100+"vw";
piece.style.top="-20px";
piece.style.background=colors[Math.floor(Math.random()*colors.length)];
piece.style.borderRadius="50%";
piece.style.pointerEvents="none";
piece.style.zIndex="999999";

document.body.appendChild(piece);

const duration=3000+Math.random()*2000;

piece.animate([

{
transform:"translateY(0) rotate(0deg)",
opacity:1
},

{
transform:`translateY(${window.innerHeight+100}px) rotate(720deg)`,
opacity:0
}

],{

duration:duration

});

setTimeout(()=>{

piece.remove();

},duration);

}

showToast("🎉 Congratulations! All Tasks Completed!");

}

/*=========================================
        CLOCK
=========================================*/

function updateClock(){

const clock=document.getElementById("clock");

if(!clock) return;

const now=new Date();

clock.innerHTML=now.toLocaleString();

}

setInterval(updateClock,1000);

updateClock();

/*=========================================
        SMOOTH SCROLL
=========================================*/

document.querySelectorAll("a").forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target=this.getAttribute("href");

if(target && target.startsWith("#")){

e.preventDefault();

document.querySelector(target).scrollIntoView({

behavior:"smooth"

});

}

});

});

/*=========================================
        PAGE LOADER
=========================================*/

window.addEventListener("load",()=>{

setTimeout(()=>{

if(loader){

loader.style.opacity="0";

setTimeout(()=>{

loader.style.display="none";

},500);

}

},1200);

});

/*=========================================
        KEYBOARD SHORTCUTS
=========================================*/

document.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key==="r"){

e.preventDefault();

refreshTasks();

}

if(e.ctrlKey && e.key==="f"){

e.preventDefault();

searchInput.focus();

}

});

/*=========================================
        END OF FILE
=========================================*/