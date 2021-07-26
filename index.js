const sushiData = require('@sushiswap/sushi-data');
const nodemailer = require('nodemailer');

let isSent = false

setInterval(() => {
  isSent = false
}, 3600000)

const sendEmail = (cost) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.email,
      pass: config.pass
    }
  });

  let mailOptions = {
    from: config.email,
    to: config.email,
    subject: `$${cost} per token`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

setInterval(() => {
  sushiData.exchange.pair({ pair_address: config.pair_address })
    .then(res => {
      let cost = res.token0.derivedETH / res.token1.derivedETH

      if (cost > config.max || cost < config.min) {
        if (!isSent){
          sendEmail(cost)
          isSent = true
        }
      }

      console.log(`${new Date(Date.now()).toLocaleString()}: ${cost}`)
    })
    .catch(e => console.log('error: ' + e))

}, 60000)

