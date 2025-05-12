// js/auth.js

let countdown = 60;
let timer;
let logoutEnabled = JSON.parse(localStorage.getItem("autoLogout")) ?? true;

function startCountdown() {
  if (!logoutEnabled) return;

  clearInterval(timer);
  countdown = 60;
  document.getElementById("countdown").innerText = countdown;

  timer = setInterval(() => {
    countdown--;
    document.getElementById("countdown").innerText = countdown;
    if (countdown <= 0) {
      clearInterval(timer);
      alert("Session expired. Logging out...");
      window.location.href = "index.html";
    }
  }, 1000);
}

function resetTimerOnActivity() {
  ["mousemove", "keydown", "click"].forEach(event =>
    document.addEventListener(event, startCountdown)
  );
}

function toggleAutoLogout() {
  logoutEnabled = !logoutEnabled;
  localStorage.setItem("autoLogout", JSON.stringify(logoutEnabled));
  alert(`Auto logout has been ${logoutEnabled ? "enabled" : "disabled"}.`);
  if (logoutEnabled) startCountdown();
  else clearInterval(timer);
}

// Username/Password Change
function changeCredentials() {
  let newUser = prompt("Enter new username:");
  let newPass = prompt("Enter new password:");

  if (newUser && newPass) {
    localStorage.setItem("username", newUser);
    localStorage.setItem("password", newPass);
    console.log("Updated credentials:");
    console.log("Username:", newUser);
    console.log("Password:", newPass);
    alert("Credentials updated.");
  }
}

// Auto-initialize
if (window.location.pathname.includes("dashboard.html")) {
  startCountdown();
  resetTimerOnActivity();
}