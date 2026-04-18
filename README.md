# FieldFlow: Redis Hash CRUD Demo

CS3200 Project 3 · Part 5 (Node Script)

## Description

A standalone Node.js script that demonstrates full CRUD operations on a Redis Hash. First it retrieves technician data from MongoDB, then caches that profile in Redis under the key `tech:KurshatMuhammet`, and walks through every CRUD step with console output. Based off of FieldFlow (see requirements doc for more info).

[requirements doc](./CS3200%20Project%203%20Requirements%20and%20UML%20%20Doc..pdf)

## Prereqs
- [Node.js](https://nodejs.org/), v18 or later
- [MongoDB](https://www.mongodb.com/), local instance running on `localhost:27017`
- [Redis](https://redis.io/), v7 or later

## Install
```bash
npm install
```

## Run Redis Locally
```bash
brew install redis
brew services start redis
```

## Run MongoDB
- If Mongo is not already running on localhost:27017:
    ```bash
    mkdir -p ~/data/db
    mongod --dbpath ~/data/db
    ```
    - Then open new terminal tab and proceed with steps


## Run the Script
```bash
npm start
```

## CRUD Operations Demonstrated

| Step | Operation | Redis Command | What It Does |
|------|-----------|---------------|--------------|
| 3 | **Create** | `HSET` | Stores the full technician profile (name, phone, region, isAvailable, skills) |
| 4 | **Read** | `HGETALL` | Retrieves every field in the hash |
| 5 | **Read** | `HGET` | Retrieves a single field (`isAvailable`) |
| 6–7 | **Update** | `HSET` | Changes `isAvailable` to `"false"` and `phone` to `"703-829-2920"` |
| 9 | **Delete** | `HDEL` | Removes the `skills` field from the hash |
| 11 | **Delete** | `DEL` | Deletes the entire `tech:KurshatMuhammet` key |

## AI Disclosures

- Sarah: This project used Claude Sonnet 4.6 to assist with selecting appropriate redis data types for each use case and organizing the CRUD command documentation. All decisions were reviewed and verified by the author.

- Kurshat: Used ChatGPT (I don't know what model, just the auto one) to split the group work between me and Sarah appropriately. Also used Github Copilot to help with Step 12, as I didn't know the proper method to make sure it was completely gone.