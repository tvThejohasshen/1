const express = require('express');
const app = express();
const forms = require('forms');  // Assuming 'forms' is the library you're using
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;
const csrf = require('csurf');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));

// Create Registration Form
const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true, errorAfterField: true
        }),
        'phone': fields.string({
            required: true, errorAfterField: true
        }),
        'email': fields.email({
            required: true, errorAfterField: true, widget: widgets.email(),
            validators: [validators.email()]
        }),
        'password': fields.password({
            required: true, errorAfterField: true
        }),
        'confirm_password': fields.password({
            required: true, errorAfterField: true,
            validators: [validators.matchField('password'), validators.minlength(8)]
        })
    });
}

// Create Login Form
const createLoginForm = () => {
    return forms.create({
        'email': fields.email({
            required: true, errorAfterField: true, widget: widgets.email(),
            validators: [validators.email()]
        }),
        'password': fields.password({
            required: true, errorAfterField: true
        })
    });
}

// Register Route
app.get('/register', (req, res) => {
    const form = createRegistrationForm();
    res.render('register', { userForm: form.toHTML(), csrfToken: req.csrfToken() });
});

app.post('/register', (req, res) => {
    const form = createRegistrationForm();
    form.handle(req, {
        success: function (form) {
            console.log('Registration successful!');
            // Handle successful registration (e.g., save user to database)
            // Here you would typically hash the password before saving
            res.redirect('/login'); // Redirect to login page or another appropriate page
        },
        error: function (form) {
            console.error('Form validation error:', form.errors);
            res.render('register', { userForm: form.toHTML(), csrfToken: req.csrfToken() });
        },
        empty: function (form) {
            console.warn('Form submitted with empty fields');
            res.render('register',
