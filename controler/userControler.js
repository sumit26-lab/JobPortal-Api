const bycrpt = require('bcrypt')
const pool = require('../util/db')
const { CreateResetToken, sendEmail } = require('../util/Email')
const crypto = require('crypto')

const jwt = require('jsonwebtoken')
//. Managing Users

require('dotenv').config()

exports.Signup = async (req, res) => {
  let { username, password, email, user_type, gender, contactphone } = req.body



  try {

    const otp = Math.floor(1000 + Math.random() * 9000)
    let Hspassword = await bycrpt.hash(password, 10)
    let query = 'insert into  user_account (username,password,email,user_type_id,gender,contactphone)values($1,$2,$3,$4,$5,$6) returning  user_account_id'
    let insertData = await pool.query(query, [username, Hspassword, email, user_type, gender, contactphone])
    //let emailSender = await EmailSend({ to: email, subject: "OTP-verification", text: `Your Otp is ${otp}` })
     sendEmail(email,'otp',{ name: username, otp: otp })
    let queryOtp = 'insert into otp(otp_code,expiry_time,user_email)values($1,$2,$3)'
    let expiry_time = new Date()
    expiry_time.setMinutes(expiry_time.getMinutes() + 20)
    await insertData.rows[0]

    await pool.query(queryOtp, [otp, expiry_time, email])
    return res.status(200).json({ status: 'success', message: "verifationis panding check You Email" })

  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Error creating user', error: error.message });

  }

}

exports.resendOtp = async (req, res) => {

  const otp = Math.floor(1000 + Math.random() * 9000);
  let expiry_time = new Date()
  expiry_time.setMinutes(expiry_time.getMinutes() + 20)
  let { email } = req.body
   
let username=req.username
  try {
    
    let emailSender = await sendEmail(email, 'Resend OTP' , {username, otp} )
    let queryOtp = {
      text: `INSERT INTO otp(otp_code,expiry_time,user_email)
      values($1,$2,$3)
      ON CONFLICT (user_email) DO UPDATE
      SET otp_code=$1,expiry_time=$2 `,
      values: [otp, expiry_time, email]
    }

    let { rows } = await pool.query(queryOtp)
    console.log("rows", rows)
    if (!rows) {
      return res.status(500).json("server Error");
    }
    else {
      res.sendStatus(200)
    }
  }
  catch (err) {
    res.status(500).send(err);
  }


}
exports.verifyOtp = async (req, res) => {
  let otp = req.body.otp
  let email = req.body.email


  try {

    let queryOtp = `SELECT 
    otp_code,
    CASE 
        WHEN expiry_time < NOW() THEN 'expire'
        ELSE 'valid'
    END AS status
FROM otp 
WHERE user_email = $1 AND otp_code = $2`

    let data = await pool.query(queryOtp, [email, otp])
    let result = await data.rows[0]
    console.log('result', result)
    if (!result) {
      throw new Error('Invalid Otp :')
    }

    let queryverifyOtp = 'update  user_account set is_active=true where email =$1'
    await pool.query(queryverifyOtp, [email])
    let Querdeleteverfy = 'delete from otp where user_email=$1'
    let deletdVerfy = await pool.query(Querdeleteverfy, [email])
    res.status(200).json(result)
  } catch (error) {
    console.log(error.message)
    res.status(400).send({ error: error.message })
  }

}

exports.Login = async (req, res) => {


  if (!req.user) {
    return res.status(400).json({ message: 'User not found.' });
  }
  let { password } = req.body


  let { password: Hspassword, user_account_id, user_type_id, username, is_active, email } = req.user
  if (!is_active) {
    //  console.log("user",user)

    const otp = Math.floor(1000 + Math.random() * 9000)
    let email_id =   await sendEmail(email,'otp',{ name: username, otp: otp })
  console.log("Signin",email_id)
    let expiry_time = new Date()
    expiry_time.setMinutes(expiry_time.getMinutes() + 20)

    let queryOtp = {
      text: `insert into otp(otp_code,expiry_time,user_email)
      values($1,$2,$3) 
      ON CONFLICT(user_email)DO UPDATE 
      SET otp_code=$1,expiry_time=$2`,
      values: [otp, expiry_time, email]
    }

    await pool.query(queryOtp)
    return res.status(401).json({ status: false, message: 'Plase Verfiyed You Accocout', email,email_id })

  }




  let accessToken = jwt.sign({ "UserInfo": { username, user_account_id, user_type_id, is_active } }, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '25s' })

  let refreshToken = jwt.sign({
    "UserInfo": {
      username, user_account_id, user_type_id
    }
  }, process.env.REFRESH_SECRET_TOKEN, { expiresIn: '1d' })
  console.log("RefreshToken", refreshToken)
  if (refreshToken) {
    let queryuser_log = {
      text: `insert into user_log(user_account_id,refresh_token)
      values($1,$2) 
    ON CONFLICT(user_account_id)
     DO UPDATE SET refresh_token=$2,las_login_date= CURRENT_TIMESTAMP  returning*`, values: [user_account_id, refreshToken]
    }
    let { rows } = await pool.query(queryuser_log)
    if (rows.length === 0) {
      return res.send("User Not Found! ") // User not found
    }

  }
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'None', // Adjust as needed
    secure: process.env.NODE_ENV === 'production' // Set to true only in production
  });
  
  res.json({ accessToken })

}
//post Api
exports.forgetpassword = async (req, res) => {
  // let { identifyer } = req.body;

  let data = req.user
  let { resetToken, passwordResetToken, passwordResetTokenExpire } = await CreateResetToken()
  let date = new Date(passwordResetTokenExpire)
  //  let resetUrl=`${req.protocol}://localhost:3000/PasswordReset/${resetToken}`
 let resetLink = `https://jobtageweb.vercel.app/PasswordReset/${resetToken}`;
  //let message = `we have received a reset password requset Plase use this below link to reset you password \n\n ${resetLink}\n\n this reset password link valid only in 10 mints `
 console.log(resetLink)
  try {

    let queryOtp = {
      text: `INSERT INTO resetpasswordtokens(user_account_id, token,expires_at)
             VALUES ($1, $2, $3)`,
      values: [data.user_account_id, passwordResetToken, date]
    };

    //Execute the query to insert or update OTP
    await pool.query(queryOtp);

    let {username,email}=data

    await sendEmail(
      email,
      'Reset-Password-link',
      {username, resetLink}
    );


    res.status(200).json({
      status: true,
      message: 'password link send you Email sent successfully.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while processing the request.' });
  }
};

exports.resetPassword = async (req, res) => {
  console.log("Token", req.params.token)
  let token = crypto.createHash('sha256').update(req.params.token).digest('hex')
  try {
    let restQuery = {
      text: `SELECT 
	user_account_id,
	token , 
	expires_at,
	CASE
	WHEN expires_at < NOW() THEN 'Expired'
	ELSE 'Valid'
	END as status
	FROM resetpasswordtokens 
    WHERE token=$1`,
      values: [token]
    }

    let response = await pool.query(restQuery)
    let result = await response.rows[0]
    if (!result) {
      return res.status(400).json({ status: 'error', message: 'Invalid token.' });
    }
    if (result.status == 'Expired') {
      return res.status(400).json({ status: 'error', message: 'Token is expired.' })
    }
    if (result.status == 'Valid') {
      let deleteToken = {
        text: 'DELETE  FROM resetpasswordtokens where user_account_id =$1',
        values: [result.user_account_id]
      }
      let response = await pool.query(deleteToken)


      res.status(200).json({
        status: 'success',
        message: 'Token is valid.',
        user_account_id: result.user_account_id
      });
    }

    //response.rows[0]
  

  }
  catch (err) {
    console.log(err)
  }



}
exports.changePassword = async (req, res) => {
  let user_account_id = req.params.userId
  let newpassword = await bycrpt.hash(req.body.newPassword, 10);


  try {
    let restQuery = {
      text: `UPDATE 
	user_account Set password=$2 
    WHERE user_account_id=$1`,
      values: [user_account_id, newpassword]
    }

    let response = await pool.query(restQuery)
    let result = await response.rows[0]

    res.status(200).json({
      status: 'success',
      message: 'Password Successfuly Change.',

    });

  }
  catch (err) {
    res.status(400).json({
      status: "falied",
      message: err
    })
  }



}

exports.LogOut = async (req, res) => {
  console.log("Logout API Callll--------->", req.cookies)
  let cookies = req.cookies
  //console.log('api',cookies)
  if (!cookies?.jwt) return res.status(401)
  console.log("cookie", cookies.jwt)
  let refreshToken = cookies.jwt
  console.log("ref", cookies)

  let query = {
    text: `SELECT * FROM user_log
    WHERE refresh_token = $1`,
    values: [refreshToken]
  }
  let data = await pool.query(query)
  let rows = await data.rows
  console.log("InsideDatabaseRefreshToken", rows)
  if (rows && rows.length === 0) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }

  let queryDelete = {
    text: `DELETE  FROM user_log
    WHERE refresh_token = $1`,
    values: [refreshToken]
  }
  let user_log = await pool.query(queryDelete)
  let user_logdata = await user_log.rowCount
  console.log("deleted Row", user_logdata)
  if (user_logdata == 1) {
    console.log("inside user")
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.send("ok")

  }

}
exports.getCookie = async (req, res) => {
  try {

    const cookieValue = req.cookies.jwt;
    res.send(cookieValue);
  }
  catch (err) {
    res.sendStatus(404)
  }

}
exports.deleteResetPasswordToken = async (req, res) => {
  const user_account_Id = req.params.id;

  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Start transaction

    // Delete from applications and return the id
    const applicationsQuery = 'DELETE FROM applications WHERE user_account_id = $1 RETURNING id';
    const result = await client.query(applicationsQuery, [user_account_Id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No applications found for this user." });
    }

    let { id } = await result.rows[0];
    console.log("userId", id)
    if (id) {
      const application_historQuery = ' DELETE FROM application_history where application_id =$1 RETURNING id'
      const result = await client.query(application_historQuery, [id])
      console.log("deleteHistroy--", result.rows[0])
    }
    await client.query('COMMIT'); // Commit transaction
    res.status(204).send(); // No Content
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback on error
    console.error("Error during transaction", err.message);
    res.status(400).send(err.message);
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
}

exports.getRecentJobs = async (req, res) => {
  console.log("Apicall")

  let { page = 1, limit = 3, sortBy = 'jp.createat', sortOrder = 'ASC', } = req.query;

  // let order = sortBy && sortOrder ? `${sortBy} ${sortOrder}` : 'jp.id ASC';
  page = parseInt(page);
  limit = parseInt(limit);
  let offset = (page - 1) * limit; //  if pages 5-1 4 *3 12
  //let countparameter = []
  let countQuery = ` select count(*) as total_count  from job_post as jp
       JOIN job_type jt on jp.job_type_id=jt.id
       JOIN company c on jp.company_id=c.id
       JOIN company_location cl on c.company_locationid=cl.id
       JOIN business_streams bs on c.business_streams_id=bs.id

    `

  let query = `SELECT
            jp.id AS job_post_id,
            jp.posted_by_id,
            jt.title,
            jt.type,
            jt.description,
            jt.max_salary,
            jt.min_salary,
            cl.street_address AS job_street_address,
            cl.city AS job_city,
            cl.state AS job_state,
            cl.zip AS job_zip,
           c.company_name,
           c.company_description,
           c.company_web,
           c.num_employes,
           c.company_locationid,
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
           company_location cl on c.company_locationid=cl.id
        JOIN   
            business_streams bs ON c.business_streams_id = bs.id 
              ORDER BY ${sortBy} ${sortOrder}
               LIMIT $1 OFFSET $2
            `;


  // queryparameter.push(limit, offset)
  // console.log(query)
  try {
    const countResult = await pool.query(countQuery);
    const totalCount = parseInt(countResult.rows[0].total_count);
    const totalPages = Math.ceil(totalCount / limit)
    if (page > totalPages && totalPages > 0) {
      return res.status(404).json({ message: 'Page not found' });
    }
    const { rows } = await pool.query(query, [limit, offset]);
    console.log("rows", rows)
    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: page
      , rows
    });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ message: 'Internal server error' });
  }



}
exports.deleteUser = async (req, res) => {
  let user_account_id = req.params.id
  console.log("userApi", user_account_id)
  if (user_account_id == null && user_account_id == undefined) return res.status(400).json({ status: false, message: "user_account_id not provided" });
  const client = await pool.connect();
  try {
    await client.query('BEGIN')
    let userlog = 'delete from  user_log  where user_account_id=$1'
    await pool.query(userlog, [user_account_id])



    let query = 'delete from  user_account  where user_account_id=$1'
    let User_Account = await pool.query(query, [user_account_id])
    if (User_Account.rowCount === 0) {
      return res.status(404).json({ message: "No applications found for this user." });
    } await client.query('COMMIT')
    res.status(204).send()
  }
  catch (error) {
    console.error(error)
    res.status(500).send(error);

  } finally {
    if (client) {
      client.release()
    }
  }


}


exports.GetState = async (req, res) => {


  try {
    const result = await pool.query('SELECT DISTINCT city_state FROM cities');
    let state = await result.rows

    res.status(200).json({ status: 'success', state })

  }
  catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }

}
exports.GetCity = async (req, res) => {
  const stateName = req.params.stateName;
  console.log(stateName)

  try {
    const result = await pool.query('SELECT * FROM cities WHERE city_state ILIKE $1', [stateName]);
    const cities = await result.rows;

    if (cities.length > 0) {
      res.status(200).json({ status: 'success', cities })
    } else {
      res.status(404).json({ message: "No cities found for the specified state." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}
