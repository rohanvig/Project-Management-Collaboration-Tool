project management & collaboration tool

this is a full-stack kanban-style project management app i built using the mern stack for the assignment.

what you need to run it:
- node.js
- mongodb (i left my connection string in the .env file so you don't have to set one up)

how to set it up:

1. install the packages
you'll need to install npm packages for both the frontend and backend.
open a terminal and do:
cd backend
npm install

cd ../frontend
npm install

2. run the database seed (optional)
i made a script to fill the database with a dummy project and some tasks so it's easier to test.
cd backend
npm run seed
(the login for this dummy account is admin@test.com and password is password123)

3. start the app
you need two terminals to run the frontend and backend at the same time.

in terminal 1 (backend):
cd backend
npm run start

in terminal 2 (frontend):
cd frontend
npm run dev

then just open your browser to http://localhost:5173

api testing:
if you want to test the api endpoints directly, i included a `swagger.yaml` file in this folder. you can just drag and drop it into postman and it will import the whole collection for you.

other notes:
- check out `backend/DB_SCHEMA.md` to see my database schemas.
- check out `NOTES.md` for my notes on architecture and caching.
