const draggable_list = document.getElementById('draggable-list');
const check = document.getElementById('check');
check.addEventListener('click', checkOrder);
const richestPeople = [
    "Warren Buffett",
    "Bill Gates",
    "Larry Page",
    "Sergey Brin",
    "Bernard Arnault",
    "Jeff Bezos",
    "Larry Ellison",
    "Amancio Ortega",
    "Jensen Huang",
    "Michael Bloomberg",
    "Steve Ballmer",
    "Michael Dell",
    "Mark Zuckerberg",
    "Elon Musk",
    "Mukesh Ambani",
    "Jim Walton",
    "Francoise Bettencourt Meyers",
    "Carlos Slim Helú & Family",
    "Zhong Shanshan",
    "Alice Walton"
];

const listItems = [];

let dragStartIndex;

createList();
// Insert list items into DOM. 

function createList() {
    [...richestPeople]
        .map(a => ({ value: a, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(a => a.value)
        .forEach((person, index) => {
            const listitem = document.createElement('li');

            listitem.setAttribute('data-index', index);
            listitem.innerHTML = `<span class = "number"> ${index + 1}</span>
            <div class = "draggable" draggable = "true">
            <p class = "person-name">${person}</p>
            <i class = "fas fa-grip-lines"></i>
            </div>`;

            listItems.push(listitem);

            draggable_list.appendChild(listitem)
        });
    addEventListeners();
}

function dragStart() {
    console.log('Event : ', 'dragstart')
    dragStartIndex = +this.closest('li').getAttribute('data-index');
    console.log(dragStartIndex);

}

function dragEnter() {
    this.classList.add('over')
}

function dragDrop() {
    const dragEndIndex = +this.getAttribute('data-index');
    swapItems(dragStartIndex, dragEndIndex);
    this.classList.remove('over');

}

// function added for swapping the list items
function swapItems(fromIndex, toIndex) {
    // console.log(123);
    const item1 = listItems[fromIndex].querySelector('.draggable');
    const item2 = listItems[toIndex].querySelector('.draggable');

    // console.log(item1, item2);
    listItems[fromIndex].appendChild(item2);
    listItems[toIndex].appendChild(item1);
}

// function added for checking the actual order of listitems 

function checkOrder(){
    listItems.forEach((listItem, index)=>{
        const personName = listItem.querySelector('.draggable')
        .innerText.trim();

        if(personName!== richestPeople[index]){
            listItem.classList.add('wrong');
        }
        else{
        listItem.classList.remove('wrong');
        listItem.classList.add('right');
        }
        console.log('button clicked');
    });
}

function dragOver(e) {
    e.preventDefault();
}

function dragLeave() {
    this.classList.remove('over')
}

function addEventListeners() {
    const draggables = document.querySelectorAll('.draggable');
    const dragListItems = document.querySelectorAll('.draggable-list li');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
    });
    dragListItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('drop', dragDrop);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
    });

}
