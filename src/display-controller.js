import { Project } from "./project";
import { ProjectsController } from "./projects-controller";

export class DisplayController {
    constructor() {
        this.projectsController = new ProjectsController();
        this.projectsContainer = document.getElementById('projects');
    }

    // creates a new project instance and sends addProject method to self and projectsController 
    createProject() {
        //const projectForm = document.getElementById('project-form');
        //let titleField = projectForm.querySelector('#project-title');
        let project = new Project('test-project');
        this.projectsController.addProject(project);
        this.addProject(project);
        //this.clearProjectForm();
    }

    // wipes the new project form fields
    clearProjectForm() {
        const projectForm = document.getElementById('project-form');
        let titleField = projectForm.querySelector('#project-title');
        titleField.value = ""; 
    }

    // sets the event listener for the new project button
    initCreateProjectListener() {
        let createProjectBtn = document.getElementById('new-project');
        createProjectBtn.addEventListener('click', this.createProject.bind(this));
    }

    // adds a project to the sidebar display
    addProject(project) {
        let projectLink = document.createElement('li');
        projectLink.classList.add('project-link');
        projectLink.innerHTML = project.title;
        
        //let deleteBtn = document.createElement('button');
        //deleteBtn.classList.add('delete-project');
        //deleteBtn.textContent = 'delete project';
        //deleteBtn.addEventListener('click', function () {
        //    let projectWrapper = this.parentElement;
        //    document.querySelector('.projects').removeChild(projectWrapper);
        //})
        //deleteBtn.addEventListener('click', () => {
        //    this.projectsController.deleteProject(project);
        //});
        
        //projectWrapper.appendChild(deleteBtn);
        this.projectsContainer.appendChild(projectLink);
    }
}