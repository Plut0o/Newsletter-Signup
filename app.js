const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const secrets = require("./secrets.js");
const {apiKey, listId, assingiedServer} = secrets;


const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
 

    const url = `https://${assingiedServer}.api.mailchimp.com/3.0/lists/${listId}`;
    const options = {
        method: "POST",
        auth: `pluto:${apiKey}`
    };

    const request = https.request(url, options, function(response) {
        response.on("data", (data) => {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure", (req, res, next) => {
    res.redirect("/")
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})




