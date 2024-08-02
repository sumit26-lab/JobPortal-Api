const { Pool}=require('pg')

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
    console.log(error)
 })

 module.exports=pool


