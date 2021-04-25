const header = document.querySelector('.header');
const searchBar = document.querySelector('.search-bar');
const searchBox = document.querySelector('#search');
const selectedCardImage = document.getElementById('selected-image');  
const selectedCardTitle = document.getElementsByClassName('description-title')[0];
const selectedCardText = document.getElementsByClassName('description-text')[0];
const selectedCardDate = document.getElementsByClassName('description-date')[0];

function CardManager(){
  this._imageBaseUrl = "https://storage.googleapis.com/portfolio-f2dfc.appspot.com/cards/";
  this._imageCDNBaseUrl = "https://tineropo.sirv.com/365cards/";
  this._sticky = searchBox ? header.offsetHeight - (searchBox.offsetHeight / 2) : window.pageYOffset+1;
  this._selectedImage = null;
  this._allCards = [];
  this._displayedCards = [];
  this._cardsIdList = [];
  this._fetchMoreCards = true;
  this._timeout = null;
}

const manager = new CardManager();

// ======= Functions =======

CardManager.prototype.clearDisplayedcards = () => {
  const listContainer = document.getElementById('img-container');
  while (listContainer.firstChild) {
    listContainer.removeChild(listContainer.lastChild);
  }
}

// Generate and display all of the cards.
CardManager.prototype.displayCards = (listOfCards) => {
  for (let i = 0; i < listOfCards.length; i++) {
    let imageEl = document.createElement("img");
    let divEl = document.createElement("div");
    
    imageEl.classList.add('Sirv');
    // imageEl.setAttribute('src', manager._imageBaseUrl + listOfCards[i].image);
    imageEl.setAttribute('title', listOfCards[i].title);
    imageEl.setAttribute('alt', listOfCards[i].title);
    imageEl.setAttribute('data-card', listOfCards[i].sequence);
    imageEl.setAttribute('data-src', manager._imageCDNBaseUrl + listOfCards[i].image);
    imageEl.addEventListener('click', function(event) {
      let targetEl = event.target;
      manager._selectedImage = manager._cardsIdList.indexOf(targetEl.getAttribute('data-card'));
      
      manager.refreshCardImage(manager._selectedImage);

      document.getElementsByClassName('overlay')[0].classList.add('active');
    });

    divEl.classList.add("col-sm","card-drawing");
    divEl.setAttribute('id', listOfCards[i]._id);
    divEl.setAttribute('data-cardfor', listOfCards[i].sequence);
    divEl.appendChild(imageEl);
    document.querySelector('.images-container').appendChild(divEl);
  }
}

// Change the selected Image's details
CardManager.prototype.refreshCardImage = (selectedImage) => {
  selectedCardImage.classList.add('Sirv');
  // selectedCardImage.setAttribute('src', manager._imageBaseUrl + manager._allCards[selectedImage].image); 
  selectedCardImage.setAttribute('src', manager._imageCDNBaseUrl + manager._allCards[selectedImage].image);
  selectedCardImage.setAttribute('data-src', manager._imageCDNBaseUrl + manager._allCards[selectedImage].image); 
  selectedCardTitle.textContent = manager._allCards[selectedImage].title;
  selectedCardText.innerHTML = manager._allCards[selectedImage].description;
  selectedCardDate.textContent = moment(manager._allCards[selectedImage].posted).format("dddd, MMMM Do YYYY");
};

CardManager.prototype.lazyLoader = (parentId) => {
  // Find the last card in the image container
  let lastCard = document.getElementById(parentId).lastChild;
  
  // Find the bottom Y position of the viewport.
  let viewportPositionBottom = window.scrollY + window.innerHeight;

  // Find the bottom Y position of the last card.
  let lastCardPositionBottom = lastCard.offsetTop + lastCard.offsetHeight;

  // If the viewport see's the bottom of last card, fetch more cards. 
  if(viewportPositionBottom > lastCardPositionBottom - 300 && manager._fetchMoreCards) {
    fetch('/api/cards/next')
    .then(response => response.json())
    .then(data => {
      //Discontinue fetching cards if no additional results are returned
      if(data.length == 0) {
        manager._fetchMoreCards = false;
      }
      manager.displayCards(data);

      //add new cards to the displayedCards array
      manager._displayedCards =  manager._displayedCards.concat(data);
    });
  }
}

// ======= Initial API Calls =======

// Fetch all cards from database
fetch('/api/cards/all')
  .then(response => response.json())
  .then(data => {
    manager._allCards = data;
    manager._cardsIdList = data.map(c => c.sequence);
  });

// Fetch the initial batch of cards
fetch('/api/cards/start')
  .then(response => response.json())
  .then(data => {
    manager.displayCards(data);
    manager.lazyLoader('img-container');

    //add new cards to the displayedCards array
    manager._displayedCards = manager._displayedCards.concat(data);
  });

// ======= Event Listeners =======

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
  if (manager._selectedImage > 0) {
    manager._selectedImage--;
  } else {
    manager._selectedImage = manager._allCards.length - 1;
  }
  manager.refreshCardImage(manager._selectedImage);
});

// Add onClick event listener to navigate to the next image when the next button is clicked
document.getElementsByClassName('nav-button next')[0].addEventListener('click', function(){
  if (manager._selectedImage < manager._allCards.length - 1) {
    manager._selectedImage++;
  } else {
    manager._selectedImage = 0;
  }
  manager.refreshCardImage(manager._selectedImage);
});

// Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};

// Filter cards that are displayed based on the Search query 
document.querySelector('#search').addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();

  // Don't fetch additional cards while scrolling through search results
  manager._fetchMoreCards = false;

  if(query == "") {
    manager.clearDisplayedcards();
    manager.displayCards(manager._displayedCards);
    manager._fetchMoreCards = true;
    return;
  }

  if( manager._timeout) {
    clearTimeout(manager._timeout);
  }

  manager._timeout = setTimeout(function() {
    // Return cards that match a title, description or sequence #
    fetch(`/api/cards/search?q=${query}`)
      .then(response => response.json())
      .then(searchResults => {
        manager.clearDisplayedcards();
        manager.displayCards(searchResults);
      });
  }, 500);
});

window.onscroll = function() {
  
  // Apply the sticky class to the search bar.
  if (window.pageYOffset > manager._sticky) {
    searchBar.classList.add('sticky');
  } else {
    searchBar.classList.remove('sticky');
  }

  // Only load images the user wants to see
  manager.lazyLoader('img-container');
}