const cards = [
    {
        "_id":"001",
        "title":"Card 001",
        "image":"card_001.jpg",
        "description":"I’m going to be trying something a little new. I’m counting on you all and Because I Said I Would to hold me accountable for this promise. Every day, for the next year, I promise to make a card for Cards for Hospitalized Kids. Be sure to check out these two wonderful non-profits! Here’s Card No. 1",
        "slogan":"Stay Strong!"
    },
    {
        "_id":"002",
        "title":"Card 002",
        "image":"card_002.jpg",
        "description":"Card No. 2...A WAY better use for my commute time. Have a great weekend everyone!",
        "slogan":"Stay Strong"
    },
    {
        "_id":"003",
        "title":"Card 003",
        "image":"card_003.jpg",
        "description":"Card No. 3 is inspired by my niece, Adele, who is celebrating her birthday today. Love you, honey!",
        "slogan":"Stay Strong!"
    },
    {
        "_id":"004",
        "title":"Card 004",
        "image":"card_004.jpg",
        "description":"Card No. 4. If you’re interested in making a card for this program as well, you can learn more at http://www.cardsforhospitalizedkids.com/",
        "slogan":"Stay Strong!"
    },
    {
        "_id":"005",
        "title":"Card 005",
        "image":"card_005.jpg",
        "description":"Card No. 5! Check out “because I said I would” - it is a great organization that helps motivate others to make positive changes within themselves and for their community. https://becauseisaidiwould.org/",
        "slogan":"Stay Strong!"
    },
    {
        "_id":"006",
        "title":"Card 006",
        "image":"card_006.jpg",
        "description":"Card No. 6!",
        "slogan":"Stay Strong!"
    },
    {
        "_id":"007",
        "title":"Card 007",
        "image":"card_007.jpg",
        "description":"Card No. 7! Today’s creation is inspired by Genevieve Bohnak, a generous, wonderful young lady I got to know through the Junior League of Akron. I had the pleasure of seeing her kindness and leadership first-hand while she was VP of Fund Development. When Genevieve is not being a JLA boss, she’s Walk(ing) to End Alzheimer’s or Dancing for The Kids to support Akron Children’s Hospital. Thanks, Genevieve, for all that you do!",
        "slogan":"Stay Strong"
    },
    {
        "_id":"008",
        "title":"Card 008",
        "image":"card_008.jpg",
        "description":"Card No. 8! To honor our little furry friends who loves us unconditionally.",
        "slogan":"Stay Strong"
    },
    {
        "_id":"009",
        "title":"Card 009",
        "image":"card_009.jpg",
        "description":"Card No. 9! TGIF!!",
        "slogan":"Stay Strong"
    },
    {
        "_id":"010",
        "title":"Card 010",
        "image":"card_010.jpg",
        "description":"Card No. 10. Bonus points to anyone who knows what kind of trees those are (or at the very least, what kind of trees I was going for lol)",
        "slogan":"Be Brave"
    },
];

// Generate and display all of the cards.
for (let i = 0; i < cards.length; i++) {
    var imageEl = document.createElement("img");
    var divEl = document.createElement("div");
    
    imageEl.setAttribute('src', 'assets/images/' + cards[i].image);
    imageEl.setAttribute('title', cards[i].title);
    imageEl.setAttribute('alt', cards[i].title);
    imageEl.setAttribute('data-card', cards[i]._id);

    divEl.classList.add("col-sm","card-drawing");
    divEl.setAttribute('data-cardid', cards[i]._id);
    divEl.appendChild(imageEl);
    document.querySelector('.images-container').appendChild(divEl);
}

var selected_image;

// After clicking an image, focus on the image
$("img").on("click", function(event) {
    selected_image = parseInt($(this).data('card')) - 1;

    $('.selected-image').attr('src', 'assets/images/' + cards[selected_image].image);
    $('.description-text').text(cards[selected_image].description);

    $('.overlay').addClass('active');
});

// setup Close events for the overlay and image popups
$('#close-overlay').on("click", function(event) {
    $('.overlay').removeClass('active');
});

$('.click-background-to-close').on('click', function(event) {
    $('.overlay').removeClass('active');
})

$('.nav-button.prev').on("click", function(event) {
    if (selected_image > 0) {
        selected_image--;
    } else {
        selected_image = cards.length - 1;
    }
    $('.selected-image').attr('src', 'assets/images/' + cards[selected_image].image);
    $('.description-text').text(cards[selected_image].description);
    console.log(selected_image);
});

$('.nav-button.next').on("click", function(event) {
    if (selected_image < cards.length - 1) {
        selected_image++;
    } else {
        selected_image = 0;
    }
    $('.selected-image').attr('src', 'assets/images/' + cards[selected_image].image);
    $('.description-text').text(cards[selected_image].description);
    console.log(selected_image);
});

//Prevents the Because I said I would logo from being dragged
document.querySelector('.mission-logo').ondragstart = () => { return false};