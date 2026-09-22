/* =========================================
   POSTIT JAVASCRIPT
   Personal Caption Posting System

   Main functions:
   1. Save user information one time
   2. Allow caption-only posts
   3. Encrypt User Name + Post + Date
   4. Save posts in localStorage
   5. Display posts as a thread
========================================= */


/* =========================================
   STORAGE KEYS
========================================= */

// Storage name for the single user
const USER_STORAGE_KEY = "postit_user";

// Storage name for all posts
const POSTS_STORAGE_KEY = "postit_posts";

// Secret key used for AES encryption
const ENCRYPTION_KEY = "POSTIT_2026_SECRET_KEY";


/* =========================================
   GET HTML ELEMENTS
========================================= */

const userSection =
    document.getElementById("userSection");

const postSection =
    document.getElementById("postSection");

const userForm =
    document.getElementById("userForm");

const displayName =
    document.getElementById("displayName");

const captionInput =
    document.getElementById("caption");

const postButton =
    document.getElementById("postButton");

const postThread =
    document.getElementById("postThread");

const characterCount =
    document.getElementById("characterCount");


/* =========================================
   START APPLICATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // Check if the user has already entered information
        checkExistingUser();

        // Show initial character count
        updateCharacterCount();

        // Load previously saved posts
        loadPosts();

    }
);


/* =========================================
   CHECK EXISTING USER
========================================= */

function checkExistingUser() {

    // Get saved user from browser storage
    const savedUser =
        localStorage.getItem(USER_STORAGE_KEY);


    // If user information already exists
    if (savedUser) {

        try {

            const user =
                JSON.parse(savedUser);

            // Skip the information form
            showPostSection(user);

        } catch (error) {

            console.error(
                "Error reading saved user:",
                error
            );

            // Remove invalid information
            localStorage.removeItem(
                USER_STORAGE_KEY
            );

        }

    }

}


/* =========================================
   USER INFORMATION FORM
========================================= */

userForm.addEventListener(
    "submit",
    function (event) {

        // Prevent page refresh
        event.preventDefault();


        /* =====================================
           GET FORM VALUES
        ===================================== */

        const fullName =
            document
                .getElementById("fullName")
                .value
                .trim();


        const dateOfBirth =
            document
                .getElementById("dateOfBirth")
                .value;


        const yearLevel =
            document
                .getElementById("yearLevel")
                .value;


        const gender =
            document
                .getElementById("gender")
                .value;


        const username =
            document
                .getElementById("username")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        /* =====================================
           VALIDATE FORM
        ===================================== */

        if (
            fullName === "" ||
            dateOfBirth === "" ||
            yearLevel === "" ||
            gender === "" ||
            username === "" ||
            password === ""
        ) {

            alert(
                "Please complete all fields."
            );

            return;
        }


        /* =====================================
           PASSWORD VALIDATION
        ===================================== */

        if (password.length < 4) {

            alert(
                "Password must contain at least 4 characters."
            );

            return;
        }


        /* =====================================
           CREATE USER
        ===================================== */

        const user = {

            fullName: fullName,

            dateOfBirth: dateOfBirth,

            yearLevel: yearLevel,

            gender: gender,

            username: username,

            /*
             * SHA-256 is used so the password
             * is not stored as plain text.
             */
            passwordHash:
                CryptoJS
                    .SHA256(password)
                    .toString()

        };


        /* =====================================
           SAVE USER
        ===================================== */

        localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(user)
        );


        /* =====================================
           SHOW POSTING AREA
        ===================================== */

        showPostSection(user);

    }
);


/* =========================================
   SHOW POSTING SECTION
========================================= */

function showPostSection(user) {

    // Hide information form
    userSection.classList.add("hidden");

    // Show posting section
    postSection.classList.remove("hidden");

    // Display user's name
    displayName.textContent =
        user.fullName;

}


/* =========================================
   CHARACTER COUNTER
========================================= */

captionInput.addEventListener(
    "input",
    updateCharacterCount
);


function updateCharacterCount() {

    // Get number of characters
    const length =
        captionInput.value.length;

    // Display character count
    characterCount.textContent =
        length + " / 500";

}


/* =========================================
   POST BUTTON
========================================= */

postButton.addEventListener(
    "click",
    createPost
);


/* =========================================
   CREATE POST
========================================= */

function createPost() {

    /* =====================================
       GET CAPTION
    ===================================== */

    const caption =
        captionInput.value.trim();


    /* =====================================
       CHECK EMPTY CAPTION
    ===================================== */

    if (caption === "") {

        alert(
            "Please write a caption before posting."
        );

        captionInput.focus();

        return;
    }


    /* =====================================
       GET USER
    ===================================== */

    const savedUser =
        localStorage.getItem(
            USER_STORAGE_KEY
        );


    if (!savedUser) {

        alert(
            "Please enter your information first."
        );

        return;
    }


    let user;


    try {

        user =
            JSON.parse(savedUser);

    } catch (error) {

        console.error(
            "Error reading user:",
            error
        );

        alert(
            "Unable to read user information."
        );

        return;
    }


    /* =====================================
       GET CURRENT DATE AND TIME
    ===================================== */

    const currentDate =
        new Date();


    const formattedDate =
        currentDate.toLocaleString();


    /* =====================================
       DATA TO ENCRYPT

       Required format:

       Stringified USER NAME
       +
       POST
       +
       DATE
    ===================================== */

    const dataToEncrypt =
        JSON.stringify(user.fullName)
        + caption
        + formattedDate;


    /* =====================================
       AES ENCRYPTION
    ===================================== */

    const encryptedValue =
        CryptoJS.AES.encrypt(
            dataToEncrypt,
            ENCRYPTION_KEY
        ).toString();


    /* =====================================
       CREATE POST OBJECT
    ===================================== */

    const newPost = {

        id: Date.now(),

        userName: user.fullName,

        caption: caption,

        date: formattedDate,

        encryptedValue: encryptedValue

    };


    /* =====================================
       GET PREVIOUS POSTS
    ===================================== */

    let posts = [];

    const savedPosts =
        localStorage.getItem(
            POSTS_STORAGE_KEY
        );


    if (savedPosts) {

        try {

            posts =
                JSON.parse(savedPosts);


            // Make sure posts is an array
            if (!Array.isArray(posts)) {

                posts = [];

            }

        } catch (error) {

            console.error(
                "Error loading posts:",
                error
            );

            posts = [];

        }

    }


    /* =====================================
       ADD NEW POST
    ===================================== */

    posts.push(newPost);


    /* =====================================
       SAVE POSTS
    ===================================== */

    localStorage.setItem(
        POSTS_STORAGE_KEY,
        JSON.stringify(posts)
    );


    /* =====================================
       CLEAR CAPTION
    ===================================== */

    captionInput.value = "";


    // Reset character counter
    updateCharacterCount();


    /* =====================================
       DISPLAY UPDATED THREAD
    ===================================== */

    displayPosts(posts);

}


/* =========================================
   LOAD SAVED POSTS
========================================= */

function loadPosts() {

    const savedPosts =
        localStorage.getItem(
            POSTS_STORAGE_KEY
        );


    // No saved posts
    if (!savedPosts) {

        displayPosts([]);

        return;
    }


    try {

        const posts =
            JSON.parse(savedPosts);


        if (Array.isArray(posts)) {

            displayPosts(posts);

        } else {

            displayPosts([]);

        }

    } catch (error) {

        console.error(
            "Error loading posts:",
            error
        );

        displayPosts([]);

    }

}


/* =========================================
   DISPLAY POST THREAD
========================================= */

function displayPosts(posts) {

    // Clear the existing thread
    postThread.innerHTML = "";


    /* =====================================
       NO POSTS YET
    ===================================== */

    if (posts.length === 0) {

        const emptyMessage =
            document.createElement("div");


        emptyMessage.className =
            "empty-message";


        emptyMessage.textContent =
            "No posts yet. Create your first caption!";


        postThread.appendChild(
            emptyMessage
        );


        return;
    }


    /* =====================================
       NEWEST POST FIRST
    ===================================== */

    const reversedPosts =
        [...posts].reverse();


    /* =====================================
       CREATE EACH POST
    ===================================== */

    reversedPosts.forEach(
        function (post) {

            /* =================================
               POST CARD
            ================================= */

            const postCard =
                document.createElement("div");


            postCard.className =
                "post-card";


            /* =================================
               POST HEADER
            ================================= */

            const postHeader =
                document.createElement("div");


            postHeader.className =
                "post-header";


            /* ORIGINAL POST LABEL */

            const label =
                document.createElement("span");


            label.className =
                "post-label";


            label.textContent =
                "ORIGINAL POST";


            /* DATE */

            const date =
                document.createElement("span");


            date.className =
                "post-date";


            date.textContent =
                post.date;


            /* Add header elements */

            postHeader.appendChild(
                label
            );


            postHeader.appendChild(
                date
            );


            /* =================================
               ORIGINAL POST
            ================================= */

            const originalPost =
                document.createElement("div");


            originalPost.className =
                "original-post";


            /* Caption title */

            const originalTitle =
                document.createElement("div");


            originalTitle.className =
                "original-post-title";


            originalTitle.textContent =
                "Original Caption";


            /* Caption */

            const originalCaption =
                document.createElement("div");


            originalCaption.className =
                "original-caption";


            /*
             * textContent prevents the caption
             * from being interpreted as HTML.
             */
            originalCaption.textContent =
                post.caption;


            /* Add caption elements */

            originalPost.appendChild(
                originalTitle
            );


            originalPost.appendChild(
                originalCaption
            );


            /* =================================
               ENCRYPTED VALUE
            ================================= */

            const encryptedSection =
                document.createElement("div");


            encryptedSection.className =
                "encrypted-section";


            /* Encrypted label */

            const encryptedTitle =
                document.createElement("div");


            encryptedTitle.className =
                "encrypted-title";


            encryptedTitle.textContent =
                "ENCRYPTED VALUE";


            /* Encrypted value */

            const encryptedValue =
                document.createElement("div");


            encryptedValue.className =
                "encrypted-value";


            encryptedValue.textContent =
                post.encryptedValue;


            /* Add encrypted elements */

            encryptedSection.appendChild(
                encryptedTitle
            );


            encryptedSection.appendChild(
                encryptedValue
            );


            /* =================================
               ADD EVERYTHING TO POST CARD
            ================================= */

            postCard.appendChild(
                postHeader
            );


            postCard.appendChild(
                originalPost
            );


            postCard.appendChild(
                encryptedSection
            );


            /* Add post card to thread */

            postThread.appendChild(
                postCard
            );

        }
    );

}


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

// Ctrl + Enter can also create a post
captionInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.ctrlKey &&
            event.key === "Enter"
        ) {

            createPost();

        }

    }
);

