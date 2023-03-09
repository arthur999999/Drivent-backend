import  { createClient } from "redis";

const client = createClient({
  url: "redis://:senha@localhost:6379"
});
  
client.on("error", err => console.log("Redis Client Error", err));

async function InitRedis() {
  await client.connect();
}

InitRedis();

export default client;
