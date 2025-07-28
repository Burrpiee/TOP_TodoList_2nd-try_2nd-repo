import "./styles.css";
import DomManager from "./modules/domManager";
import TodoManager from "./modules/todoManager";

//Initialization steps
DomManager.init();


//Form control

//Project form controls
const addProjectButton = document.getElementById("add-projects-button");
const addProjectContainer = document.getElementById("add-project-container");
const cancelProjectForm = document.getElementById("cancel-add-project");

addProjectButton.addEventListener("click", () => {
    addProjectContainer.classList.toggle("hidden");
});
cancelProjectForm.addEventListener("click", () => {
    addProjectContainer.classList.add("hidden");
    document.getElementById("add-project-form").reset();
});

//Todo form controls
const addTodoButton = document.getElementById("add-todo-button");
const addTodoContainer = document.getElementById("add-todo-container");
const cancelTodoForm = document.getElementById("cancel-todo-button");

addTodoButton.addEventListener("click", () => {
    addTodoContainer.classList.toggle("hidden");
});
cancelTodoForm.addEventListener("click", () => {
    addTodoContainer.classList.add("hidden");
    document.getElementById("add-todo-form").reset();
});