var budget = 0;
var expenses = [];

const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const totalSpentEl = document.getElementById("totalSpent");
const remainingBudgetEl = document.getElementById("remainingBudget");
const expenseForm = document.getElementById("expenseForm");
const expenseDes = document.getElementById("expenseDes");
const expenseCategory = document.getElementById("expenseCategory");
const expenseAmount = document.getElementById("expenseAmount");
const expenseDate = document.getElementById("expenseDate");
const expenseListEl = document.getElementById("expenseList");
const categoryBreakdownEl = document.getElementById("categoryBreakdown");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");

//When the page loads show the saved data
window.addEventListener("DOMContentLoaded", function() {
    loadData();
    renderExpenses();
    updateTotals();
});

//set budget button click
setBudgetBtn.addEventListener("click", function() {
    //Read the vale from the input
    var val = parseFloat(budgetInput.value);
    //check if the value is valid or not
    if(isNaN(val) || val < 0){
        alert("Enter a valid budget amount...");
        return;
    }
    budget = val;
    //Save and update the screen
    saveData();
    updateTotals();
});

expenseForm.addEventListener("sumbit", function(event) {
    event.preventDefault();
    //Get all values from the form
    var des = expenseDes.value.trim();
    var cat = expenseCategory.value;
    var amt = parseFloat(expenseAmount.value);
    var date = expenseDate.value;

    //check if smth is empty or not valid
    if(des === "" || cat === "" || isNaN(amt) || amt <= 0 || date === ""){
        alert("Please fill all the fields with valid date.");
        return;
    }

    //Create a new expense object
    var expense = {
        id: Date.now(),
        description: des,
        category: cat,
        amount: amt,
        date: date
    };

    //add this obj into the array
    expenses.push(expense);

    //Update the table, totals and saved data
    renderExpenses();
    updateTotals();
    saveDate();
    //clear the form now
    expenseForm.reset();
});

