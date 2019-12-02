const userschema = require('../model/userschema');
const bcrypt = require('bcrypt');

module.exports.index = function(req, res) {

    res.render('homepage'
        //, { title: 'Express' }
    );
};
module.exports.profile = function(req, res) {
    //save account in db
    let sess = req.session;
    req.body.email = req.body.email.toLowerCase();
    if (sess.email) {
        userschema.findOne({ "email": req.body.email }, (err, user) => {
            if (err) return console.error(err);
            console.log(user);
            if (user != null) {
                var date = new Date(user.dateofbirth);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var dob = "" + day + "/" + month + "/" + year;
                var name = user.firstname + " " + user.lastname;
                var function_command;
                if (req.session.currentURL == "/login") {
                    function_command = "snake";
                } else {
                    function_command = "snake";
                }
                res.render('profile', { name: name, gender: user.gender, email: user.email, dateofbirth: dob, functionCommand: function_command });
            } else {
                console.log("user is null");
            }
        });
    }


};
module.exports.loadProfile = function(req, res) {
    //save account in db
    if (req.session.email) {
        userschema.findOne({ "email": req.session.email }, (err, user) => {
            if (err) return console.error(err);
            console.log(user);
            if (user != null) {
                var date = new Date(user.dateofbirth);
                var day = date.getDate();
                var month = date.getMonth();
                var year = date.getFullYear();
                var dob = "" + day + "/" + month + "/" + year;
                var name = user.firstname + " " + user.lastname;
                var function_command;
                if (req.session.currentURL == "/login") {
                    function_command = "snake";
                } else {
                    function_command = "snake";
                }
                res.render('profile', { name: name, gender: user.gender, email: user.email, dateofbirth: dob, functionCommand: function_command });
            } else {
                console.log("user is null");
            }
        });

    } else {
        res.render('error', { message: 'You are not Logged in!' });
    }
};
module.exports.loadEditProfile = function(req, res) {
    //save account in db
    let session = req.session;
    if (session.email) {
        userschema.findOne({ "email": session.email }, (err, user) => {
            if (err) return console.error(err);
            if (user != null) {
                var date = new Date(user.dateofbirth);
                var _day = date.getDate();
                var _month = date.getMonth();
                var _year = date.getFullYear();
                var dob = "" + _day + "/" + _month + "/" + _year;
                var name = user.firstname + " " + user.lastname;
                res.render('editProfile', { first_name: user.firstname, last_name: user.lastname, gender: user.gender, useremail: user.email, day: _day, month: _month, year: _year });
            }

        });
    } else {
        res.render('error', { message: 'You are not Logged in!' });
    }
}
module.exports.updateProfile = function(req, res) {
    //signup
    let session = req.session;
    if (session.email) {
        userschema.findOne({ "email": session.email }, (err, user) => {
            if (err) return console.error(err);
            if (user != null) {
                var date = new Date(req.body.year, req.body.month, req.body.day);
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                req.body.email = req.body.email.toLowerCase();
                user.email = req.body.email;
                user.gender = req.body.gender;
                user.dateofbirth = date;
                user.save(function(err, user) {
                    if (err) return console.error(err);
                    req.session.email = req.body.email;
                    res.redirect(307, "/profile")
                    console.log(user.firstname + "! your account has been updated.");
                });
            } else { console.log("something happend"); }
        });
    } else {
        res.render('error', { message: ' You are not logged in!' });
    }
    //userschema.findOne({ 'email': email }).then();\
};
module.exports.logout = function(req, res) {
    //save account in db
    if (req.session.email) {
        res.header('Cache-Control', 'no-cache');

        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }

            res.redirect('/');
        });
    }
};
module.exports.login = function(req, res1) {
    //login
    req.body.email = req.body.email.toLowerCase();
    userschema.findOne({ "email": req.body.email }, (err, user) => {
        if (err) return console.error(err);
        if (user == null) {
            res1.render('error', { message: ' Account Does not Exist!' });
            console.log("Account Does not Exist!");
        } else {
            var hash = user.password;
            bcrypt.compare(req.body.password, hash, function(err, res) {
                if (user.email == req.body.email && res) {
                    // Passwords match
                    req.session.email = req.body.email;
                    req.session.currentURL = "/login";
                    res1.redirect(307, "/profile");
                } else {
                    // Passwords don't match
                    res1.render('error', { message: ' Password not matched!' }); //  display msg
                    console.log("Password Not Matched!");
                }
            });

        }
    });

    //res.render('profile');
};
module.exports.signup = function(req, res) {
    //signup
    req.body.email = req.body.email.toLowerCase();
    userschema.findOne({ "email": req.body.email }, (err, user) => {
        if (err) return console.error(err);
        if (user == null) {
            var date = new Date(req.body.year, req.body.month, req.body.day);
            bcrypt.hash(req.body.password, 3, function(err, hash) { // 3 is salt round
                // Store hash in database


                var newuser = new userschema({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, password: hash, gender: req.body.gender, dateofbirth: date });
                newuser.save(function(err, user) {
                    if (err) return console.error(err);
                    req.session.email = req.body.email;
                    var a;
                    req.session.currentURL = "/signup";
                    res.redirect(307, "/profile")
                    console.log(user.firstname + "! your account has been created.");
                });
            });
        } else if (user != null) {
            console.log(user);
            res.render('error', { message: ' This email is registered previously!\n You need to login.' }); //  display msg
            console.log("This email is registered previously! You need to login.")
        } else { console.log("something happend"); }
    });
    //userschema.findOne({ 'email': email }).then();\
};
module.exports.deleteAccount = function(req, res1) {
    let session = req.session;
    if (session.email) {
        userschema.findOne({ "email": session.email }, (err, user) => {
            if (user != null) {
                if (req.body.password == req.body.confirmpassword) {
                    var hash = user.password;
                    bcrypt.compare(req.body.password, hash, function(err, res) {
                        if (res) {
                            user.remove();
                            console.log("Account Deleted Successfully!");
                            res1.redirect('/');
                        } else {
                            // Passwords don't match
                            console.log("Password do not match!");
                        }
                    });

                } else {

                }
            } else {

            }
        });
    } else {
        //---------------
    }
};
module.exports.renderDeleteAccount = function(req, res) {
    let session = req.session;
    if (session.email) {
        res.render('deleteAccount');
    } else {
        res.render('error', { message: 'You are not Logged in!' });
    }
};
module.exports.renderChangePassword = function(req, res) {
    let session = req.session;
    if (session.email) {
        res.render('changePassword');
    } else {
        res.render('error', { message: 'You are not Logged in!' });
    }
};
module.exports.changePassword = function(req, res1) {
    let session = req.session;
    if (session.email) {
        var old_password = req.body.oldpassword;
        var new_password = req.body.newpassword;
        var confirm_password = req.body.confirmpassword;
        userschema.findOne({ "email": session.email }, (err, user) => {
            if (user != null) {
                var hash = user.password;
                bcrypt.compare(old_password, hash, function(err, res) {
                    if (res) {
                        // Passwords match
                        if (new_password == confirm_password) {
                            bcrypt.hash(new_password, 3, function(err, hash) {
                                user.password = hash;
                                user.save(function(err, user) {
                                    if (err) return console.error(err);
                                    res1.render("changePassword");
                                    console.log(user.firstname + "! your password has been changed.");
                                });
                            });

                        }
                    } else {
                        // Passwords don't match
                    }
                });

            }
        });
    } else {
        res.render('error', { message: 'You are not Logged in!' });
    }
}

// module.exports.logout = function(req, res) {

//     res.render('homepage');
// };