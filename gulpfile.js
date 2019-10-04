const gulp = require('gulp');
const mongodbData = require('gulp-mongodb-data');

const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/waniconjugation';

gulp.task('dbimport', function() {

  console.log("Importing data from data/*.json files");

  const verbs = gulp.src('./data/verbs.json')
    .pipe(mongodbData({
      mongoUrl: dbURI,
      collectionName: 'verbs',
      dropCollection: true
    }));

  const en_verbs = gulp.src('./data/en_verbs.json')
    .pipe(mongodbData({
      mongoUrl: dbURI,
      collectionName: 'en_verbs',
      dropCollection: true
    }));

  const adjectives = gulp.src('./data/adjectives.json')
    .pipe(mongodbData({
      mongoUrl: dbURI,
      collectionName: 'adjectives',
      dropCollection: true
    }));

  return Promise.all([ verbs, en_verbs, adjectives ]);
})
