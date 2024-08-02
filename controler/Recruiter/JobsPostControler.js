const pool = require('../../util/db')
exports.create = async (req, res) => {
    let { posted_by_id, job_type_id, job_location_id, company_id } = req.body
    try {
        let PostQuery = 'insert into job_post(posted_by_id,job_type_id,job_location_id,company_id)values($1,$2,$3,$4) returning  id'
        let postData = await pool.query(PostQuery, [posted_by_id, job_type_id, job_location_id, company_id])
        let id = await postData.rows

        res.send(id)
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message)
    }
}
// exports.getAllJobpost=async(req,res)=>{
//     let{page=1,limit=3,sortBy,sortOrder,serach=""}=req.query
//     let offset=(page-1)*limit
//     let order= sortBy&&sortOrder?`${sortBy} ${sortOrder}`:'jp.id ASC'
//     let searchQuery=`%${serach}%`
//     let query= `SELECT
//     jp.id AS job_post_id,
//     jp.posted_by_id,
//     jt.title,
//     jt.type,
//     jt.description,
//     jt.salary,
//     jl.street_address AS job_street_address,
//     jl.city AS job_city,
//     jl.state AS job_state,
//     jl.zip AS job_zip,
//     c.company_name,
//     jp.createat AS job_post_created_at  
// FROM
//     job_post jp

// JOIN
//     job_type jt ON jp.job_type_id = jt.id
// JOIN
//     job_location jl ON jp.job_location_id = jl.id
// JOIN
//     company c ON jp.company_id = c.id
// JOIN   
//     business_stream bs ON c.business_stream_id = bs.id 
// `
// if(serach){
//     query+=`WHERE 
//     jp.titie ILIKE $1`
// }
// query+=`
// ORDER BY
//     ${order}
//  LIMIT $${serach ? '3' : '2'} OFFSET $4;`;
// const { rows } = await pool.query(query,serach? [searchQuery,limit,offset]:[limit,offset]);
// res.status(200).json(rows);
// }
// exports.getAllJobpost = async (req, res) => {
//     let { page = 1, limit = 3, sortBy, sortOrder, search = "" } = req.query;
//     let offset = (page - 1) * limit; //  if pages 5-1 4 *3 12
//     let order = sortBy && sortOrder ? `${sortBy} ${sortOrder}` : 'jp.id ASC';
//     let searchQuery = `%${search}%`;
//     console.log("query", req.query)
//     let countparameter = []

//     let countQuery = `select count(*) as total_count
//          from job_post jp
//         JOIN job_type jt on jp.job_type_id=jt.id
//        JOIN job_location jl on jp.job_location_id=jl.id
//        JOIN company c on jp.company_id=c.id
//        JOIN business_stream bs on c.business_stream_id=bs.id
// `
// if (search) {
//     countQuery += `
//         WHERE 
//             jt.title ILIKE $1`;
//     countparameter.push(searchQuery)
// }
// let dataParams=[...countparameter]
// console.log("countQuery",countQuery

// )
//     let query = `
//         SELECT
//             jp.id AS job_post_id,
//             jp.posted_by_id,
//             jt.title,
//             jt.type,
//             jt.description,
//             jt.salary,
//             jl.street_address AS job_street_address,
//             jl.city AS job_city,
//             jl.state AS job_state,
//             jl.zip AS job_zip,
//             c.company_name,
//             jp.createat AS job_post_created_at  
//         FROM
//             job_post jp
//         JOIN
//             job_type jt ON jp.job_type_id = jt.id
//         JOIN
//             job_location jl ON jp.job_location_id = jl.id
//         JOIN
//             company c ON jp.company_id = c.id
//         JOIN   
//             business_stream bs ON c.business_stream_id = bs.id`;

//     // Add WHERE clause only if search parameter is provided

//     if (search) {
//         query += `
//             WHERE 
//                 jt.title ILIKE $1`;
//     }

//     query += `
//         ORDER BY
//             ${order}
//         LIMIT $${dataParams.length + 1} OFFSET $${dataParams.length + 2}`;
//         dataParams.push(limit, offset)
//     console.log("Parmas",dataParams)
//     try {
//         const countResult = await pool.query(countQuery, countparameter);
//         const totalCount = countResult.rows[0].total_count;
//         const { rows } = await pool.query(query, dataParams);
//         res.status(200).json({
//             totalCount, page, limit, rows
//         });
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
exports.getJobById = async (req, res) => {
    let id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid job post ID' });
    }
    let query = `SELECT
    jp.id AS job_post_id,
    jp.posted_by_id,
    jt.title,
    jt.type,
    jt.description,
    jt.salary,
    jl.street_address AS job_street_address,
    jl.city AS job_city,
    jl.state AS job_state,
    jl.zip AS job_zip,
   c.company_description,
   c.company_web,
   c.num_employes,
   c.company_loaction,
   c.company_contactnum,
  c.establishment_date,
  c.company_email,
    jp.createat AS job_post_created_at  
FROM
    job_post jp
JOIN
    job_type jt ON jp.job_type_id = jt.id
JOIN
    job_location jl ON jp.job_location_id = jl.id
JOIN
    company c ON jp.company_id = c.id
JOIN   
    business_stream bs ON c.business_stream_id = bs.id 
    WHERE jp.id=$1
    `;

    try {

        const { rows } = await pool.query(query, [id]);
        const response = { data:rows[0], status: 'success' };
        res.status(200).json(response);
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
exports.getAllJobpost = async (req, res) => {
    let id = parseInt(req.params.id, 10);
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'Invalid job post ID' });
    }


    let { page = 1, limit = 3, sortBy = 'jp.createat', sortOrder = 'ASC', search = "" } = req.query;
    let offset = (page - 1) * limit; //  if pages 5-1 4 *3 12
    // let order = sortBy && sortOrder ? `${sortBy} ${sortOrder}` : 'jp.id ASC';
    let searchQuery = `%${search}%`;
    let validSortByfields = ['jp.createat', 'jt.salary']
    if (!validSortByfields.includes(sortBy)) {
        sortBy = 'jp.createat'
    }
    console.log("validSortByfields", validSortByfields)
    if (!['ASC', 'DESC'].includes(sortOrder)) {
        sortOrder = 'ASC'
    }
    //let countparameter = []
    let countQuery = ` select count(*) as total_count  from job_post as jp
       JOIN job_type jt on jp.job_type_id=jt.id
       JOIN job_location jl on jp.job_location_id=jl.id
       JOIN company c on jp.company_id=c.id
       JOIN business_stream bs on c.business_stream_id=bs.id
       WHERE jp.posted_by_id=$1
    `

    let query = `SELECT
            jp.id AS job_post_id,
            jp.posted_by_id,
            jt.title,
            jt.type,
            jt.description,
            jt.salary,
            jl.street_address AS job_street_address,
            jl.city AS job_city,
            jl.state AS job_state,
            jl.zip AS job_zip,
           c.company_name,
           c.company_description,
           c.company_web,
           c.num_employes,
           c.company_loaction,
            c.company_contactnum,
            c.establishment_date,
            c.company_email,
            jp.createat AS job_post_created_at  
        FROM
            job_post jp
        JOIN
            job_type jt ON jp.job_type_id = jt.id
        JOIN
            job_location jl ON jp.job_location_id = jl.id
        JOIN
            company c ON jp.company_id = c.id
        JOIN   
            business_stream bs ON c.business_stream_id = bs.id 
            WHERE jp.posted_by_id=$1
            `;

    let countparameter = [id]
    let queryparameter = [id]
    if (search) {
        countQuery += `
    AND jt.title ILIKE $2
    `
        query += `
    AND jt.title ILIKE $2
    `
        countparameter.push(searchQuery)
        queryparameter.push(searchQuery)
    }
    query += `
ORDER BY
    ${sortBy} ${sortOrder}
LIMIT $${queryparameter.length + 1} OFFSET $${queryparameter.length + 2}`;
    queryparameter.push(limit, offset)
    console.log(query)
    try {
        const countResult = await pool.query(countQuery, countparameter);
        const totalCount = countResult?.rows[0].total_count;
        const { rows } = await pool.query(query, queryparameter);
        res.status(200).json({
            totalCount, page, limit, rows
        });
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ message: 'Internal server error' });
    }


    // exports.getAllJobpost=async(req,res)=>{
    //     let{page=1,limit=3,sortBy,sortOrder,serach=""}=req.query
    //     let offset=(page-1)*limit
    //     let order=`${sortBy} ${sortOrder}`
    //     let searchQuery=`%${serach}%`
    //     let query= `SELECT
    //     jp.id AS job_post_id,
    //     jp.posted_by_id,
    //     jt.title,
    //     jt.type,
    //     jt.description,
    //     jt.salary,
    //     jl.street_address AS job_street_address,
    //     jl.city AS job_city,
    //     jl.state AS job_state,
    //     jl.zip AS job_zip,
    //     c.company_name,
    //     jp.createat AS job_post_created_at
    // FROM
    //     job_post jp
    // JOIN
    //     job_type jt ON jp.job_type_id = jt.id
    // JOIN
    //     job_location jl ON jp.job_location_id = jl.id
    // JOIN
    //     company c ON jp.company_id = c.id
    // JOIN
    //     business_stream bs ON c.business_stream_id = bs.id

    // ORDER BY
    //     jp.createat DESC;



    // `
    // const { rows } = await pool.query(query);
    // res.status(200).json(rows);
}

