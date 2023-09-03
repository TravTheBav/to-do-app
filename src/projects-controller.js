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

    findProjectByTitle(title) {
        const project = _.find(this._projects, function (p) { return p.title == title });
        return project;
    }
}