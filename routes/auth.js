const express = require('express');
const config = require('../config');
const querystring = require('querystring');
const axios = require('axios');
const router = express.Router();

router.get('/start', function (req, res, next) {
  const { baseUrl, clientId: clientId, scopes } = config;
  const redirectUri = `${baseUrl}/auth/end`;

  const query = querystring.stringify({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes,
    response_type: 'code'
  });

  const uri = `https://api.instagram.com/oauth/authorize?${query}`;
  
  res.redirect(uri);
});

router.get('/end', async function (req, res, next) {
  const { code } = req.query;
  const { clientId, clientSecret, baseUrl } = config;
  const redirectUri = `${baseUrl}/auth/end`;
  const uri = 'https://api.instagram.com/oauth/access_token';

  const data = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code
  };
  
  const requestOptions = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    data: querystring.stringify(data),
    url: uri
  };

  const { data: { access_token }} = await axios(requestOptions);

  res.status(200).end();
});

module.exports = router;
