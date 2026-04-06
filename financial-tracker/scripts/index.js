/*
    AI Disclaimer:
    I used AI tools in this assignment as permitted by the assignment instructions.
    AI was primarily used to assist with structuring the bar chart and category
    breakdown table in the spending analysis page, debugging issues, and brainstorming
    solutions to complex problems. All code was written, reviewed, and edited by me.
    I am fully responsible for the content and functionality of this project.
*/

const budget = 500;
let expenses = JSON.parse(localStorage.getItem('bf-expenses') || '[]');
let activeFilter = 'All';
 
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const errorMsg = document.getElementById('error-msg');
const addBtn = document.getElementById('add-btn');
const filterRow = document.getElementById('filter-row');
const ledgerList = document.querySelector('.ledger-list');
const ledgerEmpty = document.querySelector('.ledger-empty');
const balanceValue = document.querySelector('.balance-value');
const budgetFill = document.querySelector('.budget-fill');
const budgetAmount = document.querySelector('.budget-amount');
 
function save() {
    localStorage.setItem('bf-expenses', JSON.stringify(expenses));
}
 
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}
 
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    balanceValue.textContent = formatCurrency(total);
    balanceValue.classList.toggle('over-budget', total > budget);
    const percentage = Math.min((total / budget) * 100, 100);
    budgetFill.style.width = percentage + '%';
    budgetFill.classList.toggle('over', total > budget);
    budgetAmount.textContent = formatCurrency(total) + ' / ' + formatCurrency(budget);
}
 
function getCategoryColors(category) {
    const colors = {
        'Food': { background: '#DCFCE7', color: '#166534' },
        'Transportation': { background: '#DBEAFE', color: '#1E40AF' },
        'Entertainment': { background: '#F3E8FF', color: '#6B21A8' },
        'Utilities': { background: '#FEF9C3', color: '#854D0E' },
        'Cleaning Supplies': { background: '#FFE4E6', color: '#9F1239' },
        'Other': { background: '#F1F5F9', color: '#475569' },
    };
    return colors[category] || colors['Other'];
}
 
function render() {
    const filtered = activeFilter === 'All'
        ? expenses
        : expenses.filter(expense => expense.category === activeFilter);
 
    ledgerEmpty.style.display = filtered.length === 0 ? 'block' : 'none';
    ledgerList.innerHTML = '';
 
    filtered.slice().reverse().forEach(expense => {
        const { background, color } = getCategoryColors(expense.category);
 
        const li = document.createElement('li');
        li.className = 'ledger-item';
        li.innerHTML = `
            <div>
                <div class="ledger-desc">${expense.description}</div>
                <div class="ledger-meta">${expense.category} &middot; ${expense.date}</div>
            </div>
            <div class="ledger-right">
                <span class="category-badge" style="background:${background}; color:${color};">${expense.category}</span>
                <span class="ledger-amount">${formatCurrency(expense.amount)}</span>
                <button class="delete-btn" data-id="${expense.id}" title="Remove expense">&times;</button>
            </div>
        `;
        ledgerList.appendChild(li);
    });
 
    updateTotal();
}
 
function addExpense() {
    errorMsg.textContent = '';
 
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;
 
    if (!description) {
        errorMsg.textContent = 'Please enter a description.';
        return;
    }
    if (!amount || amount <= 0) {
        errorMsg.textContent = 'Please enter a valid amount greater than 0.';
        return;
    }
    if (!category) {
        errorMsg.textContent = 'Please select a category.';
        return;
    }
 
    const newExpense = {
        id: Date.now(),
        description,
        amount,
        category,
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    };
 
    expenses.push(newExpense);
    save();
    render();
 
    descriptionInput.value = '';
    amountInput.value = '';
    categorySelect.value = '';
    descriptionInput.focus();
}
 
function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    save();
    render();
}
 
addBtn.addEventListener('click', addExpense);
 
[descriptionInput, amountInput, categorySelect].forEach(input => {
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') addExpense();
    });
});
 
filterRow.addEventListener('click', e => {
    if (!e.target.matches('.filter-btn')) return;
 
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
 
    activeFilter = e.target.textContent.trim();
    render();
});
 
ledgerList.addEventListener('click', e => {
    if (!e.target.matches('.delete-btn')) return;
    const id = Number(e.target.dataset.id);
    deleteExpense(id);
});
 
render();