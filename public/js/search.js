const searchForm = document.querySelector(".search-container");
const searchBox = document.querySelector("#searchTerm");
const NotesContainer = document.querySelector(".notes-container");
const oldNotesData = NotesContainer.innerHTML;

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

const displayResults = (data) => {
  let printData = "";
  if (data.length === 0) {
    printData = "No Result!";
  } else {
    printData = data
      .map(
        (element) =>
          `<a href="/dashboard/note/${element._id}" class="note">${element.title}</a>`
      )
      .join("");
  }
  printNotes(printData);
};

const printNotes = (data) => {
  NotesContainer.innerHTML = data;
};

const sendReq = async (searchTerm) => {
  try {
    const response = await axios.get(`/search/${searchTerm}`);
    const newNotesData = response.data;
    displayResults(newNotesData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

searchBox.addEventListener("keyup", () => {
  const searchTerm = searchBox.value.trim(); // Trim whitespace
  if (!searchTerm) {
    printNotes(oldNotesData);
  } else {
    sendReq(searchTerm);
  }
});
