// dev mode
let toggle = false;
const body = document.body;
if (toggle) {
    body.style.backgroundImage = 'none';
}

//April fool's
const date = new Date(Date.now());
// console.log(date.getMonth());
if (date.getMonth() >= 3) {
    window.location = "https://scratch.mit.edu/projects/1151867708/";
}