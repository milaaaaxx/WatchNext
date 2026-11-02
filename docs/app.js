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
        items = savedItems;
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
        && typeof item.watched === "boolean";
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

    for (const item of items) {
        const row = document.createElement("li");
        const title = document.createElement("span");
        // textContent displays titles as text, even when they contain HTML.
        title.textContent = item.title + " — " + item.type;
        row.append(title);

        if (item.watched) {
            const status = document.createElement("p");
            status.className = "watch-status";
            status.textContent = "Watched — what's next?";
            row.append(status);
        } else {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "watch-action";
            button.textContent = "Mark as watched";
            button.setAttribute("aria-label", "Mark " + item.title + " as watched");
            button.addEventListener("click", () => {
                item.watched = true;
                saveItems("Marked as watched: " + item.title);
                // Update this row without moving keyboard focus to the page body.
                const status = document.createElement("p");
                status.className = "watch-status";
                status.textContent = "Watched — what's next?";
                status.tabIndex = -1;
                button.replaceWith(status);
                status.focus();
            });
            row.append(button);
        }

        list.append(row);
    }
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

    items.unshift({ title, type, watched: false });
    saveItems("Item added to watchlist!");
    showItems();
    form.reset();
    titleInput.focus();
});

showItems();
