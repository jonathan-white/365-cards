const imageBaseUrl = "https://storage.googleapis.com/portfolio-f2dfc.appspot.com/cards/";
let selected_image;

let cards = [];

// Fetch cards from database
fetch('/api/cards/view')
    .then(response => response.json())
    .then(data => {
        cards = data;
        displayCards(data);
    });

// Generate and display all of the cards.
const displayCards = (listOfCards) => {
    for (let i = 0; i < listOfCards.length; i++) {
        let imageEl = document.createElement("img");
        let divEl = document.createElement("div");
        
        imageEl.setAttribute('src', imageBaseUrl + listOfCards[i].image);
        imageEl.setAttribute('title', listOfCards[i].title);
        imageEl.setAttribute('alt', listOfCards[i].title);
        imageEl.setAttribute('data-card', listOfCards[i].sequence);
        imageEl.addEventListener('click', function(event) {
            let targetEl = event.target;
            selected_image = parseInt(targetEl.getAttribute('data-card')) - 1;
    
            refreshImagePureJS(selected_image);
    
            document.getElementsByClassName('overlay')[0].classList.add('active');
        });
    
        divEl.classList.add("col-sm","card-drawing");
        divEl.setAttribute('data-cardfor', listOfCards[i].sequence);
        divEl.appendChild(imageEl);
        document.querySelector('.images-container').appendChild(divEl);
    }
}

// Add onClick event listener to close the overlay when the close button is clicked
document.getElementById('close-overlay').addEventListener('click', function(){
    document.getElementsByClassName('overlay')[0].classList.remove('active');
});

// Add onClick event listener to close the overlay when the background is clicked
document.getElementsByClassName('click-background-to-close')[0].addEventListener('click', function(){
    document.getElementsByClassName('overlay')[0].classList.remove('active');
});

// Add onClick event listener to navigate to the previous image when the previous button is clicked
document.getElementsByClassName('nav-button prev')[0].addEventListener('click', function(){
    if (selected_image > 0) {
        selected_image--;
    } else {
        selected_image = cards.length - 1;
    }
    refreshImagePureJS(selected_image);
});

// Add onClick event listener to navigate to the next image when the next button is clicked
document.getElementsByClassName('nav-button next')[0].addEventListener('click', function(){
    if (selected_image < cards.length - 1) {
        selected_image++;
    } else {
        selected_image = 0;
    }
    refreshImagePureJS(selected_image);
});

// Change the selected Image's details
const refreshImagePureJS = (selectedImage) => {
    document.getElementsByClassName('selected-image')[0].setAttribute('src', imageBaseUrl + cards[selectedImage].image);  
    document.getElementsByClassName('description-title')[0].textContent = cards[selectedImage].title;
    document.getElementsByClassName('description-text')[0].innerHTML = cards[selectedImage].description;
    document.getElementsByClassName('description-date')[0].textContent = moment(cards[selectedImage].posted).format("dddd, MMMM Do YYYY");
};

//Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};