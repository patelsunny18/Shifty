// Importing mocha and chai
// Nick's test suite for server side code for viewing a schedule
const mocha = require('mocha')
const chai = require('chai')
const Schedule = require('../models/schedule');
const mongoose = require('mongoose');
  
const expect = chai.expect

const mongoDB = "mongodb+srv://group10:CMPT370@project.yb52a.mongodb.net/CMPT370Project?retryWrites=true&w=majority"
const test_date = 'test'

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

describe('Data Recieved from server for View Schedule', function(){
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

describe('View Schedule array type check, assumes exists at least one Schedule', function(){
    it('Expect name to be a string', ()=>{
        getSchedule().then( (result) =>{
            expect(typeof(result.data[0])).to.equal('string')
            }
        )
    })
    it('Expect day to be a string', ()=>{
        getSchedule().then( (result) =>{
            expect(typeof(result.data[1])).to.equal('string')
            }
        )
    })
        
})

describe('Check names for given database', function(){
    it('Expect first name on schedule not to be Nick', ()=>{
        getSchedule().then( (result) =>{
            expect(result.data[0]).to.not.equal('Nick')
            }
        )
    })
    it('Expect Sunny to have a sunday night shift', ()=>{
        getSchedule().then( (result) =>{
            expect(result.data[0].sunday).to.not.equal("night")
            }
        )
    })
    it('Expect Sunny to not have a monday shift', ()=>{
        getSchedule().then( (result) =>{
            expect(result.data[0].monday).to.equal('')
            }
        )
    })
    it('Expect Second name on schedule to be Chris', ()=>{
        getSchedule().then( (result) =>{
            expect(result.data[1]).to.equal('Chris')
            }
        )
    })
    it('Expect Third name on schedule to be Aifaz', ()=>{
        getSchedule().then( (result) =>{
            expect(result.data[2]).to.equal('Aifaz')
            }
        )
    })
    it('Expect no more names on the schedule', ()=>{
        getSchedule().then( (result) =>{
            expect(result.data[3].name).to.equal(-1)
            }
        )
    })
})

