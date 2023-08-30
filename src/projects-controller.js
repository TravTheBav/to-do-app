export class ProjectsController {
    constructor() {
        this._projects = []
    }

    get projects() {
        return this._projects;
    }

    addProject(project) {
        this.projects.push(project);
    }

    deleteProject(project) {
        let index = this.projects.indexOf(project);
        this.projects.splice(index, 1);
    }
}