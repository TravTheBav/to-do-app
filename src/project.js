export class Project {
    constructor(title, description, dueDate, priority) {
        this.id = this.createProjectId();
        this._title = title
        this._description = description
        this._dueDate = dueDate
        this._priority = priority
        this._tasks = []
    }

    get title() {
        return this._title
    }

    set title(title) {
        this._title = title;
    }

    get description() {
        return this._description
    }

    set description(description) {
        this._description = description;
    }

    get dueDate() {
        return this._dueDate
    }

    set dueDate(date) {
        this._dueDate = date;
    }

    get priority() {
        return this._priority
    }

    set priority(priority) {
        this._priority = priority;
    }

    get tasks() {
        return this._tasks
    }

    totalTasks() {
        return this._tasks.length
    }

    addTask(task) {
        this._tasks.push(task);
    }

    getTaskIndex(task) {
        return this._tasks.indexOf(task);
    }

    removeTaskAtIndex(index) {
        this._tasks.splice(index, 1);
    }

    updateTaskDescription(index, text) {
        this._tasks[index].description = text;
    }

    createProjectId() {
        let i = parseInt(localStorage.getItem("project-count")) + 1;
        localStorage.setItem('project-count', i);
        return i;
    }
}