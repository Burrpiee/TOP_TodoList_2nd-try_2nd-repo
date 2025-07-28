import Project from "./project";
import Todo from "./todo";
import TodoManager from "./todoManager";
import { format } from 'date-fns';
//DOM manager

//Private variable for dom elements
const dom = {};

//Caching DOM elements
const cacheDomElements = () => {
    dom.addProjectForm = document.getElementById("add-project-form");
    dom.projectsList = document.getElementById("projects-list");
    dom.addTodoForm = document.getElementById("add-todo-form");
    dom.todosList = document.getElementById("todo-list");
    dom.projectTitle = document.getElementById("current-project-title");
    dom.projectSelect = document.getElementById("todo-project");
}


//Initialize the DOM
const init = () => {
    cacheDomElements();
    setupEventListeners();
    TodoManager.initialize();
    renderProjects();
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
        }
    });

    //Todo item actions
    dom.todosList.addEventListener('click', (e) => {
        const clickedElement = e.target;
        const actionButton = clickedElement.closest('button');

        if(actionButton) {
            const todoItem = actionButton.closest('.todo-item');

            if (todoItem) {
                const todoId = todoItem.dataset.id;

                //Edit button clicked
                if (actionButton.matches('[data-action="edit"]')){
                    console.log(`edit todo:${todoId}`)
                }

                //Delete button clicked
                if (actionButton.matches('[data-action="delete"]')){
                    console.log(`delete todo:${todoId}`);
                    //getprojectid
                    //project.removetodo()
                }
            }
        }
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

        //Create project items
        projectItem.innerHTML = `
        <div>${project.name}</div>
        <button class = "project-delete-button">x</button>`;

        dom.projectsList.appendChild(projectItem);

        projectItem.addEventListener('click', (e) => {
            if (e.target.classList.contains('project-delete-button')) {
                if (confirm("Delete this project and all it's todos?")) {
                    TodoManager.deleteProject(project.id);
                    renderProjects();
                }
            }

            else {
                renderTodos(project.id);

                //Add active class to show active list item
                document.querySelectorAll('.project-list-item').forEach(item => {
                    item.classList.remove('active');
                });
                projectItem.classList.add('active');
            }
        });

        //Add project to add todo form's dropdown list
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        dom.projectSelect.appendChild(option);
        //Choose the first project if no projects were previosly selected

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
            <input type="checkbox" id="todo-${todo.id}" ${todo.complete ? 'checked' : ''}> 
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


export default {
    init,
    setupEventListeners,
    renderProjects,
    renderTodos,

};