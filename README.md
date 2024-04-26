# NodeJs, Express, EJS & MongoDB Notes App Website - CRUD

# How to Run This Project Locally on System

## You need:

- NodeJs
- Database (MongoDB)
- Google Console Account to create the API Auth Key's
- Email SMTP provider Account (eg. Gmail, SendGrid)

## Create .env file

Create a .env file to store your credentials. Example below:

```
MONGODB_URI=mongodb+srv://<username>:<password>@mongodburlhere
GOOGLE_CLIENT_ID=YOUR_GOOGLE_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL="http://localhost:3000/google/callback"
SESSION_SECRET="anything-you-want"
COOKIE_SECRET="anything-you-want"
EMAIL_USERNAME=Username-of-Email-SMTP
EMAIL_PASSWORD=Password-of-Email-SMTP
EMAIL_HOST=Email-SMTP-Host
EMAIL_PORT=Email-SMTP-Port
```

## Installation

To install and run this project - install dependencies using npm and then start your server:

```
$ npm install
$ npm start
```
