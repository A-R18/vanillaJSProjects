// Get the modal
let modal = document.getElementById('simple-modal');
// modal.style.display = 'block';
// // Get the modal button
let modalBtn = document.getElementById('mdl-btn');
// Get the close button
let closeBtn = document.getElementById('closeBtn');

// Listen for open click
modalBtn.addEventListener('click', openModal)
// Listen for close click
closeBtn.addEventListener('click', closeModal)
// Listen for closing outside the modal box where & inside modal div area.
modal.addEventListener('click', closeOutside)

// function written for opening the modal
function openModal(){
    modal.style.display = 'block';
    console.log('opened');
}

// function written for opening the modal
function closeModal(){
    modal.style.display = 'none';
}
// function written for closing outside the modal box where & inside modal div area.
function closeOutside(e){
    if (e.target == modal){

        modal.style.display = 'none';
    }
}


