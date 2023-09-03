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
        const newProjectBtn = document.getElementById('new-project');
        newProjectBtn.addEventListener('click', this.openModal.bind(this));
    }

    // sets the event listener for the create project button
    initCreateProjectListener() {
        const createProjectBtn = document.getElementById('create-project');
        createProjectBtn.addEventListener('click', this.createProject.bind(this));
    }

    // set the event listener for the add task button
    initAddTaskListener() {
        const addTaskBtn = document.getElementById('add-task');
        addTaskBtn.addEventListener('click', this.addTask.bind(this));
    }

    // sets close button event listener for a modal
    initCloseModalListener(modal) {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', this.closeModal.bind(closeBtn.parentElement))
    }

    // sets event listener for a project link or tab
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

            // repopulate tasks
            this.clearTasksList();
            this.populateProjectTasks();

            if (window.getComputedStyle(projectCard).display == 'none') { projectCard.style.display = 'block'; }
            
            event.preventDefault();
        }).bind(this))
    }

    // remove a task from the current project object and the project's display
    deleteTask(task) {
        const index = this.currentProject.getTaskIndex(task);
        this.currentProject.removeTaskAtIndex(index);
        const tasksList = this.getTasksList();
        tasksList.children.item(index).remove();
    }

    // initializes all listeners for buttons that are present on page load
    initListeners() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach( (modal) => {
            this.initCloseModalListener(modal);
        })
        this.initNewProjectListener();
        this.initCreateProjectListener();
        this.initAddTaskListener();
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

    // wipes all tasks from the current projects tasks list
    clearTasksList() {
        const tasksList = this.getTasksList();
        while (tasksList.firstChild) {
            tasksList.removeChild(tasksList.lastChild);
        }
    }

    // takes a task as an arg and appends it to the current project's tasks display
    appendTaskToDOM(task) {
        const tasksList = this.getTasksList();
        const listElement = document.createElement('li');
        
        const textWrapper = document.createElement('span');
        textWrapper.innerHTML = task.description;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'edit';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'delete';
        deleteBtn.addEventListener('click', this.deleteTask.bind(this, task));

        [textWrapper, editBtn, deleteBtn].forEach( (ele) => {
            listElement.appendChild(ele);
        })
        tasksList.appendChild(listElement);
    }

    // adds a new task to the current project and appends it to the DOM via the helper method
    // appendTaskToDOM()
    addTask() {
        const totalTasks = this.currentProject.totalTasks();
        const task = new Task(`task-${totalTasks + 1}`);
        
        this.currentProject.addTask(task);
        this.appendTaskToDOM(task);
    }

    // adds all of the current project tasks to the tasks display via the helper method
    // appendTaskToDOM()
    populateProjectTasks() {
        for (let i = 0; i < this.currentProject.totalTasks(); i++) {
            this.appendTaskToDOM(this.currentProject.tasks[i]);
        }
    }

    openModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    closeModal() {
        this.style.display = 'none';
    }

    // queries the current project's tasks list element and returns it
    getTasksList() {
        return document.querySelector('ul#tasks-list'); 
    }
}