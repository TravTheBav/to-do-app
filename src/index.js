import './style.css';
import _ from 'lodash';
import { DisplayController } from "./display-controller";

if (!localStorage.getItem('uniq-id')) {
    localStorage.setItem('uniq-id', 0);
}

if (!localStorage.getItem('projects')) {
    localStorage.setItem('projects', JSON.stringify([]));
}

let display = new DisplayController();
display.repopulateProjectLinks();
display.initListeners();
