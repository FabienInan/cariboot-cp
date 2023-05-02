

export const postApi = (url, body, headers) => fetch(url, {
  method: 'POST',
  body: body,
  headers: {...headers,
    'Content-type': 'application/json; charset=UTF-8'
  },
});
  
export const putApi = (url, body, headers) => {
  fetch(url, {
    method: 'PUT',
    body,
    headers: {...headers,
      'Content-Type': 'application/json'
    },
  });};

export const getApi = (url, headers) => fetch(url, {
  method: 'GET',
  headers: {
    ...headers,
    'Content-Type': 'application/json'
  },
});

export const addTokenAndRefToBody = (body, ref, deployToken) => {
  body.append('token', deployToken);
  body.append('ref',ref);
  return body;
};

