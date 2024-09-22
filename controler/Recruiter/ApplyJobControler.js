const pool = require('../../util/db')
const create = async (req, res) => {
    console.log("applications", req.body)
    let { job_id, profile_id, cover_letter } = req.body


    try {
        let applicationsQuery = `
        insert into applications(
         job_id,profile_id, cover_letter)
            values($1,$2,$3) returning id `

        let data = await pool.query(applicationsQuery, [
            job_id, profile_id, cover_letter

        ])

        let result = await data.rows[0]

        res.status(200).json({
            success: true,
            data: result

        })
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }

}

const insertapplication_history = async (req, res) => {

    console.log("application_history", req.body)
    let { application_id, status, change_reason } = req.body


    try {

        let query_update = `insert into application_history(application_id, status, change_reason)
        values($1,$2,$3) ON CONFLICT(appliaction_id)
        DO UPDATE SET
        status=CASE
        WHEN application_histor.status !=EXCLUDED.status THEN EXCLUDED.status
        ELSE application_histor.status
          END,
    change_reason = EXCLUDED.change_reason,
    change_date = CURRENT_TIMESTAMP; 

        
        `
        await pool.query(query_update, [applicationId, status, changeReason]);
        console.log('Application history updated successfully');


        res.sendStatus(200)
    }
    catch (err) {
        console.log("Error")
        console.log(err.message)
    }
}

const Getapplication_history = async (req, res) => {
    let job_id = req.params.id
    try {

        let query = `SELECT
    posted_by_id,
	job_post.id as job_postId,
    applications.id AS application_id,
    job_type.title AS job_title,
    seeker_profile.profile_id AS seeker_profile_id,
    application_history.status AS application_status,
    application_history.change_date AS application_change_date,
    application_history.change_reason AS application_change_reason
FROM job_post
JOIN job_type ON job_post.job_type_id=job_type.id
JOIN applications ON job_post.id = applications.job_id
JOIN seeker_profile ON applications.profile_id = seeker_profile.profile_id
JOIN application_history ON applications.id = application_history.application_id
WHERE posted_by_id = $1`  //-- $1 is a placeholder for the exact job_post ID'
        let data = await pool.query(query)
        let result = await data.rows

        res.send(result)
    }
    catch (err) {
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
const getIdComapy = async (req, res) => {
    let id = req.params.id
    console.log("req.params")

    try {

        let query = 'select * from company where user_account_id=$1'
        let data = await pool.query(query, [id])
        let result = await data.rows[0]


        res.send(result)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }

}

const getIndustry = async (req, res) => {


    try {

        let query = 'select * from industries'
        let data = await pool.query(query)

        let result = await data.rows



        res.send(result)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}
const deletedCompany = async (req, res) => {

    let id = parseInt(req.params.id, 10)


    try {

        let query = 'DELETE FROM company WHERE id = $1';

        let Cmpdata = await pool.query(query, [id])



        res.send('ok')
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}

const getApplyJob = async (req, res) => {
    let id = req.params.id;
    console.log("userId", id)
    try {
        const result = await pool.query(`SELECT sks.skill_name,skp.first_name,ap.experience,ap.company,aph.status,jt.title,jp.createat as jobpost_date,ap.application_date,ap.id as appliactionId,ap.resume FROM job_post jp
join job_type jt on jp.job_type_id=jt.id
join applications ap on jp.id=ap.job_id
join seeker_profile skp on ap.user_account_id=skp.user_account_id	
join seeker_skill_set sks on ap.user_account_id=sks.user_account_id	
join application_history aph on ap.id=aph.application_id	

where jp.posted_by_id=$1

   `, [id]);
        console.log("appliaction", result.rows)
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const chnageStatus=async (req,res)=>{
    let id = req.params.id;
   let status= req.body.status

console.log("chnageStatus",id,status)
    try {
        const result = await pool.query(`UPDATE   application_history set status= $1 where application_id=$2 `,[status,id])

        res.status(200).json({ message: 'Row updated successfully' });
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = {

    chnageStatus,

    getApplyJob,

}