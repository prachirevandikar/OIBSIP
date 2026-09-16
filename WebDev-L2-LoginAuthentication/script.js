// ========================================
// SECUREAUTH LOGIN AUTHENTICATION SYSTEM
// ========================================


// ========================================
// GET ELEMENTS
// ========================================

const loginForm = document.getElementById("loginForm");

const registerForm = document.getElementById("registerForm");

const loginContainer =
    document.getElementById("loginFormContainer");

const registerContainer =
    document.getElementById("registerFormContainer");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");


// ========================================
// SHOW REGISTER FORM
// ========================================

if (showRegister) {

    showRegister.addEventListener("click", function () {

        loginContainer.classList.remove("active");

        registerContainer.classList.add("active");

    });

}


// ========================================
// SHOW LOGIN FORM
// ========================================

if (showLogin) {

    showLogin.addEventListener("click", function () {

        registerContainer.classList.remove("active");

        loginContainer.classList.add("active");

    });

}


// ========================================
// GET USERS FROM LOCAL STORAGE
// ========================================

function getUsers() {

    return JSON.parse(
        localStorage.getItem("secureAuthUsers")
    ) || [];

}


// ========================================
// SAVE USERS
// ========================================

function saveUsers(users) {

    localStorage.setItem(
        "secureAuthUsers",
        JSON.stringify(users)
    );

}


// ========================================
// SHA-256 PASSWORD HASH
// ========================================

async function hashPassword(password) {

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    const hashHex =
        hashArray
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(2, "0")
            )
            .join("");

    return hashHex;

}


// ========================================
// PASSWORD VALIDATION
// ========================================

function isValidPassword(password) {

    const minimumLength =
        password.length >= 8;

    const hasNumber =
        /\d/.test(password);

    return minimumLength && hasNumber;

}


// ========================================
// REGISTRATION
// ========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            const message =
                document
                    .getElementById("registerMessage");


            message.textContent = "";

            message.className =
                "form-message";


            // Check name

            if (name.length < 2) {

                message.textContent =
                    "Please enter a valid name.";

                message.classList.add("error");

                return;

            }


            // Check password

            if (!isValidPassword(password)) {

                message.textContent =
                    "Password must contain at least 8 characters and 1 number.";

                message.classList.add("error");

                return;

            }


            // Confirm password

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                message.classList.add("error");

                return;

            }


            // Get existing users

            const users = getUsers();


            // Check duplicate email

            const existingUser =
                users.find(
                    user =>
                        user.email === email
                );


            if (existingUser) {

                message.textContent =
                    "An account with this email already exists.";

                message.classList.add("error");

                return;

            }


            // Hash password

            const passwordHash =
                await hashPassword(password);


            // Create user

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                passwordHash: passwordHash

            };


            // Add user

            users.push(newUser);

            saveUsers(users);


            // Success message

            message.textContent =
                "Account created successfully. You can now login.";

            message.classList.add("success");


            // Clear form

            registerForm.reset();


            // Switch to login after short delay

            setTimeout(function () {

                registerContainer
                    .classList
                    .remove("active");

                loginContainer
                    .classList
                    .add("active");

            }, 1200);

        }
    );

}


// ========================================
// LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const error =
                document
                    .getElementById("loginError");


            error.textContent = "";

            error.className =
                "form-message error";


            // Find user

            const users = getUsers();

            const user =
                users.find(
                    currentUser =>
                        currentUser.email === email
                );


            // Generic credentials error

            if (!user) {

                error.textContent =
                    "Invalid email or password.";

                return;

            }


            // Hash entered password

            const passwordHash =
                await hashPassword(password);


            // Compare hashes

            if (
                passwordHash !==
                user.passwordHash
            ) {

                error.textContent =
                    "Invalid email or password.";

                return;

            }


            // Create login session

            sessionStorage.setItem(
                "secureAuthSession",
                JSON.stringify({

                    userId: user.id,

                    name: user.name,

                    email: user.email

                })
            );


            // Redirect

            window.location.href =
                "dashboard.html";

        }
    );

}


// ========================================
// PROTECTED DASHBOARD
// ========================================

if (
    window.location.pathname.endsWith(
        "dashboard.html"
    )
) {

    const session =
        sessionStorage.getItem(
            "secureAuthSession"
        );


    // If not logged in,
    // redirect to login

    if (!session) {

        window.location.href =
            "index.html";

    } else {

        const user =
            JSON.parse(session);


        const userName =
            document.getElementById(
                "userName"
            );

        const dashboardName =
            document.getElementById(
                "dashboardName"
            );

        const dashboardEmail =
            document.getElementById(
                "dashboardEmail"
            );


        if (userName) {

            userName.textContent =
                user.name;

        }


        if (dashboardName) {

            dashboardName.textContent =
                user.name;

        }


        if (dashboardEmail) {

            dashboardEmail.textContent =
                user.email;

        }

    }

}


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "secureAuthSession"
            );

            window.location.href =
                "index.html";

        }
    );

}