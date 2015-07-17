// import the moongoose helper utilities
//var utils = require('./utils');
var request = require('supertest');
var should = require('should');
var app = require('../server').app;
var Chance = require('chance');
var chance = new Chance();
var siteid = '000';
var pageid = '';
var galid = '';
var imgid = '';
var mockuser = 'demo@governor.io';
var imgTwo = '';

describe('GET /account', function(){
  it('responds with json', function(done){
    request(app)
      .get('/api/account')
      .set('Accept', 'application/json')
      .set('X-Token', 'QQEQWE')
      .set('X-User', mockuser)
      .expect('Content-Type', /json/)
      .expect(200)
        .end(function(err, res){
        if (err)
        {
            return done(err);
        }
        res.body.should.have.property('_id');
        res.body.should.have.property('email');
        res.body.email.should.equal(mockuser);
        done();
      });
  });
});

describe('GET /sites', function(){
  it('responds with json', function(done){
    request(app)
      .get('/api/sites')
      .set('Accept', 'application/json')
      .set('X-Token', 'QQEQWE')
      .set('X-User', mockuser)
      .expect('Content-Type', /json/)
      .expect(200)
        .end(function(err, res){
        if (err)
        {
            return done(err);
        }
        res.body[0].should.have.property('_id');
        siteid = res.body[0]._id; 
        done();
      });
  });
});

describe('GET /sites/:id', function(){
  it('responds with json', function(done){
    request(app)
      .get('/api/sites/'+siteid)
      .set('Accept', 'application/json')
      .set('X-Token', 'QQEQWE')
      .set('X-User', mockuser)
      .expect('Content-Type', /json/)
      .expect(200)
        .end(function(err, res){
        if (err)
        {
            return done(err);
        } 
        res.body.should.have.property('_id');
        done();
      });
  });
});

// describe('ADD A LIBRARY', function(){
//   it('responds with gallery json', function(done){
//     request(app)
//       .get('/api/sites/' + siteid + '/library/')
//       .set('Accept', 'application/json')
//       .set('X-Token', 'QQEQWE')
//       .set('X-User', 'test@domain1.com')
//       .expect('Content-Type', /json/)
//       .expect(200)
//         .end(function(err, res){
//         if (err)
//         {
//             console.log(res.body);
//             return done(err);
//         } 
//         done();
//       });
//   });
// });

describe('GET LIBRARY', function(){
  it('responds with gallery json', function(done){
    request(app)
      .get('/api/sites/' + siteid + '/library/')
      .set('Accept', 'application/json')
      .set('X-Token', 'QQEQWE')
      .set('X-User', mockuser)
      .expect('Content-Type', /json/)
      .expect(200)
        .end(function(err, res){
        if (err)
        {
            console.log(res.body);
            return done(err);
        } 
        done();
      });
  });
});


describe('Upload a template', function(){
  it('responds with template set', function(done){
    request(app)
      .post('/api/sites/' + siteid + '/templateSets')
      .set('Accept', 'application/json')
      .set('X-Token', 'QQEQWE')
      .set('Content-Type', 'multipart/form-data')
      .set('X-User', mockuser)
      .attach('files', __dirname + '/fixtures/tempset.zip')
      .expect('Content-Type', /json/)
      .expect(200)
        .end(function(err, res){
        if (err)
        {
            return done(err);
        } 
        res.body.should.have.property('_id');
        res.body.should.have.property('site');
        res.body.should.have.property('name');
        res.body.should.have.property('isExtracted');
        console.log(res.body);
        done();
      });
  });
});

describe('Create a gallery and upload image', function(){
  it('responds with created gallery', function(done){
    request(app)
    .post('/api/sites/' + siteid + '/media')
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .type('form')
    .send('name=' + chance.word())
    .set('X-User', mockuser)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res){
      if (err)
      {
        console.log(err);
        return done(err);
      } 
      res.body.should.have.property('_id');
      res.body.should.have.property('site');
      res.body.should.have.property('name');
      res.body.should.have.property('entityType');
      res.body.entityType.should.equal('gallery');
      galid = res.body._id;
      console.log(res.body);
      return done();
    });
  });
//         describe('Upload image to gallery', function(){
  it('can accept image', function(done){
    this.timeout(10000);
    console.log('posting image');
    request(app)
    .post('/api/sites/' + siteid + '/media/' +galid + '/images')
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .set('Content-Type', 'multipart/form-data')
    .set('X-User', mockuser)
    .attach('files', __dirname + '/fixtures/images/jpg1.jpg')
    .attach('files', __dirname + '/fixtures/images/jpg2.jpg')
    .attach('files', __dirname + '/fixtures/images/jpg2.jpg')
    .attach('files', __dirname + '/fixtures/images/gif1.gif')
    .expect('Content-Type', /json/)
    .expect(200)
      .end(function(err, res){
      if (err)
      {
        console.log(err);
        return done(err);
      } 
      res.body[0].should.have.property('_id');
      res.body[0].should.have.property('cdnUrl');
      res.body[0].should.have.property('entityType');
      res.body[0].should.have.property('gallery');
      res.body[0].entityType.should.equal('image');
      res.body[0].gallery.should.equal(galid);
      imgid = res.body[0]._id;
      imgTwo = res.body[1]._id;
      console.log(res.body[0]);
      done();
      });
    });
});

describe('Get uploaded image', function(){
  it('responds with created image', function(done){
    request(app)
    .get('/api/sites/' + siteid + '/media/' + galid + '/images/' + imgid)
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .set('X-User', mockuser)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res){
      if (err)
      {
        console.log(err);
        return done(err);
      } 
      res.body.should.have.property('_id');
      res.body.should.have.property('cdnUrl');
      res.body.should.have.property('x');
      res.body.should.have.property('entityType');
      res.body.entityType.should.equal('image');
      console.log(res.body);
      return done();
    });
  });
});

describe('Edit uploaded image', function(){
  var newtitle = chance.word();
  it('can accept updated image info', function(done){
    request(app)
    .put('/api/sites/' + siteid + '/media/' +galid + '/images/' + imgid)
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .set('Content-Type', 'multipart/form-data')
    .set('X-User', mockuser)
    .type('form')
    .send('x=30'+
      '&y=30'+
      '&title='+newtitle)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res){
    if (err)
    {
      console.log(err);
      return done(err);
    } 
    res.body.should.have.property('_id');
    res.body.should.have.property('cdnUrl');
    res.body.should.have.property('title');
    res.body.should.have.property('entityType');
    res.body.should.have.property('gallery');
    res.body.entityType.should.equal('image');
    res.body.title.should.equal(newtitle);
    res.body.gallery.should.equal(galid);
    console.log(res.body[0]);
    done();
    });
  });
});

describe('Delete uploaded image', function(){
  it('responds with success', function(done){
    request(app)
    .delete('/api/sites/' + siteid + '/media/' + galid + '/images/' + imgid)
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .set('X-User', mockuser)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res){
      if (err)
      {
        console.log(err);
        return done(err);
      } 
      console.log(res.body);
      return done();
    });
  });
});

describe('Create a page and update it', function(){
  it('responds with created page', function(done){
    request(app)
    .post('/api/sites/' + siteid + '/pages')
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .set('X-User', mockuser)
    .type('form')
    .send('name=galleryname'+
      '&isVisible=false'+
      '&template=54dbb6fe5adc8400000001f1'+
      '&navTitle=navigation+title'+
      '&metaTitle=testing+meta+title'+
      '&metaDescription=testing+meta+desc'+
      '&permalink=testing-permalink'+
      '&alternateURL=alturl')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res){
      if (err)
      {
        console.log(err);
        return done(err);
      }
      console.log('created page!')
      console.log(res.body._id);
      res.body.should.have.property('_id');
      res.body.should.have.property('site');
      res.body.should.have.property('name');
      res.body.should.have.property('isVisible');
      res.body.should.have.property('entityType');
      res.body.entityType.should.equal('page');
      res.body.isVisible.should.equal('false');
      pageid = res.body._id;
      return done();
    });
  });
//         describe('Upload image to gallery', function(){
});

describe('update created page', function(){
it('can update created page', function(done){
    var newname = chance.word();
    var metatitle = 'newmetatitle';
    console.log('posting image');
    request(app)
    .put('/api/sites/' + siteid + '/pages/' +pageid )
    .set('Accept', 'application/json')
    .set('X-Token', 'QQEQWE')
    .set('Content-Type', 'multipart/form-data')
    .set('X-User', mockuser)
    .type('form')
    .send('name=' + newname +
      '&isVisible=true'+
      '&template=54dbb6fe5adc8400000001f1'+
      '&navTitle='+ newname +
      '&metaTitle=' + metatitle +
      '&metaDescription=testing+meta+desc'+
      '&permalink=testing-permalink'+
      '&alternateURL=alturl')
    .expect(200)
    .expect('Content-Type', /json/)
      .end(function(err, res){
      if (err)
      {
        console.log(err);
        return done(err);
      } 
      res.body.should.have.property('_id');
      res.body.should.have.property('site');
      res.body.should.have.property('name');
      res.body.should.have.property('entityType');
      res.body.should.have.property('metaTitle');
      res.body.should.have.property('isVisible');
      res.body.entityType.should.equal('page');
      res.body.metaTitle.should.equal(metatitle);
      res.body.name.should.equal(newname);
      res.body.isVisible.should.equal('true');
      res.body._id.should.equal(pageid);
      console.log(res.body[0]);
      done();
      });
    });
});




