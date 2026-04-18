/**
 * FieldFlow: CS3200 Project 3, Part 5
 * full Create / Read / Update / Delete operations
 * on a Redis Hash that caches a technician profile.
 *
 * Key pattern : tech:KurshatMuhammet
 * Data struct  : Redis Hash
 */

import { createClient } from "redis";
import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const KEY = "tech:KurshatMuhammet";

async function main() {
  const client = createClient({ url: REDIS_URL });
  client.on("error", (err) => console.log("Redis Client Error", err));

  const mongoClient = new MongoClient(MONGO_URL);

  try {
    //connect to MongoDB
    console.log("Step 0: Connecting to MongoDB");
    await mongoClient.connect();
    console.log("   Connected to MongoDB.\n");

    const db = mongoClient.db("fieldflow");
    const collection = db.collection("technicians");

    //insert or update technician in MongoDB
    await collection.updateOne(
      { name: "Kurshat Muhammet" },
      {
        $set: {
          name: "Kurshat Muhammet",
          phone: "571-829-3810",
          region: "Fairfax, VA",
          isAvailable: "true",
          skills: "HVAC, Electrical",
        },
      },
      { upsert: true }
    );

    //fetch technician from MongoDB
    const technician = await collection.findOne({
      name: "Kurshat Muhammet",
    });

    if (!technician) {
      throw new Error("Technician not found in MongoDB.");
    }

    console.log("   Retrieved from MongoDB:", technician, "\n");

    //connect to Redis
    console.log("Step 1: connecting to Redis");
    await client.connect();
    console.log("   Connected to Redis successfully.\n");

    //flush the database for a clean demo
    console.log("Step 2: Flushing the database");
    await client.flushDb();
    console.log("   Database flushed.\n");

    //CREATE: HSET the technician profile (from MongoDB data)
    console.log("Step 3: Creating technician profile (HSET)");
    const fieldsSet = await client.hSet(KEY, {
      name: technician.name,
      phone: technician.phone,
      region: technician.region,
      isAvailable: technician.isAvailable,
      skills: technician.skills,
    });
    console.log(`HSET returned ${fieldsSet} (number of fields added).`);
    console.log(`Key: ${KEY}\n`);

    //READ: HGETALL (full profile)
    console.log("Step 4: Reading full profile (HGETALL)");
    const fullProfile = await client.hGetAll(KEY);
    console.log("   Profile:", fullProfile, "\n");

    //READ: HGET (single field: isAvailable)
    console.log("Step 5: Reading single field: isAvailable (HGET)");
    const available = await client.hGet(KEY, "isAvailable");
    console.log(`   isAvailable = "${available}"\n`);

    //UPDATE: change isAvailable to "false"
    console.log('Step 6: Updating isAvailable -> "false" (HSET)');
    await client.hSet(KEY, "isAvailable", "false");
    console.log("   isAvailable updated.\n");

    //UPDATE: change phone to "703-829-2920"
    console.log('Step 7: Updating phone -> "703-829-2920" (HSET)');
    await client.hSet(KEY, "phone", "703-829-2920");
    console.log("   phone updated.\n");

    //READ: HGETALL again to verify updates
    console.log("Step 8: Reading full profile after updates (HGETALL)");
    const updatedProfile = await client.hGetAll(KEY);
    console.log("   Profile:", updatedProfile, "\n");

    // DELETE: remove the skills field (HDEL)
    console.log("Step 9: Deleting skills field (HDEL)");
    const deletedCount = await client.hDel(KEY, "skills");
    console.log(`   HDEL returned ${deletedCount} (fields removed).\n`);

    //READ: HGETALL to confirm skills is gone
    console.log("Step 10: Reading profile after field deletion (HGETALL)");
    const afterFieldDelete = await client.hGetAll(KEY);
    console.log("   Profile:", afterFieldDelete, "\n");

    // DELETE: remove the entire key (DEL)
    console.log("Step 11: Deleting entire key (DEL)");
    const keysDeleted = await client.del(KEY);
    console.log(`   DEL returned ${keysDeleted} (keys removed).\n`);

    // READ: make sure the key is gone
    console.log("Step 12: Attempting to read deleted key (HGETALL)");
    const afterKeyDelete = await client.hGetAll(KEY);
    console.log("   Result:", afterKeyDelete);
    console.log(
      `   (Empty object = key no longer exists in Redis.)\n`
    );
  } catch (err) {
    console.error("   Error:", err);
  } finally {
    //quit redis
    console.log("Step 13: Closing connections");

    if (client.isOpen) {
      await client.quit();
      console.log("   Redis connection closed.");
    }

    if (mongoClient) {
      await mongoClient.close();
      console.log("   MongoDB connection closed.");
    }

    console.log("   Demo complete.");
  }
}

main();