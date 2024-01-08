import './index.css'

const NotFound = () => (
  <div className="pageNotFound-Container">
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
        className="notFoundImage"
      />
    </div>
    <h1 className="notFoundHeading">Page Not Found</h1>
    <p>We are sorry, the page you requested could not be found</p>
  </div>
)

export default NotFound
