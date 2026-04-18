/**
 * FieldFlow: CS3200 Project 3, Part 5
 * full Create / Read / Update / Delete operations
 * on a Redis Hash that caches a technician profile.
 *
 * Key format : tech:KurshatMuhammet
 * Data struct  : Redis Hash
 */

import { createClient } from "redis";

const KEY = "tech:KurshatMuhammet";

async function main() {
  const client = createClient(); // localhost:6379 default

  try {
    //Connect to Redis
    console.log("step 1: connecting to Redis");
    await client.connect();
    console.log("   Connected to Redis successfully.\n");

    //Flush the database for a clean demo
    console.log("Step 2: Flushing the database");
    await client.flushDb();
    console.log("   Database flushed.\n");

    //CREATE: HSET the technician profile
    console.log("Step 3: Creating technician profile (HSET)");
    const fieldsSet = await client.hSet(KEY, {
      name: "Kurshat Muhammet",
      phone: "571-829-3810",
      region: "Fairfax, VA",
      isAvailable: "true",
      skills: "HVAC, Electrical",
    });
    console.log(`HSET returned ${fieldsSet} (number of fields added).`);
    console.log(`Key: ${KEY}\n`);

    //READ: HGETALL (full profile)
    console.log("step 4: Reading full profile (HGETALL)");
    const fullProfile = await client.hGetAll(KEY);
    console.log("   Profile:", fullProfile, "\n");

    //READ: HGET (single field: isAvailable)
    console.log("step 5: Reading single field: isAvailable (HGET)");
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

    //DELETE: remove the skills field (HDEL)
    console.log("Step 9: Deleting skills field (HDEL)");
    const deletedCount = await client.hDel(KEY, "skills");
    console.log(`   HDEL returned ${deletedCount} (fields removed).\n`);

    //READ: HGETALL to confirm skills is gone
    console.log("Step 10: Reading profile after field deletion (HGETALL)");
    const afterFieldDelete = await client.hGetAll(KEY);
    console.log("   Profile:", afterFieldDelete, "\n");

    //DELETE: remove the entire key (DEL)
    console.log("Step 11: Deleting entire key (DEL)");
    const keysDeleted = await client.del(KEY);
    console.log(`   DEL returned ${keysDeleted} (keys removed).\n`);

    //READ: make sure key is gone
    console.log("Step 12: Attempting to read deleted key (HGETALL)");
    const afterKeyDelete = await client.hGetAll(KEY);
    console.log("   Result:", afterKeyDelete);
    console.log(
      `   (Empty object = key no longer exists in Redis.)\n`
    );
  } catch (err) {
    console.error("   Error:", err);
  } finally {
    //quit Redis
    console.log("Step 13: Closing Redis connection");
    if (client.isOpen) {
      await client.quit();
      console.log("   Redis connection closed. Demo complete.");
    } else {
      console.log("   Redis connection was not open.");
    }
  }
}

main();