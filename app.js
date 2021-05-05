const express = require('express');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
// require('./models/Survey');
require('./services/passport');
require("dotenv").config();

//Database connection
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true); // remove warning: DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

var dbUrl = utils.getDBUrl();
mongoose.connect(dbUrl, {
    useNewUrlParser: true
}).then(() => {
    logger.info(`${process.env.ENV} - MongoDB is connected. SpeakEnv - ${constant.speakEnv}`);
}, err => {
    logger.error("Can not connect to the database" + err);
});

const app = express();

app.use(bodyParser.json());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
// require('./routes/billingRoutes')(app);
// require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js file, or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
