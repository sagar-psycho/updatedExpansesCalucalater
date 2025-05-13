let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let transactionId = 1;

const incomeSound = new Audio("assets/sounds/add.mp3");
const deleteSound = new Audio("assets/sounds/delete.mp3");

function updateSummary() {
  let income = 0, expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  });

  document.getElementById("income").innerText = `₹ ${income}`;
  document.getElementById("expenses").innerText = `₹ ${expense}`;
  document.getElementById("balance").innerText = `₹ ${income - expense}`;
}

function renderTransactions() {
  const tbody = document.getElementById("transactionBody");
  tbody.innerHTML = "";

  if (transactions.length === 0) {
    const row = tbody.insertRow();
    row.innerHTML = `<td colspan="7">No transactions yet.</td>`;
    return;
  }

  transactions.forEach((t, index) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${t.date}</td>
      <td>${t.type}</td>
      <td>₹${t.amount}</td>
      <td>₹${t.total}</td>
      <td>${t.description}</td>
      <td>
        <button class="btn btn-sm btn-warning me-1" onclick="editTransaction(${index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${index})">Delete</button>
      </td>
    `;
  });
}

function addTransaction() {
  const type = document.getElementById("type").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const description = document.getElementById("description").value.trim();

  if (isNaN(amount) || amount <= 0 || description === "") {
    alert("Please enter valid amount and description.");
    return;
  }

  const date = new Date().toLocaleDateString();
  const total = type === "income"
    ? getTotal() + amount
    : getTotal() - amount;

  const transaction = { id: transactionId++, type, amount, total, description, date };
  transactions.push(transaction);
  incomeSound.play();

  updateStorage();
  renderTransactions();
  updateSummary();

  document.getElementById("amount").value = "";
  document.getElementById("description").value = "";
}

function deleteTransaction(index) {
  const confirmDelete = confirm("Do you really want to delete this transaction?");
  if (confirmDelete) {
    deleteSound.play();
    transactions.splice(index, 1);
    updateStorage();
    renderTransactions();
    updateSummary();
  }
}

function editTransaction(index) {
  const t = transactions[index];
  const newAmount = parseFloat(prompt("Edit Amount:", t.amount));
  const newDescription = prompt("Edit Description:", t.description);

  if (!isNaN(newAmount) && newAmount > 0 && newDescription.trim()) {
    transactions[index].amount = newAmount;
    transactions[index].description = newDescription;
    updateStorage();
    renderTransactions();
    updateSummary();
  }
}

function clearAllTransactions() {
  if (transactions.length === 0) {
    alert("Add transactions to delete.");
    return;
  }

  const confirmClear = confirm("Are you sure you want to delete all transactions?");
  if (confirmClear) {
    transactions = [];
    updateStorage();
    renderTransactions();
    updateSummary();
    deleteSound.play();
  }
}

function getTotal() {
  return transactions.reduce((acc, t) =>
    t.type === "income" ? acc + t.amount : acc - t.amount, 0);
}

function updateStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
function getFormattedDate() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

function downloadTable() {
  if (!transactions || transactions.length === 0) {
    alert("No transactions found. Please add transactions to download.");
    return;
  }

  const type = document.getElementById("downloadType").value;
  const messageEl = document.getElementById("downloadMessage");

  let countdown = 5;
  messageEl.innerHTML = `Your file is downloading in this format (${type.toUpperCase()}) and it will be ready in <span style="color: blue;">${countdown}</span> seconds`;

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      messageEl.innerHTML = `Your file is downloading in this format (${type.toUpperCase()}) and it will be ready in <span style="color: blue;">${countdown}</span> seconds`;
    } else {
      clearInterval(interval);
      messageEl.innerHTML = `<span style="color: green;">Your file is downloaded in this format (${type.toUpperCase()})</span>`;

      if (type === "pdf") {
        exportToPDF();
      } else if (type === "excel") {
        exportToExcel();
      }
    }
  }, 1000);
}


function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("Expense Transactions", 10, 10);

  let y = 20;
  doc.text("No.", 10, y);
  doc.text("Date", 20, y);
  doc.text("Type", 50, y);
  doc.text("Amount", 80, y);
  doc.text("Total", 110, y);
  doc.text("Description", 140, y);

  transactions.forEach((t, i) => {
    y += 10;
    doc.text(String(i + 1), 10, y);
    doc.text(t.date, 20, y);
    doc.text(t.type, 50, y);
    doc.text(`₹${t.amount}`, 80, y);
    doc.text(`₹${t.total}`, 110, y);
    doc.text(t.description, 140, y);
  });

  doc.save(`transactions_${getFormattedDate()}.pdf`);
}

function exportToExcel() {
  const wsData = [
    ["No.", "Date", "Type", "Amount", "Total", "Description"]
  ];

  transactions.forEach((t, i) => {
    wsData.push([
      i + 1,
      t.date,
      t.type,
      `₹${t.amount}`,
      `₹${t.total}`,
      t.description
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, `transactions_${getFormattedDate()}.xlsx`);

}


function sortByType() {
  const filter = document.getElementById("sortType").value;
  if (filter === "all") {
    transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  } else {
    transactions = transactions.filter(t => t.type === filter);
  }
  renderTransactions();
  updateSummary();
}

function toggleTheme() {
  document.body.classList.toggle("bg-light");
  document.body.classList.toggle("bg-dark");
  document.body.classList.toggle("text-white");
}

renderTransactions();
updateSummary();
function updateCredentials() {
  const newUsername = document.getElementById("newUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const msgEl = document.getElementById("updateMessage");

  if (!newUsername || !newPassword) {
    msgEl.textContent = "Please enter both username and password.";
    msgEl.style.color = "red";
    return;
  }

  localStorage.setItem("username", newUsername);
  localStorage.setItem("password", newPassword);

  msgEl.textContent = "Credentials updated successfully!";
  msgEl.style.color = "green";

  console.log("Updated Username:", newUsername);
  console.log("Updated Password:", newPassword);
}
function updateCredentials() {
  const newUsername = document.getElementById("newUsername").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const msgEl = document.getElementById("updateMessage");

  const oldUsername = localStorage.getItem("username") || "admin";
  const oldPassword = localStorage.getItem("password") || "1234";

  if (!newUsername || !newPassword) {
    msgEl.textContent = "Please enter both username and password.";
    msgEl.style.color = "red";
    return;
  }

  if (newUsername === oldUsername && newPassword === oldPassword) {
    msgEl.textContent = "No changes detected.";
    msgEl.style.color = "orange";
    return;
  }

  localStorage.setItem("username", newUsername);
  localStorage.setItem("password", newPassword);

  msgEl.innerHTML = `✅ Your username changed from <b>${oldUsername}</b> to <b>${newUsername}</b> and password to <b>${newPassword}</b>`;
  msgEl.style.color = "green";

  console.log("Updated Username:", newUsername);
  console.log("Updated Password:", newPassword);
}
function logout() {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
}
const isLoggedIn = localStorage.getItem("isLoggedIn");
if (!isLoggedIn || isLoggedIn !== "true") {
  alert("Please login first to access the dashboard.");
  window.location.href = "index.html";
}
