import Todo from './todo';
import generateUniqueID from './utils/idGenerator';
//Project factory

class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.todos = [];
        this.id = generateUniqueID();
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
    
}

export default Project;