#!/bin/sh

PREFIX_IN_COMPILED_CODE='ENV_VAR_REPLACEMENT_'
SET_ENVIRONEMNT_VARIABLE='VITE_APP_'

for i in $(env | grep $SET_ENVIRONEMNT_VARIABLE)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)

    to_replace_in_code=${key/$SET_ENVIRONEMNT_VARIABLE/"$PREFIX_IN_COMPILED_CODE"}

    echo "Transforming '$to_replace_in_code' to '$value' ('$key')"
    find /usr/share/nginx/html -type f \( -name '*.js' \) -exec sed -i "s|${to_replace_in_code}|${value}|g" '{}' +
done

exec "$@"