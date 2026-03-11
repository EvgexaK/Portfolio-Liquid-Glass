#!/bin/bash
export FILTER_BRANCH_SQUELCH_WARNING=1
git filter-branch -f --env-filter '
if [ "$GIT_AUTHOR_NAME" = "Antigravity" ]; then
    GIT_AUTHOR_NAME="Evgenii Zhdanov"
    GIT_AUTHOR_EMAIL="gdanovevgeniy@mail.ru"
    GIT_COMMITTER_NAME="Evgenii Zhdanov"
    GIT_COMMITTER_EMAIL="gdanovevgeniy@mail.ru"
fi
export GIT_AUTHOR_NAME
export GIT_AUTHOR_EMAIL
export GIT_COMMITTER_NAME
export GIT_COMMITTER_EMAIL
' -- --all
