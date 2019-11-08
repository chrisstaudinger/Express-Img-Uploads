const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config()

const app = new express();

// in memory storage for multer
const storage = multer.memoryStorage()

// These are the fields being retireved from the form
const fields = [
  {name: 'name'},
  {name: 'image'}
]

// middleware mutler function to pass to the endpoint
const upload = multer({ storage: storage }).fields(fields);

// we need cors for the different ports
app.use(cors())


// add s3 credentials using .env
let s3credentials = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY
});



// where our endpoint will go in a second
app.post('/upload', upload, (req, res) => {
  const { name } = req.body
  const { image } = req.files
  const uniqueValue = 'cjstaudinger'
  const key = Buffer.from(`${uniqueValue}${image[0].originalname}`).toString('base64')

  let fileParams = {
    Bucket: process.env.BUCKET,
    Body: image[0].buffer,
    Key: name,
    ACL: 'public-read',
    ContentType: image[0].mimetype
  }

  s3credentials.upload(fileParams, (err, data) => {
    if (err) {
      res.send('you got an error ❌')
    } else {
      console.log('Image succesfully uploaded ✅')
      res.send(data.Location)
    }
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`listening to PORT: ${PORT} 🙂`))