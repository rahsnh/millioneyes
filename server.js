const express = require('express');
const bodyParser = require('body-parser');
// Multer to handle the files from forms
const multer = require("multer");
// Sizeof to find the dimensions of the image
const sizeOf = require('image-size');
var date = null;
const storage = multer.diskStorage({
   destination: function(req, file, callback) {
       callback(null, "./uploads/images");
   },
   filename: function(req, file, callback) {
      date = Date.now()
      callback(null, date + "_" + file.originalname);
   }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000}
 });

const app = express();
const PORT = 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/upload", upload.single('myImage'), (req,res,next) => {
   if (req.file) {
      sizeOf('uploads/images/'+date+"_"+req.file.originalname, function (err, dimensions) {
         res.json({success: true, width: dimensions.width, height: dimensions.height});
       });
   } else {
      res.json({success: false});
   }
});

app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});