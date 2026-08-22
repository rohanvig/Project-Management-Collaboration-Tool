# Database Schemas (MongoDB)

This project uses **MongoDB** as its database, with **Mongoose** acting as the Object Data Modeling (ODM) library. 

Because MongoDB is a NoSQL, schema-less database by nature, strict schemas and constraints are enforced at the application layer via Mongoose Models rather than through SQL migration scripts.

Below are the schema definitions for our core collections.

## 1. Users Collection (`users`)
Handles authentication and user profiles.
*   `name`: String (Required)
*   `email`: String (Required, Unique, Lowercase)
*   `password`: String (Required, Hashed)
*   `timestamps`: (createdAt, updatedAt)

## 2. Projects Collection (`projects`)
A workspace that groups boards and members together.
*   `name`: String (Required)
*   `description`: String
*   `owner`: ObjectId (References `User`, Required)
*   `members`: Array of ObjectId (References `User`)
*   `timestamps`: (createdAt, updatedAt)

## 3. Boards Collection (`boards`)
Represents a Kanban board within a project.
*   `projectId`: ObjectId (References `Project`, Required)
*   `name`: String (Required)
*   `timestamps`: (createdAt, updatedAt)

## 4. Tasks Collection (`tasks`)
Individual work items on a Kanban board.
*   `boardId`: ObjectId (References `Board`, Required)
*   `title`: String (Required)
*   `description`: String
*   `status`: String (Enum: `['Todo', 'In Progress', 'Done']`, Default: `'Todo'`)
*   `priority`: String (Enum: `['Low', 'Medium', 'High']`, Default: `'Medium'`)
*   `assignedTo`: ObjectId (References `User`)
*   `dueDate`: Date
*   `createdBy`: ObjectId (References `User`)
*   `timestamps`: (createdAt, updatedAt)

## Data Migration / Seeding
To easily populate the database with dummy data (acting as our initial data migration), run the following command from the `backend` directory:
```bash
npm run seed
```
