Array.prototype.random = function() {
  return this[Math.floor(Math.random()*this.length)];
};
Array.prototype.shuffle = function() {
  for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};

var app = angular.module('waniConj', []);
app.value('wanakana', wanakana);
app.value('conjugate', conjugate);
app.value('responsiveVoice', responsiveVoice);

app.controller('AppController', function($scope, $http, filterFilter) {
  
  $scope.fetchData = function (url, callback) {
    $http.get(url).success(function(data, status, headers, config) {
      if (typeof data === 'object') {
        callback(data, url);
      } else {
        console.log('Error fetching data from '+url);
        console.log(JSON.stringify(data));
      }
    });
  }
  
  // API-KEY VARIABLES AND FUNCTIONS
  
  $scope.APIkey = (localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).APIkey : '';
  $scope.getKey = false;
  $scope.toggleGetKey = function(){$scope.getKey = !$scope.getKey;};
  
  // DOWNLOAD/STORE/UPDATE USER INFO WITH API-KEY
  
  if(localStorage.getItem('userInfo')) {
    $scope.username = JSON.parse(localStorage.getItem('userInfo')).username;
  }
  
  $scope.updateUser = function() {
    $scope.fetchData('/api/user/'+$scope.APIkey, function(data) {
      data.updated_at = Date.now();
      localStorage.setItem('userInfo', JSON.stringify(data));
      if ($scope.getKey) {
        alert('User information updated!');
      } else {
        console.log('user info updated');
      }
      $scope.username = data.username;
      $scope.$apply(function(){$scope.getKey = false;});
    });
  };
  $scope.removeUser = function() {
    localStorage.removeItem('userInfo');
    $scope.APIkey = '';
    $scope.username = '';
  };
  
  if(localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).updated_at < (Date.now()-21600000)) {
    $scope.updateUser();
  }
  
  // FUNCTIONS TO SELECT AND CONJUGATE WORDS
  
  $scope.verbConjugations = function(word) {
    var conjugations;
    if (word.verb === '有る')
      conjugations = conjugate.irregular_verb.aru;
    else if (word.category === 'irregular')
      conjugations = (word.verb === '来る') ? conjugate.irregular_verb.kuru : conjugate.irregular_verb.suru(word) ;
    else
      conjugations = conjugate.verb(word);
    return conjugations;
  };
  $scope.setWord = function(word, list) {
    $scope.word = word;
    if (list === 'verbs')
      $scope.word_conjugations = $scope.verbConjugations(word);
    else
      $scope.word_conjugations = (word.category === 'i-adjective') ? conjugate.i_adjective(word) : conjugate.na_adjective(word) ;
  };
  $scope.setEng = function(wrd, list) {
    if (list === 'verbs') {
      $scope.fetchData('/api/en_verbs/'+wrd, function(data) {
        $scope.eng = data[0];
        $scope.eng_conjugations = conjugate.english_verb(data[0]);
      });
      // $scope.eng = $scope.engList.filter(function(e){return e.infinitive === wrd})[0];
    } else if (list === 'adj') {
      $scope.eng = wrd;
      $scope.eng_conjugations = conjugate.english_adjective($scope.eng);
    }
  };
  $scope.clearWord = function() {
    $scope.word = {};
    $scope.word_conjugations = {};
  };
  $scope.clearEng = function() {
    $scope.eng = {};
    $scope.eng_conjugations = {};
  };
  
  // AVAILABLE OPTIONS FOR TRANSLATION & CONJUGATION
  
  $scope.options = {
    lang: [{display: 'Eng to Jap', sh: 'en'}, {display: 'Jap to Eng', sh: 'jp'}],
    how_many: [{display: 'Cumulative', sh: 'all'}, {display: 'Single Level', sh: 'one'}],
    tenses: [{display: 'indicative', sh: 'indicative', selected: true, forms: ['plain', 'polite']},
            {display: 'past indicative', sh: 'past_indicative', selected: true, forms: ['plain', 'polite']},
            {display: 'presumptive', sh: 'presumptive', selected: false, forms: ['plain', 'polite']},
            {display: 'past presumptive', sh: 'past_presumptive', selected: false, forms: ['plain', 'polite']},
            {display: 'volitional', sh: 'volitional', selected: false, forms: ['plain', 'polite']},
            {display: 'progressive', sh: 'progressive', selected: false, forms: ['plain', 'polite']},
            {display: 'potential', sh: 'potential', selected: false, forms: ['plain', 'polite']},
            {display: 'causative', sh: 'causative', selected: false, forms: ['plain', 'polite']},
            {display: 'passive', sh: 'passive', selected: false, forms: ['plain', 'polite']},
            {display: 'provisional', sh: 'provisional', selected: false, forms: ['plain']},
            {display: 'conditional', sh: 'conditional', selected: false, forms: ['plain', 'polite']},
            {display: 'imperative', sh: 'imperative', selected: false, forms: ['abrupt', 'plain']},
            {display: 'request', sh: 'request', selected: false, forms: ['polite', 'honorific']}
            ],
    adj_tenses: [
        {display: 'indicative', sh: 'indicative', selected: true, forms: ['plain', 'polite']},
        {display: 'past indicative', sh: 'past_indicative', selected: true, forms: ['plain', 'polite']},
        {display: 'presumptive', sh: 'presumptive', selected: false, forms: ['plain', 'polite']},
        {display: 'past presumptive', sh: 'past_presumptive', selected: false, forms: ['plain', 'polite']},
        {display: 'provisional', sh: 'provisional', selected: false, forms: ['plain']},
        {display: 'continuative', sh: 'continuative', selected: false, forms: ['plain', 'polite']},
        {display: 'conditional', sh: 'conditional', selected: false, forms: ['plain', 'polite']},
        {display: 'become', sh: 'become', selected: false},
        {display: 'looks', sh: 'looks', selected: false},
        {display: 'unbearably', sh: 'unbearably', selected: false},
        {display: 'too', sh: 'too', selected: false}
      ],
    pos_neg: ['positive', 'negative'],
    plain_polite: ['plain', 'polite'],
    kanji_kana: ['kanji', 'kana']
  };
  
  // SELECTED OPTIONS FOR TRANSLATION & CONJUGATION
  
  $scope.options.tenses = (localStorage.getItem('tenses')) ? JSON.parse(localStorage.getItem('tenses')) : $scope.options.tenses;
  $scope.options.adj_tenses = (localStorage.getItem('adj_tenses')) ? JSON.parse(localStorage.getItem('adj_tenses')) : $scope.options.adj_tenses;
  
  $scope.kan = $scope.options.kanji_kana[0];
  
  $scope.tenses = [];
  $scope.selectedTenses = function selectedTenses() {
    return filterFilter($scope.options.tenses, { selected: true });
  };
  $scope.$watch('options.tenses|filter:{selected:true}', function (nv) {
    $scope.tenses = nv.map(function (tense) {
      return tense;
    });
    localStorage.setItem('tenses', JSON.stringify($scope.options.tenses));
  }, true);
  
  $scope.adj_tenses = [];
  $scope.selectedAdjTenses = function selectedAdjTenses() {
    return filterFilter($scope.options.adj_tenses, { selected: true });
  };
  $scope.$watch('options.adj_tenses|filter:{selected:true}', function (nv) {
    $scope.adj_tenses = nv.map(function (tense) {
      return tense;
    });
    localStorage.setItem('adj_tenses', JSON.stringify($scope.options.adj_tenses));
  }, true);
  
  // MISC
  
  $scope.getNumber = function(num) {
    return new Array(num);   
  };
  
  $scope.wanakana = wanakana;
});

app.controller('ListController', ['$scope', function($scope) {
  var ctrl = this;
  
  this.level = 0;
  this.displayLevel = function(num, list){
    ctrl.searchFor = '';
    ctrl.level = num;
    $scope.fetchData('/api/'+list+'?level='+num, function(data) {
      ctrl.displayList = data;
    });
  };
  this.myWords = function(list){
    ctrl.level = 0;
    ctrl.displayList = [];
    if(localStorage.getItem('userInfo')) {
      ctrl.displayList = JSON.parse(localStorage.getItem('userInfo'))[list];
    }
  };
  
  this.showWord = false;
  this.openWord = function(word, list) {
    $scope.setWord(word, list);
    $scope.setEng(word.meanings[0], list);
    ctrl.showWord = true;
  };
  this.closeWord = function() {
    $scope.clearWord();
    ctrl.showWord = false;
  };
  
  this.searchFor = '';
  this.findWord = function(list) {
    ctrl.level = 0;
    ctrl.displayList = [];
    $scope.fetchData('/api/'+list+'/search/'+ctrl.searchFor, function(data, url) {
      //only update if returned data is from current search
      if (url === '/api/'+list+'/search/'+ctrl.searchFor)
        ctrl.displayList = data;
    });
  };
}]);

app.controller('ConjugateController', function($scope) {
  var ctrl = this;
  
  this.start = false;
  this.hideAnswer = true;
  
  this.howMany = $scope.options.how_many[0];
  this.level = (localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).level : 10;
  
  this.list_options = [{display:'Verbs',sh:'verbs'},{display:'Adjectives',sh:'adj'}];
  this.whichList = this.list_options[0];
  
  this.forms = {plain: true, polite: true};
  this.i_stem = true;
  this.te_stem = true;
  this.attributive = true;
  this.noun = true;
  this.adverb = true;
  
  function newResponse() {
    return {
      i_stem: '',
      te_stem: '',
      indicative: {
        plain: {positive: '', negative: ''},
        polite: {positive: '', negative: ''}
      },
      past_indicative: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      presumptive: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      past_presumptive: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      progressive: {
        plain: {positive: '', negative: ''},
        polite: {positive: '',negative: ''}
      },
      past_progressive: {
        plain: {positive: '', negative: ''},
        polite: {positive: '',negative: ''}
      },
      imperative: {
        abrupt: {positive: '',negative: ''},
        plain: {positive: '',negative: ''}
      },
      request: {
        polite: {positive: '',negative: ''},
        honorific: {positive: '',negative: ''}
      },
      potential: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      volitional: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      causative: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      passive: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      },
      provisional: {
        plain: {positive: '',negative: ''}
      },
      conditional: {
        plain: {positive: '',negative: ''},
        polite: {positive: '',negative: ''}
      }
    }
  };
  function newAdjResponse() {
    return {
        indicative: {
        positive: '',
        negative: ''
      },
      past_indicative: {
        positive: '',
        negative: ''
      },
      presumptive: {
        positive: '',
        negative: ''
      },
      past_presumptive: {
        positive: '',
        negative: ''
      },
      provisional: {
        positive: '',
        negative: ''
      },
      continuative: {
        positive: '',
        negative: ''
      },
      conditional: {
        positive: '',
        negative: ''
      },
      adverb: '',
      become: '',
      unbearably: '',
      noun: '',
      looks: '',
      too: ''
    };
  };
  this.response = new newResponse();
  
  this.openConj = function() {
    ctrl.makeList(function() {
      ctrl.nextWord();
      if (ctrl.list && ctrl.list.length > 0)
        ctrl.start = true;
    });
  };
  this.submitAnswer = function() {
    ctrl.hideAnswer = false;
  };
  this.nextWord = function() {
    if (!ctrl.list || ctrl.list.length === 0)
      ctrl.makeList(changeWord);
    else
      changeWord();
  };
  function changeWord() {
    ctrl.clearAnswers();
    ctrl.hideAnswer = true;
    $scope.setWord(ctrl.list.pop(), ctrl.whichList.sh);
    $scope.setEng($scope.word.meanings[0], ctrl.whichList.sh);
  }
  this.makeList = function(callback){
    if (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).level === ctrl.level) {
      ctrl.list = JSON.parse(localStorage.getItem('userInfo'))[ctrl.whichList.sh];
      if (ctrl.howMany.sh === 'one')
        ctrl.list = ctrl.list.filter(function(word) {return word.level === ctrl.level;});
      ctrl.list.shuffle();
      if (callback) callback();
    } else {
      if (!ctrl.level)
        ctrl.level = 1;
      var option = (ctrl.howMany.sh === 'one') ? 'level' : 'lte';
      $scope.fetchData('/api/'+ctrl.whichList.sh+'?'+option+'='+ctrl.level, function(data) {
        ctrl.list = data;
        if (ctrl.list)
          ctrl.list.shuffle();
        if (callback) callback();
      });
    }
  };
  this.clearAnswers = function() {
    ctrl.response = (ctrl.whichList.sh === 'verbs')? new newResponse() : new newAdjResponse() ;
  };
});

app.controller('TranslateController', function($scope, filterFilter) {
  var ctrl = this;
  
  this.start = false;
  this.hideAnswer = true;
  
  this.tense = {};
  this.forms = {plain: true, polite: true};
  this.direction = '';
  this.form = '';
  
  this.list_options = [{display:'Verbs',sh:'verbs'},{display:'Adjectives',sh:'adj'}];
  this.whichList = this.list_options[0];
  
  this.response = '';
  this.answers = [];
  this.correct = false;
  
  this.lang = $scope.options.lang[0];
  this.howMany = $scope.options.how_many[0];
  this.level = (localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).level : 10;
  
  this.openTran = function() {
    ctrl.makeList(function() {
      ctrl.nextWord();
      if (ctrl.list && ctrl.list.length > 0)
        ctrl.start = true;
    });
  };
  this.submitAnswer = function() {
    ctrl.correct = ctrl.responseInAnswers();
    ctrl.hideAnswer = false;
  };
  this.nextWord = function() {
    if (!ctrl.forms.plain && !ctrl.forms.polite) {
      ctrl.start = false;
      alert('You need to select plain and/or polite.');
      return;
    }
    if (ctrl.whichList.sh==='verbs'&&$scope.tenses.length === 0 ||
        ctrl.whichList.sh==='adj'&&$scope.adj_tenses.length===0) {
      ctrl.start = false;
      alert('You need to select at least one tense.');
      return;
    }
    if (ctrl.list.length === 0) {
      ctrl.makeList(changeWord);
    } else {
      changeWord();
    }
  };
  function changeWord() {
    ctrl.clearAnswers();
    ctrl.hideAnswer = true;
    ctrl.tense = (ctrl.whichList.sh==='verbs') ? $scope.tenses.random() : $scope.adj_tenses.random();
    ctrl.direction = $scope.options.pos_neg.random();
    if (ctrl.tense.forms) {
      ctrl.form = ctrl.tense.forms.filter(function(form, i){
        if (ctrl.forms.plain && ctrl.forms.polite) {
          return true;
        } else if (ctrl.forms.plain) {
          if (i === 0) return true;
        } else {
          if (i === 1) return true
        }
      }).random();
    } else {
      ctrl.form = '';
    }
    $scope.setWord(ctrl.list.pop(), ctrl.whichList.sh);
    $scope.setEng($scope.word.meanings.random(), ctrl.whichList.sh);
    ctrl.compileAnswers();
  }
  this.makeList = function(callback){
    if (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).level === ctrl.level) {
      ctrl.list = JSON.parse(localStorage.getItem('userInfo'))[ctrl.whichList.sh];
      if (ctrl.howMany.sh === 'one')
        ctrl.list = ctrl.list.filter(function(word) {return word.level === ctrl.level;});
      ctrl.list.shuffle();
      if (callback) callback();
    } else {
      if (!ctrl.level)
        ctrl.level = 1;
      var option = (ctrl.howMany.sh === 'one') ? 'level' : 'lte';
      $scope.fetchData('/api/'+ctrl.whichList.sh+'?'+option+'='+ctrl.level, function(data) {
        ctrl.list = data;
        if (ctrl.list) ctrl.list.shuffle();
        if (callback) callback();
      });
    }
  };
  this.clearAnswers = function() {
    ctrl.response = '';
    ctrl.answers = [];
  };
  this.compileAnswers = function() {
    var answers = [];
    if (ctrl.lang.sh === 'en') {
      $scope.fetchData('/api/'+ctrl.whichList.sh+'/search/'+$scope.eng, function(data) {
        data.forEach(function(word) {
          if (ctrl.whichList.sh === 'verbs') {
            answers.push($scope.verbConjugations(word)[ctrl.tense.sh][ctrl.form][ctrl.direction]);
          } else {
            var conjugations = (word.category === 'i-adjective') ? i_adj_conjugation(word) : na_adj_conjugation(word)
            if (conjugations[ctrl.tense.sh][ctrl.form]) {
              answers.push(conjugations[ctrl.tense.sh][ctrl.form][ctrl.direction]);
            } else {
              answers.push(conjugations[ctrl.tense.sh]);
            }
          }
        });
        ctrl.answers = answers;
      });
    } else {
      $scope.word.meanings.forEach(function(meaning){
        var conj;
        if(ctrl.whichList.sh === 'verbs') {
          $scope.fetchData('/api/en_verbs/'+meaning, function(data) {
            conj = eng_conjugation(data[0]);
            conj[ctrl.tense.sh][ctrl.direction].forEach(function(ans){ answers.push(ans); });
            ctrl.answers = answers;
            ctrl.correct = ctrl.responseInAnswers();
          });
          // var engVerbs = $scope.engList.filter(function(verb){return verb.infinitive === meaning});
          // if (engVerbs.length > 0) {
          //   var conj = $scope.getEngConjugations(engVerbs[0]);
          //   conj[ctrl.tense.sh][ctrl.direction].forEach(function(ans){ answers.push(ans); });
          // }
        } else {
          conj = eng_adj_conjugation(meaning);
          if (conj[ctrl.tense.sh][ctrl.direction]) {
            conj[ctrl.tense.sh][ctrl.direction].forEach(function(ans){ answers.push(ans); });
          } else {
            conj[ctrl.tense.sh].forEach(function(ans){ answers.push(ans); });
          }
          ctrl.answers = answers;
        }
      });
    }
  };
  this.responseInAnswers = function() {
    var correct = false;
    ctrl.answers.forEach(function(answer){
      if (ctrl.lang.sh === 'en') {
        if (answer.kanji === ctrl.response || answer.kana === ctrl.response) {
          correct = true;
        }
      } else {
        if (answer === ctrl.response) {
          correct = true;
        }
      }
    });
    return correct;
  };
});

app.directive('langJa', function($window) {
  return {
    restrict: 'A',
    require: '^ngModel',
    link: function(scope, element, attrs){
      attrs.$set('lang', 'ja');
      if ($window.SpeechSynthesisEvent) {
        element.addClass('clickable');
        element.on('mouseup', function(){responsiveVoice.speak(element.text(),'Japanese Female');});
      }
      scope.$watch(attrs.ngModel, function(value) {
        element.text(value);
      });
    }
  };
});

app.directive('verbConjRow', function() {
  return {
    restrict: 'EA',
    scope: {
      tense: '=',
      jaConj: '=',
      enConj: '=',
      kana: '=',
      forms: '='
    },
    templateUrl: './template/verbRow.html'
  }
});

app.directive('verbInputRow', function() {
  return {
    restrict: 'EA',
    scope: {
      tense: '=',
      jaConj: '=',
      enConj: '=',
      kana: '=',
      forms: '=',
      selectedForms: '=',
      hideAnswer: '=',
      response: '='
    },
    templateUrl: './template/verbInputRow.html'
  }
});

app.directive('adjConjRow', function() {
  return {
    restrict: 'EA',
    scope: {
      tense: '=',
      jaConj: '=',
      enConj: '=',
      kana: '=',
      word: '='
    },
    templateUrl: './template/adjRow.html'
  }
});

app.directive('adjInputRow', function() {
  return {
    restrict: 'EA',
    scope: {
      tense: '=',
      jaConj: '=',
      enConj: '=',
      kana: '=',
      forms: '=',
      selectedForms: '=',
      hideAnswer: '=',
      response: '='
    },
    templateUrl: './template/adjInputRow.html'
  }
});

app.directive('compareResponse', function() {
  return {
    restrict: 'A',
    scope: {
      response: '=',
      answer: '=',
      hideAnswer: '=',
    },
    link: function(scope, element, attrs){
      scope.$watch('hideAnswer', function(value){
        if(value === false) {
          if(scope.response != scope.answer.kanji && scope.response != scope.answer.kana) {
            element.addClass('wrong');
          }
        } else {
          element.removeClass('wrong');
        }
      })
    }
  }
});

app.directive('toHiragana', function(){
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    link: function(scope, element, attrs){
      scope.$watch('ngModel', function(value){
        if (element && value !== '') {
          var eng_text = value.match(/\w+/g);
          if (eng_text) {
            var jap_text = eng_text.map(function(txt){
              if (txt !== 'n') {
                return wanakana.toHiragana(txt);
              } else {
                return txt;
              }
            });
            eng_text.forEach(function(txt, i){
              value = value.replace(txt, jap_text[i]);
            });
            scope.ngModel = value;
          }
        }
      });
    }
  };
});

app.directive('automaticFocus', function($timeout){
  return {
    restrict: 'A',
    scope: {
      hideAnswer: '=',
      start: '='
    },
    link: function(scope, element, attrs){
      scope.$watch('start', function(value){
        if (value === true) {
          if(element.find('input[type="text"]').first()[0]) {
            $timeout(function(){
              element.find('input[type="text"]').first()[0].focus();
            }, 0);
          }
        }
      });
      scope.$watch('hideAnswer', function(value){
        if (value === true) {
          if(element.find('input[type="text"]').first()[0]) {
            $timeout(function(){
              element.find('input[type="text"]').first()[0].focus();
            }, 0);
          }
        }
        if (value === false) {
          $timeout(function(){
            element.parent().parent().find('#next').focus();
          }, 0);
        }
      });
    }
  };
});

app.directive('escCloseWord', function($document){
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      $document.bind('keyup', function(event) {
        if (event.keyCode === 27 && scope.listCtrl.showWord === true) {
          scope.$apply(function(){scope.listCtrl.closeWord()});
        }
      })
    }
  };
});
    