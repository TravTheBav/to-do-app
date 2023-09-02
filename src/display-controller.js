import { formatTimeString } from './date-time-helpers';
import { Project } from "./project";
import { ProjectsController } from "./projects-controller";
import { Task } from "./task";

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
        
        const dt = new Date(form.querySelector('input#due-date').value);        
        const dateTime = formatTimeString(dt);
        
        const priorityOptions = document.querySelectorAll('input[name="priority"]');
        let priority;
        priorityOptions.forEach( (field) => {
            if (field.checked) {
                priority = field.value;
            }
        });

        const project = new Project(title, description, dateTime, priority);        
        this.projectsController.addProject(project);
        this.addProject(project);

        // clear form and close modal afterwards
        this.clearForm(form);
        this.closeModal.bind(modal)();
        event.preventDefault();
    }

    // wipes the new project form fields
    clearForm(form) {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach((input) => {
            if (input.type == 'radio') {
                if (input.value == 'low') {
                    input.checked = true;  // reset priority to low
                }
            }   else {
                input.value = null;
            }
        })
    }

    // sets the event listener for the new project button
    initNewProjectListener() {
        let newProjectBtn = document.getElementById('new-project');
        newProjectBtn.addEventListener('click', this.openProjectModal.bind(this));
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
            const projectCard = document.getElementById('current-project');

            const title = projectCard.querySelector('#title');
            title.textContent = this.currentProject.title;

            const description = projectCard.querySelector('#description');
            description.textContent = this.currentProject.description;

            const dueDate = projectCard.querySelector('#due-date');
            dueDate.textContent = this.currentProject.dueDate;

            const priority = projectCard.querySelector('#priority');
            priority.textContent = this.currentProject.priority;

            if (window.getComputedStyle(projectCard).display == 'none') { projectCard.style.display = 'block'; }
            
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

        listWrapper.appendChild(projectLink);
        this.projectsContainer.appendChild(listWrapper);
    }

    openProjectModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    closeModal() {
        this.style.display = 'none';
    }
}