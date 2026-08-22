database schemas for mongodb

i used mongodb with mongoose for this project. since mongodb is nosql, the schemas are defined in the models folder rather than sql scripts.

here are the main collections i made:

1. users
- name (string, required)
- email (string, required, unique)
- password (string, required, hashed)
- timestamps

2. projects
- name (string, required)
- description (string)
- owner (objectid ref to users)
- members (array of objectids)
- timestamps

3. boards
- projectId (objectid ref to projects)
- name (string, required)
- timestamps

4. tasks
- boardId (objectid ref to boards)
- title (string, required)
- description (string)
- status (todo, in progress, done)
- priority (low, medium, high)
- assignedTo (objectid ref to users)
- dueDate (date)
- createdBy (objectid ref to users)
- timestamps

data seeding
to test the app quickly with some dummy data, i made a seed script. you can run it by going to the backend folder and running:
npm run seed
