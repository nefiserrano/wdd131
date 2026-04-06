/*
    AI Disclaimer:
    I used AI tools in this assignment as permitted by the assignment instructions.
    AI was primarily used to assist with structuring the bar chart and category
    breakdown table in the spending analysis page, debugging issues, and brainstorming
    solutions to complex problems. All code was written, reviewed, and edited by me.
    I am fully responsible for the content and functionality of this project.
*/

const budget = 500;

const categories = [
    'Food',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Cleaning Supplies',
    'Other'
];

const colors = {
    'Food': { bar: '#00A86B', badge: { background: '#DCFCE7', color: '#166534' } },
    'Transportation': { bar: '#1E3A8A', badge: { background: '#DBEAFE', color: '#1E40AF' } },
    'Entertainment': { bar: '#7C3AED', badge: { background: '#F3E8FF', color: '#6B21A8' } },
    'Utilities': { bar: '#F59E0B', badge: { background: '#FEF9C3', color: '#854D0E' } },
    'Cleaning Supplies': { bar: '#EC4899', badge: { background: '#FFE4E6', color: '#9F1239' } },
    'Other': { bar: '#94A3B8', badge: { background: '#F1F5F9', color: '#475569' } },
};

const statusDot = document.querySelector('.status-dot');
const statusText = document.getElementById('status');
const statusBanner = statusDot.parentElement;
const statCards = document.querySelectorAll('.stat-card .stat-value');
const emptyStates = document.querySelectorAll('.empty-state');
const chartWrap = document.getElementById('chart-wrap');
const chartArea = document.querySelector('.chart-area');
const chartXLabels = document.querySelector('.chart-x-labels');
const tableBody = document.querySelector('tbody');
const table = document.querySelector('table');

function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function buildCategoryData(expenses) {
    const data = {};
    categories.forEach(cat => {
        data[cat] = { count: 0, total: 0 };
    });

    expenses.forEach(expense => {
        const cat = data[expense.category] ? expense.category : 'Other';
        data[cat].count++;
        data[cat].total += expense.amount;
    });

    return data;
}

function updateStats(expenses) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = budget - total;

    statCards[0].textContent = formatCurrency(total);
    statCards[2].textContent = formatCurrency(Math.abs(remaining));
    statCards[2].className = 'stat-value ' + (remaining < 0 ? 'red' : 'green');

    if (total > budget) {
        statusBanner.classList.add('over');
        statusText.textContent = 'You have exceeded your monthly budget!';
        statusDot.classList.add('over');
    } else {
        statusBanner.classList.remove('over');
        statusText.textContent = 'You are currently within your monthly budget.';
    }
}

function buildChart(catData) {
    const total  = Object.values(catData).reduce((sum, d) => sum + d.total, 0);
    const maxVal = Math.max(...Object.values(catData).map(d => d.total), 1);

    if (total === 0) {
        emptyStates[0].style.display = 'block';
        chartWrap.style.display = 'none';
        return;
    }

    emptyStates[0].style.display = 'none';
    chartWrap.style.display = 'block';

    chartArea.innerHTML = '';
    chartXLabels.innerHTML = '';

    categories.forEach(cat => {
        const d = catData[cat];
        const pct = (d.total / maxVal) * 100;
        const col = colors[cat].bar;

        const group = document.createElement('div');
        group.className = 'bar-group';
        group.innerHTML = `
            ${d.total > 0 ? `<div class="bar-amount">${formatCurrency(d.total)}</div>` : ''}
            <div class="bar" style="height: ${pct}%; background: ${col};"></div>
        `;
        chartArea.appendChild(group);

        const label = document.createElement('span');
        label.textContent = cat;
        chartXLabels.appendChild(label);
    });
}

function buildTable(catData) {
    const total = Object.values(catData).reduce((sum, d) => sum + d.total, 0);

    if (total === 0) {
        emptyStates[1].style.display = 'block';
        table.style.display = 'none';
        return;
    }

    emptyStates[1].style.display = 'none';
    table.style.display = 'table';
    tableBody.innerHTML = '';

    categories.forEach(cat => {
        const d = catData[cat];
        if (d.count === 0) return;

        const budgetPct = ((d.total / budget) * 100).toFixed(1);
        const { background, color } = colors[cat].badge;
        const barColor = colors[cat].bar;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="cat-badge" style="background: ${background}; color: ${color};">${cat}</span></td>
            <td>${d.count} item${d.count !== 1 ? 's' : ''}</td>
            <td><strong>${formatCurrency(d.total)}</strong></td>
            <td>
                <div class="pct-bar-wrap">
                    <div class="pct-track">
                        <div class="pct-fill" style="width: ${Math.min(budgetPct, 100)}%; background: ${barColor};"></div>
                    </div>
                    <span class="pct-label">${budgetPct}%</span>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function init() {
    const expenses = JSON.parse(localStorage.getItem('bf-expenses') || '[]');
    const catData = buildCategoryData(expenses);

    updateStats(expenses);
    buildChart(catData);
    buildTable(catData);
}

init();