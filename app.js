const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
app.use(express.static("public")); // to get the work done by Bootstrap
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){

  res.sendFile(__dirname + "/signup.html");
})
app.post("/",function(req,res){
  var first = req.body.fname;
  var last = req.body.lname;
  var address = req.body.eaddress;

    // in order to use mailchimp an object named data is created and all the things are specified.
  var data = {
    members:[
      {
      email_address : address,
      status :  "subscribed",
      merge_fields : {
        FNAME : first,
        LNAME : last
      }
    }
    ]
  };
var jsonData = JSON.stringify(data); // convert the object named data into string that is in the form of JSON

//WE NEED TO REQUEST THE DATA TO BE ADDED ON MAILCHIMP
const url = 'https://us1.api.mailchimp.com/3.0/lists/418109449a';
const options = {
  method: "POST",
  auth : "aditya:729a74a083193903ac8023ae717bd6dd-us1"
}
 const request = https.request(url,options,function(response){

     if(response.statusCode == 200)
     {
       res.sendFile(__dirname + "/success.html");
     }else
    res.sendFile(__dirname + "/failure.html");
     response.on("data",function(data)
   {
      console.log(JSON.parse(data));
   })
 })
 request.write(jsonData);
 request.end();
});
app.post("/failure", function(req,res){
  res.redirect("/");

})
app.listen(process.env.PORT || 3000 ,function(){

  console.log("Server  is running on port 3000");

})


//API KEY
//729a74a083193903ac8023ae717bd6dd-us1
// uniqueid
// 418109449a
