const pool = require('../../util/db')
exports.SeekProfileCreated = async (req, res) => {
 
    let { user_account_id, first_name, last_name, currentsalary} = req.body
    try {
      let queryProfile = 'insert into seeker_profile(user_account_id,first_name,last_name,currentsalary)values($1,$2,$3,$4)'
      
       let profile = await pool.query(queryProfile, [user_account_id, first_name, last_name, currentsalary])
     
    
     return res.status(201).send("ok")
  
    }
    catch (error) {
    return  res.status(400).send(error.message)
    }
  
  }
  exports.getProfileByid = async (req, res) => {
    let user_account_id = req.params.id
    console.log(user_account_id)
    try{
  
      let getuserQuery = ` 
     select * from seeker_profile  
	join education_detail on seeker_profile.user_account_id=education_detail.user_account_id
	join experience_detail on seeker_profile.user_account_id=experience_detail.user_account_id
	join seeker_skill_set on seeker_profile.user_account_id=seeker_skill_set.user_account_id
	join resume on seeker_profile.user_account_id=resume.user_account_id
	
	where seeker_profile.user_account_id=$1
  
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

