let selectElem = document.querySelector('select');
let logo = document.querySelector('img');

selectElem.addEventListener('change', changeTheme);

function changeTheme() {
    let current = selectElem.value;
    if (current == 'dark') {
        document.body.classList.add('dark-theme');
        document.querySelector('img').src = 'byui-logo-white.png';
    } else {
        document.body.classList.remove('dark-theme');
        document.querySelector('img').src = 'byui-logo-blue.webp';
    }
}