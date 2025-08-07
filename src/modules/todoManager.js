import Project from "./project";
import Todo from "./todo";

//Background logic for the todo list

let projects = [];

//Default project
const initialize = () => {
    loadFromLocalStorage();
    if (projects.length === 0) {
        addProject('Default', 'Default project for todos');
    }
    return projects;
}

//Add project function
const addProject = (name, description) => {
    const project = new Project(name, description);
    projects.push(project);
    saveToLocalStorage();
    return project; 
};

//Delete project from project array
const deleteProject = (projectId) => {
    projects = projects.filter(project => project.id !== projectId);
    saveToLocalStorage();
};

const getProject = (projectId) => {
    return projects.find(project => project.id === projectId);
}

const getProjectIndex = (projectId) => {
    const project = getProject(projectId);
    return (projects.indexOf(project));
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
    saveToLocalStorage();
    return todo;
};

//Get todo from project
const getTodo = (projectId, todoId) => {
    const project = getProject(projectId);
    if (project) {
        return project.todos.find(todo => todo.id === todoId);
    }
};

//Delete todo
const deleteTodo = (projectId, todoId) => {
    const project = getProject(projectId);
    if (project) {
        return project.removeTodo(todoId);
    }
    saveToLocalStorage();
};


//Save all the elements in the project array into local storage
const saveToLocalStorage = () => {
    localStorage.setItem('todoList_projects', JSON.stringify(projects));
};


const loadFromLocalStorage = () => {
    const savedProjects = JSON.parse(localStorage.getItem('todoList_projects'));

    try {
        if (savedProjects && Array.isArray(savedProjects)) {
            projects = savedProjects.map(pData => {
                //Restore projects
                const project = new Project(pData.name, pData.description, pData.id);
                //Restore todos
                project.todos = pData.todos.map(tData => {
                    const todo = new Todo(
                        tData.title, 
                        tData.description, 
                        tData.dueDate, 
                        tData.priority, 
                        tData.notes, 
                        tData.projectId, 
                        tData.checklist, 
                        tData.isCompleted,
                        tData.id
                    );
                    return todo;
                });
                return project;
            })
        }    
    } catch (error) {
        console.error("Error getting projects from localStorage", error);
    }
};

export default {
    initialize,
    addProject,
    getAllProjects,
    getProject,
    getProjectIndex,
    deleteProject,
    addTodo,
    getTodo,
    deleteTodo,
    saveToLocalStorage,
    loadFromLocalStorage,

};