const pool = require('../../util/db')
const {putObjectUrl,deleteObjectFromS3}= require('../../util/uploadfile')

const path= require('path')
exports.create = async (req, res) => {
   let user_id= req.user_account_id
    if (!req.file ) {
        return res.status(400).send("File not found");
    }
    const buffer = req.file.buffer
    let originalFileName= req.file.originalname
    let file_type= req.file.mimetype
    let file_size = req.file.size

    
    let klobytis = file_size / 1024
    let megabits = klobytis.toFixed(2)
    megabits = parseInt(megabits)
    const customFileName = `resume-${Date.now()}${path.extname(originalFileName)}`;
    try {
       await putObjectUrl(customFileName,file_type,buffer)
      
             let resume_url=`https://jobportal-bucket-app.s3.ap-south-1.amazonaws.com/uploads/${customFileName}`
            
            console.log("url",resume_url)
            console.log(`resumeUrl -${resume_url}, fileSize -${file_size} file_type - ${file_type} user_id ${user_id}`)
            let query_experience_detail = 'insert into  resume(user_account_id,resume_url,file_size,file_type)values($1,$2,$3,$4)'
            let skillset = await pool.query(query_experience_detail, [user_id, resume_url, megabits, file_type])
             res.status(201).send({message:'File uploaded and resume created successfully.'});
            // // This will cause the err

    }
    catch (err) {
        res.status(400).json({ message: err })

    }

}


exports.update = async (req, res) => {
    console.log("InsideApiLoaction", req.body)
    let user_account_id = req.params.id
    const { resume_url, uploaded_at, file_size, file_type } = req.body
    try {

        let query_update = ` UPDATE resume SET resume_url=$1,uploaded_at=$2,file_size=$3,file_type=$4, where user_account_id=$5`

        let updateRow = await pool.query(query_update, [resume_url, uploaded_at, file_size, file_type, user_account_id])
        let result = updateRow.rowCount
        res.sendStatus(201)
    }
    catch (err) {
        console.log(err.message)
    }
}

exports.getAll = async (req, res) => {
    let user_account_id= req.params.id
    try {

        let query = 'select resume_url from resume  where user_account_id= $1'
        let data = await pool.query(query,[user_account_id])
        let result = await data.rows[0]

        res.status(200).send({message:"Successfuliy",result})
    }
    catch (err) {
        console.log(error.message)
        res.status(400).send(error.message)
    }


}
exports.getIdBy = async (req, res) => {
    let id = req.params.id
    try {

        let query = 'select * from resume  where user_account_id=$1'
        let data = await pool.query(query, [id])
        let result = await data.rows[0]
 console.log("Resume",result)
        res.send(result)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }

}
exports.delete = async (req, res) => {
    let id = req.params.id
    let {key}=req.body
    
    try {
        await deleteObjectFromS3(key)

        let query = 'DELETE  from resume where user_account_id=$1'
        let data = await pool.query(query, [id])
        let result = await data.rows
        console.log("user_account_id", result)
        res.status(201).json({
            message: "deleted sucesFuliy"
        })
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }

}



