Array.prototype.random = function() {
  return this[Math.floor(Math.random()*this.length)];
};
Array.prototype.shuffle = function() {
  for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};

var app = angular.module('waniConj', []);
app.value('wanakana', wanakana);
app.value('conjugate', conjugate);
app.value('kuru_conjugation', kuru_conjugation);
app.value('suru_conjugation', suru_conjugation);
app.value('suru_conjugation', eng_conjugation);
app.value('i_adj_conjugation', i_adj_conjugation);
app.value('na_adj_conjugation', na_adj_conjugation);
app.value('eng_adj_conjugation', eng_adj_conjugation);
app.value('responsiveVoice', responsiveVoice);

app.controller('AppController', function($scope, $http, filterFilter) {
  
  if(localStorage.getItem('userInfo')) {
    $scope.username = JSON.parse(localStorage.getItem('userInfo')).username;
  }
  
  
  $scope.APIkey = (localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).APIkey : '';
  $scope.getKey = false;
  $scope.toggleGetKey = function(){$scope.getKey = !$scope.getKey;};
  
  $scope.updateUser = function() {
    $.ajax({url: "https://www.wanikani.com/api/user/"+$scope.APIkey+"/vocabulary/", dataType: 'jsonp', success: function(data, status, headers, config) {
      if (data.error || status !== 'success') {
        if ($scope.getKey) {
          alert('Error fetching data from WaniKani');
        }
        console.log(JSON.stringify(data.error));
      } else {
        var saveStuff = {
          username: data.user_information.username,
          level: data.user_information.level,
          APIkey: $scope.APIkey,
          verbsList: [],
          adjList: [],
          updated_at: Date.now()
        };
        data.requested_information.general.forEach(function(word, i, arr){
          var verb = $scope.verbsList.filter(function(v){return v.verb === word.character;});
          var adj = $scope.adjList.filter(function(a){return a.word === word.character});
          if (verb.length > 0 && word.user_specific) {
            saveStuff.verbsList.push(verb[0]);
          }
          if (adj.length > 0 && word.user_specific) {
            saveStuff.adjList.push(adj[0]);
          }
        });
        localStorage.setItem('userInfo', JSON.stringify(saveStuff));
        if ($scope.getKey) {
          alert('User information updated!');
        } else {
          console.log('user info updated');
        }
        $scope.username = saveStuff.username;
        $scope.$apply(function(){$scope.getKey = false;});
      }
    }});
  };
  $scope.removeUser = function() {
    localStorage.removeItem('userInfo');
    $scope.APIkey = '';
    $scope.username = '';
  };
  
  // UPDATE USER INFO HERE IF OLD
  
  if(localStorage.getItem('verbsList') && JSON.parse(localStorage.getItem('verbsList')).updated_at > (Date.now()-86400000)) {
    $scope.verbsList = JSON.parse(localStorage.getItem('verbsList')).verbs;
    console.log('loading verbs list from '+(Date.now()-JSON.parse(localStorage.getItem('verbsList')).updated_at)+' ago');
    if($scope.verbsList.length === 0) {
      console.log('Warning: verbslist is empty.');
    }
    if(localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).updated_at < (Date.now()-21600000)) {
      $scope.updateUser();
    }
  } else {
    $http.get("./json/verbs.json").success(function(data, status, headers, config) {
      $scope.verbsList = data.verbs;
      localStorage.setItem('verbsList', JSON.stringify({"updated_at": Date.now(), "verbs": data.verbs}));
      console.log('downloaded verbs');
      if($scope.verbsList.length === 0) {
        console.log('Warning: verbslist is empty.');
      }
      if(localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).updated_at < (Date.now()-21600000)) {
        $scope.updateUser();
      }
    });
  }
  if(localStorage.getItem('verbsEngList') && JSON.parse(localStorage.getItem('verbsEngList')).updated_at > (Date.now()-86400000)) {
    $scope.engList = JSON.parse(localStorage.getItem('verbsEngList')).verbs;
    console.log('loading eng list from '+(Date.now()-JSON.parse(localStorage.getItem('verbsEngList')).updated_at)+' ago');
  } else {
    $http.get("./json/verbsEng.json").success(function(data, status, headers, config) {
      $scope.engList = data.verbs;
      localStorage.setItem('verbsEngList', JSON.stringify({"updated_at": Date.now(), "verbs": data.verbs}));
      console.log('downloaded eng');
    });
  }
  if(localStorage.getItem('adjList') && JSON.parse(localStorage.getItem('adjList')).updated_at > (Date.now()-86400000)) {
    $scope.adjList = JSON.parse(localStorage.getItem('adjList')).words;
    console.log('loading adjectives from '+(Date.now()-JSON.parse(localStorage.getItem('adjList')).updated_at)+' ago');
  } else {
    $http.get("./json/adjectives.json").success(function(data, status, headers, config) {
      $scope.adjList = data.words;
      localStorage.setItem('adjList', JSON.stringify({"updated_at": Date.now(), "words": data.words}));
      console.log('downloaded adjectives');
    });
  }
  
  $scope.getConjugations = function(word) {
    var conjugations;
    if(word.category==='irregular') {
      conjugations = (word.verb === '来る') ? kuru_conjugation() : suru_conjugation(word) ;
    } else {
      conjugations = conjugate(word);
    }
    return conjugations;
  }
  $scope.getEngConjugations = function(word) {
    return eng_conjugation(word);
  }
  $scope.setWord = function(wrd, list) {
    if (list === 'verbsList') {
      $scope.word = $scope.verbsList.filter(function(e){return e.verb === wrd})[0];
      $scope.word_conjugations = $scope.getConjugations($scope.word);
    } else if (list === 'adjList') {
      $scope.word = $scope.adjList.filter(function(e){return e.word === wrd})[0];
      $scope.word_conjugations = ($scope.word.category === 'i-adjective') ? i_adj_conjugation($scope.word) : na_adj_conjugation($scope.word) ;
    }
  };
  $scope.setEng = function(wrd, list) {
    if (list === 'verbsList') {
      $scope.eng = $scope.engList.filter(function(e){return e.infinitive === wrd})[0];
      $scope.eng_conjugations = $scope.getEngConjugations($scope.eng);
    } else if (list === 'adjList') {
      $scope.eng = wrd;
      $scope.eng_conjugations = eng_adj_conjugation($scope.eng);
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
  
  
  $scope.getNumber = function(num) {
    return new Array(num);   
  };
  
  $scope.wanakana = wanakana;
});

app.controller('VerbsListController', ['$scope', function($scope) {
  var ctrl = this;
  
  this.level = 0;
  this.displayLevel = function(num){
    ctrl.searchFor = '';
    ctrl.level = num;
    ctrl.displayList = $scope.verbsList.filter(function(w){return  w.level === num;});
  };
  this.myVerbs = function(){
    ctrl.level = 0;
    ctrl.displayList = [];
    if(localStorage.getItem('userInfo')) {
      ctrl.displayList = JSON.parse(localStorage.getItem('userInfo')).verbsList;
    }
  };
  
  this.showWord = false;
  this.openWord = function(wrd) {
    $scope.setWord(wrd, 'verbsList');
    $scope.setEng($scope.word.meanings[0], 'verbsList');
    ctrl.showWord = true;
  };
  this.closeWord = function() {
    $scope.clearWord();
    ctrl.showWord = false;
  };
  
  this.searchFor = '';
  this.findWord = function() {
    ctrl.level = 0;
    ctrl.displayList = [];
    $scope.verbsList.forEach(function(word){
      if (hasStringValue(word, ctrl.searchFor)) {
        ctrl.displayList.push(word);
      }
    });
  };
  
  function hasStringValue(obj, str) {
    var hasString = false;
    obj.meanings.forEach(function(e){ (e.indexOf(str) > -1) ? hasString = true : null; });
    if(obj.verb) {
      if(obj.verb.indexOf(str) > -1 || obj.reading.indexOf(str) > -1) {hasString = true;}
    } else if (obj.word) {
      if(obj.word.indexOf(str) > -1 || obj.reading.indexOf(str) > -1) {hasString = true;}
    }
    return hasString;
  }
}]);
app.controller('AdjListController', ['$scope', function($scope) {
  var ctrl = this;
  
  this.level = 0;
  this.displayLevel = function(num){
    ctrl.searchFor = '';
    ctrl.level = num;
    ctrl.displayList = $scope.adjList.filter(function(w){return  w.level === num;});
  };
  this.myAdj = function(){
    ctrl.level = 0;
    ctrl.displayList = [];
    if(localStorage.getItem('userInfo')) {
      ctrl.displayList = JSON.parse(localStorage.getItem('userInfo')).adjList;
    }
  };
  
  this.showWord = false;
  this.openWord = function(wrd) {
    $scope.setWord(wrd, 'adjList');
    $scope.setEng($scope.word.meanings[0], 'adjList');
    ctrl.showWord = true;
  };
  this.closeWord = function() {
    $scope.clearWord();
    ctrl.showWord = false;
  };
  
  this.searchFor = '';
  this.findWord = function() {
    ctrl.level = 0;
    ctrl.displayList = [];
    $scope.adjList.forEach(function(word){
      if (hasStringValue(word, ctrl.searchFor)) {
        ctrl.displayList.push(word);
      }
    });
  };
  
  function hasStringValue(obj, str) {
    var hasString = false;
    obj.meanings.forEach(function(e){ (e.indexOf(str) > -1) ? hasString = true : null; });
    if(obj.verb) {
      if(obj.verb.indexOf(str) > -1 || obj.reading.indexOf(str) > -1) {hasString = true;}
    } else if (obj.word) {
      if(obj.word.indexOf(str) > -1 || obj.reading.indexOf(str) > -1) {hasString = true;}
    }
    return hasString;
  }
}]);
app.controller('ConjugateController', function($scope) {
  var ctrl = this;
  
  this.start = false;
  this.hideAnswer = true;
  
  this.howMany = $scope.options.how_many[0];
  this.level = (localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).level : 10;
  
  this.list_options = [{display:'Verbs',sh:'verbsList'},{display:'Adjectives',sh:'adjList'}];
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
    ctrl.makeList();
    ctrl.nextWord();
    this.start = true;
  };
  this.submitAnswer = function() {
    ctrl.hideAnswer = false;
  }
  this.nextWord = function() {
    if (ctrl.list.length === 0) {
      ctrl.makeList();
    }
    ctrl.clearAnswers();
    ctrl.hideAnswer = true;
    if(ctrl.whichList.sh==='verbsList') {
      $scope.setWord(ctrl.list.pop().verb, ctrl.whichList.sh);
    } else {
      $scope.setWord(ctrl.list.pop().word, ctrl.whichList.sh);
    }
    $scope.setEng($scope.word.meanings[0], ctrl.whichList.sh);
  };
  this.makeList = function(){
    if (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).level === ctrl.level) {
      ctrl.list = JSON.parse(localStorage.getItem('userInfo'))[ctrl.whichList.sh];
    } else {
      ctrl.list = $scope[ctrl.whichList.sh].filter(function(w){return  w.level <= ctrl.level;});
    }
    if (ctrl.howMany.sh === 'one') {
      ctrl.singleLevel();
    }
    if(ctrl.list.length === 0) {
      alert('No words match your criteria.');
      return false;
    }
    ctrl.list.shuffle();
  };
  this.singleLevel = function() {
    ctrl.list = ctrl.list.filter(function(w){return  w.level === ctrl.level;});
  };
  this.clearAnswers = function() {
    ctrl.response = (ctrl.whichList.sh === 'verbsList')? new newResponse() : new newAdjResponse() ;
  };
  
  this.toHiragana = function(form, tense, direction) {
    var str = ctrl.response[tense][form][direction];
    var letters = str.match(/[a-zA-Z]+$/);
    if (letters) {
      letters = letters[0]
      if (letters === 'n') { return; }
      var translated = str.substring(0, str.indexOf(letters));
      var to_translate = str.substring(str.indexOf(letters));
      ctrl.response[tense][form][direction] = translated + wanakana.toHiragana(to_translate);
    }
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
  
  this.list_options = [{display:'Verbs',sh:'verbsList'},{display:'Adjectives',sh:'adjList'}];
  this.whichList = this.list_options[0];
  
  this.response = '';
  this.answers = [];
  this.correct = false;
  
  this.lang = $scope.options.lang[0];
  this.howMany = $scope.options.how_many[0];
  this.level = (localStorage.getItem('userInfo'))? JSON.parse(localStorage.getItem('userInfo')).level : 10;
  
  this.openTran = function() {
    ctrl.makeList();
    ctrl.nextWord();
    this.start = true;
  };
  this.submitAnswer = function() {
    ctrl.hideAnswer = false;
    ctrl.possibleAnswers();
  }
  this.nextWord = function() {
    if (!ctrl.forms.plain && !ctrl.forms.polite) {
      alert('You need to select plain and/or polite.');
      return;
    }
    if (ctrl.whichList.sh==='verbsList'&&$scope.tenses.length === 0 ||
        ctrl.whichList.sh==='adjList'&&$scope.adj_tenses.length===0) {
      alert('You need to select at least one tense.');
      return;
    }
    if (ctrl.list.length === 0) {
      ctrl.makeList();
    }
    ctrl.clearAnswers();
    ctrl.hideAnswer = true;
    ctrl.tense = (ctrl.whichList.sh==='verbsList') ? $scope.tenses.random() : $scope.adj_tenses.random();
    ctrl.direction = $scope.options.pos_neg.random();
    if (ctrl.tense.forms) {
      ctrl.form = ctrl.tense.forms.filter(function(form, i){
        if (ctrl.forms.plain && ctrl.forms.polite) {
          return true;
        } else if (ctrl.forms.plain) {
          if (i === 0) {
            return true;
          }
        } else {
          if (i === 1) {
            return true
          }
        }
      }).random();
    } else {
      ctrl.form = '';
    }
    (ctrl.whichList.sh === 'verbsList') ? $scope.setWord(ctrl.list.pop().verb, 'verbsList') : $scope.setWord(ctrl.list.pop().word, 'adjList');
    $scope.setEng($scope.word.meanings.random(), ctrl.whichList.sh);
  };
  this.makeList = function(){
    if (localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).level === ctrl.level) {
      ctrl.list = JSON.parse(localStorage.getItem('userInfo'))[ctrl.whichList.sh];
    } else {
      ctrl.list = $scope[ctrl.whichList.sh].filter(function(w){return  w.level <= ctrl.level;});
    }
    if (ctrl.howMany.sh === 'one') {
      ctrl.singleLevel();
    }
    if(ctrl.list.length === 0) {
      alert('No words match your criteria.');
      return false;
    }
    ctrl.list.shuffle();
  };
  this.singleLevel = function() {
    ctrl.list = ctrl.list.filter(function(w){return  w.level === ctrl.level;});
  };
  this.clearAnswers = function() {
    ctrl.response = '';
    ctrl.answers = [];
  };
  this.possibleAnswers = function() {
    var answers = [];
    if (ctrl.lang.sh === 'en') {
      $scope[ctrl.whichList.sh].forEach(function(word){
        if(word.meanings.indexOf($scope.eng.infinitive || $scope.eng) !== -1) {
          var conjugations;
          if (ctrl.whichList.sh==='verbsList') {
            conjugations = $scope.getConjugations(word);
            answers.push(conjugations[ctrl.tense.sh][ctrl.form][ctrl.direction]);
          } else {
            conjugations = ($scope.word.category === 'i-adjective') ? i_adj_conjugation(word) : na_adj_conjugation(word) ;
            if (conjugations[ctrl.tense.sh][ctrl.form]) {
              answers.push(conjugations[ctrl.tense.sh][ctrl.form][ctrl.direction]);
            } else {
              answers.push(conjugations[ctrl.tense.sh]);
            }
          }
        }
      });
    } else {
      $scope.word.meanings.forEach(function(meaning){
        if(ctrl.whichList.sh === 'verbsList') {
          var engVerbs = $scope.engList.filter(function(verb){return verb.infinitive === meaning});
          if (engVerbs.length > 0) {
            var conj = $scope.getEngConjugations(engVerbs[0]);
            conj[ctrl.tense.sh][ctrl.direction].forEach(function(ans){ answers.push(ans); });
          }
        } else {
          var conj = eng_adj_conjugation(meaning);
          if (conj[ctrl.tense.sh][ctrl.direction]) {
            conj[ctrl.tense.sh][ctrl.direction].forEach(function(ans){ answers.push(ans); });
          } else {
            conj[ctrl.tense.sh].forEach(function(ans){ answers.push(ans); });
          }
        }
      });
    }
    ctrl.answers = answers;
    ctrl.correct = ctrl.responseInAnswers();
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
  
  this.toHiragana = function() {
    var str = ctrl.response
    var letters = str.match(/[a-zA-Z]+$/);
    if (letters) {
      letters = letters[0]
      if (letters === 'n') { return; }
      var translated = str.substring(0, str.indexOf(letters));
      var to_translate = str.substring(str.indexOf(letters));
      ctrl.response = translated + wanakana.toHiragana(to_translate);
    }
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
    