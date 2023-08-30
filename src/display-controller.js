import { Project } from "./project";
import { ProjectsController } from "./projects-controller";

export class DisplayController {
    constructor() {
        this.projectsController = new ProjectsController();
        this.projectsContainer = document.getElementById('projects');
    }

    // creates a new project instance and sends addProject method to self and projectsController 
    createProject() {
        let project = new Project('test-project');
        this.projectsController.addProject(project);
        this.addProject(project);
    }

    // wipes the new project form fields
    clearProjectForm() {
        const projectForm = document.getElementById('project-form');
        const titleField = projectForm.querySelector('#project-title');
        titleField.value = "";
    }

    // sets the event listener for the new project button
    initCreateProjectListener() {
        let createProjectBtn = document.getElementById('new-project');
        createProjectBtn.addEventListener('click', this.openNewProjectModal.bind(this));
    }

    // sets close button event listener for a modal
    initCloseModalListener(modal) {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', this.closeModal.bind(closeBtn.parentElement))
    }

    // initializes all listeners
    initListeners() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach( (modal) => {
            this.initCloseModalListener(modal);
        })
        this.initCreateProjectListener();        
    }

    // adds a project to the sidebar display
    addProject(project) {
        let projectLink = document.createElement('li');
        projectLink.classList.add('project-link');
        projectLink.innerHTML = project.title;
        this.projectsContainer.appendChild(projectLink);
    }

    openNewProjectModal() {
        const modal = document.getElementById('new-project-form');
        modal.style.display = 'block';
    }

    closeModal() {
        this.style.display = 'none';
    }
}