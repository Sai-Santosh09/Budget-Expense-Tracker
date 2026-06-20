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
//Save button
saveBtn.addEventListener("click", function() {
    saveData();
    alert("Data Saved.");
});
//Load Button 
loadBtn.addEventListener("click", function() {
    loadData();
    renderExpenses();
    updateTotals();
    alert("Data Loaded..");
});

//Exporting data as a JSON file
exportBtn.addEventListener("click", function() {
    //create an object with all the DATA
    var data = {
        budget: budget,
        expenses: expenses
    };

    //Comvert it into JSON
    var json = JSON.stringify(data);
    //create a downloadable file of this
    var blob = new Blob([json], {type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");

    a.href = url;
    a.download = "budget-data.json";
    a.click();

    URL.revokeObjectURL(url);
});

//Import JSON
importInput.addEventListener("change", function(event) {
    var file = event.target.files[0];
    //if no file selected then hmm
    if(!file){
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            //Read the json and convert to object
            var importedData = JSON.parse(e.target.result);

            if (typeof importedData.budget === "number" && Array.isArray(importedData.expenses)) {
                budget = importedData.budget;
                expenses = importedData.expenses;

                //update ui and save the imported data
                renderExpenses();
                updateTotals();
                saveData();
                alert("Data imported successfully.");
            } else {
                alert("Invalid JSON format.");
            }
        } catch (err){
            alert("Error parsing JSON file.");
        }
    };
    reader.readAsText(file);
});

//Show all the expenses in the table
function renderExpenses() {
    //Clear the old rows
    expenseListEl.innerHTML = "";

    //if no expense exists, show something to say nothing is added...
    if(expenses.length === 0){
        categoryBreakdownEl.textContent = "No expenses added...";
        return;
    }

    //Create one row for each and every expense
    for(var i = 0 ; i < expenses.length ; i++){
        var exp = expenses[i];

        //create table row
        var row = document.createElement("tr");
        //Description cell
        var desCell = document.createElement("td");
        desCell.textContent = exp.description;
        row.appendChild(desCell);

        //Amount Cell
        var amountCell = document.createElement("td");
        amountCell.textContent = exp.amount.toFixed(2);
        row.appendChild(amountCell);

        //Category Cell
        var catCell = document.createElement("td");
        catCell.textContent = exp.category;
        row.appendChild(catCell);

        //Date Cell
        var dateCell = document.createElement("td");
        dateCell.textContent = exp.date;
        row.appendChild(dateCell);

        //Action buttons Cell
        var actionCell = document.createElement("td");

        //Edit Button for action Cell
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.setAttribute("data-id", exp.id);
        actionCell.appendChild(editBtn);

        //Delete button for action Cell
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.setAttribute("data-id", exp.id);
        actionCell.appendChild(deleteBtn);

        row.appendChild(actionCell);
        //Add the row to the table
        expenseListEl.appendChild(row);
    }
}


