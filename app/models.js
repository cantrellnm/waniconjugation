var mongoose = require('mongoose');

var verbSchema = new mongoose.Schema({
  verb: {type: String, required: true, index:true},
  reading: {type: String, required: true, index:true},
  meanings: [String],
  level: Number,
  category: String
});

var en_verbSchema = new mongoose.Schema({
  infinitive: {type: String, required: true, index:true},
  conj: {
    participle: String,
    gerund: String,
    indicative: {
        positive: String,
        negative: String
    },
    past_indicative: {
        positive: String,
        negative: String
    }
  }
});

var adjSchema = new mongoose.Schema({
  word: {type: String, required: true, index:true},
  reading: {type: String, required: true, index:true},
  meanings: [String],
  level: Number,
  category: String
});

mongoose.model('Verb', verbSchema);
mongoose.model('En_verb', en_verbSchema);
mongoose.model('Adjective', adjSchema);