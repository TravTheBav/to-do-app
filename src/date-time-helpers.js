import { format, getMinutes, getHours } from 'date-fns';

function formatTimeString(dateObject) {
    let hours = getHours(dateObject);
    let minutes = getMinutes(dateObject);
    let amOrPm;

    if (hours == 0) {
        hours = 12;
        amOrPm = 'AM';
    } else if (hours == 12) {
        hours = 12;
        amOrPm = 'PM';
    } else if (hours > 12) {
        hours = hours % 12;
        amOrPm = 'PM';
    } else {
        amOrPm = 'AM';
    }
    hours = String(hours);
    minutes = String(minutes).padStart(2, '0');

    const output = format(dateObject, `MM/dd/yyyy, '${hours}':'${minutes}' '${amOrPm}'`);
    return output;
}

function formattedDateInputString(string) {
    let d = new Date(string);
    return d.getFullYear() +
           '-' + (d.getMonth() + 1).toString().padStart(2, '0') + // months are 0 indexed so we add 1
           '-' + d.getDate().toString().padStart(2, '0') +
           'T' + d.getHours().toString().padStart(2, '0') +
           ":" + d.getMinutes().toString().padStart(2, '0');
}

export { formatTimeString, formattedDateInputString };