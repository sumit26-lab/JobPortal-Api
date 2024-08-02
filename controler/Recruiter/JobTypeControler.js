const pool = require('../../util/db')
exports.create = async (req, res) => {
    console.log("job_type",req.body)
    let {name,
        description,
        qualification,
        skills_required,
        experience_required,
        title,
        salary,
        type
     } = req.body
    try {
        let stramQuery = 'insert into job_type(name,description,qualification,skills_required,experience_required,title,salary,type)values($1,$2,$3,$4,$5,$6,$7,$8) returning  id'
        let stream = await pool.query(stramQuery, [name,
            description,
            qualification,
            skills_required,
            experience_required,
            title,
            salary,type])
        let id = await stream.rows[0]

        res.send(id)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}