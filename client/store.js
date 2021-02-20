import { createStore } from 'redux'
import { combineReducers } from 'redux'
import appReducer from './src/reducers/appReducer'
import authReducer from './src/reducers/authReducer'

const reducers = combineReducers({
  appReducer,
  authReducer,
})

export default createStore(reducers)
