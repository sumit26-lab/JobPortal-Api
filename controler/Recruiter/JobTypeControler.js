const pool = require('../../util/db')
exports.create = async (req, res) => {

    if (!req.body) {
        return res.status(400).json({ message: 'Kindly enter The value' });
    }

    let {
        description,
        qualification,
        skills_required,
        experience_required,
        title,
        type
    } = req.body
   const [min_salary, max_salary] = req.body.salary?.split('-').map(value => parseFloat(value));
   console.log("body",req.body)
  console.log(`min,${min_salary},Max ${max_salary}`)
    try {
        let stramQuery = 'insert into job_type(title,description,qualification,skills_required,experience_required,min_salary,max_salary,type)values($1,$2,$3,$4,$5,$6,$7,$8) returning  id'
        let stream = await pool.query(stramQuery, [
            title,
            description,
            qualification,
            skills_required,
            experience_required,
            min_salary, max_salary,
            type])
        let id = await stream.rows[0]

        res.send(id)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}
exports.upadte=async(req,res)=>{
    let id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid job Type  ID' });
    }
    console.log('job_type',req.body)
    let {title,
        description,
        qualification,
        skills_required,
        experience_required,
        type
    } = req.body
    const [min_salary, max_salary] = req.body.salary?.split('-').map(value => parseFloat(value));

    let query=` UPDATE  job_type SET title =$1,description =$2,qualification=$3,skills_required=$4,experience_required=$5,type=$6 ,min_salary=$7,max_salary=$8 where id=$9 `
    let updateType=await pool.query(query,[
        title,
        description,
        qualification,
        skills_required,
        experience_required,
        type,
        min_salary, max_salary,id
    ])
    let response= await updateType.rows
    res.status(201).json(response)
}

exports.delete=async(req,res)=>{
    //job_type id
    let id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid job Type  ID' });
    }
    const query='DELETE FROM job_type where id=$1'
    const queryinput=await pool.query(query,[id])
    const  response=await queryinput.rowCount
    res.sendStatus(204)

}