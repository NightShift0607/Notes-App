const passField = document.querySelectorAll("input[type='password']");
const showBtn = document.querySelectorAll(".eye");

for (let i = 0; i < showBtn.length; i++) {
  showBtn[i].addEventListener("click", () => {
    if (passField[i].type == "password") {
      passField[i].type = "text";
      showBtn[i].classList.replace("fa-eye", "fa-eye-slash");
    } else {
      passField[i].type = "password";
      showBtn[i].classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}
