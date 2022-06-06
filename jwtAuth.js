const router = require("express").Router();
const nodemailer = require('nodemailer')
var mysql = require('mysql');
var bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const jwtGenerator = require("./jwtGenerator");
const authorize = require('./auth');
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
require('dotenv').config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

var connection = mysql.createConnection({
    connectionLimit : 100,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE,
});

connection.connect(function (error) {
    if (!!error) {
        console.error("Error");
        console.error(error);

    } else {
        console.log("connected");
    }
});


router.use(bodyparser.json());
//register route
router.post("/register", async (req, res) => {
    try {
        //1 req.body(name,email,password)
        var fname = req.body.fname;
        var lname = req.body.lname;
        var mobile = req.body.mobile;
        var email = req.body.email;
        // console.log(email);
        var pass = req.body.pass;
        //2 check if user exist
        const user = await connection.query("SELECT * FROM register_master WHERE email=" + mysql.escape(email), function (error, rows) {
            if (error) {
                console.error("error in fetching data");
            } else {
                if (rows.length !== 0) {
                    return res.status(401).send("User already exist");
                }
                else {
                    // res.status(200).send("record successfully inserted");
                    //3 bcrypt password
                    const saltRounds = 10;
                    const salt = bcrypt.genSaltSync(saltRounds);
                    const encryptedPassword = bcrypt.hashSync(pass, salt);

                    //4 insert new user

                    const newUser = connection.query("INSERT INTO `register_master`( `fname`, `lname`, `mobile`, `email`, `pass`, `isverified`) VALUES ('" + fname + "','" + lname + "','" + mobile + "','" + email + "','" + encryptedPassword + "','" + 0 + "')", function (error, rows, fields) {
                        console.log("INSERT INTO `register_master`( `fname`, `lname`, `mobile`, `email`, `pass`, `isverified`) VALUES ('" + fname + "','" + lname + "','" + mobile + "','" + email + "','" + encryptedPassword + "','" + 0 + "')")
                        if (!!error) {
                            console.error("Error In Register Master INSERT DATA Query");
                            return res.status(500).send({ error: "Error In Register Master INSERT DATA Query" })
                        } else {
                            console.log("Data Inserted In Register MASTER TABLE");
                            // console.log(rows[0].id);
                            const lastval = connection.query("SELECT * FROM register_master WHERE email=" + mysql.escape(email) + ";", (error, rows) => {
                                var id = rows[0].id;
                                var fname = rows[0].fname;
                                // console.log(id);
                                const token = jwtGenerator(id);
                                // console.log(token);
                                var otp = Math.floor(100000 + Math.random() * 900000)
                                const otpquery = connection.query("INSERT INTO `otp_master`(`uid`, `otp`) VALUES ('" + id + "','" + otp +"')",function(err,row){
                                    if(!!error){
                                        console.log("error at insert otp")
                                        res.status.end({error:"error at insert otp"})
                                    }
                                    else{

                                        var mailOptions = {
                                            to: email,
                                            subject: "Otp for registration",
                                            html:
                                            `<div style="font-family:sans-serif;">`+
                                        `<h2 style="text-transform:capitiliaze;">Hello ${fname},</h2>`+
                                        `<h3>Thank You for Joining TeamMeet </h3>`+
                                          "<h3>Your OTP for account verification is </h3>" +
                                          "<h1 style='font-weight:bold; width:100%;background:#0BB5FF;color:white;text-align:center; letter-spacing:10px ;font-size:40px;'>" +
                                          otp +
                                          "</h1>"+
                                          "</div>",
                                          };
                                          transporter.sendMail(mailOptions, (error, info) => {
                                            if (error) {
                                              return console.log("error", error);
                                            }
                                          });
                                        return res.status(200).json({"id":id,msg:"Registration Sucessful 😉 Please check your email for otp to verify your email for login"})
                                    }
                                })
                                // return res.status(200).json({ "id": id, "msg": "Registration Sucessful 😉" })

                            });
                            //

                        }
                    })
                }
            }
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("server Error");
    }
});

//login route

router.post('/login', async (req, res) => {
    try {
        var email = req.body.email;
        var pass = req.body.pass;
        //  2. check if user exist or not
        const user = await connection.query("SELECT * FROM register_master WHERE email=" + mysql.escape(email), function (error, rows) {
            if (error) {
                console.error("error in fetching data");
            } else {
                if (rows.length === 0) {
                    console.error("User Not Exist")
                    return res.status(401).json("User Not Exist");
                }
                else {
                    //res.status(200).send("good");
                    var isverified =rows[0].isverified
                    const validPassword = bcrypt.compare(pass, rows[0].pass, function (err, result) {
                        // result == true
                        if (result === true) {
                            console.log('validPassword');
                            //return res.status(200).json("successfully login");
                            const lastval = connection.query("SELECT id FROM register_master WHERE email=" + mysql.escape(email) + ";", (error, rows) => {
                                var id = rows[0].id;
                                // console.log(id);
                                const token = jwtGenerator(id);
                                if(isverified == 0){
                                    return res.status(200).send({id:id,msg:"not-verified"})
                                }else{
                                    return res.status(200).json({ token, msg: "successfull login" });
                                }
                            });
                        }
                        else {
                            console.error('InvalidPassword');
                            return res.status(401).json("Password Incorrect");
                        }
                    });
                    // const validPassword =  bcrypt.compare(pass,rows[0].pass);

                }
            }
        })

    } catch (err) {
        console.error(err.message);
        return res.status(500).send("server Error");
    }
});

router.get('/verify', authorize.verifytoken, async (req, res) => {
    try {
        token = req.header('token');
        if (token) {
            const value = jwt_decode(token);
            // console.log(value)
            return res.status(200).send(JSON.stringify(value));
        }
        else {
            return res.status(401).send('token not received');
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).send('Server Error');
    }
});

router.get('/user/:id', authorize.requestcheck, async (req, res) => {
    var id = req.params.id;
    console.log(id);
    if (id) {
        const user = connection.query("SELECT * FROM `register_master` where id=" + mysql.escape(id), function (error, rows) {
            if (error) {
                console.error("error in fetching data");
                return res.status(400).send("error in fetching data");
            } else {
                if (rows.length === 0) {
                    return res.status(400).send("No record found");
                }
                else {
                    return res.status(200).send(rows[0]);
                }
            }
        })
    }
    else {
        return res.status(400).send("User Id is not provided")
    }
})

router.post('/update/:id', authorize.requestcheck, async (req, res) => {
    var id = req.params.id;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var mobile = req.body.mobile;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var passonDb = "";
    var updatePassword = req.body.changePasswordCheckBox;
    // console.log(req.header('token'));
    if (id) {

        if (updatePassword == true && oldPassword != null && newPassword != null) {
            // console.log(updatePassword )
            connection.query("select pass from register_master where id=" + mysql.escape(id), function (error, rows) {
                if (error) {
                    console.error("can't fetch password");
                    return res.send("can't fetch password from database")
                }
                else {
                    passonDb = JSON.stringify(rows[0].pass)

                    match = bcrypt.compare(oldPassword, passonDb.slice(1, -1), function (err, result) {
                        if (err) {
                            console.error(err);
                        }
                        if (result == true) {
                            //Password Encryption
                            const saltRounds = 10;
                            const salt = bcrypt.genSaltSync(saltRounds);
                            const encryptedPassword = bcrypt.hashSync(newPassword, salt);

                            connection.query("UPDATE `register_master` SET `fname`='" + fname + "',`lname`='" + lname + "',`mobile`='" + mobile + "',`pass`='" + encryptedPassword + "' WHERE `id`='" + id + "';", function (error, rows, fields) {
                                if (!!error) {
                                    console.error("Error In CUSTOMER MASTER TABLE UPDATE DATA Query");
                                } else {
                                    console.log("Data Update In CUSTOMER MASTER TABLE")
                                    return res.status(200).end(JSON.stringify("updated wirh password"));
                                }
                            });
                        } else {
                            return res.status(401).end("Wrong Password")
                        }
                    });
                }
            })

        } else {
            connection.query("UPDATE `register_master` SET `fname`='" + fname + "',`lname`='" + lname + "',`mobile`='" + mobile + "' WHERE `id`='" + id + "';", function (error, rows, fields) {
                if (!!error) {
                    console.error("Error In CUSTOMER MASTER TABLE UPDATE DATA Query");
                } else {
                    console.log("Data Update In CUSTOMER MASTER TABLE")
                    return res.status(200).end(JSON.stringify("updated"));
                }
            });
        }
    }
})

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        // console.log(file);
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });
const fs = require('fs')
router.post('/upload/:id/:userid', upload.single('file'), function (req, res, next) {
    var id = req.params.id;
    var userid = req.params.userid;
    if (!req.file) {
        res.status(500);
        return next(err);
    }

    var filetype = '';
    if (req.file.mimetype === 'image/gif') {
        filetype = 'gif';
    }
    if (req.file.mimetype === 'image/png') {
        filetype = 'png';
    }
    if (req.file.mimetype === 'image/bmp') {
        filetype = 'bmp';
    }
    if (req.file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
    }
    fs.rename('./public/images/' + req.file.filename, './public/images/' + id + '-' + userid + '.' + filetype, () => {
        console.log('file renamed')
    })
    res.send('/uploads/' + id + '-' + userid + '.' + filetype);
})

router.post("/setprofile", async (req, res) => {
    try {
        var uid = req.body.uid;
        // var uid = 125;
        var url = req.body.url;
        // var url = 'https://192.168.43.119:5000/uploads/616399-122.png'
        console.log(uid)
        console.log(url)
        console.log("type",typeof(url))
        let x = "INSERT INTO `profile_master`(`uid`, `picUrl`) VALUES ('"+uid+"','"+url+"');"
        console.log(x)

        const newUser =  connection.query("INSERT INTO `profile_master`(`uid`, `picUrl`) VALUES ('"+uid+"','"+url+"');", function (error, rows, fields) {
            if (!!error) {
                console.error("Error In Profile Master INSERT DATA Query");
                return res.status(500).end({ error: "Error In Profile Master INSERT DATA Query" })
            } else {
                console.log("Data Inserted In Profile MASTER TABLE");
                res.status(200).send({msg:"Data inserted"})
            }
        })
    }catch (err) {
        console.error(err.message);
        return res.status(500).send("server Error");
    }

})

router.get('/profilepic/:id', async (req, res) => {
    var id = req.params.id;
    if (id) {
        const user = connection.query("SELECT * FROM `profile_master` where uid=" + mysql.escape(id), function (error, rows) {
            if (error) {
                console.error("error in fetching data");
                return res.status(400).send("error in fetching data");
            } else {
                if (rows.length === 0) {
                    return res.status(400).send("No record found");
                }
                else {
                    // console.log(rows[0])
                    return res.status(200).send(rows[0].picUrl);
                }
            }
        })
    }
    else {
        return res.status(400).send("User Id is not provided")
    }
})

router.post('/resendotp',async(req, res)=>{
    console.log('api called')
    var email = req.body.email;
    console.log(email);
    var uid = req.body.uid;
    console.log(uid);

    if(email != undefined && email){
        console.log("email provided")
        const user = await connection.query("SELECT * FROM register_master WHERE email=" + mysql.escape(email), function (error, rows) {
            if(!!error){
                return res.status(400).send(`error at select user`)
            }
            else{
                if(rows.length===0){
                    return res.status(400).send(`No user found for this ${email} emailaddress`)
                }else{
                    var id = rows[0].id
                    var fname = rows[0].fname
                    console.log(id)
                    connection.query('delete from otp_master where uid='+mysql.escape(id),function(error,rows){
                        if(!!error){
                            res.send("no any otp founded")
                        }
                        else{
                            if(rows.length===0){
                                res.send("no any otp founded")
                            }
                            var otp = Math.floor(100000 + Math.random() * 900000);
                            const otpquery = connection.query("INSERT INTO `otp_master`(`uid`, `otp`) VALUES ('" + id + "','" + otp +"')",function(error,row){
                                if(!!error){
                                    console.log("error at insert otp")
                                    res.status.end({error:"error at insert otp"})
                                }
                                else{

                                    var mailOptions = {
                                        to: email,
                                        subject: "Otp for registration",
                                        html:
                                        `<div style="font-family:sans-serif;">`+
                                        `<h2 style="text-transform:capitiliaze;">Hello ${fname},</h2>`+
                                        `<h3>Thank You for Joining TeamMeet </h3>`+
                                          "<h3>Your OTP for account verification is </h3>" +
                                          "<h1 style='font-weight:bold; width:100%;background:#0BB5FF;color:white;text-align:center; letter-spacing:10px ;font-size:40px;'>" +
                                          otp +
                                          "</h1>"+
                                          "</div>",
                                        };
                                        transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log("error", error);
                                        }
                                        });
                                    return res.status(200).json(`new otp successfully submitted for ${email}`)
                                }
                            })
                        }
                    })
                }
            }
        })
    }
    else{
        console.log("uid provided")
        connection.query("SELECT * FROM `register_master` WHERE `id`='"+mysql.escape(parseInt(uid))+"';", function (error, rows) {
            if(!!error){
                return res.status(400).send(`error at select user`)
            }
            else{
                if(rows.length===0){
                    return res.status(400).send(`No user found for this ${email} emailaddress`)
                }else{
                    var id = rows[0].id
                    var emailfromquery = rows[0].email
                    var fname = rows[0].fname
                    console.log(id)
                    connection.query('DELETE FROM `otp_master` WHERE uid="'+mysql.escape(id)+'"',function(error,rows){
                        if(!!error){
                            res.send("no any otp founded")
                        }
                        else{
                            if(rows.length===0){
                                res.send("no any otp founded")
                            }
                            var otp = Math.floor(100000 + Math.random() * 900000)
                            const otpquery = connection.query("INSERT INTO `otp_master`(`uid`, `otp`) VALUES ('" + id + "','" + otp +"')",function(error,row){
                                if(!!error){
                                    console.log("error at insert otp")
                                    res.status.end({error:"error at insert otp"})
                                }
                                else{
                                    var mailOptions = {
                                        to: emailfromquery,
                                        subject: "Otp for registration",
                                        html:
                                        `<div style="font-family:sans-serif;">`+
                                        `<h2 style="text-transform:capitiliaze;">Hello ${fname},</h2>`+
                                        `<h3>Thank You for Joining TeamMeet </h3>`+
                                          "<h3>Your OTP for account verification is </h3>" +
                                          "<h1 style='font-weight:bold; width:100%;background:#0BB5FF;color:white;text-align:center; letter-spacing:10px ;font-size:40px;'>" +
                                          otp +
                                          "</h1>"+
                                          "</div>",
                                        };
                                        transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log("error", error);
                                        }
                                        });
                                    return res.status(200).json(`new otp successfully submitted for ${emailfromquery}`)
                                }
                            })
                            // res.send('work')
                        }
                    })
                }
            }
        })
    }

})

router.post('/validateotp',async(req,res)=>{
    var otp = req.body.otp;
    var uid = req.body.uid;
    console.log(otp,uid)

    const getotp = connection.query("SELECT `otp` FROM `otp_master` WHERE `uid`= " +mysql.escape(uid),function(error,rows){
        if(!!error){
            console.error("Error at fetching otp from table")
            return res.status(500).send("Error at fetching otp from table")
        }
        else{
            if(rows.length ===0){
                return res.status(400).send("no User Founded")
            }
            console.log(rows[0])
            var otpfromtable = rows[0].otp
            if(otpfromtable == otp){
                const userupdate = connection.query("UPDATE `register_master` SET `isverified`='" + 1 +"' WHERE `id` = "+mysql.escape(uid),(error,rows)=>{
                    if(!!error){
                        return res.status(500).send('Error at verify user query')
                    }
                    else{
                        connection.query("DELETE FROM `otp_master` WHERE uid="+mysql.escape(uid))
                        return res.status(200).send({"msg":"verified"})
                    }
                })
                // return res.send(true)
            }
            else{
                return res.status(200).send({"msg":"Invalid"})
            }
        }
    })
})

router.post('/room',authorize.requestcheck,async(req,res)=>{
    var roomid = req.body.roomid
    var uid = req.body.uid
    var time = new Date();
    var curr_date = time.getDate();
    var curr_month = time.getMonth() + 1;
    var curr_year = time.getFullYear();
    var curr_hour = time.getHours();
    var curr_min = time.getMinutes();
    var curr_sec = time.getSeconds();
    var date = curr_year + "-" + curr_month + "-" + curr_date + " " + curr_hour + ":" + curr_min + ":" + curr_sec;
    try{
        if(roomid){
            connection.query(`INSERT INTO room_master(uid, roomid, createtime) VALUES (${uid},${roomid},'${date}')`,(error,rows)=>{
                if(error){
                    console.log(error)
                    return  res.status(200).send({error :error})
                }
                else{
                    console.log("record inserted in room_master")
                    return  res.status(200).send({msg:"room Inserted"})

                }
            })
        }
    }catch(err){
        console.log(err)
        res.status(400).send({"Error":err})
    }
})

router.post('/findroom',authorize.requestcheck,async(req,res)=>{
    var roomid = req.body.roomid
    try{
        if(roomid){
            connection.query(`SELECT * FROM room_master WHERE roomid=${roomid} `,(error,rows)=>{
                if(error){
                    console.log(error)
                    return  res.status(200).send({error :error})
                }
                else{
                   if(rows.length === 0){
                    return  res.status(200).send({msg :'room-not-exist'})
                   }
                   else{
                        return  res.status(200).send({msg :'room-exist'})
                   }
                }
            })
        }
        else{return  res.status(200).send({msg :'room id not provided'})}
    }catch(err){
        console.log(err)
        res.status(400).send({"Error":err})
    }
})

router.get('/deleteroom',async(req,res)=>{
    var roomid = req.body.roomid
    try{
        if(roomid){
            connection.query(`DELETE FROM room_master WHERE roomid=${roomid} `,(error,rows)=>{
                if(error){
                    console.log(error)
                    return  res.status(200).send({error :error})
                }
                else{
                    return res.status(200).send({msg :'room deleted'})
                }
            })
        }
        else{return  res.status(200).send({msg :'room id not provided'})}
    }catch(err){
        console.log(err)
        res.status(400).send({"Error":err})
    }
})


module.exports = router;