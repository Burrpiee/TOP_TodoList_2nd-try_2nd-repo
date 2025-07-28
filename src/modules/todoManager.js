import Project from "./project";
import Todo from "./todo";

//Background logic for the todo list

let projects = [];

//Default project
const initialize = () => {
    if (projects.length === 0) {
        addProject('Default', 'Default project for todos');
    }
    return projects;
}

//Add project function
const addProject = (name, description) => {
    const project = new Project(name, description);
    projects.push(project);

    return project; 
};

//Delete project from project array
const deleteProject = (projectId) => {
    projects = projects.filter(project => project.id !== projectId);
};

const getProject = (projectId) => {
    return projects.find(project => project.id === projectId);
}

//Return all projects in project array
const getAllProjects = () => {
    return projects;
};

//Add todo to project
const addTodo = (title, description, dueDate, priority, notes, projectId) => {
    const project = getProject(projectId);
    const todo =  new Todo(title, description, dueDate, priority, notes, projectId);

    project.addTodo(todo);
    return todo;
};

//getTodo
const getTodo = (todoId) => {
    
};

//Delete todo
const deleteTodo = (todoId) => {

};

//Get todo

const getAllTodos = (projectId) => {

};

export default {
    initialize,
    addProject,
    getAllProjects,
    getProject,
    deleteProject,
    addTodo,
    getAllTodos,
    

};