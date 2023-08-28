import { Project } from "./project";
import { ProjectsController } from "./projects-controller";

export class DisplayController {
    constructor() {
        this.projects = new ProjectsController();
        this.projectsContainer = document.querySelector('.projects');
    }

    #createProject() {
        const projectForm = document.getElementById('project-form');
        let titleField = projectForm.querySelector('#project-title');
        let project = new Project(titleField.value);
        this.projects.addProject(project);
        this.addProject(project);
        titleField.value = ""; 
    }

    initCreateProjectListener() {
        let createProjectBtn = document.getElementById('new-project');
        createProjectBtn.addEventListener('click', this.#createProject.bind(this));
    }

    addProject(project) {
        let projectWrapper = document.createElement('li');
        projectWrapper.classList.add('project-wrapper');
        
        let title = document.createElement('h2');
        title.textContent = project.title;
        
        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-project');
        deleteBtn.textContent = 'delete project';
        deleteBtn.addEventListener('click', function () {
            let projectWrapper = this.parentElement;
            document.querySelector('.projects').removeChild(projectWrapper);
        })
        deleteBtn.addEventListener('click', () => {
            this.projects.deleteProject(project);
        });
        
        projectWrapper.appendChild(title);
        projectWrapper.appendChild(deleteBtn);
        this.projectsContainer.appendChild(projectWrapper);
    }
}