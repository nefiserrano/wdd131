const theForm = document.querySelector('form');
const errorContainer = document.querySelector('.errors');
const cardNumberInput = document.querySelector('#cardNumber');

cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = formattedValue.substring(0, 19);
});

function setNumericConstraint(selector, limit) {
    const input = document.querySelector(selector);
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, limit);
    });
}

setNumericConstraint('#month', 2);
setNumericConstraint('#year', 2);
setNumericConstraint('#cvc', 3);

function displayError(msg) {
    errorContainer.textContent = msg;
}

function isCardNumberValid(number) {
    return number === '1234123412341234';
}

function submitHandler(event) {
    event.preventDefault();
    let errorMsg = [];
    displayError('');

    const cardNum = cardNumberInput.value.replace(/\s+/g, '').trim();
    const expYear = Number(document.querySelector('#year').value);
    const expMonth = Number(document.querySelector('#month').value);
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (!/^\d{16}$/.test(cardNum)) {
        errorMsg.push('Card number must be 16 digits.');
    } else if (!isCardNumberValid(cardNum)) {
        errorMsg.push('Card number is not recognized.');
    }

    if (expMonth < 1 || expMonth > 12) {
        errorMsg.push('Expiration month must be between 01 and 12.');
    }

    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        errorMsg.push('The card has expired.');
    }

    const cvcValue = document.querySelector('#cvc').value;
    if (!/^\d{3}$/.test(cvcValue)) {
        errorMsg.push('CVC must be exactly 3 digits.');
    }

    if (errorMsg.length > 0) {
        displayError(errorMsg.join(' | '));
        return;
    }

    theForm.innerHTML = `
        <div style="grid-column: 1 / 4; grid-row: 1 / 4; text-align: center; align-self: center;">
            <h2>Purchase Successful!</h2>
            <p>Thank you for your order.</p>
        </div>
    `;
}

theForm.addEventListener('submit', submitHandler);