const express = require("express")
const app = express()
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const session = require("express-session")
const flash = require("connect-flash")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true, // prevents client-side JS from accessing the cookie
    }
}

app.get("/", (req, res) => {
    res.send("root is working")
})

app.use(session(sessionOptions))
app.use(flash())

main().then(() => {console.log("connected to DB")}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    next()
})

// Create Listing Route
app.use("/listings", listings)

// Create Review Route
app.use("/listings/:id/reviews", reviews)


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     })

//     await sampleListing.save()
//     console.log("sample was saved")
//     res.send("successful testing")
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"))
})

// Error Handling Middleware

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err
    res.status(statusCode).render("error.ejs", {message})
    // res.status(statusCode).send(message)
})

app.listen(3000, () => {
    console.log("Server is listening")
})