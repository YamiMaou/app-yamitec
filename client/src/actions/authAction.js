export const setAuth = (data) => {
     //console.log(data)
     return {
          type: 'SET_AUTH', 
          payload: data
     }
};

export const setDialog = (authDialog) => ({
     type: 'SET_AUTH_DIALOG', 
     payload: authDialog
});