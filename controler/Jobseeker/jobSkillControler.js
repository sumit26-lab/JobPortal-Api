const pool = require('../../util/db')
exports.createSkill=async(req,res)=>{
    const {user_account_id,skill_name}=req.body
    try{ 
    let query_skillset = 'insert into seeker_skill_set(user_account_id,skill_name)values($1,$2)'
    let skillset = await pool.query(query_skillset, [user_account_id, skill_name])
    res.sendStatus(201)
    }
    catch(err){
        res.sendStatus(400).json({message:err.message})

    }
}


exports.update= async(req,res)=>{
    console.log("InsideApiLoaction",req.body)
    let user_account_id= req.params.id
    const {skill_name}=req.body
    try{

        let query_update=`INSERT INTO seeker_skill_set(user_account_id,skill_name)
        VALUES($1,$2) ON CONFLICT (user_account_id) DO UPDATE SET
        skill_name=EXCLUDED.skill_name
        `
        let updateRow= await pool.query(query_update,[user_account_id,skill_name])
        let result= updateRow.rowCount
        res.sendStatus(201)
    }
    catch(err){
        console.log(err.message)
    }
}

exports.getAll_skill=async(req,res)=>{
    try{

        let query= 'select * from seeker_skill_set'
        let data= await pool.query(query)
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
exports.getIdBySkill=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'select * from seeker_skill_set where user_account_id=$1'
        let data= await pool.query(query,[id])
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(err.message)
        res.status(400).send(err.message)
    }

}
exports.deleteSkill=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'DELETE  from seeker_skill_set where user_account_id=$1'
        let data= await pool.query(query,[id])
        let result= await data.rows
   console.log("user_account_id",result)
   res.status(201).json({
    message:"deleted sucesFuliy"
   })
    }
    catch(err){
        console.log(err.message)
        res.status(400).send(err.message)
    }

}