
// Importing mocha and chai
const mocha = require('mocha')
const chai = require('chai')
  
// Importing fareutils.js where our code is written
const serverfuncs = require('../serverfuncs')
  
const expect = chai.expect

describe('Manager ID Tests', function(){
    it('Expect the id to be a string of length 7', ()=>{
        let str = serverfuncs.getManagerId()
        expect(str.length).to.equal(7)
    })
    it('Expect the manager id to be a string', ()=>{
        let type = typeof(serverfuncs.getManagerId())
        expect(type).to.equal('string')
    })
})