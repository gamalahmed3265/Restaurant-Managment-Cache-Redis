import { getRedisClient } from "@/utils/client.js";
import { bloomkey } from "@/utils/keys.js";

async function createBloomFilter() {
    const client = await getRedisClient();
    await Promise.all([
        client.del(bloomkey),
        client.bf.reserve(bloomkey,0.001,1000000)
    ]);

}

await createBloomFilter();
console.log("Bloom filter created successfully ✅");
process.exit(0);