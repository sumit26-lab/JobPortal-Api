const pool = require('../../util/db')
const create = async (req, res) => {
    console.log(req.body)
    let { company_name,
        company_description,
        num_employes,
        establishment_date,
        company_web,
        company_loaction,
        business_stream_id, user_account_id,industry_id } = req.body
    company_contactnum = req.body.company_contactnum.trim().replace(/\s+/g, '');


    try {
        let CompanyQuery = `
        insert into company(
        company_name,
         company_description,
          num_employes,
          company_loaction,
          establishment_date,
          company_contactnum,
           company_web,
            business_stream_id,user_account_id,industry_id)
            values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id `

        let data = await pool.query(CompanyQuery, [
            company_name,
            company_description,
            num_employes,
            company_loaction,
            establishment_date,
            company_contactnum,
            company_web,
            business_stream_id, user_account_id,industry_id])

        let result = await data.rows[0]

        res.send(result)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }

}

const update = async (req, res) => {
    let id = req.params.id
    console.log(req.body)
    let { company_name,
        company_description,
        num_employes,
        establishment_date,
        company_web,
        company_loaction,
        business_stream_id,
        user_account_id,industry_id } = req.body
    company_contactnum = req.body.company_contactnum ? req.body.company_contactnum.trim().replace(/\s+/g, '') : null;

    try {

        let query_update = `update company set 
        company_name =$1
         ,company_description =$2
          ,num_employes=$3 ,
          establishment_date=$4,
        company_web=$5,
        company_loaction=$6,
        business_stream_id=$7,
        user_account_id =$8,
        company_contactnum=$9,industry_id=$10 where id=$11
        `
        let updateRow = await pool.query(query_update, [company_name,
            company_description,
            num_employes,
            establishment_date,
            company_web,
            company_loaction,
            business_stream_id,
            user_account_id, company_contactnum,industry_id, id])
        let result = await updateRow.rowCount
        console.log(result)
        res.status(201).send("ok")
    }
    catch (err) {
        console.log(err.message)
    }
}

const getAllComapy = async (req, res) => {
    try {

        let query = 'select * from company'
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
    console.log(req.params)

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
    console.log("ApiCall")

    try {

        let query = 'select * from industry'
        let data = await pool.query(query)

        let result = await data.rows
        console.log(result)


        res.send(result)
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}
const deletedComapy = async (req, res) => {

    let id= parseInt(req.params.cm_id,10)
    let industry_id= parseInt(req.params.ind_id,10)
console.log("deltedId",id)

    try {

        let query = 'DELETE FROM company WHERE id = $1'; 
        let industry_query = 'DELETE FROM industry WHERE industry_id = $1';  
        let Cmpdata = await pool.query(query,[id])
        let Inddata = await pool.query(industry_query,[industry_id])


        res.send('ok')
    }
    catch (err) {
        console.log(err.message)
        res.status(400).send(err.message)
    }
}
module.exports = {
    getIndustry,
    getIdComapy,
    create,
    update,
    getAllComapy,
    deletedComapy 
}