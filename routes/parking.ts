import express = require('express');
import dayjs = require('dayjs');
import norm = require('ucf-database');
import {conn} from '../app';


const router = express.Router();

router.route('/').get(async (req, res) => {
   res.render('parking.ejs', {
      title: 'UCF Parking Data',
      linkToday: '/parking/' + dayjs().format('YYYY-MM-DD')
   });
});

function chartJSData(rawData: any): any {
   const colors = [
      'rgb(127, 127,   0)',
      'rgb(  0, 255,   0)',
      'rgb(255,   0,   0)',
      'rgb(  0,   0, 255)',
      'rgb( 63,   63, 63)',
      'rgb(127, 255, 255)',
      'rgb(195,   0, 195)'
   ];

   // Set labels.
   let labels = [];
   for (const garage of rawData[0].hour) {
      labels.push(garage.hourPretty);
   }

   // Set datapoints for each garage.
   let datasets = [];
   // For each garage...
   for (const garage of rawData) {
      const color = (colors.length > 1) ? colors.pop() : colors[0];
      let dataset:any = {
         label: garage.name,
         data: [],
         backgroundColor: color,
         borderColor: color
      };
      // ...set datapoints.
      for (const hour of garage.hour) {
         if (hour.data) {
            let percentFilled = (1 - hour.data.available / hour.data.capacity) * 100;
            percentFilled = (percentFilled < 0)   ? 0   :
                            (percentFilled > 100) ? 100 :
                            percentFilled;
            dataset.data.push(percentFilled);
         }
         else {
            dataset.data.push(null);
         }
      }
      datasets.push(dataset);
   }

   // Consolidate.
   return { labels, datasets};
}

function chartJSOptions() {
   return {
      responsive: true,
      scales: {
         y: {
            //suggestedMin: 0,
            //suggestedMax: 100,
            min: 0,
            max: 100,
            title: {
               text: 'Percent filled',
               //align: 'center',
               display: true
            }
         },
         x: {
            title: {
               text: 'Hour',
               //align: "center",
               display: true
            }
         }
      }
   };
}

async function parkingDatehour(req: any, res: any) {
   const date = req.params.date;
   const dateFancy = dayjs(req.params.date).format('MMMM D, YYYY');
   const dateURLLeft = dayjs(req.params.date).subtract(1, 'day').format('YYYY-MM-DD');
   const dateURLRight = dayjs(req.params.date).add(1, 'day').format('YYYY-MM-DD');

   let garages:any = await norm.getGarages(conn);
   for (let garage of garages) {
      const garageId = garage.id;
      garage.hour = [];
      for (let i = 0; i < 24; i++) {
         garage.hour[i] = {
            data: await norm.getNorm(conn, garageId, date + ' ' + dayjs().hour(i).format('HH')),
            hour: i,
            hourPretty: dayjs().hour(i).format('HH')
         };
      }
   }
   res.render('parking-chart.ejs', {
      title:      'UCF Parking Data for ' + dateFancy,
      dateFancy: dateFancy,
      date:       date,
      data:       garages,
      chartData:  chartJSData(garages),
      chartOptions: chartJSOptions(),
      linkRight:  '/parking/' + dateURLRight,
      linkLeft:   '/parking/' + dateURLLeft
   });
}

router.route('/:date(\\d{4}-\\d{2}-\\d{2})').get(async (req, res) => {
   parkingDatehour(req, res);
});

//router.route('/:date(\\d{4}-\\d{2}-\\d{2})/:hour(\\d\\d?)').get(async (req, res) => {
//   parkingDatehour(req, res);
//});


module.exports = router;

