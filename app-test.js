const mongoose = require("mongoose");
const server = require("./app");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

describe('Planets API Suite', () => {
  describe('Fetching Planet Details', () => {

    const planetTests = [
      { id: 1, name: 'Mercury' },
      { id: 2, name: 'Venus' },
      { id: 3, name: 'Earth' },
      { id: 4, name: 'Mars' },
      { id: 5, name: 'Jupiter' },
      { id: 6, name: 'Saturn' },
      { id: 7, name: 'Uranus' },
      { id: 8, name: 'Neptune' }
    ];

    planetTests.forEach(test => {
      it(`should fetch a planet named ${test.name}`, async () => {
        const res = await chai.request(server).post('/planet').send({ id: test.id });
        res.should.have.status(200);
        res.body.should.have.property('id').eql(test.id);
        res.body.should.have.property('name').eql(test.name);
      });
    });
  });
});

// Tests for other endpoints
describe('Testing Other Endpoints', () => {

  it('should fetch OS details', async () => {
    const res = await chai.request(server).get('/os');
    res.should.have.status(200);
    res.body.should.have.property('os');
  });

  it('should check Liveness endpoint', async () => {
    const res = await chai.request(server).get('/live');
    res.should.have.status(200);
    res.body.should.have.property('status').eql('live');
  });

  it('should check Readiness endpoint', async () => {
    const res = await chai.request(server).get('/ready');
    res.should.have.status(200);
    res.body.should.have.property('status').eql('ready');
  });
});

// Optional cleanup after tests
after(async () => {
  await mongoose.connection.close();
});
