const form = document.querySelector("#form");
const username = document.querySelector("#userID");
const password = document.querySelector("#password");

form.addEventListener("submit", handleFormSubmit);

username.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(username, "Username can't be blank");
    } else {
        setSuccessFor(username)
    }
});

password.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(password, "Password can't be blank");
    } else {
        setSuccessFor(password)
    }
})

function handleFormSubmit(event) {
    if (!checkInputs()) {
        event.preventDefault();
    } else {
        sendData(event);
    }
}

function sendData(e) {
    e.preventDefault();
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();

    const data = {
        userID: usernameValue,
        password: passwordValue
    }

    axios.post('/', data)
        .then((response) => {
            switch (response.data.role) {
                case "Owner": {
                    console.log(response.data.id);
                    window.location = `/owner/home/${response.data.id}`;
                    break;
                }
                case "Manager": {
                    window.location = `/manager/home/${response.data.id}`;
                    break;
                }
                case "Employee": {
                    window.location = `/employee/home/${response.data.id}`;
                    break;
                }
            }
        })
        .catch((error) => {
            form.reset();
            checkInputs();
            alert("User not found. Please try again!")
        })
}

function checkInputs() {
    // get the values from the inputs
    const usernameValue = username.value.trim();
    const passwordValue = password.value.trim();
    let success = false;

    if (usernameValue === '') {
        setErrorFor(username, "Username can't be blank");
        success = false;
    } else {
        setSuccessFor(username)
        success = true;
    }

    if (passwordValue === '') {
        setErrorFor(password, "Password can't be blank");
        success = false;
    } else {
        setSuccessFor(password);
        success = true;
    }

    return success;
}

function setErrorFor(input, message) {
    const control = input.parentElement;
    const small = control.querySelector("small");

    small.innerText = message;
    control.className = 'control error';
}

function setSuccessFor(input) {
    const control = input.parentElement;
    control.className = 'control success';
}

        // function checkPassword(input) {
        //     const pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,14}$/;

        //     return input.match(pass);
        // }