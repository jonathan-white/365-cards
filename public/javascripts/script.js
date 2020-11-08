const imageBaseUrl = "https://storage.googleapis.com/portfolio-f2dfc.appspot.com/cards/";

const body = document.body;
const html = document.documentElement;
let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, 
  html.scrollHeight, html.offsetHeight);

let percentOfPageViewed;

let selected_image;

let allCards = [];
let displayedCards = [];
let tempCards = [];
let cards = [];
let cardsIdList = [];
let searchResults = [];

let fetchMoreCards = true;

//Check the maximum page height
const calculateHeight = () => {
  height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, 
    html.scrollHeight, html.offsetHeight);
}

// Fetch cards from database
fetch('/api/cards/start')
    .then(response => response.json())
    .then(data => {
        tempCards = data;
        cardsIdList = data.map(c => c.sequence);
        displayCards(data);
    });

// Fetch cards from database
fetch('/api/cards/all')
    .then(response => response.json())
    .then(data => {
        allCards = data;
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
            selected_image = cardsIdList.indexOf(targetEl.getAttribute('data-card'));
    
            refreshImagePureJS(selected_image);
    
            document.getElementsByClassName('overlay')[0].classList.add('active');
        });
    
        divEl.classList.add("col-sm","card-drawing");
        divEl.setAttribute('id', listOfCards[i]._id);
        divEl.setAttribute('data-cardfor', listOfCards[i].sequence);
        divEl.appendChild(imageEl);
        document.querySelector('.images-container').appendChild(divEl);
    }

    //add new cards to the displayedCards array
    displayedCards = displayedCards.concat(listOfCards);

    //Obtain the new page height
    calculateHeight();
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
        selected_image = displayedCards.length - 1;
    }
    refreshImagePureJS(selected_image);
});

// Add onClick event listener to navigate to the next image when the next button is clicked
document.getElementsByClassName('nav-button next')[0].addEventListener('click', function(){
    if (selected_image < displayedCards.length - 1) {
        selected_image++;
    } else {
        selected_image = 0;
    }
    refreshImagePureJS(selected_image);
});

// Change the selected Image's details
const refreshImagePureJS = (selected_image) => {
    document.getElementsByClassName('selected-image')[0].setAttribute('src', imageBaseUrl + displayedCards[selected_image].image);  
    document.getElementsByClassName('description-title')[0].textContent = displayedCards[selected_image].title;
    document.getElementsByClassName('description-text')[0].innerHTML = displayedCards[selected_image].description;
    document.getElementsByClassName('description-date')[0].textContent = moment(displayedCards[selected_image].posted).format("dddd, MMMM Do YYYY");
};

// Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};

// Filter cards that are displayed based on the Search query 
document.querySelector('#search').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    let resultsIds = [];

    // filter results based on the title or description of a card
    searchResults = allCards.filter(c => c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) || 
        c.sequence.includes(query));

    // Add the IDs for the matched cards to a resultsId array
    for (let i = 0; i < searchResults.length; i++) {
        resultsIds.push(searchResults[i]._id);
    }

    //TODO: change from displayedCards to Allcards; move search logic to the server 
    //Loop through search results and apply or remove the 'hide' class
    for (let i = 0; i < displayedCards.length; i++) {
        if (resultsIds.includes(displayedCards[i]._id)) {
            document.getElementById(displayedCards[i]._id).classList.remove('hide');
        } else {
            document.getElementById(displayedCards[i]._id).classList.add('hide');
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


    // Method #1: Lazy Load based on scroll height
    // Calculate how much of the page has been viewed.
    percentOfPageViewed = (window.scrollY / (height - window.visualViewport.height) * 100).toFixed(1);
    // console.log(`Cards Displayed: ${displayedCards.length}; Page Scrolled: ${percentOfPageViewed}%`);

    // if (percentOfPageViewed > 60) {
    //   fetch('/api/cards/next')
    //     .then(response => response.json())
    //     .then(data => {
    //         cards = data;
    //         cardsIdList = data.map(c => c.sequence);
    //         displayCards(data);
    //     });
    // }

    // Method #2: Lazy Load based on if the bottom of the last card is visible
    //temp1 = last card
    //temp1.offsetTop + temp1.offsetHeight = position of the bottom of the card
    //window.scrollY + window.visualViewport.height = position of the bottom of the viewport
    //once the viewport's bottom position is greater than the position of the bottom of the card; fetch more images
    lastCard = document.getElementById('img-container').lastChild;
    
    let viewportPositionBottom = window.scrollY + window.visualViewport.height;
    let lastCardPositionBottom = lastCard.offsetTop + lastCard.offsetHeight;

    if(viewportPositionBottom > lastCardPositionBottom && fetchMoreCards) {
      fetch('/api/cards/next')
      .then(response => response.json())
      .then(data => {
        if(data.length == 0) {
          fetchMoreCards = false;
        }
        cards = data;
        cardsIdList = data.map(c => c.sequence);
        displayCards(data);
      });
    }


    //viewport: window.visualViewport.height = 725
}

document.getElementById('load-images').addEventListener('click', function(){
// Fetch cards from database after the load-images button has been clicked.
    fetch('/api/cards/next')
        .then(response => response.json())
        .then(data => {
            cards = data;
            cardsIdList = data.map(c => c.sequence);
            displayCards(data);
        });
});