const form = document.querySelector("#watchlist-form");
const titleInput = document.querySelector("#title");
const typeInput = document.querySelector("#type");
const list = document.querySelector("#watchlist");
const message = document.querySelector("#message");
const emptyMessage = document.querySelector("#empty-message");

// Use a project-specific key: other GitHub Pages apps can share browser storage.
const storageKey = "watchnext.watchlist.v1";
let items = [];
let storageReady = true;

try {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
        const savedItems = JSON.parse(saved);
        if (!Array.isArray(savedItems) || !savedItems.every(isValidItem)) {
            throw new Error("Invalid watchlist data");
        }
        // Lists from the first version do not have ratings yet.
        items = savedItems.map(item => ({ ...item, rating: item.rating ?? null }));
    }
} catch (error) {
    // Keep existing storage untouched if it cannot be read safely.
    storageReady = false;
    message.textContent = "Couldn't load your saved list. Changes will only last until you leave this page.";
}

function isValidItem(item) {
    return item !== null && typeof item === "object"
        && typeof item.title === "string" && item.title.trim().length > 0
        && item.title.length <= 255
        && ["movie", "series"].includes(item.type)
        && typeof item.watched === "boolean"
        && (item.rating == null || (Number.isInteger(item.rating)
            && item.rating >= 1 && item.rating <= 5));
}

function saveItems(successMessage) {
    if (storageReady) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(items));
            message.textContent = successMessage;
            return;
        } catch (error) {
            // The browser may block storage or run out of space.
        }
    }
    message.textContent = "Updated on this page, but couldn't save. These changes may be lost when you leave.";
}

function showItems() {
    list.replaceChildren();
    emptyMessage.hidden = items.length > 0;

    items.forEach((item, index) => {
        const row = document.createElement("li");
        const title = document.createElement("h3");
        // textContent displays titles as text, even when they contain HTML.
        title.textContent = item.title;
        row.append(title);

        const type = document.createElement("p");
        type.className = "item-type";
        type.textContent = item.type;
        row.append(type);

        const status = document.createElement("p");
        status.className = "watch-status";
        status.textContent = "Watched — what's next? lol";
        row.append(status);

        const watchButton = document.createElement("button");
        watchButton.type = "button";
        watchButton.className = "watch-action";

        function updateWatchButton() {
            status.hidden = !item.watched;
            watchButton.textContent = item.watched ? "Mark as unwatched" : "Mark as watched";
            watchButton.setAttribute("aria-label", watchButton.textContent + ": " + item.title);
        }

        watchButton.addEventListener("click", () => {
            item.watched = !item.watched;
            updateWatchButton();
            saveItems((item.watched ? "Watched: " : "Back on your watchlist: ") + item.title);
        });
        updateWatchButton();
        row.append(watchButton);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "watch-action";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + item.title);
        deleteButton.addEventListener("click", () => {
            items = items.filter(other => other !== item);
            saveItems("Removed: " + item.title);
            showItems();
            titleInput.focus();
        });
        row.append(deleteButton);

        row.append(createRatingForm(item, index));
        list.append(row);
    });
}

function createRatingForm(item, index) {
    const ratingForm = document.createElement("form");
    ratingForm.className = "watch-action";

    const fieldset = document.createElement("fieldset");
    fieldset.className = "rating-field";
    const legend = document.createElement("legend");
    legend.textContent = "Your rating";
    fieldset.append(legend);

    const stars = document.createElement("div");
    stars.className = "star-rating";

    // CSS reverses this order so the stars read from one to five on screen.
    for (let score = 5; score >= 1; score--) {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "rating";
        input.id = "rating-" + index + "-" + score;
        input.value = String(score);
        input.checked = item.rating === score;
        input.required = true;

        const label = document.createElement("label");
        label.htmlFor = input.id;
        const star = document.createElement("span");
        star.setAttribute("aria-hidden", "true");
        star.textContent = "★";
        const description = document.createElement("span");
        description.className = "visually-hidden";
        description.textContent = score + " out of 5 stars for " + item.title;
        label.append(star, description);
        stars.append(input, label);
    }

    fieldset.append(stars);
    const saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.textContent = "Save Rating";
    ratingForm.append(fieldset, saveButton);

    ratingForm.addEventListener("submit", event => {
        event.preventDefault();
        const rating = Number(new FormData(ratingForm).get("rating"));
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            message.textContent = "Choose a star rating first.";
            return;
        }
        item.rating = rating;
        saveItems("Saved " + rating + "/5 for " + item.title + ".");
    });

    return ratingForm;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = titleInput.value.trim();
    const type = typeInput.value;

    if (!title || title.length > 255) {
        message.textContent = "Enter a title between 1 and 255 characters.";
        titleInput.focus();
        return;
    }
    if (!["movie", "series"].includes(type)) {
        message.textContent = "Please choose a movie or series.";
        return;
    }

    items.unshift({ title, type, watched: false, rating: null });
    saveItems("Item added to watchlist!");
    showItems();
    form.reset();
    titleInput.focus();
});

showItems();
