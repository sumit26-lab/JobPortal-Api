const pool = require('../../util/db')
exports.create= async (req, res) => {
    console.log("applications",req.body)
    let {  job_id,user_account_id, title,company,
        experience,
        resume,
        education}= req.body


    try {
        let applicationsQuery = `
        insert into applications(
         job_id,
         user_account_id,
          title,
          company,
        experience,
        resume,
        education)values($1,$2,$3,$4,$5,$6,$7) returning id `

        let applicationResult = await pool.query(applicationsQuery, [
            job_id,user_account_id, title,company,experience,
            resume,
            education
        
        ])
        const applicationId = applicationResult.rows[0].id;
 console.log("id",applicationId)
        //Step 2: Insert into application_history table (if change_reason is provided)
            await pool.query(`
                INSERT INTO application_history (application_id, status, change_reason)
                VALUES ($1, $2, $3);
            `, [applicationId, "submitted", "Application Successfuliy submitted"]);
        // let result = await data.rows[0]

        res.status(200).json({
            success:true,
        

        })
    }catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }

}

// Route to get applications for a specific job
exports.getId =async(req, res) => {
    const { id,userId } = req.params;
 console.log("job_id",id,userId)
    try {
        const result = await pool.query('SELECT * FROM applications WHERE job_id = $1 AND  user_account_id =$2', [id,userId]);
        console.log("appliactions",result.rows)
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// exports.insertapplication_history  = async (req, res) => {
  
//     console.log("application_history",req.body)
//     let { application_id, status, change_reason} = req.body
   

//     try {

//         let query_update = `insert into application_history(application_id, status, change_reason)
//         values($1,$2,$3) ON CONFLICT(appliaction_id)
//         DO UPDATE SET
//         status=CASE
//         WHEN application_histor.status !=EXCLUDED.status THEN EXCLUDED.status
//         ELSE application_histor.status
//           END,
//     change_reason = EXCLUDED.change_reason,
//     change_date = CURRENT_TIMESTAMP; 

        
//         `
//         await pool.query(query_update, [application_id, status,change_reason]);
//             console.log('Application history updated successfully');
       
   
//       res.sendStatus(200)
//     }
//     catch (err) {
//         console.log("Error")
//         console.log(err.message)
//     }
// }

exports.getApplyJob=async(req,res)=>{
    let id= req.params.id;
    console.log("userId",id)
    try {
        const result = await pool.query(`select ap.job_id,ap.application_date,jt.title,cm.company_name,aph.status from applications ap 
	 join application_history aph on ap.id=aph.application_id
	 join job_post jp on ap.job_id=jp.id
	 join job_type jt on jp.job_type_id=jt.id
	 join company cm on jp.company_id=cm.id
     where ap.user_account_id=$1`,[id]);
        console.log("appliaction",result.rows)
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


