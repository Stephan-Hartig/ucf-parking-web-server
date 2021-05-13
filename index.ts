import express = require('express');
//import {getGarages} from '../db/garage';


import {conn} from '../app';









export let getHomePage: express.RequestHandler = async function(req, res) {
   res.render('index.ejs', {
      title: 'Home'
   });
}

export let getParkingPage: express.RequestHandler = async function(req, res) {
   res.render('parking.ejs', {
      title: 'UCF Parking Data'
   });
}









