import { Project } from "./project";

export class ProjectsController {
    constructor() {
        this._projects = [];
        this.loadProjects();
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

    loadProjects() {
        localStorage.setItem('project-count', 0);
        let arr = JSON.parse(localStorage.getItem('projects'));
        for (let i=0; i < arr.length; i++) {
            const p = new Project(
                arr[i]._title,
                arr[i]._description,
                arr[i]._dueDate,
                arr[i]._priority
            );
            this.addProject(p);
        }
        localStorage.setItem('projects', JSON.stringify(arr));
        console.log(this._projects);
    }

    saveProject(project) {
        let arr = JSON.parse(localStorage.getItem('projects'));
        let found = false;

        let p = arr.find((o, i) => {
            if (o.id == project.id) {
                arr[i] = project;
                localStorage.setItem('projects', JSON.stringify(arr));
                found = true;
                return true;
            }
        });

        if (!found) {
            arr.push(project);
            localStorage.setItem('projects', JSON.stringify(arr));
        }        
    }
}