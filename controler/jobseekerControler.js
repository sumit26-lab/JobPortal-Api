const pool = require('../util/db')
exports.SeekProfileCreated = async (req, res) => {
    //let user_account_id= req.user;
    let { user_account_id, first_name, last_name, currentsalar, major, institute_university_name, start_date, completion_data, is_current_job, company_name, job_location_city, job_location_state, exp_start_date, exp_end_date, description, skill_name } = req.body
    try {
      let queryProfile = 'insert into seeker_profile(user_account_id,first_name,last_name,currentsalary)values($1,$2,$3,$4)'
      let query_education = 'insert into education_detail(user_account_id,major,institute_university_name,start_date,completion_date)values($1,$2,$3,$4,$5)'
      let query_experience = 'insert into experience_detail(user_account_id,is_current_job,company_name,job_location_city,job_location_state,exp_start_date,exp_end_date,description)values($1,$2,$3,$4,$5,$6,$7,$8)'
      let query_skillset = 'insert into seeker_skill_set(user_account_id,skill_name)values($1,$2)'
      let profile = await pool.query(queryProfile, [user_account_id, first_name, last_name, currentsalar])
      let education = await pool.query(query_education, [user_account_id, major, institute_university_name, start_date, completion_data])
      let experience = await pool.query(query_experience, [user_account_id, is_current_job, company_name, job_location_city, job_location_state, exp_start_date, exp_end_date, description])
      let skillset = await pool.query(query_skillset, [user_account_id, skill_name])
      res.status(201).send("ok")
  
    }
    catch (error) {
      res.status(400).send(error.message)
    }
  
  }
  exports.getProfileByid = async (req, res) => {
    let user_account_id = req.params.id
    console.log(user_account_id)
    try{
  
      let getuserQuery = ` 
      select  *  from seeker_profile 
      INNER JOIN  education_detail on seeker_profile.user_account_id = education_detail.user_account_id
      INNER JOIN  experience_detail on seeker_profile.user_account_id= experience_detail.user_account_id
      INNER JOIN  seeker_skill_set on seeker_profile.user_account_id= seeker_skill_set.user_account_id
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

