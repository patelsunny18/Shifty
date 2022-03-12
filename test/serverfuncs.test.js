
// Importing mocha and chai
const mocha = require('mocha')
const chai = require('chai')
  

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

describe('Employeee ID Tests', function(){
    it('Expect the id to be a string of length 6', ()=>{
        let str = serverfuncs.getEmployeeId()
        expect(str.length).to.equal(6)
    })
    it('Expect the employee id to be a string', ()=>{
        let type = typeof(serverfuncs.getEmployeeId())
        expect(type).to.equal('string')
    })
})

describe('Password Tests', function(){
    it('Expect the id to be a string of length 7', ()=>{
        let str = serverfuncs.getPassword()
        expect(str.length).to.be.above(5)
    })
    it('Expect the password to be a string', ()=>{
        let type = typeof(serverfuncs.getPassword())
        expect(type).to.equal('string')
    })
})