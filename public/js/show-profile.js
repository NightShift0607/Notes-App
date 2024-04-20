const profileContainer = document.querySelector(".profile");
const profileBtn = document.querySelector("#profile");
const profileClose = document.querySelector("#profile-close");

profileBtn.addEventListener("click", () => {
  profileContainer.classList.toggle("open-profile");
});

profileClose.addEventListener("click", () => {
  profileContainer.classList.remove("open-profile");
});
