// DELIVERABLES

//✅ Populate page with quotes with a GET request to http://localhost:3000/quotes?_embed=likes


//✅ Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page. Pessimistic rendering is recommended.

//✅ Clicking the delete button should delete the respective quote from the API and remove it from the page without having to refresh.

// Clicking the like button will create a like for this particular quote in the API and update the number of likes displayed on the page without having to refresh.
    //✅ Use a POST request to http://localhost:3000/likes
    //✅ The body of the request should be a JSON object containing a key of quoteId, with an integer value. Use the ID of the quote you're creating the like for — e.g. { quoteId: 5 } to create a like for quote 5.
    //✅ IMPORTANT: if the quoteID is a string for some reason (for example, if you've pulled the ID from a dataset) the index page will not include the like you create on any quote.
    //✅ Bonus (not required): add a createdAt key to your object to track when the like was created. Use UNIX time (Links to an external site.) (the number of seconds since January 1, 1970). The documentation (Links to an external site.) for the JS Date class may be helpful here!

// BONUS
    // Add an edit button to each quote-card that will allow the editing of a quote. (Hint: there is no 'correct' way to do this. You can try creating a hidden form that will only show up when hitting the edit button.)
    // Currently, the number of likes of each post does not persist on the frontend after we refresh, as we set the beginning value to 0. Include an additional fetch to always have an updated number of likes for each post. You will send a GET request to http://localhost:3000/likes?quoteId= and interpolate the id of a given post.
    // Add a sort button that can be toggled on or off. When off the list of quotes will appear sorted by the ID. When the sort is active, it will display the quotes by author's name, alphabetically.
        // One way of doing this is to sort the quotes in JS after you've retrieved them from the API. Try this way first.
        // Another way of doing this is to make a fetch to http://localhost:3000/quotes?_sort=author
        // What are the pros and cons in doing the sorting on the client vs. the server? Discuss with a partner.



// Assignments

const baseURL = `http://localhost:3000`;
const baseURLGetLikes = `http://localhost:3000/likes`;
const baseURLEmbedLikes = `http://localhost:3000/quotes?_embed=likes`;
const submitBtn = document.getElementsByClassName("btn btn-primary")[0];
const submitQuote = document.getElementById("new-quote");
const submitAuthor = document.getElementById("author");


// console.log()


// DOMContentLoaded beginning

document.addEventListener("DOMContentLoaded", () => {


// Fetches

function getAllQuotes() {
    return fetch(baseURLEmbedLikes)
    .then(resp => resp.json())
    .then(quotesArr => renderAllQuotes(quotesArr))
}

function sendNewQuote(quoteObj) {
    fetch(baseURL + `/quotes`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({quote: quoteObj.quote, author: quoteObj.author})
    }
)}

function deleteQuoteFromApi(quoteId) {
    fetch(baseURL + `/quotes/${quoteId}`, {
        method: "DELETE",
    })
    .then(getAllQuotes)
}

function addLikeToQuote(e) {
    const quoteId = e.target.parentNode.parentNode.id;
    fetch (baseURLGetLikes, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({quoteId: parseInt(quoteId), createdAt: Date.now()})
    })
    .then(resp => resp.json())

}


// Rendering

function renderAllQuotes (quotesArr) {
    quotesArr.forEach(renderOneQuote)
}

function renderOneQuote (quoteObj) {
    const quoteList = document.querySelector("#quote-list");
    const quoteCard = document.createElement("li");
    quoteCard.id = quoteObj.id;
    quoteCard.classList = "quote-card";
    
    const quoteBlockquote = document.createElement("blockquote");
    quoteBlockquote.classList = "blockquote";
    quoteBlockquote.innerHTML = `
        <p class="mb-0">${quoteObj.quote}</p>
        <footer class="blockquote-footer">${quoteObj.author}</footer>
        <br>
    `;

    const likeBtn = document.createElement("button");
    likeBtn.classList = "btn-success";
    likeBtn.innerHTML = `
        Likes: <span>${quoteObj.likes.length}</span>
    `;
    likeBtn.addEventListener('click', addLikeToQuote);
    quoteBlockquote.append(likeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList = "btn-danger";
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener('click', deleteQuote);
    quoteBlockquote.append(deleteBtn);

    quoteCard.append(quoteBlockquote);
    quoteList.append(quoteCard)
}


// Event Listeners

submitBtn.addEventListener('click', submitNewQuote)


// Event Handlers

function submitNewQuote (e) {
    e.preventDefault();
    const quoteSubmitObj = {
        "quote": submitQuote.value,
        "author": submitAuthor.value
    }
    renderOneQuote(quoteSubmitObj)
    sendNewQuote(quoteSubmitObj)
}

function deleteQuote(e) {
    e.target.parentNode.remove();
    deleteQuoteFromApi(e.target.parentNode.id)
}


// Initialize

getAllQuotes()


}) // end of domcontentloaded