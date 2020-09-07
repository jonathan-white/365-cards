const imageBaseUrl = "https://storage.googleapis.com/portfolio-f2dfc.appspot.com/cards/";
const html = document.documentElement;
let selected_image;

let cards = [];
let searchResults = [];

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
        divEl.setAttribute('id', listOfCards[i]._id);
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

// Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};

// Filter cards that are displayed based on the Search query 
document.querySelector('#search').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    let resultsIds = [];

    // filter results based on the title or description of a card
    searchResults = cards.filter(c => c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) || 
        c.sequence.includes(query));

    // Add the IDs for the matched cards to a resultsId array
    for (let i = 0; i < searchResults.length; i++) {
        resultsIds.push(searchResults[i]._id);
    }

    //Loop through search results and apply or remove the 'hide' class
    for (let i = 0; i < cards.length; i++) {
        if (resultsIds.includes(cards[i]._id)) {
            document.getElementById(cards[i]._id).classList.remove('hide');
        } else {
            document.getElementById(cards[i]._id).classList.add('hide');
        }
    }

    const footer = document.querySelector('footer');

    if (html.clientHeight == html.scrollHeight) {
        footer.style.position = 'fixed';
    } else {
        footer.style.position = 'relative';
    }
});

var header = document.querySelector('.header');
var searchBar = document.querySelector('.search-bar');
var searchBox = document.querySelector('#search');
var sticky = header.offsetHeight - (searchBox.offsetHeight / 2);

// Apply the sticky class to the search bar.
window.onscroll = function() {
    if (window.pageYOffset > sticky) {
        searchBar.classList.add('sticky');
    } else {
        searchBar.classList.remove('sticky');
    }
}