#!/usr/bin/env bash

# Imports data to mongodb collections, requires db URI as argument
# example:
# sh import_data.sh mongodb://localhost:27017/waniconjugation

URI=$1
if [ -z "$URI" ]; then
  URI="mongodb://localhost:27017/waniconjugation"
fi

mongoimport --uri=$URI --collection=verbs --file=./data/verbs.json --drop

mongoimport --uri=$URI --collection=en_verbs --file=./data/en_verbs.json --drop

mongoimport --uri=$URI --collection=adjectives --file=./data/adjectives.json --drop