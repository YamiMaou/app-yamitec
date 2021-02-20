const initialState = { snackbar: {open: false, message: undefined}, open: false, loading: false }

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MENU':
            return { ...state, open: action.payload }
        case 'SET_SNACKBAR':
            return { ...state, snackbar: action.payload }
        case 'SET_LOADING':
            return { ...state, snackbar: action.payload }
        default:
            return state
    }
}