const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const jsonWebToken = require('jsonwebtoken')
const environment = require('../environments/environment')


const credentials = {
    client: {
        id: environment.APP_ID,
        secret: environment.APP_PASSWORD,
    },
    auth: {
        tokenHost: 'https://login.microsoftonline.com',
        authorizePath: 'common/oauth2/v2.0/authorize',
        tokenPath: 'common/oauth2/v2.0/token',
    },
}

const authenticationService = require('../services/authenticationService')
const commonService = require('../services/commonService')

const verifyToken = (req, res, next) => {
    req.account = undefined
    if (!req.headers || !req.headers.authorization)
        return res.status(401).json({
            err: 'Unauthorized User!',
            statusCode: 3, //
        })

    const token = req.headers.authorization
    return jsonWebToken.verify(token, environment.secret, async (err, decode) => {
        if (err)
            return res.status(401).json({
                err,
                statusCode: 2,
            })
        const account = decode
        const role_id = await authenticationService.getRole(account.acc_id)
        
		if (role_id === '') {
			return res.status(401).json({
                statusCode: 6,
            })
		}
		account.acc_role = role_id
        req.account = account

		next()
    })
}

function getAuthUrl() {
	const client = new AuthorizationCode(credentials)
	const returnVal = client.authorizeURL({
		redirect_uri: environment.APP_REDIRECT_URI,
		scope: environment.APP_SCOPE
	})
	console.log(`Generated Auth Url: ${returnVal}`)
	return returnVal
}

function saveValuesToCookie(token, res) {
	// Parse The Identity Token
	const account = jsonWebToken.decode(token.token.id_token)

	// Save The Access Token In Cookie
	res.cookie('graph_access_token', token.token.access_token, { maxAge: 3600000, httpOnly: false})
	
	// Save The Account's Name In Cookie
	res.cookie('graph_account_name', account.accFullName, { maxAge: 3600000, httpOnly: false})

	// Save The Refresh Token In Cookie
	res.cookie('graph_refresh_token', token.token.refresh_token, { maxAge: 7200000, httpOnly: false})

	// Save The Token Expiration Time In Cookie
	res.cookie('graph_access_expires', token.token.expires_at.getTime(), { maxAge: 3600000, httpOnly: false})
}

async function getTokenFromCode(auth_code, res) {
	const client = new AuthorizationCode(config);
	const result = await client.getToken({
		statusCode: auth_code,
		redirect_uri: environment.APP_REDIRECT_URI,
		scope: environment.APP_SCOPE
	})

	saveValuesToCookie(result, res)

	return result.token
}


function clearCookies(res) {
	// Remove The Access Token In Cookie
	res.clearcookie('graph_access_token', token.token.access_token, { maxAge: 3600000, httpOnly: false})
	
	// Remove The Account's Name In Cookie
	res.clearcookie('graph_account_name', account.accFullName, { maxAge: 3600000, httpOnly: false})

	// Remove The Refresh Token In Cookie
	res.clearcookie('graph_refresh_token', token.token.refresh_token, { maxAge: 7200000, httpOnly: false})

	// Remove The Token Expiration Time In Cookie
	res.clearcookie('graph_access_expires', token.token.expires_at.getTime(), { maxAge: 3600000, httpOnly: false})
}

async function getAccessToken(data, res) {
	const client = new AuthorizationCode(config);
	const accessToken = data.access_token
	if (accessToken) {
		const newDate = new Date(data.expires_at).getTime()
		const earlyExpires = 30000
		const expiration = new Date(parseFloat(newDate) - earlyExpires)
		if (expiration > new Date()) {
			return accessToken
		}
	}

	const refreshToken = data.refresh_token
	if (refreshToken) {
		const newToken = client.accessToken.refresh({ refresh_token: refreshToken }).refresh()
		return newToken.token.access_token
	}

	return null
}

module.exports = {
	verifyToken,
	getAuthUrl,
	getAccessToken,
	clearCookies,
	getTokenFromCode
}
