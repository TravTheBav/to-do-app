export class Task {
    constructor(description) {
        this._description = description
    }

    get description() {
        return this._description
    }

    set description(text) {
        this._description = text;
    }
}