const bookMarkForm = document.getElementById("bm-form");
const bookMarkResult = document.getElementById("bookmark-results");
bookMarkForm.addEventListener("submit", getFormData);
let bookMarksArray = [];
let savedBookMark;
let webUrl = document.getElementById("s-url").value;
let webName = document.getElementById("s-name").value;
let webData = {
  Name: webName,
  Url: webUrl,
};
function fetchBookMarks() {
    document.getElementById('bm-form').reset();
  let savedB = JSON.parse(localStorage.getItem("bookMarks"));
  bookMarkResult.innerHTML = ``;
  for (const item of bookMarksArray) {
    //   console.log(`${item.Name} : ${item.Url}`);
    bookMarkResult.innerHTML += `<div class = "font-bold text-xl w-[80%] mt-2 p-4 mx-auto rounded-md bg-blue-400">Name:  ${item.Name}             
      <button class="bg-orange-600 p-2.5 mx-[72px] text-white font-bold text-center w-24 mt-8 hover:bg-orange-200 hover:text-orange-600 hover:border-orange-950 hover:border-2">
      <a href="${item.Url}">Visit</a></button>
      <button class="bg-orange-900 p-2.5 mx-[72px] text-white font-bold text-center w-24 mt-8 hover:bg-orange-100 hover:text-orange-600 hover:border-orange-400 hover:border-1">
      <a href="#" onclick = 'deleteBookMark("${item.Url}")'>Delete</a></button>
      </div>`;
  }
}

function deleteBookMark(Url) {
  // console.log('Delete function executed');
  for (const item of bookMarksArray) {
    if (item.Url == Url) {
      // Remove that array
      bookMarksArray.splice(item, 1);
    }
  }
  localStorage.setItem("bookMarks", JSON.stringify(bookMarksArray));

  // refetch bookmarks
  fetchBookMarks();
}

function getFormData(e) {


    
  // refetch bookmarks
  fetchBookMarks();
  //Preventing the form from submission
  e.preventDefault();
  if (localStorage.getItem("bookMarks") === null) {
    bookMarksArray.push(webData);
    localStorage.setItem("bookMarks", JSON.stringify(bookMarksArray));
  } else {
    bookMarksArray = JSON.parse(localStorage.getItem("bookMarks"));
    bookMarksArray.push(webData);
    localStorage.setItem("bookMarks", JSON.stringify(bookMarksArray));
  }

  
//   if(!webUrl || !webName){
//     alert(`Please fill details properly`);
// }
  //   function for deleting the respective bookmark
       fetchBookMarks();
}
