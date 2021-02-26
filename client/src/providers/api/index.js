import axios from 'axios';

let hostname = window === undefined ? "yamitec.yamitec.com" : window.location.hostname;
let apiHost = ""
hostname = "/api";
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  apiHost = "http://localhost:8000/api"
} else {
  apiHost = hostname;
}
//apiHost = hostname;
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
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
  }
};
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
    return { data: { success: false, error ,message: "problema ao se conectar com o servidor!" } }
  }
}

/// update contributors
export const putApiContributors = async (id,params = {}) => {
  localStorage.setItem("sessionTime", 900)
  params.justification = params.justification  ?? "Update";
  const data = new FormData();
  data.append("_method", "put");
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
    url: apiHost +  `/contributors/${id}`,
  };
  try{
    const response = await axios(options);  // wrap in async function
    return response;
  } catch (error) {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, error, message: "problema ao se conectar com o servidor!" } }
  }
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
    console.log(response.data);
    let blob = new Blob([response.data], { type: 'application/jpeg' })
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'Documento.jpg'
    link.click();
  }).catch((error) => {
    console.log('Whoops! Houve um erro.', error.message || error)
    return { data: { success: false, message: "problema ao se conectar com o servidor!" } }
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
