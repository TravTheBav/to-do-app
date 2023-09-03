export class Project {
    constructor(title, description, dueDate, priority) {
        this._title = title
        this._description = description
        this._dueDate = dueDate
        this._priority = priority
        this._tasks = []
    }

    get title() {
        return this._title
    }

    get description() {
        return this._description
    }

    get dueDate() {
        return this._dueDate
    }

    get priority() {
        return this._priority
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
}