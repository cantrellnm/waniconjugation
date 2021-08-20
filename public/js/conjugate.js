// important reference: http://www.epochrypha.com/japanese/materials/verbs/

function get_root(word) {
  return {
    kanji: word.verb.substring(0, word.verb.length-1),
    kana: word.reading.substring(0, word.reading.length-1)
  };
}

function a_base(word) {
  var sounds = [['う','わ'],['く','か'],['ぐ','が'],['す','さ'],['ず','ざ'],['つ','た'],['づ','だ'],['ぬ','な'],['ふ','は'],['ぶ','ば'],['ぷ','ぱ'],['む','ま'],['る','ら']];
  var ending = word.verb.substr(word.verb.length - 1);
  if (word.category === 'ichidan') {
    return '';
  } else {
    var sound = sounds.filter(function(arr){return arr[0] === ending;})[0];
    return sound[1];
  }
}
function i_base(word) {
  var sounds = [['う','い'],['く','き'],['ぐ','ぎ'],['す','し'],['ず','じ'],['つ','ち'],['づ','ぢ'],['ぬ','に'],['ふ','ひ'],['ぶ','び'],['ぷ','ぴ'],['む','み'],['る','り']];
  var ending = word.verb.substr(word.verb.length - 1);
  if (word.category === 'ichidan') {
    return '';
  } else {
    var sound = sounds.filter(function(arr){return arr[0] === ending;})[0];
    return sound[1];
  }
}
function e_base(word) {
  var sounds = [['う','え'],['く','け'],['ぐ','げ'],['す','せ'],['ず','ぜ'],['つ','て'],['づ','で'],['ぬ','ね'],['ふ','へ'],['ぶ','べ'],['ぷ','ぺ'],['む','め'],['る','れ']];
  var ending = word.verb.substr(word.verb.length - 1);
  var sound = sounds.filter(function(arr){return arr[0] === ending;})[0];
  return sound[1];
}
function o_base(word) {
  var sounds = [['う','おう'],['く','こう'],['ぐ','ごう'],['す','そう'],['ず','ぞう'],['つ','とう'],['づ','どう'],['ぬ','のう'],['ふ','ほう'],['ぶ','ぼう'],['ぷ','ぽう'],['む','もう'],['る','ろう']];
  var ending = word.verb.substr(word.verb.length - 1);
  if (word.category === 'ichidan') {
    return 'よう';
  } else {
    var sound = sounds.filter(function(arr){return arr[0] === ending;})[0];
    return sound[1];
  }
}
function u_base(word) {
  var ending = word.verb.substr(word.verb.length - 1);
  return ending;
}
function te_base(word) {
  var ending = word.verb.substr(word.verb.length - 1);
  if (word.category === 'ichidan') {
    return 'て';
  } else {
    if (['問う','訪う','請う','乞う','恋う'].indexOf(word.verb) > -1) {
      return 'うて';
    } else if (['る','つ','う'].indexOf(ending) > -1 || word.verb === '行く') {
      return 'って';
    } else if(['ぶ','む','ぬ'].indexOf(ending) > -1) {
      return 'んで';
    } else if (ending === 'ぐ') {
      return 'いで';
    } else if (ending === 'く') {
      return 'いて';
    } else if (ending === 'す') {
      return 'して';
    }
  }
}
function ta_base(word) {
  var ending = word.verb.substr(word.verb.length - 1);
  if (word.category === 'ichidan') {
    return 'た';
  } else {
    if (['る','つ','う'].indexOf(ending) > -1 || word.verb === '行く') {
      return 'った';
    } else if (['ぶ','む','ぬ'].indexOf(ending) > -1) {
      return 'んだ';
    } else if (ending === 'ぐ') {
      return 'いだ';
    } else if (ending === 'く') {
      return 'いた';
    } else if (ending === 'す') {
      return 'した';
    }
  }
}

// VERBS

const verb = function(word) {
  var root = get_root(word),
      a_stem = {
        kanji: root.kanji + a_base(word),
        kana: root.kana + a_base(word)
      },
      i_stem = {
        kanji: root.kanji + i_base(word),
        kana: root.kana + i_base(word)
      },
      u_stem = {
        kanji: root.kanji + u_base(word),
        kana: root.kana + u_base(word)
      },
      e_stem = {
        kanji: root.kanji + e_base(word),
        kana: root.kana + e_base(word)
      },
      o_stem = {
        kanji: root.kanji + o_base(word),
        kana: root.kana + o_base(word)
      },
      ta_stem = {
        kanji: root.kanji + ta_base(word),
        kana: root.kana + ta_base(word)
      },
      te_stem = {
        kanji: root.kanji + te_base(word),
        kana: root.kana + te_base(word)
      },
      potential_stem = (function(){
        if (word.category === 'ichidan') {
          return {kanji: root.kanji+'られ', kana: root.kana+'られ'};
        } else {
          return {kanji: e_stem.kanji, kana: e_stem.kana};
        }
      })(),
      causative_stem = (function(){
        if (word.category === 'ichidan') {
          return {kanji: root.kanji+'させ', kana: root.kana+'させ'};
        } else {
          return {kanji: a_stem.kanji+'せ', kana: a_stem.kana+'せ'};
        }
      })(),
      passive_stem = (function(){
        if (word.category === 'ichidan') {
          return {kanji: root.kanji+'られ', kana: root.kana+'られ'};
        } else {
          return {kanji: a_stem.kanji+'れ', kana: a_stem.kana+'れ'};
        }
      })();
  return {
    i_stem: i_stem,
    te_stem: te_stem,
    indicative: {
      plain: {
        positive: {
          kanji: u_stem.kanji,
          kana: u_stem.kana
        },
        negative: {
          kanji: a_stem.kanji+'ない',
          kana: a_stem.kana+'ない'
        }
      },
      polite: {
        positive: {
          kanji: i_stem.kanji +'ます',
          kana: i_stem.kana +'ます'
        },
        negative: {
          kanji: i_stem.kanji +'ません',
          kana: i_stem.kana + 'ません'
        }
      }
    },
    past_indicative: {
      plain: {
        positive: {
          kanji: ta_stem.kanji,
          kana: ta_stem.kana
        },
        negative: {
          kanji: a_stem.kanji+'なかった',
          kana: a_stem.kana+'なかった'
        }
      },
      polite: {
        positive: {
          kanji: i_stem.kanji+'ました',
          kana: i_stem.kana+'ました'
        },
        negative: {
          kanji: i_stem.kanji+'ませんでした',
          kana: i_stem.kana+'ませんでした'
        }
      }
    },
    presumptive: {
      plain: {
        positive: {
          kanji: u_stem.kanji+'だろう',
          kana: u_stem.kana+'だろう'
        },
        negative: {
          kanji: a_stem.kanji+'ないだろう',
          kana: a_stem.kana+'ないだろう'
        }
      },
      polite: {
        positive: {
          kanji: u_stem.kanji+'でしょう',
          kana: u_stem.kana+'でしょう'
        },
        negative: {
          kanji: a_stem.kanji+'ないでしょう',
          kana: a_stem.kana+'ないでしょう'
        }
      }
    },
    past_presumptive: {
      plain: {
        positive: {
          kanji: ta_stem.kanji+'だろう',
          kana: ta_stem.kana+'だろう'
        },
        negative: {
          kanji: a_stem.kanji+'なかっただろう',
          kana: a_stem.kana+'なかっただろう'
        }
      },
      polite: {
        positive: {
          kanji: ta_stem.kanji+'でしょう',
          kana: ta_stem.kana+'でしょう'
        },
        negative: {
          kanji: a_stem.kanji+'なかったでしょう',
          kana: a_stem.kana+'なかったでしょう'
        }
      }
    },
    progressive: {
      plain: {
        positive: {
          kanji: te_stem.kanji+'いる',
          kana: te_stem.kana+'いる'
        },
        negative: {
          kanji: te_stem.kanji+'いない',
          kana: te_stem.kana+'いない'
        }
      },
      polite: {
        positive: {
          kanji: te_stem.kanji+'います',
          kana: te_stem.kana+'います'
        },
        negative: {
          kanji: te_stem.kanji+'いません',
          kana: te_stem.kana+'いません'
        }
      }
    },
    past_progressive: {
      plain: {
        positive: {
          kanji: te_stem.kanji+'いた',
          kana: te_stem.kana+'いた'
        },
        negative: {
          kanji: te_stem.kanji+'いなかった',
          kana: te_stem.kana+'いなかった'
        }
      },
      polite: {
        positive: {
          kanji: te_stem.kanji+'いました',
          kana: te_stem.kana+'いました'
        },
        negative: {
          kanji: te_stem.kanji+'いませんでした',
          kana: te_stem.kana+'いませんでした'
        }
      }
    },
    imperative: {
      abrupt: {
        positive: {
          kanji: (function(){
            if (word.category === 'godan') {
              return e_stem.kanji;
            } else {
              return root.kanji+'ろ';
            }
          })(),
          kana: (function(){
            if (word.category === 'godan') {
              return e_stem.kana;
            } else {
              return root.kana+'ろ';
            }
          })()
        },
        negative: {
          kanji: u_stem.kanji+'な',
          kana: u_stem.kana+'な'
        }
      },
      plain: {
        positive: {
          kanji: i_stem.kanji+'なさい',
          kana: i_stem.kana+'なさい'
        },
        negative: {
          kanji: i_stem.kanji+'なさるな',
          kana: i_stem.kana+'なさるな'
        }
      },
    },
    request: {
      polite: {
        positive: {
          kanji: te_stem.kanji+'ください',
          kana: te_stem.kana+'ください'
        },
        negative: {
          kanji: a_stem.kanji+'ないでください',
          kana: a_stem.kana+'ないでくださいい'
        }
      },
      honorific: {
        positive: {
          kanji: 'お'+i_stem.kanji+'なさいませ',
          kana: 'お'+i_stem.kana+'なさいませ'
        },
        negative: {
          kanji: 'お'+i_stem.kanji+'なさいますな',
          kana: 'お'+i_stem.kana+'なさいますな'
        }
      }
    },
    potential: {
      plain: {
        positive: {
          kanji: potential_stem.kanji + 'る',
          kana: potential_stem.kana + 'る'
        },
        negative: {
          kanji: potential_stem.kanji+'ない',
          kana: potential_stem.kana+'ない'
        }
      },
      polite: {
        positive: {
          kanji: potential_stem.kanji+'ます',
          kana: potential_stem.kana+'ます'
        },
        negative: {
          kanji: potential_stem.kanji+'ません',
          kana: potential_stem.kana+'ません'
        }
      }
    },
    volitional: {
      plain: {
        positive: {
          kanji: o_stem.kanji,
          kana: o_stem.kana
        },
        negative: (function(){
          if(word.category === 'ichidan') {
            return {kanji: root.kanji+'まい', kana: root.kana+'まい'};
          } else {
            return {kanji: u_stem.kanji+'まい', kana: u_stem.kana+'まい'};
          }
        })()
      },
      polite: {
        positive: {
          kanji: i_stem.kanji+'ましょう',
          kana: i_stem.kana+'ましょう'
        },
        negative: {
          kanji: i_stem.kanji+'ますまい',
          kana: i_stem.kana+'ますまい'
        }
      }
    },
    causative: {
      plain: {
        positive: {
          kanji: causative_stem.kanji + 'る',
          kana: causative_stem.kana + 'る'
        },
        negative: {
          kanji: causative_stem.kanji+'ない',
          kana: causative_stem.kana+'ない'
        }
      },
      polite: {
        positive: {
          kanji: causative_stem.kanji+'ます',
          kana: causative_stem.kana+'ます'
        },
        negative: {
          kanji: causative_stem.kanji+'ません',
          kana: causative_stem.kana+'ません'
        }
      }
    },
    passive: {
      plain: {
        positive: {
          kanji: passive_stem.kanji + 'る',
          kana: passive_stem.kana + 'る'
        },
        negative: {
          kanji: passive_stem.kanji+'ない',
          kana: passive_stem.kana+'ない'
        }
      },
      polite: {
        positive: {
          kanji: passive_stem.kanji+'ます',
          kana: passive_stem.kana+'ます'
        },
        negative: {
          kanji: passive_stem.kanji+'ません',
          kana: passive_stem.kana+'ません'
        }
      }
    },
    provisional: {
      plain: {
        positive: {
          kanji: e_stem.kanji+'ば',
          kana: e_stem.kana+'ば'
        },
        negative: {
          kanji: a_stem.kanji+'なければ',
          kana: a_stem.kana+'なければ'
        }
      }
    },
    conditional: {
      plain: {
        positive: {
          kanji: ta_stem.kanji+'ら',
          kana: ta_stem.kana+'ら'
        },
        negative: {
          kanji: a_stem.kanji+'なかったら',
          kana: a_stem.kana+'なかったら'
        }
      },
      polite: {
        positive: {
          kanji: i_stem.kanji+'ましたら',
          kana: i_stem.kana+'ましたら'
        },
        negative: {
          kanji: i_stem.kanji+'ませんでしたら',
          kana: i_stem.kana+'ませんでしたら'
        }
      }
    }
  };
}

const irregular_verb = {
  kuru: {
    i_stem: { kanji: '来', kana: 'き' },
    te_stem: { kanji: '来て', kana: 'きて' },
    indicative: {
      plain: {
        positive: {
          kanji: '来る',
          kana: 'くる'
        },
        negative: {
          kanji: '来ない',
          kana: 'こない',
        }
      },
      polite: {
        positive: {
          kanji: '来ます',
          kana: 'きます'
        },
        negative: {
          kanji: '来ません',
          kana: 'きません',
        }
      }
    },
    past_indicative: {
      plain: {
        positive: {
          kanji: '来た',
          kana: 'きた'
        },
        negative: {
          kanji: '来なかった',
          kana: 'こなかった',
        }
      },
      polite: {
        positive: {
          kanji: '来ました',
          kana: 'きました'
        },
        negative: {
          kanji: '来ませんでした',
          kana: 'きませんでした',
        }
      }
    },
    presumptive: {
      plain: {
        positive: {
          kanji: '来るだろう',
          kana: 'くるだろう'
        },
        negative: {
          kanji: '来ないだろう',
          kana: 'こないだろう',
        }
      },
      polite: {
        positive: {
          kanji: '来るでしょう',
          kana: 'くるでしょう'
        },
        negative: {
          kanji: '来ないでしょう',
          kana: 'こないでしょう',
        }
      }
    },
    past_presumptive: {
      plain: {
        positive: {
          kanji: '来ただろう',
          kana: 'きただろう'
        },
        negative: {
          kanji: '来なかっただろう',
          kana: 'きなかっただろう',
        }
      },
      polite: {
        positive: {
          kanji: '来たでしょう',
          kana: 'きたでしょう'
        },
        negative: {
          kanji: '来なかったでしょう',
          kana: 'こなかったでしょう',
        }
      }
    },
    progressive: {
      plain: {
        positive: {
          kanji: '来ている',
          kana: 'きている'
        },
        negative: {
          kanji: '来ていない',
          kana: 'きていない'
        }
      },
      polite: {
        positive: {
          kanji: '来ています',
          kana: 'きています'
        },
        negative: {
          kanji: '来ていません',
          kana: 'きていません',
        }
      }
    },
    past_progressive: {
      plain: {
        positive: {
          kanji: '来ていた',
          kana: 'きていた'
        },
        negative: {
          kanji: '来ていなかった',
          kana: 'きていなかった'
        }
      },
      polite: {
        positive: {
          kanji: '来ていました',
          kana: 'きていました'
        },
        negative: {
          kanji: '来ていませんでした',
          kana: 'きていませんでした',
        }
      }
    },
    imperative: {
      abrupt: {
        positive: {
          kanji: 'こい',
          kana: 'こい'
        },
        negative: {
          kanji: '来るな',
          kana: 'くるな',
        }
      },
      plain: {
        positive: {
          kanji: '来なさい',
          kana: 'きなさい'
        },
        negative: {
          kanji: '来なさるな',
          kana: 'きなさるな',
        }
      },
    },
    request: {
      polite: {
        positive: {
          kanji: '来てください',
          kana: 'きてください'
        },
        negative: {
          kanji: '来ないでください',
          kana: 'こないでください',
        }
      },
      honorific: {
        positive: {
          kanji: 'おいでなさいませ',
          kana: 'おいでなさいませ'
        },
        negative: {
          kanji: 'おいでなさいますな',
          kana: 'おいでなさいますな',
        }
      }
    },
    potential: {
      plain: {
        positive: {
          kanji: '来られる',
          kana: 'こられる'
        },
        negative: {
          kanji: '来られない',
          kana: 'こられない',
        }
      },
      polite: {
        positive: {
          kanji: '来られます',
          kana: 'こられます'
        },
        negative: {
          kanji: '来られません',
          kana: 'こられません',
        }
      }
    },
    volitional: {
      plain: {
        positive: {
          kanji: '来よう',
          kana: 'こよう'
        },
        negative: {
          kanji: '来るまい',
          kana: 'くるまい',
        }
      },
      polite: {
        positive: {
          kanji: '来ましょう',
          kana: 'きましょう'
        },
        negative: {
          kanji: '来ますまい',
          kana: 'きますまい',
        }
      }
    },
    causative: {
      plain: {
        positive: {
          kanji: '来させる',
          kana: 'こさせる'
        },
        negative: {
          kanji: '来させない',
          kana: 'こさせない',
        }
      },
      polite: {
        positive: {
          kanji: '来させます',
          kana: 'こさせます'
        },
        negative: {
          kanji: '来させません',
          kana: 'こさせません',
        }
      }
    },
    passive: {
      plain: {
        positive: {
          kanji: '来られる',
          kana: 'こられる'
        },
        negative: {
          kanji: '来られない',
          kana: 'こられない',
        }
      },
      polite: {
        positive: {
          kanji: '来られます',
          kana: 'こられます'
        },
        negative: {
          kanji: '来られません',
          kana: 'こられません',
        }
      }
    },
    provisional: {
      plain: {
        positive: {
          kanji: '来れば',
          kana: 'くれば'
        },
        negative: {
          kanji: '来なければ',
          kana: 'こなければ',
        }
      }
    },
    conditional: {
      plain: {
        positive: {
          kanji: '来たら',
          kana: 'きたら'
        },
        negative: {
          kanji: '来なかったら',
          kana: 'こなかったら',
        }
      },
      polite: {
        positive: {
          kanji: '来ましたら',
          kana: 'きましたら'
        },
        negative: {
          kanji: '来ませんでしたら',
          kana: 'きませんでしたら',
        }
      }
    }
  },
  suru: function(word) {
    var kanji = word.verb.substring(0, word.verb.length-2);
    var kana = word.reading.substring(0, word.reading.length-2);
    return {
      i_stem: {kanji: kanji+'し', kana: kana+'し'},
      te_stem: {kanji: kanji+'して', kana: kana+'して'},
      indicative: {
        plain: {
          positive: {
            kanji: kanji+'する',
            kana: kana+'する'
          },
          negative: {
            kanji: kanji+'しない',
            kana: kana+'しない'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'します',
            kana: kana+'します'
          },
          negative: {
            kanji: kanji+'しません',
            kana: kana+'しません'
          }
        }
      },
      past_indicative: {
        plain: {
          positive: {
            kanji: kanji+'した',
            kana: kana+'した'
          },
          negative: {
            kanji: kanji+'しなかった',
            kana: kana+'しなかった'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'しました',
            kana: kana+'しました'
          },
          negative: {
            kanji: kanji+'しませんでした',
            kana: kana+'しませんでした'
          }
        }
      },
      presumptive: {
        plain: {
          positive: {
            kanji: kanji+'するだろう',
            kana: kana+'するだろう'
          },
          negative: {
            kanji: kanji+'しないだろう',
            kana: kana+'しないだろう'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'するでしょう',
            kana: kana+'するでしょう'
          },
          negative: {
            kanji: kanji+'しないでしょう',
            kana: kana+'しないでしょう'
          }
        }
      },
      past_presumptive: {
        plain: {
          positive: {
            kanji: kanji+'しただろう',
            kana: kana+'しただろう'
          },
          negative: {
            kanji: kanji+'しなかっただろう',
            kana: kana+'しなかっただろう'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'しましたろう',
            kana: kana+'しましたろう'
          },
          negative: {
            kanji: kanji+'しなかたでしょう',
            kana: kana+'しなかたでしょう'
          }
        }
      },
      progressive: {
        plain: {
          positive: {
            kanji: kanji+'している',
            kana: kana+'している'
          },
          negative: {
            kanji: kanji+'していない',
            kana: kana+'していない'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'しています',
            kana: kana+'しています'
          },
          negative: {
            kanji: kanji+'していません',
            kana: kana+'していません'
          }
        }
      },
      past_progressive: {
        plain: {
          positive: {
            kanji: kanji+'していた',
            kana: kana+'していた'
          },
          negative: {
            kanji: kanji+'していなかった',
            kana: kana+'していなかった'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'していました',
            kana: kana+'していました'
          },
          negative: {
            kanji: kanji+'していませんでした',
            kana: kana+'していませんでした'
          }
        }
      },
      imperative: {
        abrupt: {
          positive: {
            kanji: kanji+'しろ',
            kana: kana+'しろ'
          },
          negative: {
            kanji: kanji+'するな',
            kana: kana+'するな'
          }
        },
        plain: {
          positive: {
            kanji: kanji+'しなさい',
            kana: kana+'しなさい'
          },
          negative: {
            kanji: kanji+'しなさるな',
            kana: kana+'しなさるな'
          }
        }
      },
      request: {
        polite: {
          positive: {
            kanji: kanji+'してください',
            kana: kana+'してください'
          },
          negative: {
            kanji: kanji+'しないでください',
            kana: kana+'しないでください'
          }
        },
        honorific: {
          positive: {
            kanji: kanji+'なさいませ',
            kana: kana+'なさいませ'
          },
          negative: {
            kanji: kanji+'なさいますな',
            kana: kana+'なさいますな'
          }
        }
      },
      potential: {
        plain: {
          positive: {
            kanji: kanji+'できる',
            kana: kana+'できる'
          },
          negative: {
            kanji: kanji+'できない',
            kana: kana+'できない'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'できます',
            kana: kana+'できます'
          },
          negative: {
            kanji: kanji+'できません',
            kana: kana+'できません'
          }
        }
      },
      volitional: {
        plain: {
          positive: {
            kanji: kanji+' しよう',
            kana: kana+' しよう'
          },
          negative: {
            kanji: kanji+'するまい',
            kana: kana+'するまい'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'しましょう',
            kana: kana+'しましょう'
          },
          negative: {
            kanji: kanji+'しますまい',
            kana: kana+'しますまい'
          }
        }
      },
      causative: {
        plain: {
          positive: {
            kanji: kanji+'させる',
            kana: kana+'させる'
          }
        }
      },
      passive: {
        plain: {
          positive: {
            kanji: kanji+'される',
            kana: kana+'される'
          }
        }
      },
      provisional: {
        plain: {
          positive: {
            kanji: kanji+'すれば',
            kana: kana+'すれば'
          },
          negative: {
            kanji: kanji+'しなければ',
            kana: kana+'しなければ'
          }
        }
      },
      conditional: {
        plain: {
          positive: {
            kanji: kanji+'したら',
            kana: kana+'したら'
          },
          negative: {
            kanji: kanji+'しなかったら',
            kana: kana+'しなかったら'
          }
        },
        polite: {
          positive: {
            kanji: kanji+'しましたら',
            kana: kana+'しましたら'
          },
          negative: {
            kanji: kanji+'しませんでしたら',
            kana: kana+'しませんでしたら'
          }
        }
      }
    };
  },
  aru: {
    i_stem: {kanji: "有り", kana: "あり"},
    te_stem: {kanji: "有って", kana: "あって"},
    indicative: {
      plain: {
        positive: {
          kanji: "有る",
          kana: "ある"
        },
        negative: {
          kanji: "無い",
          kana: "ない"
        }
      },
      polite: {
        positive: {
          kanji: "有ります",
          kana: "あります"
        },
        negative: {
          kanji: "有りません",
          kana: "ありません"
        }
      }
    },
    past_indicative: {
      plain: {
        positive: {
          kanji: "有った",
          kana: "あった"
        },
        negative: {
          kanji: "無かった",
          kana: "なかった"
        }
      },
      polite: {
        positive: {
          kanji: "有りました",
          kana: "ありました"
        },
        negative: {
          kanji: "有りませんでした",
          kana: "ありませんでした"
        }
      }
    },
    presumptive: {
      plain: {
        positive: {
          kanji: "有るだろう",
          kana: "あるだろう"
        },
        negative: {
          kanji: "有らないだろう",
          kana: "あらないだろう"
        }
      },
      polite: {
        positive: {
          kanji: "有るでしょう",
          kana: "あるでしょう"
        },
        negative: {
          kanji: "有らないでしょう",
          kana: "あらないでしょう"
        }
      }
    },
    past_presumptive: {
      plain: {
        positive: {
          kanji: "有っただろう",
          kana: "あっただろう"
        },
        negative: {
          kanji: "有らなかっただろう",
          kana: "あらなかっただろう"
        }
      },
      polite: {
        positive: {
          kanji: "有ったでしょう",
          kana: "あったでしょう"
        },
        negative: {
          kanji: "有らなかったでしょう",
          kana: "あらなかったでしょう"
        }
      }
    },
    progressive: {
      plain: {
        positive: {
          kanji: "有っている",
          kana: "あっている"
        },
        negative: {
          kanji: "無くていない",
          kana: "なくていない"
        }
      },
      polite: {
        positive: {
          kanji: "有っています",
          kana: "あっています"
        },
        negative: {
          kanji: "無くていません",
          kana: "なくていません"
        }
      }
    },
    past_progressive: {
      plain: {
        positive: {
          kanji: "有っていた",
          kana: "あっていた"
        },
        negative: {
          kanji: "無くていなかった",
          kana: "なくていなかった"
        }
      },
      polite: {
        positive: {
          kanji: "有っていました",
          kana: "あっていました"
        },
        negative: {
          kanji: "無くていませんでした",
          kana: "なくていませんでした"
        }
      }
    },
    imperative: {
      abrupt: {
        positive: {
          kanji: "有れ",
          kana: "あれ"
        },
        negative: {
          kanji: "有るな",
          kana: "あるな"
        }
      },
      plain: {
        positive: {
          kanji: "有りなさい",
          kana: "ありなさい"
        },
        negative: {
          kanji: "有りなさるな",
          kana: "ありなさるな"
        }
      }
    },
    request: {
      polite: {
        positive: {
          kanji: "有ってください",
          kana: "あってください"
        },
        negative: {
          kanji: "無いでください",
          kana: "ないでくださいい"
        }
      },
      honorific: {
        positive: {
          kanji: "お有りなさいませ",
          kana: "おありなさいませ"
        },
        negative: {
          kanji: "お有りなさいますな",
          kana: "おありなさいますな"
        }
      }
    },
    potential: {
      plain: {
        positive: {
          kanji: "有れる",
          kana: "あれる"
        },
        negative: {
          kanji: "有れない",
          kana: "あれない"
        }
      },
      polite: {
        positive: {
          kanji: "有れます",
          kana: "あれます"
        },
        negative: {
          kanji: "有れません",
          kana: "あれません"
        }
      }
    },
    volitional: {
      plain: {
        positive: {
          kanji: "有ろう",
          kana: "あろう"
        },
        negative: {
          kanji: "有るまい",
          kana: "あるまい"
        }
      },
      polite: {
        positive: {
          kanji: "有りましょう",
          kana: "ありましょう"
        },
        negative: {
          kanji: "有りますまい",
          kana: "ありますまい"
        }
      }
    },
    causative: {
      plain: {
        positive: {
          kanji: "有らせる",
          kana: "あらせる"
        },
        negative: {
          kanji: "有らせない",
          kana: "あらせない"
        }
      },
      polite: {
        positive: {
          kanji: "有らせます",
          kana: "あらせます"
        },
        negative: {
          kanji: "有らせません",
          kana: "あらせません"
        }
      }
    },
    passive: {
      plain: {
        positive: {
          kanji: "有られる",
          kana: "あられる"
        },
        negative: {
          kanji: "有られない",
          kana: "あられない"
        }
      },
      polite: {
        positive: {
          kanji: "有られます",
          kana: "あられます"
        },
        negative: {
          kanji: "有られません",
          kana: "あられません"
        }
      }
    },
    provisional: {
      plain: {
        positive: {
          kanji: "有れば",
          kana: "あれば"
        },
        negative: {
          kanji: "無ければ",
          kana: "なければ"
        }
      }
    },
    conditional: {
      plain: {
        positive: {
          kanji: "有ったら",
          kana: "あったら"
        },
        negative: {
          kanji: "無かったら",
          kana: "なかったら"
        }
      },
      polite: {
        positive: {
          kanji: "有りましたら",
          kana: "ありましたら"
        },
        negative: {
          kanji: "有りませんでしたら",
          kana: "ありませんでしたら"
        }
      }
    }
  }
};

const english_verb = function(verb) {
  if (verb.infinitive.split(' ')[1] !== 'be') {
    return {
      participle: verb.conj.participle,
      gerund: verb.conj.gerund,
      indicative: {
        positive: [verb.conj.indicative.positive, 'will '+verb.conj.indicative.positive],
        negative: [verb.conj.indicative.negative, 'won\'t '+verb.conj.indicative.positive]
      },
      past_indicative: {
        positive: [verb.conj.past_indicative.positive],
        negative: [verb.conj.past_indicative.negative]
      },
      presumptive: {
        positive: ['probably '+verb.conj.indicative.positive, 'will probably '+verb.conj.indicative.positive],
        negative: ['probably don\'t '+verb.conj.indicative.positive, 'probably won\'t '+verb.conj.indicative.positive]
      },
      past_presumptive: {
        positive: ['probably '+verb.conj.past_indicative.positive, 'probably have '+verb.conj.participle, 'probably had '+verb.conj.participle],
        negative: ['probably didn\'t '+verb.conj.indicative.positive, 'probably haven\'t '+verb.conj.participle, 'probably hadn\'t '+verb.conj.participle]
      },
      progressive: {
        positive: ['are '+verb.conj.gerund],
        negative: ['aren\'t '+verb.conj.gerund]
      },
      past_progressive: {
        positive: ['were '+verb.conj.gerund],
        negative: ['weren\'t '+verb.conj.gerund]
      },
      volitional: {
        positive: ['intend to '+verb.conj.indicative.positive, 'will '+verb.conj.indicative.positive, 'let\'s '+verb.conj.indicative.positive],
        negative: ['don\'t intend to '+verb.conj.indicative.positive, 'won\'t '+verb.conj.indicative.positive, 'let\'s not '+verb.conj.indicative.positive]
      },
      potential: {
        positive: ['can '+verb.conj.indicative.positive, 'are able '+verb.infinitive],
        negative: ['can\'t '+verb.conj.indicative.positive, 'aren\'t able '+verb.infinitive]
      },
      causative: {
        positive: ['make X '+verb.conj.indicative.positive, 'let X '+verb.conj.indicative.positive],
        negative: ['don\'t make X '+verb.conj.indicative.positive, 'don\'t let X '+verb.conj.indicative.positive]
      },
      passive: {
        positive: ['are '+verb.conj.participle, 'will be '+verb.conj.participle],
        negative: ['aren\'t '+verb.conj.participle, 'won\'t be '+verb.conj.participle]
      },
      provisional: {
        positive: ['if X '+verb.conj.indicative.positive],
        negative: ['if X don\'t '+verb.conj.indicative.positive]
      },
      conditional: {
        positive: ['if X '+verb.conj.indicative.positive, 'when X '+verb.conj.indicative.positive],
        negative: ['if X don\'t '+verb.conj.indicative.positive, 'when X don\'t '+verb.conj.indicative.positive]
      },
      imperative: {
        positive: [verb.conj.indicative.positive],
        negative: [verb.conj.indicative.negative]
      },
      request: {
        positive: ['please '+verb.conj.indicative.positive],
        negative: ['please '+verb.conj.indicative.negative]
      }
    }
  } else {
    var stem = verb.infinitive.split(' ').splice(1).join(' ');
    return {
      participle: verb.conj.participle,
      gerund: verb.conj.gerund,
      indicative: {
        positive: [verb.conj.indicative.positive, 'will '+stem],
        negative: [verb.conj.indicative.negative, 'won\'t '+stem]
      },
      past_indicative: {
        positive: [verb.conj.past_indicative.positive],
        negative: [verb.conj.past_indicative.negative]
      },
      presumptive: {
        positive: ['probably '+verb.conj.indicative.positive, 'will probably '+stem],
        negative: ['probably '+verb.conj.indicative.negative, 'probably won\'t '+stem]
      },
      past_presumptive: {
        positive: ['probably '+verb.conj.past_indicative.positive, 'probably have '+verb.conj.participle, 'probably had '+verb.conj.participle],
        negative: ['probably '+verb.conj.past_indicative.negative, 'probably haven\'t '+verb.conj.participle, 'probably hadn\'t '+verb.conj.participle]
      },
      progressive: {
        positive: ['are '+verb.conj.gerund],
        negative: ['aren\'t '+verb.conj.gerund]
      },
      past_progressive: {
        positive: ['were '+verb.conj.gerund],
        negative: ['weren\'t '+verb.conj.gerund]
      },
      volitional: {
        positive: ['intend '+verb.infinitive, 'will '+stem, 'let\'s '+stem],
        negative: ['don\'t intend '+verb.infinitive, 'won\'t '+stem, 'let\'s not '+stem]
      },
      potential: {
        positive: ['can '+stem, 'are able '+verb.infinitive],
        negative: ['can\'t '+stem, 'aren\'t able '+verb.infinitive]
      },
      causative: {
        positive: ['make X '+stem, 'let X '+stem],
        negative: ['don\'t make X '+stem, 'don\'t let X '+stem]
      },
      passive: {
        positive: ['suffer X '+verb.conj.gerund, 'will suffer X '+verb.conj.gerund],
        negative: ['don\'t suffer X '+verb.conj.gerund, 'won\'t suffer X '+verb.conj.gerund]
      },
      provisional: {
        positive: ['if X '+verb.conj.indicative.positive],
        negative: ['if X '+verb.conj.indicative.negative]
      },
      conditional: {
        positive: ['if X were '+verb.infinitive, 'when X '+verb.conj.indicative.positive],
        negative: ['if X weren\'t '+verb.infinitive, 'when X '+verb.conj.indicative.negative]
      },
      imperative: {
        positive: [stem],
        negative: ['don\'t '+stem]
      },
      request: {
        positive: ['please '+stem],
        negative: ['please don\'t '+stem]
      }
    }
  }
}

// ADJ

const a_sounds = ['あ','か','さ','た','な','は','ま','ら','が','ざ','だ','ば','ぱ'];
const u_sounds = ['う','く','す','つ','ぬ','ふ','む','る','ぐ','ず','づ','ぶ','ぷ'];
const i_sounds = ['い','き','し','ち','に','ひ','み','り','ぎ','じ','ぢ','び','ぴ'];
const o_sounds = ['お','こ','そ','と','の','ほ','も','ろ','ご','ぞ','ど','ぼ','ぽ',];

const i_adjective = function(word) {
  var stem = {kanji: word.word.substring(0, word.word.length-1), kana: word.reading.substring(0, word.reading.length-1)};
  var gstem = {};
  var last_sound = stem.kana[stem.kana.length-1];
  var kanji_stem_minus_one = (stem.kanji.substring(0,stem.kanji.length-1).length > 0) ? stem.kanji.substring(0,stem.kanji.length-1) : stem.kanji ;
  if (a_sounds.indexOf(last_sound) > -1) {
    gstem = {
      kanji: kanji_stem_minus_one+o_sounds[a_sounds.indexOf(last_sound)]+'う',
      kana: stem.kana.substring(0,stem.kana.length-1)+o_sounds[a_sounds.indexOf(last_sound)]+'う'
    };
  } else if (last_sound === 'い') {
    gstem = {
      kanji: kanji_stem_minus_one+'ゆう',
      kana: stem.kana.substring(0,stem.kanji.length-1)+'ゆう'
    };
  } else if (i_sounds.indexOf(last_sound) > -1) {
    gstem = {
      kanji: stem.kanji+'ゅう',
      kana: stem.kana+'ゅう'
    };
  } else if (u_sounds.indexOf(last_sound)>-1 || o_sounds.indexOf(last_sound)>-1) {
    gstem = {
      kanji: stem.kanji+'う',
      kana: stem.kana+'う'
    };
  }
  return {
    indicative: {
      plain: {
        positive: {kanji: word.word, kana: word.reading},
        negative: {kanji: stem.kanji+'くない', kana: stem.kana+'くない'}
      },
      polite: {
        positive: {kanji: word.word+'です', kana: word.reading+'です'},
        negative: {kanji: stem.kanji+'くないです', kana: stem.kana+'くないです'}
      }
    },
    past_indicative: {
      plain: {
        positive: {kanji: stem.kanji+'かった', kana: stem.kana+'かった'},
        negative: {kanji: stem.kanji+'くなかった', kana: stem.kana+'くなかった'}
      },
      polite: {
        positive: {kanji: stem.kanji+'かったです', kana: stem.kana+'かったです'},
        negative: {kanji: stem.kanji+'くなかったです', kana: stem.kana+'くなかったです'}
      }
    },
    presumptive: {
      plain: {
        positive: {kanji: word.word+'だろう', kana: word.reading+'だろう'},
        negative: {kanji: stem.kanji+'くないだろう', kana: stem.kana+'くないだろう'}
      },
      polite: {
        positive: {kanji: word.word+'でしょう', kana: word.reading+'でしょう'},
        negative: {kanji: stem.kanji+'くないでしょう', kana: stem.kana+'くないでしょう'}
      }
    },
    past_presumptive: {
      plain: {
        positive: {kanji: stem.kanji+'かっただろう', kana: stem.kana+'かっただろう'},
        negative: {kanji: stem.kanji+'くなかっただろう', kana: stem.kana+'くなかっただろう'}
      },
      polite: {
        positive: {kanji: stem.kanji+'かったでしょう', kana: stem.kana+'かったでしょう'},
        negative: {kanji: stem.kanji+'くなかったでしょう', kana: stem.kana+'くなかったでしょう'}
      }
    },
    provisional: {
      plain: {
        positive: {kanji: stem.kanji+'ければ', kana: stem.kana+'ければ'},
        negative: {kanji: stem.kanji+'くなければ', kana: stem.kana+'くなければ'}
      }
    },
    continuative: {
      plain: {
        positive: {kanji: stem.kanji+'くて', kana: stem.kana+'くて'},
        negative: {kanji: stem.kanji+'くなくて', kana: stem.kana+'くなくて'}
      },
      polite: {
        positive: {kanji: stem.kanji+'くありまして', kana: stem.kana+'くありまして'},
        negative: {kanji: stem.kanji+'くありませんで', kana: stem.kana+'くありませんで'}
      }
    },
    conditional: {
      plain: {
        positive: {kanji: stem.kanji+'かったら', kana: stem.kana+'かったら'},
        negative: {kanji: stem.kanji+'くなかったら', kana: stem.kana+'くなかったら'}
      },
      polite: {
        positive: {kanji: gstem.kanji+'ございましたら', kana: gstem.kana+'ございましたら'},
        negative: {kanji: stem.kanji+'くありませんでしたら', kana: stem.kana+'くありませんでしたら'}
      }
    },
    adverb: {kanji: stem.kanji+'く', kana: stem.kana+'く'},
    become: {kanji: stem.kanji+'くなる', kana: stem.kana+'くなる'},
    unbearably: {kanji: stem.kanji+'くてたまらない', kana: stem.kana+'くてたまらない'},
    noun: {kanji: stem.kanji+'さ', kana: stem.kana+'さ'},
    looks: {kanji: stem.kanji+'そう', kana: stem.kana+'そう'},
    too: {kanji: stem.kanji+'すぎる', kana: stem.kana+'すぎる'},
    attributive: {kanji: word.word, kana: word.reading}
  }
};

const na_adjective = function(word) {
  return {
    indicative: {
      plain: {
        positive: {kanji: word.word+'だ', kana: word.reading+'だ'},
        negative: {kanji: word.word+'ではない', kana: word.reading+'ではない'}
      },
      polite: {
        positive: {kanji: word.word+'です', kana: word.reading+'です'},
        negative: {kanji: word.word+'ではありません', kana: word.reading+'ではありません'}
      }
    },
    past_indicative: {
      plain: {
        positive: {kanji: word.word+'だった', kana: word.reading+'だった'},
        negative: {kanji: word.word+'ではなかった', kana: word.reading+'ではなかった'}
      },
      polite: {
        positive: {kanji: word.word+'でした', kana: word.reading+'でした'},
        negative: {kanji: word.word+'ではありませんでした', kana: word.reading+'ではありませんでした'}
      }
    },
    presumptive: {
      plain: {
        positive: {kanji: word.word+'だろう', kana: word.reading+'だろう'},
        negative: {kanji: word.word+'ではなかろう', kana: word.reading+'ではなかろう'}
      },
      polite: {
        positive: {kanji: word.word+'でしょう', kana: word.reading+'でしょう'},
        negative: {kanji: word.word+'ではないでしょう', kana: word.reading+'ではないでしょう'}
      }
    },
    past_presumptive: {
      plain: {
        positive: {kanji: word.word+'だったろう', kana: word.reading+'だったろう'},
        negative: {kanji: word.word+'ではなかったろう', kana: word.reading+'ではなかったろう'}
      },
      polite: {
        positive: {kanji: word.word+'だったでしょう', kana: word.reading+'だったでしょう'},
        negative: {kanji: word.word+'ではなかったでしょう', kana: word.reading+'ではなかったでしょう'}
      }
    },
    provisional: {
      plain: {
        positive: {kanji: word.word+'なら', kana: word.reading+'なら'},
        negative: {kanji: word.word+'でなければ', kana: word.reading+'でなければ'}
      }
    },
    continuative: {
      plain: {
        positive: {kanji: word.word+'で', kana: word.reading+'で'},
        negative: {kanji: word.word+'ではなくて', kana: word.reading+'ではなくて'}
      },
      polite: {
        positive: {kanji: word.word+'でして', kana: word.reading+'でして'},
        negative: {kanji: word.word+'ではありませんでして', kana: word.reading+'ではありませんでして'}
      }
    },
    conditional: {
      plain: {
        positive: {kanji: word.word+'だったら', kana: word.reading+'だったら'},
        negative: {kanji: word.word+'でなかったら', kana: word.reading+'でなかったら'}
      },
      polite: {
        positive: {kanji: word.word+'でしたら', kana: word.reading+'でしたら'},
        negative: {kanji: word.word+'でありませんでしたら', kana: word.reading+'でありませんでしたら'}
      }
    },
    adverb: {kanji: word.word+'に', kana: word.reading+'に'},
    become: {kanji: word.word+'になる', kana: word.reading+'になる'},
    unbearably: {kanji: word.word+'でたまらない', kana: word.reading+'でたまらない'},
    noun: {kanji: word.word, kana: word.reading},
    looks: {kanji: word.word+'そう', kana: word.reading+'そう'},
    too: {kanji: word.word+'すぎる', kana: word.reading+'すぎる'},
    attributive: {kanji: word.word+'な', kana: word.reading+'な'}
  };
};

const english_adjective = function(word) {
  return {
    indicative: {
      positive: ['are '+word],
      negative: ['aren\'t '+word]
    },
    past_indicative: {
      positive: ['were '+word],
      negative: ['weren\'t '+word]
    },
    presumptive: {
      positive: ['probably are '+word],
      negative: ['probably aren\'t '+word]
    },
    past_presumptive: {
      positive: ['probably were '+word, 'probably have been '+word],
      negative: ['probably weren\'t '+word, 'probably haven\'t been '+word]
    },
    provisional: {
      positive: ['if X are '+word],
      negative: ['if X aren\'t '+word]
    },
    continuative: {
      positive: ['are '+word+' and X'],
      negative: ['aren\'t '+word+' and X']
    },
    conditional: {
      positive: ['if X were '+word, 'when X are '+word],
      negative: ['if X weren\'t '+word, 'when X aren\'t '+word]
    },
    adverb: [word+'-ly'],
    become: ['become '+word],
    unbearably: ['unbearably '+word],
    noun: [word+'-ness'],
    looks: ['look '+word, 'appear to be '+word],
    too: ['too '+word]
  }
};

const conjugate = {
  verb,
  irregular_verb,
  english_verb,
  i_adjective,
  na_adjective,
  english_adjective
};