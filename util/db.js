const { Pool}=require('pg')

require('dotenv').config();

//  const pool = new Pool({
//    connectionString: process.env.POSTGRES_URL,
//  })

const pool= new Pool({
    database:'findjobs',
     host:'localhost',
     user:'postgres',
     port:5432,
     password:'12345',
 })


 pool.connect().then(connect=>{
    console.log("Posgrest Conntect")
 }).catch(error=>{
  throw new Error(error)
 })

module.exports=pool


