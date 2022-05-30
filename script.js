// VARIABLES
const form = document.getElementsByTagName('form')[0],
	clear = document.querySelector('.clear'),
	fullName = document.getElementById('fullname'),
	phoneNumber = document.getElementById('phone-number'),
	email = document.getElementById('email'),
	url = document.getElementById('url'),
	password = document.getElementById('password'),
	confirmPassword = document.getElementById('confirm-password'),
	registerBtn = document.querySelector('.register-btn'),
	msgBtn = document.querySelector('.msg-btn');

let formInput = {};

// FUNCTIONS
function clearFields() {
	formInput = {};
	localStorage.removeItem('formInput');

	fullName.value = '';
	phoneNumber.value = '';
	email.value = '';
	url.value = '';
	password.value = '';
	confirmPassword.value = '';

	Array.from(document.getElementsByTagName('input')).forEach((input) => {
		input.classList.remove('correct-input');
		input.classList.remove('incorrect-input');
	});
	msgBtn.innerText = '-';
	msgBtn.classList.remove('msg-btn-error-msg');
}

function setFields(formInput) {
	let elem;
	for (let [ k, v ] of Object.entries(formInput)) {
		elem = getElement(k);
		elem.value = v;
		elem.classList.add('correct-input');
	}
}

function getElement(key) {
	switch (key) {
		case 'fullName':
			return fullName;
		case 'phoneNumber':
			return phoneNumber;
		case 'email':
			return email;
		case 'url':
			return url;
	}
}

function handleFormSubmit(e) {
	e.preventDefault();

	let totalCorrectFields = Array.from(document.getElementsByTagName('input')).reduce(
		(acc, elem) => (elem.classList.contains('correct-input') ? ++acc : acc),
		0
	);
	if (totalCorrectFields == 6) {
		//delete stored input
		localStorage.removeItem('formInput');
		//submit form
		// form.submit();
		console.log('Submit form');
	} else console.log("Don't submit form");
}

function getRegexPattern(type) {
	switch (type) {
		case 'fullname':
			return new RegExp('^.{3,20}$');

		case 'phone-number':
			return new RegExp('^[6-9]{1}[0-9]{9}$');

		case 'email':
			return new RegExp('([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+)');

		case 'url':
			return new RegExp(
				'(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})'
			);

		case 'password':
			return new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$&*~]).{8,}$');

		case 'confirm-password':
			return confirmPassword.value === password.value ? true : false;
	}
}

function getMessage(type) {
	switch (type) {
		case 'fullname':
			return 'Name must be b/w 3 to 10 characters';
		case 'phone-number':
			return 'Phone number entered is incorrect';
		case 'email':
			return 'Email entered is incorrect';
		case 'url':
			return 'URL entered is incorrect';
		case 'password':
			return 'Password must contain atleast 1 upper case, 1 lower case, 1 digit and 1 special character';
		case 'confirm-password':
			return 'Password not matching';
	}
}

function saveToLS(formInput) {
	localStorage.setItem('formInput', JSON.stringify(formInput));
}

function validate(e) {
	let type = e.target.id;
	let regex = getRegexPattern(type);
	let testResult = null;

	//to handle confirm-password field
	if (typeof regex === 'boolean') testResult = regex;
	else testResult = regex.test(e.target.value);

	//if input pattern not matched => add red boundary and alert message
	if (!testResult) {
		e.target.classList.remove('correct-input');
		e.target.classList.add('incorrect-input');
		msgBtn.innerText = getMessage(type);
		msgBtn.classList.add('msg-btn-error-msg');
	} else {
		e.target.classList.remove('incorrect-input');
		e.target.classList.add('correct-input');

		msgBtn.innerText = '-';
		msgBtn.classList.remove('msg-btn-error-msg');
	}

	//enable confirm password if password entered matches constraints
	if ((testResult && type == 'password') || !confirmPassword.disabled) confirmPassword.disabled = false;
	else confirmPassword.disabled = true;

	//save to ls if not password || confirm-password
	if (testResult && (type != 'password' && type != 'confirm-password')) {
		formInput[e.target.getAttribute('data-key')] = e.target.value;
		saveToLS(formInput);
	}
}

// EVENTS
window.onload = () => {
	if (localStorage.getItem('formInput')) {
		formInput = JSON.parse(localStorage.getItem('formInput'));
		setFields(formInput);
	} else formInput = {};
};
clear.addEventListener('click', clearFields);
registerBtn.addEventListener('click', handleFormSubmit);
msgBtn.addEventListener('click', (e) => e.preventDefault());
fullName.addEventListener('keyup', validate);
phoneNumber.addEventListener('keyup', validate);
email.addEventListener('keyup', validate);
url.addEventListener('keyup', validate);
password.addEventListener('keyup', validate);
confirmPassword.addEventListener('keyup', validate);

// password validation
// ^
//  (?=.*[A-Z])       // should contain at least one upper case
//  (?=.*[a-z])       // should contain at least one lower case
//  (?=.*?[0-9])      // should contain at least one digit
//  (?=.*?[!@#\$&*~]) // should contain at least one Special character
//  .{8,}             // Must be at least 8 characters in length
// $
