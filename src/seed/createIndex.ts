import { getRedisClient } from "@/utils/client.js";
import { getKeyName, indexKey } from "@/utils/keys.js";

async function createIndex() {
  const client = await getRedisClient();

  try {
    await client.ft.dropIndex(indexKey);
  } catch {
    console.log("Index does not exist, creating a new one...");
  }

  await client.ft.create(
    indexKey,
    {
      id: { type: "TEXT", AS: "id" },
      name: { type: "TEXT", AS: "name" },
      location: { type: "GEO" },
      avgStarRating: { type: "NUMERIC", AS: "avgStarRating", SORTABLE: true },
      cuisine: { type: "TAG", AS: "cuisine" },
    },
    {
      ON: "HASH",
      PREFIX: [getKeyName("restaurants")],
    }
  );

  console.log("Redis index created successfully ✅");
}

await createIndex();
process.exit(0);
