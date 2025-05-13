const defaultUsername = "admin";
const defaultPassword = "1234";

let storedUsername = localStorage.getItem("username") || defaultUsername;
let storedPassword = localStorage.getItem("password") || defaultPassword;

console.log("Username:", storedUsername);
console.log("Password:", storedPassword);

document.getElementById("loginBtn").addEventListener("click", function () {
  const enteredUsername = document.getElementById("username").value.trim();
  const enteredPassword = document.getElementById("password").value.trim();

  storedUsername = localStorage.getItem("username") || defaultUsername;
  storedPassword = localStorage.getItem("password") || defaultPassword;

  if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("loginTime", new Date().getTime());

    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password!");
  }
});

document.getElementById("forgotPassword").addEventListener("click", function () {
  const savedUsername = localStorage.getItem("username") || defaultUsername;
  const savedPassword = localStorage.getItem("password") || defaultPassword;

  alert(`Username: ${savedUsername}\nPassword: ${savedPassword}`);
});
