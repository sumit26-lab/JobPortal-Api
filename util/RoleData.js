const pool = require('../util/db')
const RoleData=async()=>{
try{
     let rolequery='select * from role'
   let data= await pool.query(rolequery)
   let role= await data.rows
 let role_list=role.reduce((acc,row)=>{
    acc[row.role_id]=row
    return acc
 },{})
 return role_list
}
catch(err){
    console.log(err)
}
}
module.exports={RoleData}