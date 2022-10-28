#!/bin/bash

# https://github.com/rigetti/pyquil/blob/master/entrypoint.sh

/usr/local/bin/quilc --quiet -R &> quilc.log &
/usr/local/bin/qvm --quiet -S &> qvm.log &

exec "$@"