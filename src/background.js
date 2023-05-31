function alphabeticallySortBookmarksFolder(bookmarkFolder) {
    if (bookmarkFolder.children.length === 0) {
        return;
    }
    let bookmarks = bookmarkFolder.children;
    let clonedBookmarks = bookmarks.map((e) => ({ ...e }));
    clonedBookmarks.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    if (JSON.stringify(clonedBookmarks) !== JSON.stringify(bookmarks)) {
        for (let i = 0; i < clonedBookmarks.length; i++) {
            if (clonedBookmarks[i].id !== bookmarks[i].id) {
                browser.bookmarks.move(clonedBookmarks[i].id, { index: parseInt(i) });
            }
            if (clonedBookmarks[i].type === "folder") {
                alphabeticallySortBookmarksFolder(clonedBookmarks[i]);
            }
        }
    }
}

function bookmarkEventListener() {
    let bookmarksTree = browser.bookmarks.getTree();
    bookmarksTree.then((bookmarks) => {
        let bookmarksFolders = bookmarks[0].children;
        for (let i = 0; i < bookmarksFolders.length; i++) {
            alphabeticallySortBookmarksFolder(bookmarksFolders[i]);
        }
    });
}

browser.bookmarks.onCreated.addListener(bookmarkEventListener);
browser.bookmarks.onChanged.addListener(bookmarkEventListener);
browser.bookmarks.onMoved.addListener(bookmarkEventListener);
