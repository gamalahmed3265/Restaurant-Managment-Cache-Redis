import {createClient, type RedisClientType} from "redis"


let client:RedisClientType|null=null;

export async function getRedisClient():Promise<RedisClientType>{
    if(client && client.isOpen){
        return client;
    }   
    client=createClient({
        url:process.env.REDIS_URL||"redis://localhost:6379"
    });
    client.on("error",(err)=>console.error("Redis Client Error",err));
    await client.connect();
    return client;
}
export async function disconnectRedisClient():Promise<void>{
    if(client && client.isOpen){
        await client.disconnect();
    }   
    client=null;
}