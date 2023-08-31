import { Project } from "./project";
import { ProjectsController } from "./projects-controller";

export class DisplayController {
    constructor() {
        this.projectsController = new ProjectsController();
        this.projectsContainer = document.getElementById('projects');
        this.currentProject = null;
    }

    // creates a new project instance and sends addProject method to self and projectsController 
    createProject(event) {
        const form = document.querySelector('form#project-form');
        const modal = document.querySelector('.modal');

        const title = form.querySelector('input#title').value;
        const description = form.querySelector('textarea#description').value;
        const dateTime = form.querySelector('input#due-date').value;
        const priorityOptions = document.querySelectorAll('input[name="priority"]');
        let priority;

        priorityOptions.forEach( (field) => {
            if (field.checked) {
                priority = field.value;
            }
        })

        const project = new Project(title, description, dateTime, priority);        
        this.projectsController.addProject(project);
        this.addProject(project);

        // close modal afterwards
        const close = this.closeModal.bind(modal);
        close();
        event.preventDefault();
    }

    // wipes the new project form fields
    clearNewProjectForm() {
        const projectForm = document.getElementById('project-form');
        const titleField = projectForm.querySelector('#project-title');
        titleField.value = "";
    }

    // sets the event listener for the new project button
    initNewProjectListener() {
        let newProjectBtn = document.getElementById('new-project');
        newProjectBtn.addEventListener('click', this.openNewProjectModal.bind(this));
    }

    // sets the event listener for the create project button
    initCreateProjectListener() {
        let createProjectBtn = document.getElementById('create-project');
        createProjectBtn.addEventListener('click', this.createProject.bind(this));
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
        this.initNewProjectListener();
        this.initCreateProjectListener();    
    }

    initProjectLinkListener(projectLink) {
        projectLink.addEventListener('click', (function (event) {
            this.currentProject = this.projectsController.findProjectByTitle(projectLink.textContent);
            const main = document.querySelector('main');
            
            const title = document.createElement('h2');
            title.textContent = this.currentProject.title;

            const description = document.createElement('p');
            description.textContent = this.currentProject.description;

            const dueDate = document.createElement('p');
            dueDate.textContent = this.currentProject.dueDate;

            const priority = document.createElement('p');
            priority.textContent = this.currentProject.priority;

            const projectDetails = [title, description, dueDate, priority];
            main.replaceChildren(...projectDetails);
            
            event.preventDefault();
        }).bind(this))
    }

    // adds a project to the sidebar display
    addProject(project) {
        const listWrapper = document.createElement('li');
        const projectLink = document.createElement('a');
        projectLink.classList.add('project-link');
        projectLink.href = "";
        projectLink.innerHTML = project.title;

        this.initProjectLinkListener(projectLink);

        listWrapper.appendChild(projectLink)
        this.projectsContainer.appendChild(listWrapper);
    }

    openNewProjectModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    closeModal() {
        this.style.display = 'none';
    }
}