/**
 * UserController tests
 * @module tests/user
 * @requires module:../../utils/db
 */

import dbClient from '../../utils/db';

/**
 * @description Test the UserController
 */
describe('+ UserController', () => {
  const mockUser = {
    email: 'soufiane@green.com',
    password: 'soufiane19',
  };

  /**
   * @description Make sure the user exists
   * @listens done
   * @function before
   */
  before(function (done) {
    this.timeout(10000);
    dbClient.usersCollection()
      .then((usersCollection) => {
        usersCollection.deleteMany({ email: mockUser.email })
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
    setTimeout(done, 5000);
  });

  /**
   * @description POST /users
   * @listens done
   */
  describe('+ POST: /users', () => {
    /**
     * @description User creation fails if there is no email
     * @listens done
     * @function it
     */
    it('+ Fails when there is no email and there is password', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          password: mockUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Missing email' });
          done();
        });
    });

    /**
     * @description User creation fails if there is email but no password
     * @listens done
     * @function it
     */
    it('+ Fails when there is email and there is no password', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: mockUser.email,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Missing password' });
          done();
        });
    });

    /**
     * @description User creation succeeds when the new user has a password and email
     * @listens done
     * @function it
     */
    it('+ Succeeds when the new user has a password and email', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.email).to.eql(mockUser.email);
          expect(res.body.id.length).to.be.greaterThan(0);
          done();
        });
    });

    /**
     * @description User creation fails if the user already exists
     * @listens done
     * @function it
     */
    it('+ Fails when the user already exists', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Already exist' });
          done();
        });
    });
  });

});

