const profileContainer = document.querySelector(".profile");
const profileBtn = document.querySelector("#profile");
const profileClose = document.querySelector("#profile-close");
const imageBtn = document.querySelector(".image-update label");
const imageProfile = document.querySelector(".image-update img");
const imageInput = document.querySelector("#profile-image");

profileBtn.addEventListener("click", () => {
  profileContainer.classList.toggle("open-profile");
});

profileClose.addEventListener("click", () => {
  profileContainer.classList.remove("open-profile");
});

imageInput.addEventListener("change", () => {
  const newImage = imageInput.files;
  if (newImage) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      imageProfile.setAttribute("src", e.target.result);
    };
    fileReader.readAsDataURL(newImage[0]);
  }
});
