const form = document.querySelector("#form");
const fName = document.querySelector("#fName");
const lName = document.querySelector("#lName");
const address = document.querySelector("#address");
const phone = document.querySelector("#phone");
const dob = document.querySelector("#dob");
const email = document.querySelector("#email");
const bankAccount = document.querySelector("#bankAccount");
const sinNumber = document.querySelector("#sinNumber");
const avail = document.querySelector("#avail");
const monday = document.querySelector("#monday");
const tuesday = document.querySelector("#tuesday");
const wednesday = document.querySelector("#wednesday");
const thursday = document.querySelector("#thursday");
const friday = document.querySelector("#friday");
const saturday = document.querySelector("#saturday");
const sunday = document.querySelector("#sunday");
const mon_choice = document.querySelector("#mon-options");
const tue_choice = document.querySelector("#tue-options");
const wed_choice = document.querySelector("#wed-options");
const thurs_choice = document.querySelector("#thurs-options");
const fri_choice = document.querySelector("#fri-options");
const sat_choice = document.querySelector("#sat-options");
const sun_choice = document.querySelector("#sun-options");
const wage = document.querySelector("#wage");


monday.addEventListener('change', function () {
    if (monday.checked) {
        mon_choice.disabled = false;
    } else if (!monday.checked) {
        mon_choice.disabled = true;
    }
})

tuesday.addEventListener('change', function () {
    if (tuesday.checked) {
        tue_choice.disabled = false;
    } else if (!tuesday.checked) {
        tue_choice.disabled = true;
    }
})

wednesday.addEventListener('change', function () {
    if (wednesday.checked) {
        wed_choice.disabled = false;
    } else if (!wednesday.checked) {
        wed_choice.disabled = true;
    }
})

thursday.addEventListener('change', function () {
    if (thursday.checked) {
        thurs_choice.disabled = false;
    } else if (!thursday.checked) {
        thurs_choice.disabled = true;
    }
})

friday.addEventListener('change', function () {
    if (friday.checked) {
        fri_choice.disabled = false;
    } else if (!friday.checked) {
        fri_choice.disabled = true;
    }
})

saturday.addEventListener('change', function () {
    if (saturday.checked) {
        sat_choice.disabled = false;
    } else if (!saturday.checked) {
        sat_choice.disabled = true;
    }
})

sunday.addEventListener('change', function () {
    if (sunday.checked) {
        sun_choice.disabled = false;
    } else if (!sunday.checked) {
        sun_choice.disabled = true;
    }
})

fName.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(fName, "First name can't be blank");
    } else {
        setSuccessFor(fName);
    }
})

lName.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(lName, "Last name can't be blank");
    } else {
        setSuccessFor(lName);
    }
})

address.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(address, "Address can't be blank");
    } else {
        setSuccessFor(address);
    }
})

phone.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(phone, "Phone can't be blank");
    } else if (!this.value.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)) {
        setErrorFor(phone, "Incorrect phone number");
    } else {
        setSuccessFor(phone);
    }
})

dob.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(dob, "Date of birth can't be blank");
    } else {
        setSuccessFor(dob);
    }
})

email.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(email, "Email can't be blank");
    } else {
        setSuccessFor(email);
    }
})

bankAccount.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(bankAccount, "Bank account can't be blank");
    } else {
        setSuccessFor(bankAccount);
    }
})

sinNumber.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(sinNumber, "SIN number can't be blank");
    } else {
        setSuccessFor(sinNumber);
    }
})

wage.addEventListener("input", function (event) {
    if (this.value === '') {
        setErrorFor(wage, "Wage can't be blank");
    } else {
        setSuccessFor(wage);
    }
})

function checkInputs() {
    const fNameValue = fName.value.trim();
    const lNameValue = lName.value.trim();
    const addressValue = address.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value.trim();
    const emailValue = email.value.trim();
    const bankAccountValue = bankAccount.value.trim();
    const sinNumberValue = sinNumber.value.trim();
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const wageValue = wage.value.trim();

    let success = false;

    if (fNameValue === '') {
        setErrorFor(fName, "First name can't be blank");
        success = false;
    } else {
        setSuccessFor(fName);
        success = true;
    }

    if (lNameValue === '') {
        setErrorFor(lName, "Last name can't be blank");
        success = false;
    } else {
        setSuccessFor(lName);
        success = true;
    }

    if (addressValue === '') {
        setErrorFor(address, "Address can't be blank");
        success = false;
    } else {
        setSuccessFor(address);
        success = true;
    }

    if (phoneValue === '') {
        setErrorFor(phone, "Phone can't be blank");
    } else if (!phoneValue.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)) {
        setErrorFor(phone, "Incorrect phone number");
    } else {
        setSuccessFor(phone);
    }

    if (dobValue === '') {
        setErrorFor(dob, "Date of birth can't be blank");
        success = false;
    } else {
        setSuccessFor(dob);
        success = true;
    }

    if (emailValue === '') {
        setErrorFor(email, "Email can't be blank");
        success = false;
    } else {
        setSuccessFor(email);
        success = true;
    }

    if (bankAccountValue === '') {
        setErrorFor(bankAccount, "Bank account number can't be blank");
        success = false;
    } else {
        setSuccessFor(bankAccount);
        success = true;
    }

    if (sinNumberValue === '') {
        setErrorFor(sinNumber, "SIN number can't be blank");
        success = false;
    } else {
        setSuccessFor(sinNumber);
        success = true;
    }

    if (checkboxes.length === 0) {
        const control = avail.parentElement;
        const small = control.querySelector("small");
        small.innerText = "Availability can't be blank";
        control.className = 'col control error';
        success = false;
    } else if (checkboxes.length !== 0) {
        const control = avail.parentElement;
        control.className = 'col control success';
        success = true;
    }

    if (wageValue === '') {
        setErrorFor(wage, "Wage can't be blank");
        success = false;
    } else {
        setSuccessFor(wage);
        success = true;
    }
    return success;
}

function setErrorFor(input, message) {
    const control = input.parentElement.parentElement;
    const small = control.querySelector("small");
    small.innerText = message;
    control.className = 'col control error';
}

function setSuccessFor(input) {
    const control = input.parentElement.parentElement;
    control.className = 'col control success';
}

form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    if (!checkInputs()) {
        event.preventDefault();
    } else {
        sendData(event);
    }
}

function sendData(event) {
    event.preventDefault();

    const fNameValue = fName.value.trim();
    const lNameValue = lName.value.trim();
    const addressValue = address.value.trim();
    const phoneValue = phone.value.trim();
    const dobValue = dob.value.trim();
    const emailValue = email.value.trim();
    const bankAccountValue = bankAccount.value.trim();
    const sinNumberValue = sinNumber.value.trim();
    const availability = {}
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const periods = document.querySelectorAll('select:enabled');
    for (let i = 0; i < periods.length; i++) {
        availability[checkboxes[i].id] = periods[i].value;
    }
    const wageValue = wage.value.trim();

    const data = {
        firstName: fNameValue,
        lastName: lNameValue,
        address: addressValue,
        phoneNumber: phoneValue,
        dob: dobValue,
        email: emailValue,
        bankAccount: bankAccountValue,
        sinNumber: sinNumberValue,
        availability: availability,
        wage: wageValue
    }

    axios.post('/addEmployee', data)
        .then((result) => {
            alert(`New employee added successfully!\n\nUserID: ${result.data.userID}\nPassword: ${result.data.password}`);
        })
        .catch((error) => {
            alert("Oops! Something went wrong. Please, try again.");
        })
}