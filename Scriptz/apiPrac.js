let linkUrl = 'https://jsonplaceholder.typicode.com/posts';
let data = fetch(linkUrl);
data.then((items)=>{
    // console.log(items);
return items.json();
})
.then((item)=>{
   const cardzDiv = document.getElementById('card-holder');
   console.log(item);
   item.forEach((item) => {
    cardzDiv.innerHTML += `<div class="card font-sans text-sm justify-evenly bg-red-200  h-[300px] rounded-lg flex flex-col border-blue-900 border-2 shadow-2xl shadow-blue-600 mx-4 my-4 w-48 p-1">
    <!-- image used in the card -->
    <img class = "h-[40%]"src="/img/playstation_5.png" alt="ps_picture">
    
    <div class="h-[20%] description w-[100%] mx-auto my-4 text-justify">
    ${item.title}
    </div>
    
    <div class = "h-[20%] mx-auto mb-1 " ><strong>I${item.id}</strong></div>
    <!-- button -->
    <div class=" h-[20%] cursor-pointer w-[98%] bg-blue-800 mx-auto text-white  font-bold text-center p-3 rounded-lg"><a class="hover:text-green-500 " href="${item.id}" >Click here</a></div>
    
    
    </div>`;  
    
   });

console.log(item);
})
