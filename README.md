# WaniConjugation

Application to practice conjugating and translating Japanese verbs and adjectives that are taught by [WaniKani](https://www.wanikani.com/).

Use app at: [waniconjugation.herokuapp.com](http://waniconjugation.herokuapp.com/)

## For developers

A copy of the MongoDB collections are saved as `.json` files in the `data` folder and can be imported to your local db (while it's running) with `yarn build` or `npm run build`.

~~These files are imported when code gets deployed, so making changes to these files means making changes to the data on the site. If any data needs to be corrected, these files are where you do it.~~

## To Do:

- check that API keys still work
- update words to align with current WaniKani vocab & levels
- clarify exceptions for some suru verbs? (past nai, imperative, volitional) (P.S. I don't remember what this note means.)
- find out why progressive, potential, causative, and passive tenses are listed as category: ichidan and check if it's true of godan verbs like 上る, 入る for progressive (and other tenses?)

## Fix:

- check conjugations of these godan verbs with -ru ending after changing category to godan
  - 見返る, 走る, 気に入る, 帰る, 交じる
- any other godan -ru verbs marked ichidan?

Japanese conjugations:

- 対する - presumptive is not 対するだろう but 始まるだろう ?

English conjugations:

- 死ぬ - passive: "are died" -> [not sure what this should be]
- 死ぬ - provisional: "if X die" -> "if X dies"; same with the negative
- 止める - passive: "are/aren't stopped something" + "will/won't stopped something" -> "something is/isn't stopped" + "something will/won't be stopped"?
- 対する - "probably contrast" -> "probably contrasts" and several other mistakes (including the in other meanings of the verb)
- 入れる - passive: "will/won't inserted" -> "will/won't be inserted"
- 手伝う - potential: "are/aren't to help" -> "are/aren't able to help"
- 手伝う - passive: "will helped" -> "will be helped"
- 手伝う - provisional: "if X help" -> "if X helps"

Missing:

- 運がいい (Level 10 adj)
- 気持ちいい (Level 11 adj)
- 丁度いい (Level 11 adj)
- probably more, see to do list about updating words
