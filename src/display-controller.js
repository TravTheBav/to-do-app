import { formatTimeString } from './date-time-helpers';
import { Project } from "./project";
import { ProjectsController } from "./projects-controller";
import { Task } from "./task";

export class DisplayController {
    constructor() {
        this.projectsController = new ProjectsController();
        this.projectsContainer = document.querySelector('section#projects > ul');
        this.currentProject = null;
    }

// methods for manipulating projects

    // opens up the project form in new mode
    newProject() {
        this.setProjectFormMode('new');
        this.openModal();
    }

    // opens up the project form in edit mode
    editProject() {
        this.setProjectFormMode('edit');
        this.fillFormFields();
        this.openModal();
    }

    // deletes current project
    deleteProject() {
        const text = "Are you sure?";
        if (confirm(text) == true) {
            const index = this.projectsController.projectIndex(this.currentProject);
            this.deleteProjectLink(index);
            this.projectsController.deleteProject(this.currentProject);      
            this.closeCurrentProject();
        }
    }

    // remove project link from the DOM
    deleteProjectLink(index) {
        this.projectsContainer.children.item(index).remove();
    }

    // creates a new project instance and sends addProject method to self and projectsController 
    createProject(event) {
        const fields = this.getProjectFields();

        let validForm = this.checkFields([
                fields.title,
                fields.description,
                fields.dueDate,
                fields.priority
            ]);
        if (!validForm) {
            return;
        }
        
        let validTitle = this.uniqueProjectTitle(fields.title.value);
        if (!validTitle) {
            alert("Project title must be unique");
        } else {
            const dt = new Date(fields.dueDate.value);
            const dateTime = formatTimeString(dt);       
            const project = new Project(
                fields.title.value,
                fields.description.value,
                dateTime,
                fields.priority.value
            );     
            this.projectsController.addProject(project);
            this.addProject(project);
            this.projectsController.saveProject(project);
            this.closeModal();
        }
                
        event.preventDefault();
    }

    // updates the current project
    updateProject(event) {
        const oldTitle = this.currentProject.title;
        const fields = this.getProjectFields();

        let validForm = this.checkFields([
            fields.title,
            fields.description,
            fields.dueDate,
            fields.priority
        ]);
        if (!validForm) {
            console.log('invalid form');
            return;
        }

        let validTitle = this.uniqueProjectTitle(fields.title.value);
        if (fields.title.value != oldTitle && !validTitle) {
            alert("Project title must be unique");
        } else {
            const dt = new Date(fields.dueDate.value);        
            const dateTime = formatTimeString(dt);
    
            // before updating the project, find the project link and update its text to the new title
            let projectLink = this.getProjectLink(oldTitle);
            projectLink.textContent = fields.title.value;
            
            this.currentProject.title = fields.title.value;
            this.currentProject.description = fields.description.value;
            this.currentProject.dueDate = dateTime;
            this.currentProject.priority = fields.priority.value;
    
            this.projectsController.saveProject(this.currentProject);
            this.closeModal();
    
            // simulate a project link click so that the project display updates
            projectLink.click();
        }

        event.preventDefault();
    }

    // retrieves a project link by title
    getProjectLink(title) {
        let listItems = this.projectsContainer.children;
        for (let i=0; i < listItems.length; i++) {
            if (listItems[i].firstChild.textContent == title) {
                return listItems[i].firstChild;
            }
        }
    }    

    // adds a project to the sidebar display
    addProject(project) {
        const listItem = document.createElement('li');
        const projectLink = document.createElement('a');
        projectLink.classList.add('project-link');
        projectLink.href = "";
        listItem.innerHTML = project.title;

        this.initProjectLinkListener(projectLink);

        projectLink.appendChild(listItem);
        this.projectsContainer.appendChild(projectLink);
    }

    // repopulates the projects navigation with all project links on page reload
    repopulateProjectLinks() {
        let projects = this.projectsController.projects;
        for (let i=0; i < projects.length; i++) {
            this.addProject(projects[i]);
        }
    }

    // closes current project display
    closeCurrentProject() {
        const currentProjectDisplay = document.querySelector('#current-project');
        currentProjectDisplay.style.display = 'none';
        this.currentProject = null;
    }

// methods for manipulating tasks

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
        editBtnIcon.classList.add('button-icon', 'small-icon', 'edit-icon');
        editBtn.appendChild(editBtnIcon);
        editBtn.addEventListener('click', this.editTask.bind(this, task));
        return editBtn;
    }

    // returns a task delete button
    newTaskDeleteButton(task) {
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('has-icon');
        const deleteBtnIcon = document.createElement('div');
        deleteBtnIcon.classList.add('button-icon', 'small-icon', 'delete-icon');
        deleteBtn.appendChild(deleteBtnIcon);
        deleteBtn.addEventListener('click', this.deleteTask.bind(this, task));
        return deleteBtn;
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
    }    

// Methods for manipulating the project form

    // open project form
    openModal() {
        const modal = document.querySelector('.modal');
        modal.style.display = 'block';
    }

    // close project form
    closeModal() {
        const form = document.querySelector('form#project-form');
        const modal = document.querySelector('.modal');
        modal.style.display = 'none';
        this.clearForm(form);
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

    // returns an object containing form fields for a project
    getProjectFields() {
        const form = document.querySelector('form#project-form');

        const title = form.querySelector('input#title');
        const description = form.querySelector('textarea#description');
        const dueDate = form.querySelector('input#due-date');
        
        const priorityOptions = document.querySelectorAll('input[name="priority"]');
        let priority;
        priorityOptions.forEach( (field) => {
            if (field.checked) {
                priority = field;
            }
        });

        return {
            title: title,
            description: description,
            dueDate: dueDate,
            priority: priority
        };
    }

    // checks each form field in the array to see if it is valid
    checkFields(arr) {
        const isValid = (field) => field.checkValidity();
        return arr.every(isValid);
    }

    // make sure two projects don't have the same name
    uniqueProjectTitle(title) {
        const bool = this.projectsController.titleExists(title);
        if (bool) {
            return false;
        } else {
            return true;
        }
    }

    // fills the form with some current project data
    fillFormFields() {
        const form = document.querySelector('form#project-form');
        const title = form.querySelector('input#title');
        const description = form.querySelector('textarea#description');
        title.value = this.currentProject.title;
        description.value = this.currentProject.description;
    }

    // sets the project form to the appropriate mode i.e. - create or update
    setProjectFormMode(mode) {
        let header = document.getElementById('modal-header');
        const createProjectBtn = document.querySelector('button#create-project');
        const updateProjectBtn = document.querySelector('button#update-project');
        
        if (mode == 'new') {
            header.textContent = 'New Project';
            createProjectBtn.style.display = 'block';
            updateProjectBtn.style.display = 'none';
        } else if (mode == 'edit') {
            header.textContent = 'Edit Project';
            updateProjectBtn.style.display = 'block';
            createProjectBtn.style.display = 'none';
        }
    }

// Button initializers

    // sets the event listener for the new project button
    initNewProjectListener() {
        const newProjectBtn = document.getElementById('new-project');
        newProjectBtn.addEventListener('click', this.newProject.bind(this));
    }

    // sets the event listener for the create project button
    initCreateProjectListener() {
        const createProjectBtn = document.getElementById('create-project');
        createProjectBtn.addEventListener('click', this.createProject.bind(this));
    }

    // sets the event listener for the edit project button
    initEditProjectListener() {
        const editProjectBtn = document.getElementById('edit-project');
        editProjectBtn.addEventListener('click', this.editProject.bind(this));
    }

    // sets the event listener for the delete project button
    initDeleteProjectListener() {
        const deleteProjectBtn = document.getElementById('delete-project');
        deleteProjectBtn.addEventListener('click', this.deleteProject.bind(this));
    }

    // sets the event listener for the update project button
    initUpdateProjectListener() {
        const updateProjectBtn = document.getElementById('update-project');
        updateProjectBtn.addEventListener('click', this.updateProject.bind(this));
    }

    // sets the event listener for the add task button
    initAddTaskListener() {
        const addTaskBtn = document.getElementById('add-task');
        addTaskBtn.addEventListener('click', this.addTask.bind(this));
    }

    // sets the event listener for the delete-checked-tasks button
    initDeleteCheckedTasksListener() {
        const deleteCheckedBtn = document.getElementById('delete-checked-tasks');
        deleteCheckedBtn.addEventListener('click', this.deleteCheckedTasks.bind(this));
    }

    // sets close button event listener for the new project modal
    initCloseModalListener(modal) {
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', this.closeModal.bind(this));
    }

    // sets the close button event listener for the current project display
    initCloseCurrentProjectListener() {
        const closeBtn = document.getElementById('close-project');
        closeBtn.addEventListener('click', this.closeCurrentProject.bind(this));
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

    // sets event listener for the projects list accordian button
    initProjectsListAccordian() {
        let accordianBtn = document.querySelector('nav button.accordian');
        accordianBtn.addEventListener('click', this.toggleProjectsListState.bind(this));
    }

    toggleProjectsListState() {
        let accordianBtn = document.querySelector('nav button.accordian');
        let icon = accordianBtn.firstElementChild;
        
        if (this.projectsContainer.classList.contains('collapsed')) {
            icon.classList.remove('collapsed-icon');
            icon.classList.add('expanded-icon');
            this.projectsContainer.classList.remove('collapsed');
            this.projectsContainer.style.display = 'block';
        } else {
            icon.classList.remove('expanded-icon');
            icon.classList.add('collapsed-icon');
            this.projectsContainer.classList.add('collapsed');
            this.projectsContainer.style.display = 'none';
        }
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
        this.initEditProjectListener();
        this.initUpdateProjectListener();
        this.initDeleteProjectListener();
        this.initProjectsListAccordian();
    }
}