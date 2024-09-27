const pool = require('../../util/db')
exports.SeekProfileCreated = async (req, res) => {
 
    let { user_account_id, first_name, last_name, state,city} = req.body
    try {
      let queryProfile = 'insert into seeker_profile(user_account_id,first_name,last_name,state,city)values($1,$2,$3,$4,$5)'
      
       let profile = await pool.query(queryProfile, [user_account_id, first_name, last_name, state,city])
     
    
     return res.status(201).send("ok")
  
    }
    catch (error) {
    return  res.status(400).send(error.message)
    }
  
  }
  exports.getProfileByid = async (req, res) => {
    let user_account_id = req.params.id
    console.log( "Prof",user_account_id)
    try{
  
      let getuserQuery = ` 
     SELECT 
    seeker_profile.*, 
    education_detail.*, 
    experience_detail.*, 
    seeker_skill_set.*, 
    resume.*,
    CASE 
        WHEN experience_detail.user_account_id IS NULL THEN 'fresh' 
        WHEN experience_detail.user_account_id IS NOT NULL THEN 'experienced'
        ELSE 'no experience data'
    END AS user_status
FROM seeker_profile
JOIN education_detail ON seeker_profile.user_account_id = education_detail.user_account_id
LEFT JOIN experience_detail ON seeker_profile.user_account_id = experience_detail.user_account_id
JOIN seeker_skill_set ON seeker_profile.user_account_id = seeker_skill_set.user_account_id
JOIN resume ON seeker_profile.user_account_id = resume.user_account_id
WHERE seeker_profile.user_account_id = $1;

  
    `
      let getuser = await pool.query(getuserQuery, [user_account_id])
      let data = await getuser.rows
      res.send(data)
    }
    catch(error){
      console.error('Error Fetchin Profile', error);
      res.status(500).send(error.message);
    }
  }

  exports.deleteProfile=async(req,res)=>{
      let user_account_id = req.params.id
      if(user_account_id==null && user_account_id ==undefined) return  res.status(400).json({status:false,message:"user_account_id not provided"});

     try{

     let query='delete from  seeker_profile  where user_account_id=$1'
      await pool.query(query,[user_account_id])
      res.status(201).json({
        message: "deleted sucesFuliy"
    })
     }
     catch(error){
      console.error(error)
      res.status(500).send(error);

     }


  }
