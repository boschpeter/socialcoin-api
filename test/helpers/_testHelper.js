'use strict';

module.exports = {
  config: {
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en-US',
    },
    auth: {
      url: '/api/Relations/login',
    },
    error: err => {
      console.error(err);
    },
  },
  adminUser: {
    email: 'theo.theunissen@gmail.com',
    password: '111111',
  },
};
