// function authenticate(user, callback) {
//     console.info("STEP 1: Authenticating user", user);

//     setTimeout(() => {
//         user = { ...user, isAuthenticated: true };
//         callback(user, matchPassword);
//     }, 1000)
// }

// function matchPassword (user, callback) {
//     console.info("STEP 2: Matching password for", user.name);
    
//     setTimeout(() => {
//         user = { ...user, passwordMatched: true };
//         callback(user, fetchUserData);
//     }, 1000);
// }

// function fetchUserData (user, callback) {
//     console.info("STEP 3: Fetching user data for", user.name);
    
//     setTimeout(() => {
//         user = { ...user, dataFetched: true };
//         callback(user, sendVerificationEmail);
//     }, 1000);

// }

// function sendVerificationEmail(user, callback) {
//     console.info("STEP 4: Sending verification email to", user.name);
    
//     setTimeout(() => {
//         user = { ...user, emailSent: true };
//         callback(user);
//     }, 1000);
// }

// // Calling the function with nested callbacks
// authenticate({ id: 1, name: "John" }, function processUser(user, nextStep) {
//     matchPassword(user, function addHobbies(userWithPassword, nextStep) {
//         fetchUserData(userWithPassword, function verifyAccount(verifiedUser, nextStep) {
//             sendVerificationEmail(verifiedUser, function finalizeAccount(finalUser) {
//                 console.info("FINAL STEP: User setup complete:", finalUser);
//             });
//         });
//     });
// });

// Refactoring the callback hell using Promises

async function processUser() {
    try {
        let user = { id: 1, name: "John" };

        user = await authenticate(user);
        user = await matchPassword(user);
        user = await fetchUserData(user);
        user = await sendVerificationEmail(user);

        console.info("FINAL STEP: User setup complete:", user);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Calling the async function
processUser();


// ## Refactored with Async Generators

async function* userAuthFlow(user) {
    console.info("STEP 1: Authenticating user", user);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    user = { ...user, isAuthenticated: true };
    yield user;

    console.info("STEP 2: Matching password for", user.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    user = { ...user, passwordMatched: true };
    yield user;

    console.info("STEP 3: Fetching user data for", user.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    user = { ...user, dataFetched: true };
    yield user;

    console.info("STEP 4: Sending verification email to", user.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    user = { ...user, emailSent: true };
    yield user;
}

// Running the async generator
(async () => {
    let user = { id: 1, name: "John" };
    const generator = userAuthFlow(user);

    for await (const updatedUser of generator) {
        console.info("User State:", updatedUser);
    }

    console.info("FINAL STEP: User setup complete.");
})();


// callback hell example with authentication

function authenticate(user, next) {
    console.log("STEP 1: starting authentication", user);

    setTimeout(() => {
        user = {...user, isAuthenticated: true };
    }, 1000);
    

    setTimeout(() => {
        next(user, function verify (verifiedUser, matchPassword) {
        
        console.log("STEP 2: verified user", verifiedUser);
        
        const matchPass = { ...verifiedUser, doesPasswordMatch: false };
        
        // invoke `matchPassword` and define inline `done`
        
        matchPassword(matchPass, function sendMail (mailInfo, done) {
            console.log("STEP 4: preparing to send email");
            
            // invoke `done`
            
            done("Y")
        });
    });
    
    }, 2000);
    
    
}


authenticate({user: 1, isAuthenticated: false }, function next (user, verify) {
    
    // verifying user
    setTimeout(() => {
        console.log("before verification: ", user);
        user = {...user, isVerified: true };
    }, 1000);
    
    // invoke `verify` and define inline `matchPassword`
    
    setTimeout(() => {
        verify(user, function matchPassword (matchPass, sendEmail) {
        console.log("STEP 3: matching password")
        
        // matching password
        
        matchPass = {...matchPass, doesPasswordMatch: true }
        
        const mailInfo = {...matchPass, email: {provider: "gmail", to: "example@user.com"}}
        
        // invoke `sendEmail` and defin inline `done`
        sendEmail(mailInfo, function done (message) {
            console.log("STEP 5: DONE");
            return message === "Y" ? "Authentication Done" : "Still working";
        })
        
        
    });
    }, 2000);
})