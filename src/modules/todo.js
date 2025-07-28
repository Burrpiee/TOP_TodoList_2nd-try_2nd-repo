import generateUniqueID from "./utils/idGenerator";
//Todo factory

class Todo {
    constructor(title, description, dueDate, priority, notes = "", projectId, checklist = [], isCompleted = false) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.projectId = projectId;
        this.checklist = checklist;
        this.isCompleted = isCompleted;
        this.id = generateUniqueID();
    }

    toggleisComplete() {
        this.isCompleted = !this.isCompleted;
    }

    updatePriority(newPriority) {
        this.priority = newPriority;
    }

    updateDueDate(newDate) {
        this.dueDate = newDate;
    }
}

export default Todo;