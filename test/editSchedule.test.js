// Importing mocha and chai
// Nick's test suite for server side code for editing a schedule
const mocha = require('mocha')
const chai = require('chai')
const Schedule = require('../models/schedule');
const mongoose = require('mongoose');
  
const expect = chai.expect

const mongoDB = "mongodb+srv://group10:CMPT370@project.yb52a.mongodb.net/CMPT370Project?retryWrites=true&w=majority"

const test_date = 'test';

let changes = []

const connection = async() => {
    await mongoose.connect(mongoDB)
    .then((result) => {
        console.log("Connected to DB")
    })
    .catch((err) => {
        console.log(err)
    })
}

async function getSchedule(req, res) {

    const schedule = await Schedule.find({ week: test_date }).then((result) => {
        if (result.length == 0) {
            console.log('No Schedule')
        }
        else {
            return result[0].schedule;
        }
    }
    )

};

async function editSchedule(req, res) {
    const schedule = await Schedule.findOneAndUpdate({ week: test_date }, { schedule: changes }).then((result) => {
        return true
    })
}



describe('Data Recieved from server for Edit Schedule', function(){
    it('Expect data to be defined', ()=>{
        getSchedule().then( (result) =>{
            expect(typeof(result)).to.equal('object')
        }
        )
        })
    it('Expect data to contain Array', ()=>{
        getSchedule().then( (result) =>{
            expect(typeof(result.data)).to.equal('object')
        }
        )
    })
    it('Expect Array data to not be empty', ()=>{
        getSchedule().then( (result) =>{
            expect(typeof(result.data.length)).to.be.above(0)
        }
        )
    })
    })