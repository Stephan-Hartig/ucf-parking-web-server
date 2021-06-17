import express = require('express');

export let getHomePage: express.RequestHandler = async function(req, res) {
   const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
   console.log(ip);
   res.render('index.ejs', {
      title: 'Home'
   });
}


