const gallery = document.querySelector('.gallery');
const modal = document.querySelector('dialog');
const modalImage = modal.querySelector('img');

function viewerTemplate(imageURL, altText) {
    return `
        <img src="${imageURL}" alt="${altText}">
        <button class="close-viewer">X</button>
    `;
}

// Event listener for opening the modal
gallery.addEventListener('click', openModal);

function openModal(e) {
    console.log(e.target);
    
    const img = e.target;
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    const full = src.replace('sm', 'full');

    modal.innerHTML = viewerTemplate(full, alt);

    modal.showModal();

    const closeButton = modal.querySelector('.close-viewer');
    closeButton.addEventListener('click', () => modal.close());
}

// Close modal if clicking outside the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});

// Menu toggle functionality
const btn = document.querySelector('.menu-btn');
const menu = document.querySelector('nav');

btn.addEventListener('click', () => {
    toggleMenu();
});

function toggleMenu() {
    menu.classList.toggle('hide');
    btn.classList.toggle('change');
}