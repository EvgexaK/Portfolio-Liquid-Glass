import os
import subprocess

os.environ['FILTER_BRANCH_SQUELCH_WARNING'] = '1'
env_filter = """
if [ "$GIT_AUTHOR_NAME" = "Antigravity" ]; then
    export GIT_AUTHOR_NAME="Evgenii Zhdanov"
    export GIT_AUTHOR_EMAIL="gdanovevgeniy@mail.ru"
    export GIT_COMMITTER_NAME="Evgenii Zhdanov"
    export GIT_COMMITTER_EMAIL="gdanovevgeniy@mail.ru"
fi
"""

print("Running git filter-branch...")
result = subprocess.run(
    ['git', 'filter-branch', '-f', '--env-filter', env_filter, '--', '--all'],
    capture_output=True,
    text=True
)

print(result.stdout)
if result.stderr:
    print("ERRORS:", result.stderr)
