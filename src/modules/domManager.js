import Project from "./project";
import Todo from "./todo";
import todoManager from "./todoManager";
import TodoManager from "./todoManager";
import { format } from 'date-fns';
//DOM manager

//Private variable for dom elements
const dom = {};

let currentProjectId = null;
let currentlyEditingTodoId = null;

//Caching DOM elements
const cacheDomElements = () => {
    dom.addProjectForm = document.getElementById("add-project-form");
    dom.projectsList = document.getElementById("projects-list");
    dom.addTodoForm = document.getElementById("add-todo-form");
    dom.todosList = document.getElementById("todo-list");
    dom.projectTitle = document.getElementById("current-project-title");
    dom.projectSelect = document.getElementById("todo-project");
    dom.editTodoContainer = document.getElementById("todo-details");
    dom.editTitle = document.getElementById("edit-title");
    dom.editDescription = document.getElementById("edit-description");
    dom.editDueDate = document.getElementById("edit-due-date");
    dom.editPriority = document.getElementById("edit-priority");
    dom.editNotes = document.getElementById("edit-notes");
    dom.checklistContainer = document.getElementById("checklist-container");
    dom.addChecklistForm = document.getElementById('add-checklist-form');
    dom.checklistItemName = document.getElementById('new-checklist-item');
}

//Initialize the DOM
const init = () => {
    cacheDomElements();
    setupEventListeners();
    TodoManager.initialize(); //Checks if theres existing project in local storage.

    const storedProjectId = localStorage.getItem('currentProjectId');
    if (storedProjectId) {
        currentProjectId = storedProjectId;
    }

    if (!currentProjectId){
        //Select the first project in the project array
        currentProjectId = (TodoManager.getAllProjects())[0].id;     
    }
    renderProjects();
    renderTodos(currentProjectId); 
};

//Setup event listeners
const setupEventListeners = () => {
    
    //Submission of Add Project Form
    dom.addProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = document.getElementById("project_name").value.trim();
        const projectDesc = document.getElementById("project_desc").value.trim();

        if (projectName !== '') {
            TodoManager.addProject(projectName, projectDesc);
            renderProjects();
            dom.addProjectForm.reset();
        }
    });

    //Submission of Add Todo Form
    dom.addTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById("todo-title").value.trim();
        const description = document.getElementById("todo-desc").value.trim();
        const dueDate = document.getElementById("todo-due-date").value;
        const priority = document.getElementById("todo-priority").value;
        const notes = document.getElementById("todo-notes").value.trim();
        const projectId = document.getElementById("todo-project").value;

        //If values are not empty, add todo to project
        if (title && dueDate !== '') {
            TodoManager.addTodo(title, description, dueDate, priority, notes, projectId);
            renderTodos(projectId);
            dom.addTodoForm.reset();
            document.getElementById('add-todo-container').classList.add('hidden');

            currentProjectId = projectId;
            renderProjects();
        }
    });

    //Todo item actions
    dom.todosList.addEventListener('click', (e) => {
        const clickedElement = e.target;
        const actionButton = clickedElement.closest('button');

        // Edit and delete button section
        if(actionButton) {
            const todoItem = actionButton.closest('.todo-item');

            if (todoItem) {
                const todoId = todoItem.dataset.id;

                //Edit button clicked
                if (actionButton.matches('[data-action="edit"]')){
                    console.log(`edit todo:${todoId}`)
                    const todo = TodoManager.getTodo(currentProjectId, todoId);
                    currentlyEditingTodoId = todoId;
                    console.log(currentlyEditingTodoId);

                    //Fill in form with existing values
                    dom.editTitle.value = todo.title;
                    dom.editDescription.value = todo.description;
                    dom.editDueDate.value = todo.dueDate;
                    dom.editPriority.value = todo.priority;
                    dom.editNotes.value = todo.notes;
                    
                    //Rendering todo's checklist 
                    if (todo.checklist && todo.checklist.length > 0) {
                        renderChecklist(todo.checklist);
                    }

                    dom.editTodoContainer.classList.toggle('hidden');
                }

                //Delete button clicked
                if (actionButton.matches('[data-action="delete"]')){
                    console.log(`delete todo:${todoId}`);
                    TodoManager.deleteTodo(currentProjectId, todoId);
                    renderTodos(currentProjectId);
                }
            }
        }

        //Checkbox section
        if (clickedElement.matches('input[type="checkbox"]')) {
            const todoItem = clickedElement.closest('.todo-item');
            if (todoItem) {
                const todoId =  todoItem.dataset.id;
                const todo = TodoManager.getTodo(currentProjectId, todoId);

                todo.toggleIsCompleted();
                console.log(todo.isCompleted)
                renderTodos(currentProjectId);
                TodoManager.saveToLocalStorage();
                //need to have a function in todomanager to save to localstorage
            }
        }
    });

    //Submission of add checklist form
    dom.addChecklistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const checklistName = dom.checklistItemName.value.trim();
        const todo = TodoManager.getTodo(currentProjectId, currentlyEditingTodoId);
        dom.addChecklistForm.reset();

        todo.checklist.push({name: checklistName, completed: false});
        todoManager.saveToLocalStorage();
        renderChecklist(todo.checklist);
    });
};

//Rendering of projects in projects list
const renderProjects = () => {
    const projects = TodoManager.getAllProjects();

    //Clear project lists
    dom.projectsList.innerHTML = '';
    dom.projectSelect.innerHTML = ''; 

    projects.forEach(project => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-list-item');
        projectItem.dataset.projectId = project.id;
        
        //Add active class to current project when init
        if (project.id === currentProjectId) {
            projectItem.classList.add('active');
        }

        //Create project items
        projectItem.innerHTML = `
        <div>${project.name}</div>
        <button class="project-delete-button">x</button>`;

        dom.projectsList.appendChild(projectItem);

        projectItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-delete-button')) {
                if (confirm("Delete this project and all it's todos?")) {
                    const deletedProjectIndex = TodoManager.getProjectIndex(project.id);
                    const projects = TodoManager.getAllProjects();

                    TodoManager.deleteProject(project.id);
                    renderProjects();

                    //If project is not last project
                    if (deletedProjectIndex !== 0) {
                        const previousProjectId = projects[deletedProjectIndex - 1].id;
                        //Renders todos 1 project before
                        currentProjectId = previousProjectId;
                        renderTodos(previousProjectId) 
                        renderProjects();
                    } else {
                        localStorage.clear('currentProjectId');
                    }
                }
            }

            else {
                currentProjectId = project.id;
                localStorage.setItem('currentProjectId', currentProjectId);

                //Add active class to show active list item
                document.querySelectorAll('.project-list-item').forEach(item => {
                    item.classList.remove('active');
                });
                projectItem.classList.add('active');

                renderTodos(project.id);
                //Changes the dropdown value to current project
                dom.projectSelect.value = project.id;
            }
        });

        //Add project to add todo form's dropdown list
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        dom.projectSelect.appendChild(option);
    });
};

//Rendering todos for specific project
const renderTodos = (projectId) => {
    const project = TodoManager.getProject(projectId);

    if (!project) return;

    dom.projectTitle.textContent = project.name;

    //Clear todos list
    dom.todosList.innerHTML = '';

    if (project.todos.length === 0) {
        //Placeholder to state there is no todos
        dom.todosList.innerHTML = `
        <div class="empty-todo-list">
            <div>There are currently no todos.</div>
            <div>Click the '+' button on top to add one!</div>
        </div>`;
        return;
    }

    project.todos.forEach (todo => {
        const todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");
        todoItem.dataset.id = todo.id;

        //Formatting of date using datefns
        const dueDate = new Date(todo.dueDate);
        const formattedDate = format(dueDate, 'dd-MM-yyyy');

        todoItem.innerHTML = `
        <div class = "todo-checkbox">
            <input type="checkbox" id="todo-${todo.id}"${todo.isCompleted ? 'checked' : ''}> 
            <label for="todo-${todo.id}">
                <span class="checkbox-circle"></span>
            </label>
        </div>
        <div class = "todo-content">
            <h3 class ="todo-title">${todo.title}</h3>
            <div class ="todo-duedate">${formattedDate}</div>
        </div>
        <div class = "todo-actions">
            <button class="todo-edit" data-action="edit" data-todoId="${todo.id}">Edit</button>
            <button class="todo-delete" data-action="delete" data-todoId="${todo.id}">Delete</button>
        </div>`

        dom.todosList.appendChild(todoItem);
    });
};

const renderChecklist = (checklistArray) => {
    dom.checklistContainer.innerHTML = '';

    checklistArray.forEach(checklist => {
        const checklistItem = document.createElement('li');
        checklistItem.classList.add('checklist-item');

        checklistItem.innerHTML = `
        <div class="checklist-elements">
            <input type="checkbox" ${checklistItem.completed ? 'checked' : ''}>
            <h4>${checklist.name}</h4>
        </div>
        <button class="delete-checklist-button">x</button>
        `

        dom.checklistContainer.appendChild(checklistItem);
    });
}


export default {
    init
};