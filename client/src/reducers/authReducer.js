const initialState = { authDialog: false, data : undefined }

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_AUTH_DIALOG':
            return { ...state, authDialog: action.payload }
        case 'SET_AUTH':
            return { ...state, data: action.payload }
        default:
            return state
    }
}