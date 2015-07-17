var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TestSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true, default: "test schema" },
   
}, {
    collection: 'test'
});

module.exports = mongoose.model('TestSchema', TestSchema);
