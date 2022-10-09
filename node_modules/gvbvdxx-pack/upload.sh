
git init
git add ./
git commit -m "Upload"
git branch -M main
git rm -r --cached node_modules
git commit -m "Removed node_modules"
git remote add origin https://github.com/jasonglenevans/gvbvdxx-pack.git
git push -f origin main