#!/bin/sh
# Публікує зібрану вітрину (apps/web/dist) у гілку gh-pages репозиторію origin.
# Гілка щоразу перезаписується і містить лише файли сайту.
set -e

REMOTE=$(git remote get-url origin)
cd "$(dirname "$0")/../apps/web/dist"

rm -rf .git
git init -q -b gh-pages
git add -A
git commit -qm "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -f "$REMOTE" gh-pages
rm -rf .git

echo "Готово: гілку gh-pages оновлено"
