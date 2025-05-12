// Default credentials if none exist
const defaultUsername = "admin";
const defaultPassword = "1234";

// Retrieve stored credentials or fallback to default
let storedUsername = localStorage.getItem("username") || defaultUsername;
let storedPassword = localStorage.getItem("password") || defaultPassword;

// Console log current login credentials
console.log("Username:", storedUsername);
console.log("Password:", storedPassword);

// Handle Login
document.getElementById("loginBtn").addEventListener("click", function () {
  const enteredUsername = document.getElementById("username").value.trim();
  const enteredPassword = document.getElementById("password").value.trim();

  // Refresh stored credentials in case updated from dashboard
  storedUsername = localStorage.getItem("username") || defaultUsername;
  storedPassword = localStorage.getItem("password") || defaultPassword;

  if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
    // Store login session in localStorage (for auto-logout handling)
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginTime", new Date().getTime());

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
});

// Handle Forgot Password
document.getElementById("forgotPassword").addEventListener("click", function () {
  alert(`Username: ${storedUsername}\nPassword: ${storedPassword}`);
});