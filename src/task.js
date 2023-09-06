export class Task {
    constructor(description) {
        this._description = description
        this._checked = false
    }

    get description() {
        return this._description;
    }

    set description(text) {
        this._description = text;
    }

    get checked() {
        return this._checked;
    }

    toggleChecked() {
        if (this._checked) {
            this._checked = false;
        } else {
            this._checked = true;
        }
    }
}