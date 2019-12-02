const mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost:27017/UserDatabase', { useNewUrlParser: true }, (err) => {
    if (!err) { console.log('MongoDB connected Successfully!') } else { console.log('Error in DB connection :' + err) }
}); // i guess table of database
module.exports = db;