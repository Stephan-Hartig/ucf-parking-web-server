import express = require('express');
import cors = require('cors');
import mysql = require('mysql');
require('dotenv').config();


/**
 * Augment the global variable with `conn`.
 */
declare global {
   namespace NodeJS {
      interface Global {
         document: Document;
         window: Window;
         navigator: Navigator;
         conn: mysql.Connection;
      }
   }
}
global.conn = mysql.createConnection({
   host:       process.env.DB_HOST,
   user:       process.env.DB_USER,
   password:   process.env.DB_PASSWORD,
   database:   process.env.DB_DATABASE
});
export let conn = global.conn;

import index = require('./routes/index');
const parking: express.Router = require('./routes/parking');
const port = 8080;
const app = express();

/* Configure middleware. */
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use('/static', express.static('public'));


/* Configure routing. */
app.get('/', index.getHomePage);
app.use('/parking', parking as express.Router);

/* Start both servers. */
conn.connect((e) => {
   if (e) throw e;
   app.listen(port, () => {
      console.log(`Web server listening on port ${port}.`);
   });
});

