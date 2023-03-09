import  { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL
});
  
client.on("error", err => console.log("Redis Client Error", err));

async function InitRedis() {
  await client.connect();
}

InitRedis();

export default client;
