#!/bin/sh

VALUE_TO_REPLACE='ENV_VAR_REPLACEMENT_'
REPLACEMENT='VITE_APP_'

for i in $(env | grep $REPLACEMENT)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)

    to_replace=${key/$VALUE_TO_REPLACE/"$REPLACEMENT"}

    echo "Transforming '$to_replace' to '$value'"
    find /usr/share/nginx/html -type f -name '*.js' -exec sed -i "s|${to_replace}|${value}|g" '{}' +
done

exec "$@"