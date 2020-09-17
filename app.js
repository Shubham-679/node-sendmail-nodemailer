const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

// view engine setup

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')
app.locals.layout = false;
//static folder

app.use('/public',express.static(path.join(__dirname,'public')))


// middlewares

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', (req, res) => res.render('contact'))

app.post('/send', (req, res)=>{
    console.log(req.body);
    const output = `
    <p> you have a new contact request</p>
    <h3>contact details</h3>
    <ul>
    <li> Name:${req.body.name} </li>
    <li> Company:${req.body.company} </li>
    <li> Email:${req.body.email} </li>
    <li> Phone:${req.body.phone} </li>
    </ul>    
    <h3>message</h3>
    <p> ${req.body.message}</p>
    `;
      
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'abc123@gmail.com',
        pass: 'your password'
      },
  
      tls:{
        rejectUnauthorized:false
      }
  });

  // Message object
  let message = {
      from: '"abc"<abc123@gmail.com>',
      to: '"xyz"<xyz123@ethereal.email>',
      subject: 'Nodemailer is unicode friendly ✔',
      text: 'Hello to myself!',
      html: output,
  };

  transporter.sendMail(message, (err, info) => {
      if (err) {
          console.log('Error occurred. ' + err.message);
          return process.exit(1);
      }

      console.log('Message sent: %s', info.messageId);
      // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.render('contact', {msg:'Email has been sent'});
    });

  
}); 

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
