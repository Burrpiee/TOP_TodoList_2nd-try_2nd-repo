import Todo from './todo';
import generateUniqueID from './utils/idGenerator';
//Project factory

class Project {
    constructor(name, description, id = generateUniqueID()) {
        this.name = name;
        this.description = description;
        this.todos = [];
        this.id = id;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
    
}

export default Project;