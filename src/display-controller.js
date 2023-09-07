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

        const title = form.querySelector('input#title');
        const description = form.querySelector('textarea#description');
        const dateField = form.querySelector('input#due-date'); 
        
        const priorityOptions = document.querySelectorAll('input[name="priority"]');
        let priority;
        priorityOptions.forEach( (field) => {
            if (field.checked) {
                priority = field;
            }
        });

        let validForm = this.checkFields([title, description, dateField, priority]);
        if (!validForm) {
            console.log('invalid form');
            return;
        }

        const dt = new Date(dateField.value);        
        const dateTime = formatTimeString(dt);       
        const project = new Project(title.value, description.value, dateTime, priority.value);        
        this.projectsController.addProject(project);
        this.addProject(project);

        // clear form and close modal afterwards
        this.clearForm(form);
        this.closeModal.bind(modal)();
        
        event.preventDefault();
    }

    // checks each form field in the array to see if it is valid
    checkFields(arr) {
        const isValid = (field) => field.checkValidity();
        return arr.every(isValid);
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

    // set the event listener for the delete-checked-tasks button
    initDeleteCheckedTasksListener() {
        const deleteCheckedBtn = document.getElementById('delete-checked-tasks');
        deleteCheckedBtn.addEventListener('click', this.deleteCheckedTasks.bind(this));
    }

    // sets close button event listener for the new project modal
    initCloseModalListener(modal) {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', this.closeModal.bind(closeBtn.parentElement));
    }

    // sets the close button event listener for the current project display
    initCloseCurrentProjectListener() {
        const closeBtn = document.getElementById('close-project');
        closeBtn.addEventListener('click', this.closeCurrentProject.bind(this));
    }

    closeCurrentProject() {
        const currentProjectDisplay = document.querySelector('#current-project');
        currentProjectDisplay.style.display = 'none';
        this.currentProject = null;
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

    // initializes all listeners for buttons that are present on page load
    initListeners() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach( (modal) => {
            this.initCloseModalListener(modal);
        })
        this.initNewProjectListener();
        this.initCreateProjectListener();
        this.initAddTaskListener();
        this.initDeleteCheckedTasksListener();
        this.initCloseCurrentProjectListener();
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

    // deletes all checked tasks from the current project display and the backend
    deleteCheckedTasks() {
        const tasksList = this.getTasksList();
        for (let i = tasksList.children.length - 1; i >= 0; i--) {
            let listItem = tasksList.children[i]
            let checkBox = listItem.querySelector('button.checkbox');
            if (checkBox.classList.contains('checked')) {
                let task = this.currentProject.tasks[i]
                this.deleteTask(task);
            }
        }
    }

    // takes a task as an arg and appends it to the current project's tasks display
    appendTaskToDOM(task) {
        const tasksList = this.getTasksList();
        const listElement = document.createElement('li');
        listElement.classList.add('task');

        const checkBox = this.newTaskCheckBox(task);
        const editBtn = this.newTaskEditButton(task);
        const deleteBtn = this.newTaskDeleteButton(task);

        const textWrapper = document.createElement('span');
        textWrapper.innerHTML = task.description;

        [checkBox, editBtn, deleteBtn, textWrapper].forEach( (ele) => {
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

    // remove a task from the current project object and the project's display
    deleteTask(task) {
        const index = this.currentProject.getTaskIndex(task);
        this.currentProject.removeTaskAtIndex(index);
        const tasksList = this.getTasksList();
        tasksList.children.item(index).remove();
    }

    // allows a task description to be edited
    editTask(task) {
        const index = this.currentProject.getTaskIndex(task);
        const tasksList = this.getTasksList();
        let listItem = tasksList.children.item(index);
        let ele = listItem.querySelector('span');
        let text = ele.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = text;
        
        input.onblur = (function() {
            listItem = tasksList.children.item(index);
            text = input.value;
            const spanEle = document.createElement('span');
            spanEle.textContent = text;
            listItem.replaceChild(spanEle, input);
            this.currentProject.updateTaskDescription(index, text);
        }).bind(this);

        input.addEventListener('keydown', (event) => {
            if (event.key == "Enter") {
                input.blur();
            };
        });

        listItem.replaceChild(input, ele);
        input.focus();  
    }

    // toggles a task checkbox
    toggleCheckBox() {
        if (this.classList.contains('checked')) {
            this.classList.remove('checked');
        } else {
            this.classList.add('checked');
        }
    }

    // notifies a task when it is checked on the display
    toggleTaskCheckedStatus(task) {
        task.toggleChecked();
    }

    // adds all of the current project tasks to the tasks display via the helper method
    // appendTaskToDOM()
    populateProjectTasks() {
        for (let i = 0; i < this.currentProject.totalTasks(); i++) {
            this.appendTaskToDOM(this.currentProject.tasks[i]);
        }
        console.log(this.currentProject.tasks);
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

    // returns a task checkbox
    newTaskCheckBox(task) {
        const checkBox = document.createElement('button');
        checkBox.classList.add('has-icon', 'checkbox');
        const checkBoxIcon = document.createElement('div');
        checkBoxIcon.classList.add('button-icon', 'small-icon', 'task-checkbox');
        if (task.checked) {
            checkBox.classList.add('checked');
        }
        checkBox.appendChild(checkBoxIcon);
        checkBox.addEventListener('click', this.toggleCheckBox);
        checkBox.addEventListener('click', this.toggleTaskCheckedStatus.bind(this, task));
        return checkBox;
    }

    // returns a task edit button
    newTaskEditButton(task) {
        const editBtn = document.createElement('button');
        editBtn.classList.add('has-icon');
        const editBtnIcon = document.createElement('div');
        editBtnIcon.classList.add('button-icon', 'small-icon', 'edit-task');
        editBtn.appendChild(editBtnIcon);
        editBtn.addEventListener('click', this.editTask.bind(this, task));
        return editBtn;
    }

    // returns a task delete button
    newTaskDeleteButton(task) {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('has-icon');
        const deleteBtnIcon = document.createElement('div');
        deleteBtnIcon.classList.add('button-icon', 'small-icon', 'delete-task');
        deleteBtn.appendChild(deleteBtnIcon);
        deleteBtn.addEventListener('click', this.deleteTask.bind(this, task));
        return deleteBtn;
    }
}