/* =========================================
   SURSA.JS
   RSA Signup Encryption and Decryption

   This program:
   1. Gets the signup information.
   2. Creates RSA 1024-bit keys.
   3. Encrypts the information using
      the 1024-bit public key.
   4. Decrypts the information using
      the 1024-bit private key.
   5. Creates RSA 3072-bit keys.
   6. Encrypts the information using
      the 3072-bit public key.
   7. Decrypts the information using
      the 3072-bit private key.
========================================= */


/* =========================================
   GET FORM ELEMENTS
========================================= */

const signupForm =
    document.getElementById("signupForm");

const encryptButton =
    document.getElementById("encryptButton");


/* =========================================
   GET RESULT SECTIONS
========================================= */

const originalSection =
    document.getElementById("originalSection");

const rsa1024Section =
    document.getElementById("rsa1024Section");

const rsa3072Section =
    document.getElementById("rsa3072Section");


/* =========================================
   FORM SUBMISSION
========================================= */

signupForm.addEventListener(
    "submit",
    function (event) {

        // Prevent the browser from refreshing
        event.preventDefault();

        // Start the RSA process
        processRSA();

    }
);


/* =========================================
   MAIN RSA FUNCTION
========================================= */

function processRSA() {

    /* =====================================
       GET USER INFORMATION
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
       VALIDATE INFORMATION
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
            "Please complete all required fields."
        );

        return;
    }


    /* =====================================
       CREATE DATA OBJECT
    ===================================== */

    const userData = {

        fullName: fullName,

        dateOfBirth: dateOfBirth,

        yearLevel: yearLevel,

        gender: gender,

        username: username,

        password: password

    };


    /*
     * Convert the signup information
     * into a string before encryption.
     */
    const dataToEncrypt =
        JSON.stringify(userData);


    /* =====================================
       DISPLAY ORIGINAL INFORMATION
    ===================================== */

    displayOriginalInformation(
        userData
    );


    /* =====================================
       DISABLE BUTTON
    ===================================== */

    encryptButton.disabled = true;

    encryptButton.textContent =
        "Generating RSA Keys...";


    /* =====================================
       GENERATE 1024-BIT RSA
    ===================================== */

    setTimeout(
        function () {

            processRSA1024(
                dataToEncrypt
            );

        },
        100
    );

}


/* =========================================
   DISPLAY ORIGINAL INFORMATION
========================================= */

function displayOriginalInformation(
    userData
) {

    document.getElementById(
        "originalName"
    ).textContent =
        userData.fullName;


    document.getElementById(
        "originalDOB"
    ).textContent =
        formatDate(
            userData.dateOfBirth
        );


    document.getElementById(
        "originalYear"
    ).textContent =
        userData.yearLevel;


    document.getElementById(
        "originalGender"
    ).textContent =
        userData.gender;


    document.getElementById(
        "originalUsername"
    ).textContent =
        userData.username;


    /*
     * The password is shown here only because
     * this is a classroom encryption/decryption
     * demonstration.
     */
    document.getElementById(
        "originalPassword"
    ).textContent =
        userData.password;


    originalSection.classList.remove(
        "hidden"
    );

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateValue) {

    const parts =
        dateValue.split("-");


    if (parts.length !== 3) {

        return dateValue;

    }


    return (
        parts[1] +
        "/" +
        parts[2] +
        "/" +
        parts[0]
    );

}


/* =========================================
   RSA 1024-BIT
========================================= */

function processRSA1024(
    dataToEncrypt
) {

    const rsa1024 =
        new JSEncrypt({
            default_key_size: 1024
        });


    /*
     * Generate the RSA 1024-bit
     * public/private key pair.
     */
    rsa1024.getKey();


    const publicKey =
        rsa1024.getPublicKey();


    const privateKey =
        rsa1024.getPrivateKey();


    /* =====================================
       ENCRYPT DATA
    ===================================== */

    rsa1024.setPublicKey(
        publicKey
    );


    const encryptedData =
        rsa1024.encrypt(
            dataToEncrypt
        );


    /* =====================================
       DECRYPT DATA
    ===================================== */

    rsa1024.setPrivateKey(
        privateKey
    );


    const decryptedData =
        rsa1024.decrypt(
            encryptedData
        );


    /* =====================================
       DISPLAY RESULTS
    ===================================== */

    document.getElementById(
        "publicKey1024"
    ).value =
        publicKey;


    document.getElementById(
        "privateKey1024"
    ).value =
        privateKey;


    document.getElementById(
        "encrypted1024"
    ).value =
        encryptedData ||
        "Encryption failed.";


    document.getElementById(
        "decrypted1024"
    ).value =
        decryptedData ||
        "Decryption failed.";


    rsa1024Section.classList.remove(
        "hidden"
    );


    /* =====================================
       STATUS
    ===================================== */

    const status1024 =
        document.getElementById(
            "status1024"
        );


    if (
        decryptedData === dataToEncrypt
    ) {

        status1024.textContent =
            "✓ RSA 1024-bit Encryption and Decryption Successful";

        status1024.className =
            "status success";

    } else {

        status1024.textContent =
            "✗ RSA 1024-bit verification failed";

        status1024.className =
            "status";

    }


    /* =====================================
       START 3072-BIT PROCESS
    ===================================== */

    encryptButton.textContent =
        "Generating 3072-bit RSA Keys...";


    /*
     * A short delay allows the browser
     * to update the screen before the
     * larger key generation begins.
     */
    setTimeout(
        function () {

            processRSA3072(
                dataToEncrypt
            );

        },
        100
    );

}


/* =========================================
   RSA 3072-BIT
========================================= */

function processRSA3072(
    dataToEncrypt
) {

    const rsa3072 =
        new JSEncrypt({
            default_key_size: 3072
        });


    /*
     * Generate the RSA 3072-bit
     * public/private key pair.
     *
     * This may take longer than
     * generating the 1024-bit key.
     */
    rsa3072.getKey();


    const publicKey =
        rsa3072.getPublicKey();


    const privateKey =
        rsa3072.getPrivateKey();


    /* =====================================
       ENCRYPT DATA
    ===================================== */

    rsa3072.setPublicKey(
        publicKey
    );


    const encryptedData =
        rsa3072.encrypt(
            dataToEncrypt
        );


    /* =====================================
       DECRYPT DATA
    ===================================== */

    rsa3072.setPrivateKey(
        privateKey
    );


    const decryptedData =
        rsa3072.decrypt(
            encryptedData
        );


    /* =====================================
       DISPLAY RESULTS
    ===================================== */

    document.getElementById(
        "publicKey3072"
    ).value =
        publicKey;


    document.getElementById(
        "privateKey3072"
    ).value =
        privateKey;


    document.getElementById(
        "encrypted3072"
    ).value =
        encryptedData ||
        "Encryption failed.";


    document.getElementById(
        "decrypted3072"
    ).value =
        decryptedData ||
        "Decryption failed.";


    rsa3072Section.classList.remove(
        "hidden"
    );


    /* =====================================
       STATUS
    ===================================== */

    const status3072 =
        document.getElementById(
            "status3072"
        );


    if (
        decryptedData === dataToEncrypt
    ) {

        status3072.textContent =
            "✓ RSA 3072-bit Encryption and Decryption Successful";

        status3072.className =
            "status success";

    } else {

        status3072.textContent =
            "✗ RSA 3072-bit verification failed";

        status3072.className =
            "status";

    }


    /* =====================================
       ENABLE BUTTON AGAIN
    ===================================== */

    encryptButton.disabled = false;

    encryptButton.textContent =
        "Encrypt Information";

}

