const characterCard = {
    name: 'Snortleblat',
    class: 'Swamp Beast Diplomat',
    level: 5,
    health: 100,
    image: 'images/snortleblat.webp',
    attacked: function(damage) {
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
            alert("Character Died");
        }
    },
    levelUp: function(levels) {
        this.level += levels;
    }
};

document.querySelector('.image').setAttribute('src', characterCard.image);
document.querySelector('.image').setAttribute('alt', characterCard.name);
document.querySelector('.name').textContent = characterCard.name;
document.querySelector('#class').innerHTML = `<strong>Class:</strong> ${characterCard.class}`;
document.querySelector('#level').innerHTML = `<strong>Level:</strong> ${characterCard.level}`;
document.querySelector('#health').innerHTML = `<strong>Health:</strong> ${characterCard.health}`;

document.querySelector('#attacked').addEventListener('click', function () {
    characterCard.attacked(20);
    document.querySelector('#health').innerHTML = `<strong>Health:</strong> ${characterCard.health}`;
});

document.querySelector('#levelUp').addEventListener('click', function () {
    characterCard.levelUp(1);
    document.querySelector('#level').innerHTML = `<strong>Level:</strong> ${characterCard.level}`;
});