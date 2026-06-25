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

const themeToggle = document.getElementById("themeToggle");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");

window.addEventListener("DOMContentLoaded", function() {
    loadData();
    renderExpenses();
    updateTotals();
});

setBudgetBtn.addEventListener("click", function() {
    var val = parseFloat(budgetInput.value);
    if(isNaN(val) || val < 0){
        alert("Enter a valid budget amount...");
        return;
    }
    budget = val;
    saveData();
    updateTotals();
});

expenseForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var des = expenseDes.value.trim();
    var cat = expenseCategory.value;
    var amt = parseFloat(expenseAmount.value);
    var date = expenseDate.value;

    if(des === "" || cat === "" || isNaN(amt) || amt <= 0 || date === ""){
        alert("Please fill all the fields with valid date.");
        return;
    }

    var expense = {
        id: Date.now(),
        description: des,
        category: cat,
        amount: amt,
        date: date
    };

    expenses.push(expense);
    renderExpenses();
    updateTotals();
    saveData();
    expenseForm.reset();
});
saveBtn.addEventListener("click", function() {
    saveData();
    alert("Data Saved.");
});
loadBtn.addEventListener("click", function() {
    loadData();
    renderExpenses();
    updateTotals();
    alert("Data Loaded..");
});

exportBtn.addEventListener("click", function() {
    var data = {
        budget: budget,
        expenses: expenses
    };

    var json = JSON.stringify(data);
    var blob = new Blob([json], {type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");

    a.href = url;
    a.download = "budget-data.json";
    a.click();

    URL.revokeObjectURL(url);
});

importInput.addEventListener("change", function(event) {
    var file = event.target.files[0];
    //if no file selected then hmm
    if(!file){
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        console.log(e.target.result);
        try {
            var importedData = JSON.parse(e.target.result);

            if (typeof importedData.budget === "number" && Array.isArray(importedData.expenses)) {
                budget = importedData.budget;
                expenses = importedData.expenses.filter(function (exp) {
                    return(
                        typeof exp.id === "number" &&
                        typeof exp.description === "string" &&
                        typeof exp.category === "string" &&
                        typeof exp.amount === "number" &&
                        typeof exp.date === "string"
                    );
                });

                budgetInput.value = budget;
                renderExpenses();
                updateTotals();
                saveData();
                alert("Data imported successfully.");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (err){
            console.log(err);
            alert(err.message);
        }
        importInput.value = "";
    };
    reader.readAsText(file);
});

function renderExpenses() {
    expenseListEl.innerHTML = "";

    if(expenses.length === 0){
        categoryBreakdownEl.textContent = "No expenses added...";
        return;
    }

    for(var i = 0 ; i < expenses.length ; i++){
        var exp = expenses[i];

        var row = document.createElement("tr");

        var desCell = document.createElement("td");
        desCell.textContent = exp.description;
        row.appendChild(desCell);

        var amountCell = document.createElement("td");
        amountCell.textContent = exp.amount.toFixed(2);
        row.appendChild(amountCell);

        var catCell = document.createElement("td");
        catCell.textContent = exp.category;
        row.appendChild(catCell);

        var dateCell = document.createElement("td");
        dateCell.textContent = exp.date;
        row.appendChild(dateCell);

        var actionCell = document.createElement("td");

        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.setAttribute("data-id", exp.id);
        actionCell.appendChild(editBtn);
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("data-id", exp.id);
        actionCell.appendChild(deleteBtn);

        row.appendChild(actionCell);
        expenseListEl.appendChild(row);
    }
}

function updateTotals() {
    var total = 0;
    for(var i = 0 ; i < expenses.length ; i++){
        var currentAmount = expenses[i].amount;
        total += currentAmount;
    }

    var remaining = budget - total;
    
    totalSpentEl.textContent = total.toFixed(2);
    remainingBudgetEl.textContent = remaining.toFixed(2);

    if(remaining < 0){
        remainingBudgetEl.classList.add("over-budget");
    } else {
        remainingBudgetEl.classList.remove("over-budget");
    }
    if(expenses.length > 0){
        var catTotals = {};

        for(var j = 0 ; j < expenses.length ; j++){
            var categoryName = expenses[j].category;

            if(catTotals[categoryName] === undefined){
                catTotals[categoryName] = 0;
            }
            catTotals[categoryName] += expenses[j].amount;
        }

        categoryBreakdownEl.innerHTML = "";
        for(var cat in catTotals) {
            var catSum = catTotals[cat];
            var percent = 0;

            if(total > 0) {
                percent = (catSum / total * 100).toFixed(0);
            }

            var div = document.createElement("div");
            div.className = "breakdown-item";
            div.textContent = cat + ": ₹" + catSum.toFixed(2) + " (" + percent + "%)";
            categoryBreakdownEl.appendChild(div);
        }
    }
}
expenseListEl.addEventListener("click", function (e) {
    if(e.target.classList.contains("delete-btn")) {
        var id = parseInt(e.target.getAttribute("data-id"));
        for(var i = 0 ; i < expenses.length ; i++){
            if(expenses[i].id === id){
                expenses.splice(i , 1);
                break;
            }
        }
        renderExpenses();
        updateTotals();
        saveData();
    }
    if (e.target.classList.contains("edit-btn")) {
        var id2 = parseInt(e.target.getAttribute("data-id"));
        for(var j = 0 ; j < expenses.length ; j++){
            if(expenses[j].id === id2){
                var exp = expenses[j];
                expenseDes.value = exp.description;
                expenseCategory.value = exp.category;
                expenseAmount.value = exp.amount;
                expenseDate.value = exp.date;

                expenses.splice(j, 1);
                break;
            }
        }
        renderExpenses();
        updateTotals();
        saveData();
    }
});


function saveData() {
    localStorage.setItem("budget", budget);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadData() {
    var storedBudget = localStorage.getItem("budget");
    if(storedBudget !== null){
        budget = parseFloat(storedBudget);
    } else {
        budget = 0;
    }
    var storedExpenses = localStorage.getItem("expenses");
    if(storedExpenses){
        try {
            expenses = JSON.parse(storedExpenses);
            if(!Array.isArray(expenses)) {
                expenses = [];
            }
        } catch (e) {
            expenses = [];
        }
    } else {
        expenses = [];
    }
    budgetInput.value = budget;
}

themeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "Light Mode";
    } else {
        themeToggle.textContent = "Dark Mode";
    }
});