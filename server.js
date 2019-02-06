const express = require('express')
require('dotenv').config();

const checkScope = require('express-jwt-authz'); //validates jwt scopes

const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksurl: `http://${
            process.env.REACT_APP_AUTH0_DOMAIN
        }/.well-known/jwks.json`

}),

//validate the audience and the issuer
audience: process.env.REACT_APP_AUTH0_AUDIENCE,
issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

algorithms: ["RS256"]

});

const app = express();

app.get('/public', function (req, res) {
    res.json({
        message: "hello from public api"
    });
});

app.get('/private', checkJwt, function (req, res) {
    res.json({
        message: "hello from private api"
    });
});

app.get('/course', checkJwt, checkScope(["read:courses"]), function (req, res) {
    res.json({
        courses: [
            {id: 1, title: "building Apps with React and Redux" },
            {id: 1, title: "building Apps with React and 50 years" }
        ]
    });
});


app.listen(3001);

console.log("Api listening on 3001 " + process.env.REACT_APP_AUTH0_AUDIENCE);

