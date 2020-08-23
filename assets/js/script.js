const cards = [
    {
        "_id":"001",
        "title":"Sunflower",
        "image":"card_001.jpg",
        "description":"I’m going to be trying something a little new. I’m counting on you all and Because I Said I Would to hold me accountable for this promise. Every day, for the next year, I promise to make a card for Cards for Hospitalized Kids. Be sure to check out these two wonderful non-profits! Here’s Card No. 1",
        "slogan":"Stay Strong!",
        "posted":"2020-08-13T17:55:00-00:00"
    },
    {
        "_id":"002",
        "title":"Dinosaurs!",
        "image":"card_002.jpg",
        "description":"Card No. 2...A WAY better use for my commute time. Have a great weekend everyone!",
        "slogan":"Stay Strong",
        "posted":"2020-08-14T07:51:00-00:00"
    },
    {
        "_id":"003",
        "title":"Unicorn",
        "image":"card_003.jpg",
        "description":"Card No. 3 is inspired by my niece, Adele, who is celebrating her birthday today. Love you, honey!",
        "slogan":"Stay Strong!",
        "posted":"2020-08-15T08:15:00-00:00"
    },
    {
        "_id":"004",
        "title":"Hearts",
        "image":"card_004.jpg",
        "description":"Card No. 4. If you’re interested in making a card for this program as well, you can learn more at <a href='http://www.cardsforhospitalizedkids.com/' target='_blank'>http://www.cardsforhospitalizedkids.com/</a>",
        "slogan":"Stay Strong!",
        "posted":"2020-08-16T08:53:00-00:00"
    },
    {
        "_id":"005",
        "title":"Pandas!",
        "image":"card_005.jpg",
        "description":"Card No. 5! Check out “because I said I would” - it is a great organization that helps motivate others to make positive changes within themselves and for their community. <a href='https://becauseisaidiwould.org/' target='_blank'>https://becauseisaidiwould.org/</a>",
        "slogan":"Stay Strong!",
        "posted":"2020-08-17T07:40:00-00:00"
    },
    {
        "_id":"006",
        "title":"Stay Strong!",
        "image":"card_006.jpg",
        "description":"Card No. 6!",
        "slogan":"Stay Strong!",
        "posted":"2020-08-18T07:47:00-00:00"
    },
    {
        "_id":"007",
        "title":"Dancing for The Kids",
        "image":"card_007.jpg",
        "description":"Card No. 7! Today’s creation is inspired by Genevieve Bohnak, a generous, wonderful young lady I got to know through the Junior League of Akron. I had the pleasure of seeing her kindness and leadership first-hand while she was VP of Fund Development. When Genevieve is not being a JLA boss, she’s Walk(ing) to End Alzheimer’s or Dancing for The Kids to support Akron Children’s Hospital. Thanks, Genevieve, for all that you do!",
        "slogan":"Stay Strong",
        "posted":"2020-08-19T07:07:00-00:00"
    },
    {
        "_id":"008",
        "title":"Furry Friends",
        "image":"card_008.jpg",
        "description":"Card No. 8! To honor our little furry friends who loves us unconditionally.",
        "slogan":"Stay Strong",
        "posted":"2020-08-20T07:25:00-00:00"
    },
    {
        "_id":"009",
        "title":"Summer Days",
        "image":"card_009.jpg",
        "description":"Card No. 9! TGIF!!",
        "slogan":"Stay Strong",
        "posted":"2020-08-21T07:30:00-00:00"
    },
    {
        "_id":"010",
        "title":"Birch",
        "image":"card_010.jpg",
        "description":"Card No. 10. Bonus points to anyone who knows what kind of trees those are (or at the very least, what kind of trees I was going for lol).",
        "slogan":"Be Brave",
        "posted":"2020-08-22T09:22:00-00:00"
    },
];

const imageBaseUrl = "https://storage.googleapis.com/portfolio-f2dfc.appspot.com/cards/";
let selected_image;

// Generate and display all of the cards.
for (let i = 0; i < cards.length; i++) {
    let imageEl = document.createElement("img");
    let divEl = document.createElement("div");
    
    imageEl.setAttribute('src', imageBaseUrl + cards[i].image);
    imageEl.setAttribute('title', cards[i].title);
    imageEl.setAttribute('alt', cards[i].title);
    imageEl.setAttribute('data-card', cards[i]._id);

    divEl.classList.add("col-sm","card-drawing");
    divEl.setAttribute('data-cardfor', cards[i]._id);
    divEl.appendChild(imageEl);
    document.querySelector('.images-container').appendChild(divEl);
}

// After clicking an image, focus on the image
$(".card-drawing img").on("click", function(event) {
    selected_image = parseInt($(this).data('card')) - 1;

    refreshImage(selected_image);

    $('.overlay').addClass('active');
});

// setup Close events for the overlay and image popups
$('#close-overlay').on("click", function(event) {
    $('.overlay').removeClass('active');
});

$('.click-background-to-close').on('click', function(event) {
    $('.overlay').removeClass('active');
})

// Cycle to the previous card's details
$('.nav-button.prev').on("click", function(event) {
    if (selected_image > 0) {
        selected_image--;
    } else {
        selected_image = cards.length - 1;
    }
    refreshImage(selected_image);
});

// Cycle to the next card's details
$('.nav-button.next').on("click", function(event) {
    if (selected_image < cards.length - 1) {
        selected_image++;
    } else {
        selected_image = 0;
    }
    refreshImage(selected_image);
});

// Change the selected Image's details
const refreshImage = function (selectedImage) {
    $('.selected-image').attr('src', imageBaseUrl + cards[selectedImage].image);
    $('.description-title').text(cards[selectedImage].title); 
    $('.description-text').html(cards[selectedImage].description);
    $('.description-date').text(moment(cards[selectedImage].posted).format("dddd, MMMM Do YYYY")); 
};

//Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};