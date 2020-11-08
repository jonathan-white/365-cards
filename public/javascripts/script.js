const imageBaseUrl = "https://storage.googleapis.com/portfolio-f2dfc.appspot.com/cards/";

const body = document.body;
const html = document.documentElement;
let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, 
  html.scrollHeight, html.offsetHeight);

let selected_image;

let allCards = [];
let displayedCards = [];
let cardsIdList = [];
let searchResults = [];

let fetchMoreCards = true;

// Fetch the initial batch of cards
const fetchInitialCards = () => {
  fetch('/api/cards/start')
    .then(response => response.json())
    .then(data => {
        displayCards(data);

        //add new cards to the displayedCards array
        displayedCards = displayedCards.concat(data);
    });
}

fetchInitialCards();

// Fetch all cards from database
fetch('/api/cards/all')
  .then(response => response.json())
  .then(data => {
    allCards = data;
    cardsIdList = data.map(c => c.sequence);
  });

//Check the maximum page height
const calculateHeight = () => {
  height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, 
    html.scrollHeight, html.offsetHeight);
}

const clearDisplayedcards = () => {
  const listContainer = document.getElementById('img-container');
  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.lastChild);
  }
}

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
      console.log(`selected_image index: ${selected_image} - Card ID: ${targetEl.getAttribute('data-card')}`);
      
      refreshCardImage(selected_image);

      document.getElementsByClassName('overlay')[0].classList.add('active');
    });

    divEl.classList.add("col-sm","card-drawing");
    divEl.setAttribute('id', listOfCards[i]._id);
    divEl.setAttribute('data-cardfor', listOfCards[i].sequence);
    divEl.appendChild(imageEl);
    document.querySelector('.images-container').appendChild(divEl);
  }

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
  refreshCardImage(selected_image);
});

// Add onClick event listener to navigate to the next image when the next button is clicked
document.getElementsByClassName('nav-button next')[0].addEventListener('click', function(){
  if (selected_image < allCards.length - 1) {
    selected_image++;
  } else {
    selected_image = 0;
  }
  refreshCardImage(selected_image);
});

// Change the selected Image's details
const refreshCardImage = (selected_image) => {
  document.getElementsByClassName('selected-image')[0].setAttribute('src', imageBaseUrl + allCards[selected_image].image);  
  document.getElementsByClassName('description-title')[0].textContent = allCards[selected_image].title;
  document.getElementsByClassName('description-text')[0].innerHTML = allCards[selected_image].description;
  document.getElementsByClassName('description-date')[0].textContent = moment(allCards[selected_image].posted).format("dddd, MMMM Do YYYY");
};

// Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};

// ==========================
// ===== START SEARCH =======
// ==========================
var timeout;

// Filter cards that are displayed based on the Search query 
document.querySelector('#search').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();
  let resultsIds = [];

  // Don't fetch additional cards while scrolling through search results
  fetchMoreCards = false;

  if(query == "") {
    clearDisplayedcards();
    displayCards(displayedCards);
    fetchMoreCards = true;
    return;
  }

  if(timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(function() {
    // Return cards that match a title, description or sequence #
    fetch(`/api/cards/search?q=${query}`)
      .then(response => response.json())
      .then(searchResults => {
        clearDisplayedcards();
        displayCards(searchResults);
      });
  }, 500);

  // const footer = document.querySelector('footer');

  // if (html.clientHeight == html.scrollHeight) {
  //   footer.style.position = 'fixed';
  // } else {
  //   footer.style.position = 'relative';
  // }
});

// ==========================
// ===== END SEARCH =======
// ==========================

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

  // == Lazy Loading ==
  
  // once the viewport's bottom position is greater than the position of the 
  // bottom of the last card; fetch more images

  // Find the last card in the image container
  let lastCard = document.getElementById('img-container').lastChild;
  
  // Find the bottom Y position of the viewport.
  let viewportPositionBottom = window.scrollY + window.innerHeight;

  // Find the bottom Y position of the last card.
  let lastCardPositionBottom = lastCard.offsetTop + lastCard.offsetHeight;

  // If the viewport see's the bottom of last card, fetch more cards. 
  if(viewportPositionBottom > lastCardPositionBottom && fetchMoreCards) {
    fetch('/api/cards/next')
    .then(response => response.json())
    .then(data => {
      //Discontinue fetching cards if no additional results are returned
      if(data.length == 0) {
        fetchMoreCards = false;
      }
      displayCards(data);

      //add new cards to the displayedCards array
      displayedCards = displayedCards.concat(data);
    });
  }
}