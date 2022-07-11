var state = {
    balance: 1000,
    income: 400,
    expense: 100,
    transcations: [
         
    ]
}

var balanceEl = document.querySelector('#balance');
var incomeEl = document.querySelector('#income');
var expenseEl = document.querySelector('#expense');
var transcationsEl = document.querySelector('#transcation');
var incomeBtnEL = document.querySelector('#incomeBtn');
var expenseBtnEl = document.querySelector('#expenseBtn');
var nameInputEl = document.querySelector('#name');
var amountInputEl = document.querySelector('#amount');

function init() {
    var localState = JSON.parse(localStorage.getItem('expenseTrackerState'));

    if (localState !== null) {
        state = localState;
    }
    updateState();
    initListeners();
}

function uniqueId() {
    return Math.round(Math.random() * 1000000);
}

function initListeners() {
    incomeBtnEL.addEventListener('click', onAddIncomeClick);
    expenseBtnEl.addEventListener('click', onAddExpenseClick);
}

// DRY - Do not repeat yourself

function onAddIncomeClick() {
    addTranscation(nameInputEl.value, amountInputEl.value, 'income');  
}

function addTranscation(name, amount, type) {
    if (name !== '' && amount !== '') {
        var transcation = {
            id: uniqueId(),
            name: name,
            amount: parseInt(amount), 
            type: type
        };
         
        state.transcations.push(transcation);

        updateState();
    } else {
        alert('Please enter valid data');
    }

     nameInputEl.value = '';
     amountInputEl.value = '';
}

function onAddExpenseClick() {
    addTranscation(nameInputEl.value, amountInputEl.value, 'expense');
}

function onDeleteClick(event) {
    var id = parseInt(event.target.getAttribute('data-id'));
    var deleteIndex;
    for (var i = 0; i < state.transcations.length; i++) {
        if (state.transcations[i].id === id) {
            deleteIndex = i;
            break;
        }
    }
    state.transcations.splice(deleteIndex, 1);

    updateState();
}

function updateState() {
    var balance = 0,
        income = 0,
        expense = 0, 
        item;


    for (var i = 0; i < state.transcations.length; i++) {
        item = state.transcations[i];

        if (item.type === 'income') {
            income += item.amount;
        } else if (item.type === 'expense') {
            expense += item.amount;
        }
    }

    balance = income - expense;

    state.balance = balance;
    state.income = income;
    state.expense = expense;

    localStorage.setItem('expenseTrackerState', JSON.stringify(state))

    render();
}

function render() {
    balanceEl.innerHTML = `$${state.balance}`;
    incomeEl.innerHTML = `$${state.income}`;
    expenseEl.innerHTML = `$${state.expense}`;

    var transcationEl, containerEl, amountEl, item, btnEl;

    transcationsEl.innerHTML = '';

    for (var i = 0; i < state.transcations.length; i++) {
        item = state.transcations[i];
        transcationEl = document.createElement('li');
        transcationEl.append(item.name);

        transcationsEl.appendChild(transcationEl);

        containerEl = document.createElement('div');
        amountEl = document.createElement('span');
        if (item.type === 'income') {
            amountEl.classList.add('income-amt');
        } else if (item.type === 'expense') {
            amountEl.classList.add('expense-amt');
        }
        amountEl.innerHTML = `$${item.amount}`;

        containerEl.appendChild(amountEl);

        btnEl = document.createElement('button');
        btnEl.setAttribute('data-id',  item.id);
        btnEl.innerHTML = 'X';

        btnEl.addEventListener('click', onDeleteClick);

        containerEl.appendChild(btnEl);

        transcationEl.appendChild(containerEl);
    }
}

init();
