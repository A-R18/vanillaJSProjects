//Adding ratings for different manufacturers:
const ratings = {
    sony: 0.5,
    lg: 3.3,
    vizio: 1.3,
    panasonic: 1.0,
    phillips: 1.2
}
document.addEventListener('DOMContentLoaded', getRatings);

const inputElem = document.getElementById('rating-control');

const selectElem = document.getElementById('product-select');

selectElem.addEventListener('change', (e) => {
    product = e.target.value;
    // Enabling the rating field
    inputElem.disabled = false;
    inputElem.value = ratings[product];

});

//rating control change
inputElem.addEventListener('blur', (e) => {
    const rating = e.target.value;
    if (rating > 5) {
        alert('Please rate between 1 - 5');
        return;
    }
    ratings[product] = rating;
    
    getRatings();
});
const totalStars = 5;

function getRatings() {
    for (let rating in ratings) {
        const starsPercentage = (ratings[rating] / totalStars) * 100;
        console.log(starsPercentage);
        //Rounding to nearest 10s value:
        const starPercentageRoundedTo10s = `${Math.round(starsPercentage / 10) * 10}%`
        console.log(starPercentageRoundedTo10s);

        document.querySelector(`.${rating} .stars-inner`).style.width = starPercentageRoundedTo10s;
        document.querySelector(`.${rating} .number-rating`).innerHTML = ratings[rating];
    }

}
