import axios from 'axios';

let hostname = window === undefined ? "yamitec.yamitec.com" : window.location.hostname;
let apiHost = ""
hostname = "/api";
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  apiHost = "http://localhost:8000/api"
} else {
  apiHost = hostname;
}
apiHost = hostname;
let token = localStorage.getItem("token");
export const Api = () => {
  return axios.create({
    baseURL: apiHost,
  }).get("/");
}

/// COMON METHODS

export const JWT_Decode = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
/// Lower Keys from object
function lower(obj) {
  for (let prop in obj) {
    console.log(prop)
    if (obj[prop] !== "type")
      continue;
    obj[prop.toLowerCase()] = obj[prop];
  }
  return obj;
}
/// new API METHOD
/// Auth API Methods
export const postResetPassword = async (params = {}) => {
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: params,
    url: apiHost + '/reset',
  };
  try {
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  }
};
// Reset PWD API
export const putResetPassword = async (params = {}) => {
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
    });
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data,
    url: apiHost + '/resetpwd',
  };
  try {
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: error.message } }
  }
};

export const postAuth = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: params,
    url: apiHost + '/login',
  };
  try {
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, message: "problema ao se conectar com o servidor!" } }
  }
};

/// list function
export const getApiRanking = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/ranking/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

/// report contributors
export const getApiContributorsReport = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/contributors/report${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      //'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwib3JnYW5pemF0aW9uX2lkIjoxLCJpYXQiOjE2MTIzMDIyNTYsImV4cCI6MTYxMjkwNzA1Nn0.mnNuXdmqF487x_K4zfOkhhrkdJ6rwLB61NaSPhGZyJo'//localStorage.getItem('token')
    }),
  }).then((response) => {
    //return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

/// list contributors
export const getApiContributors = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/contributors/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwib3JnYW5pemF0aW9uX2lkIjoxLCJpYXQiOjE2MTIzMDIyNTYsImV4cCI6MTYxMjkwNzA1Nn0.mnNuXdmqF487x_K4zfOkhhrkdJ6rwLB61NaSPhGZyJo'//localStorage.getItem('token')
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}
/// create contributors
export const postApiContributors = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
      //`${key}=${encodeURIComponent(val)}`
    });
    //.join('&');
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/contributors',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update contributors
export const putApiContributors = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  data.append("_method", "put");
  data.append("justification",params.justification  ?? " ")
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
      //`${key}=${encodeURIComponent(val)}`
    });
    //.join('&');
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/contributors/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// list provider types
export const getApiProviderTypes = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/providertypes/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwib3JnYW5pemF0aW9uX2lkIjoxLCJpYXQiOjE2MTIzMDIyNTYsImV4cCI6MTYxMjkwNzA1Nn0.mnNuXdmqF487x_K4zfOkhhrkdJ6rwLB61NaSPhGZyJo'//localStorage.getItem('token')
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

/// list providers
export const getApiProviders = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/providers/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwib3JnYW5pemF0aW9uX2lkIjoxLCJpYXQiOjE2MTIzMDIyNTYsImV4cCI6MTYxMjkwNzA1Nn0.mnNuXdmqF487x_K4zfOkhhrkdJ6rwLB61NaSPhGZyJo'//localStorage.getItem('token')
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}
/// create providers
export const postApiProviders = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
      //`${key}=${encodeURIComponent(val)}`
    });
    //.join('&');
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/providers',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update providers
export const putApiProviders = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
      //`${key}=${encodeURIComponent(val)}`
    });
    //.join('&');
 const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/providers/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}
/// list clients
export const getApiClients = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/clients/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}
/// create clients
export const postApiClients = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
    });
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/clients',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update clients
export const putApiClients = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/clients/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// list managers
export const getApiManagers = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/managers/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}
/// create managers
export const postApiManagers = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
    });
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/managers',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update managers
export const putApiManagers = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/managers/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}
// remove manager to provider
export const deleteApiManagersProviders = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  //data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, `${val}`);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/providers/manager/remove`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// list bonus
export const getApiBonus = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/bonus/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

/// create bonus
export const postApiBonus = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
    });
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/bonus',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update bonus
export const putApiBonus = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/bonus/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// update bonus
export const deleteApiBonus = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "delete");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/bonus/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// list function
export const getApiFunction = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/function/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

/// create function
export const postApiFunction = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
    });
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/function',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update function
export const putApiFunction = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/function/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// update function
export const deleteApiFunction = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "delete");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/function/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}
/// list accountmanager
export const getApiAccountmanager = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/accountmanager/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}
/// create accountmanager
export const postApiAccountmanager = async (params = {}) => {
  localStorage.setItem("sessionTime", 900)
  const data = new FormData();
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, val);
    });
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost + '/accountmanager',
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update accountmanagers
export const putApiAccountmanager = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "put");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/accountmanager/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// update accountmanagers
export const deleteApiAccountmanager = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  const data = new FormData();
  data.append("_method", "delete");
  Object.entries(params)
    .map(([key, val]) => {
      data.append(key, (typeof string == "string") ? `${val}` : val);
    });
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + token
    },
    data,
    url: apiHost +  `/accountmanager/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// list permissions
export const getApiPermissions = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/permissions/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwib3JnYW5pemF0aW9uX2lkIjoxLCJpYXQiOjE2MTIzMDIyNTYsImV4cCI6MTYxMjkwNzA1Nn0.mnNuXdmqF487x_K4zfOkhhrkdJ6rwLB61NaSPhGZyJo'//localStorage.getItem('token')
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

/// update accountmanagers
export const putApiPermissions = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? " ";
  params._method = 'PUT';
  /*const data = new FormData();
  data.append("_method", "put");*/
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
    
  const options = {
    method: 'POST',
    //mode: 'cors', // pode ser cors ou basic(default)
    headers: {
      //'Content-Type': 'appli',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    params,
    url: apiHost +  `/permissions/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
}

/// list audits
export const getApiAudits = async (params = '',id = undefined) => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  return fetch(`${apiHost}/audits/${id ?? ''}?${data}`, {
    method: 'GET',
    data,
    mode: 'cors', // pode ser cors ou basic(default)
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwib3JnYW5pemF0aW9uX2lkIjoxLCJpYXQiOjE2MTIzMDIyNTYsImV4cCI6MTYxMjkwNzA1Nn0.mnNuXdmqF487x_K4zfOkhhrkdJ6rwLB61NaSPhGZyJo'//localStorage.getItem('token')
    }),
  }).then((response) => {
    return response.json();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  });
}
//Download Report
export const getApiReportFileS = async (rel, ext,params = '') => {
  localStorage.setItem("sessionTime", 900);
  let names = {
    'reports/sales' : 'venda',
    'reports/providers' : 'fornecedor',
    'reports/client-ranking': 'Rank-Cliente' ,
    'reports/provider-ranking': 'Rank-fornecedor' 
  };
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  axios({
    method: 'get',
    url: `${apiHost}/${rel}/?${data}`,
    responseType: 'arraybuffer',
    headers: {
      'Content-Disposition': `attachment; filename=${names[rel] ?? 'Relatorio'}.${ext}`,
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
  }).then(function(response) {
    if(response.status == 203){
      alert('Nenhum registro encontrado');
      return response.status
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${names[rel] ?? 'Relatorio'}.${ext}`);
    document.body.appendChild(link);
    link.click();
    //revokeObjectURL(url)
    return response.status;
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

//Download Report
export const getApiReportFile = async (params = '') => {
  localStorage.setItem("sessionTime", 900)
  const data = Object.entries(params)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
  axios({
    method: 'get',
    url: `${apiHost}/report/?${data}`,
    responseType: 'arraybuffer',
    //data: dates
  }).then(function(response) {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download','auditoria.csv'); //or any other extension
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, message: "problema ao se conectar com o servidor!" } }
  });
}

//Download Document
export const getApiDownloadFile = async (params = '') => {
  localStorage.setItem("sessionTime", 900)
  axios({
    method: 'post',
    url: `${apiHost}/contributors/downloads?file_name=${params}`,
    responseType: 'arraybuffer',
    //data: dates
  }).then(function(response) {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', params); //or any other extension
    document.body.appendChild(link);
    link.click();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: {  data: [], success: false, message: "problema ao se conectar com o servidor!" } }
  });
}


// get address ViaCep
export const getAddressByCepla = async (params = '') => {
  localStorage.setItem("sessionTime", 900)
  if (params.length >= 8) {
    const data = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');
    const options = {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      data,
      url: `http://cep.la/${params}`,
    };
    const response = await axios(options);  // wrap in async function
    console.log(response.data);
    return response;
  }
}
