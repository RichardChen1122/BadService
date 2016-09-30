var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BearSchema = new Schema({ name: String, customtype: { type: Number, min: 0, max: 1 }, customdate: Date, customcount: Number, number: Number, total: Number });

module.exports = mongoose.model('Bear', BearSchema);
