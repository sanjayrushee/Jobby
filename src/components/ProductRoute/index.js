import {Route, Redirect} from 'react-router-dom'
import Cookie from 'js-cookie'

const ProductRoute = props => {
  const jwtToken = Cookie.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}

export default ProductRoute
