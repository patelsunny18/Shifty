// Ivan - test suite for server side code for logging in

// Import Model
const mocha = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
var Employee = require('../models/employee');
var Manager = require('../models/manager');
var Owner = require('../models/owner');
const { getEmployeeId, getEmployeeIdfromDatabase } = require('../serverfuncs');

// import the server 
const server = require('../server');
const serverfuncs = require('../serverfuncs')


const should = chai.should();
var mongoose = require("mongoose");
// use chaiHttp for making the actual HTTP requests        
chai.use(chaiHttp);
const expect = chai.expect



describe('login page', function() {
    it('should navigate to login page', function(done) {
        chai.request("http://localhost:8080")
        .get('/')
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
    }
);
});

describe('Login employee page', () => {
    it('should navigate to employee page',() => {
        return chai.request('http://localhost:8080')
            .get('/employee/622d96a9c6b90d7ac27bf842')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('Login manager page', () => {
    it('should navigate to manager page',() => {
        return chai.request('http://localhost:8080')
            .get('/manager/622db2ab390ab17968ba43fe')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('Login owner page', () => {
    it('should navigate to owner page',() => {
        return chai.request('http://localhost:8080')
            .get('/owner/6217f84fc0e8e57587a58bb1')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});


describe('check if employee id is valid', () => {
    it('should return true', () => {
        let id = '236335';
        let result = serverfuncs.validateEmployeeId(id)
        expect(result).to.equal(true);
    });
});

describe('check if employee id is invalid', () => {
    it('should return false', () => {
        let id = '123123123123';
        let result = serverfuncs.validateEmployeeId(id)
        expect(result).to.equal(false);
    });
});

describe ('check if manager id is valid', () => {
    it('should return true', () => {
        let id = '8488232';
        let result = serverfuncs.validateManagerId(id)
        expect(result).to.equal(true);
    });
});

describe ('check if manager id is invalid', () => {
    it('should return false', () => {
        let id = '112';
        let result = serverfuncs.validateManagerId(id)
        expect(result).to.equal(false);
    });
});

describe ('check if owner id is valid', () => {
    it('should return true', () => {
        let id = '12345';
        let result = serverfuncs.validateOwnerId(id)
        expect(result).to.equal(true);
    });
});

describe ('check if owner id is invalid', () => {
    it('should return false', () => {
        let id = '123';
        let result = serverfuncs.validateOwnerId(id)
        expect(result).to.equal(false);
    });
});

describe ('check Login user', () => {
    it('should return employee', async () => {
        let id = '375738';
        let password = 'e6JvC5bKy';
        return serverfuncs.checkEmployeeLogin(id, password)
            .then((employee) => {
                expect(employee).to.be.an('object');
            }
        );
    })
    it ('should return manager', () => {
        let id = '3963318';
        let password = 'FHPb4grX';
        return serverfuncs.checkManagerLogin(id, password)
            .then((manager) => {
                expect(manager).to.be.an('object');
            }
        );
    })   
    it ('should return owner', () => {
        let id = '12345';
        let password = 'iamdummy';
        return serverfuncs.checkOwnerLogin(id, password)
            .then((owner) => {
                expect(owner).to.be.an('object');
            }
        );
    })
});


describe('check if employee session is working', () => {
    it('should return true', () => {
        return chai.request('http://localhost:8080/employee/:id')
            .get('/employee/622d96a9c6b90d7ac27bf842')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('check if manager session is working', () => {
    it('should return true', () => {
        return chai.request('http://localhost:8080/manager/:id')
            .get('/manager/622db2ab390ab17968ba43fe')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('check if owner session is working', () => {
    it('should return true', () => {
        return chai.request('http://localhost:8080/owner/:id')
            .get('/owner/6217f84fc0e8e57587a58bb1')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
}
);


describe('check if employee session is not working', () => {
    it('should return false', () => {
        return chai.request('http://localhost:8080/employee/:id')
            .get('/employee/622d96a9c6b90d7ac27bf842')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('check if manager session is not working', () => {
    it('should return false', () => {
        return chai.request('http://localhost:8080/manager/:id')
            .get('/manager/622db2ab390ab17968ba43fe')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('check if owner session is not working', () => {
    it('should return false', () => {
        return chai.request('http://localhost:8080/owner/:id')
            .get('/owner/6217f84fc0e8e57587a58bb1')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});


describe('check if logged out & destroyed employee session', () => {
    it('should destroy employee session', () => {
        return chai.request('http://localhost:8080')
            .get('/employee/logout')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('check if logged out & destroyed manager session', () => {
    it('should destroy manager session', () => {
        return chai.request('http://localhost:8080')
            .get('/manager/logout')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});

describe('check if logged out & destroyed session', () => {
    it('should destroy owner session', () => {
        return chai.request('http://localhost:8080')
            .get('/owner/logout')
            .send()
            .then((res) => {
                res.should.have.status(200);
            }
        );
    });
});
