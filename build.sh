
rm -rf build # node_modules
# npm install
# npm audit fix
echo Killing http servers
kill -9 $(lsof -t -i :80 | awk '{print $1}')
echo Killing mqtt servers
kill -9 $(lsof -t -i :1883 | awk '{print $1}')
kill -9 $(lsof -t -i :8888 | awk '{print $1}')
GENERATE_SOURCEMAP=false npm run build
node broker & node server