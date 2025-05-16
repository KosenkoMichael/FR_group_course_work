npm install
ng build --configuration production
npm install -g @angular/cli

cd backend

npm init -y
npm install express cors sqlite3 body-parser

cd ..

Start-Process cmd -ArgumentList '/k node backend/server.js'

ng serve