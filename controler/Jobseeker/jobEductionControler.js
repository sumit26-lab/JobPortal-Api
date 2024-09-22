const pool = require('../../util/db')
exports.createEduction=async(req,res)=>{
    const {user_account_id,
        major
        ,institute_university_name
        ,start_date,
        completion_date}=req.body
    try{ 
    let query_education_detail = 'insert into  education_detail(user_account_id,major,institute_university_name,start_date,completion_date)values($1,$2,$3,$4,$5)'
    let skillset = await pool.query(query_education_detail, [user_account_id, major,institute_university_name,start_date,completion_date])
    res.sendStatus(201)
    }
    catch(err){
      return  res.status(400).json({message:err.message})

    }
}


exports.update= async(req,res)=>{
    console.log("InsideApiLoaction",req.body)
    let user_account_id= req.params.id
    const {major,institute_university_name,start_date,completion_date}=req.body
    try{

        let query_update=` UPDATE education_detail SET major=$1,institude_university_name=$2,start_date=$3,completion_date=$4 where user_account_id=$5
        `
        let updateRow= await pool.query(query_update,[major,institute_university_name,start_date,completion_dat,user_account_id])
        let result= updateRow.rowCount
        res.sendStatus(201)
    }
    catch(err){
        console.log(err.message)
    }
}

exports.getAlleducation_detail=async(req,res)=>{
    try{

        let query= 'select * from education_detail'
        let data= await pool.query(query)
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
exports.getIdByEduction=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'select * from education_detail where user_account_id=$1'
        let data= await pool.query(query,[id])
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(err.message)
        res.status(400).send(err.message)
    }

}
exports.deleteEdution=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'DELETE  from education_detail where user_account_id=$1'
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



