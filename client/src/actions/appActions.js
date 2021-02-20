export const setMenu = (open) => ({
  type: 'SET_MENU', 
  payload: open
});

export const setSnackbar = (snackbar) => ({
  type: 'SET_SNACKBAR', 
  payload: snackbar
});

export const setLoading = (loading) => ({
  type: 'SET_LOADING', 
  payload: loading
});