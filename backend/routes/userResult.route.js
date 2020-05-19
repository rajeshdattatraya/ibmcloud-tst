const express = require('express');
const app = express();
const quizRoute = express.Router();

// Results model
let Results = require('../models/Results');
let Candidate = require('../models/Candidate');
array:any=[];	


// Save the user scored results  Results
quizRoute.route('/saveResult').post((req, res, next) => {
console.log("Inside the save results route", req.body);
  Results.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

//Get All Candidates
quizRoute.route('/getresult').get((req, res) => {
  Results.aggregate([
   {$lookup:
     {   from: "candidate",
             localField: "userName",
             foreignField: "username",
             as: "result_users"
     }
   },
   {$sort:
     {
       'updatedDate': -1
     },
     
   }],
   (error,output) => {
     if (error) {
       return next(error)
     } else {
       res.json(output)
     }
   });
})

module.exports = quizRoute;
