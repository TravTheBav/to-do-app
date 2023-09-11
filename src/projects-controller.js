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

    projectIndex(project) {
        const index = this.projects.indexOf(project);
        return index;
    }

    deleteProject(project) {
        const index = this.projectIndex(project);
        this.projects.splice(index, 1);
    }

    findProjectByTitle(title) {
        const project = _.find(this._projects, function (p) { return p.title == title });
        return project;
    }

    titleExists(title) {
        const fn = function (project) { return project.title == title }
        const result = this._projects.some(fn);
        return result;
    }
}