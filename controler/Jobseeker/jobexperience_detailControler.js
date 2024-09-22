const pool = require('../../util/db')
exports.create=async(req,res)=>{
    const {user_account_id,
        company_name,
        job_location_city,
        exp_start_date,
        exp_end_date,
        description}=req.body
    try{ 
    let query_experience_detail = 'insert into  experience_detail(user_account_id,company_name,job_location_city,exp_start_date,exp_end_date,description)values($1,$2,$3,$4,$5,$6)'
    let skillset = await pool.query(query_experience_detail, [user_account_id, company_name,job_location_city,exp_start_date,exp_end_date,description])
    res.sendStatus(201)
    }
    catch(err){
        res.sendStatus(400).json({message:err.message})

    }
}


exports.update= async(req,res)=>{
    console.log("InsideApiLoaction",req.body)
    let user_account_id= req.params.id
    const {company_name,job_location_city,job_location_state,exp_start_date,exp_end_date,description}=req.body
    try{

        let query_update=` UPDATE experience_detail SET company_name=$1,job_location_city=$2,job_location_state=$3,exp_start_date=$4,exp_end_date=$5,descriptio=$6 where user_account_id=$7`
        
        let updateRow= await pool.query(query_update,[company_name,job_location_city,job_location_state,exp_start_date,exp_end_date,description,user_account_id])
        let result= updateRow.rowCount
        res.sendStatus(201)
    }
    catch(err){
        console.log(err.message)
    }
}

exports.getAll=async(req,res)=>{
    try{

        let query= 'select * from experience_detail '
        let data= await pool.query(query)
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
exports.getIdBy=async(req,res)=>{
    let id= req.params.id
    try{

        let query= 'select * from experience_detail  where user_account_id=$1'
        let data= await pool.query(query,[id])
        let result= await data.rows

        res.send(result)
    }
    catch(err){
        console.log(err.message)
        res.status(400).send(err.message)
    }

}
exports.delete=async(req,res)=>{
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



