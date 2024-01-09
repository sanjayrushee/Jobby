import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Headers from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const stateOfContainer = {
  success: 'SUCCESS',
  fail: 'FAIL',
  pending: 'PENDING',
  initial: 'INITIAL',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    salaryId: 0,
    companyDetails: [],
    userDetails: [],
    EmployList: [],
    apiStatusForJOb: stateOfContainer.initial,
    apiStatusForUser: stateOfContainer.initial,
  }

  componentDidMount() {
    this.getCompanyDetails()
    this.getUserDetails()
  }

  onchangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  searchInputDown = event => {
    if (event.key === 'Enter') {
      this.getCompanyDetails()
    }
  }

  onClickSearchBtn = () => {
    this.getCompanyDetails()
  }

  getCompanyDetails = async () => {
    this.setState({apiStatusForJOb: stateOfContainer.pending})
    const {EmployList, salaryId, searchInput} = this.state
    const employType = EmployList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employType}&minimum_package=${salaryId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updateDataJobs = data.jobs.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePreAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        companyDetails: updateDataJobs,
        apiStatusForJOb: stateOfContainer.success,
      })
    } else {
      this.setState({
        apiStatusForJOb: stateOfContainer.fail,
      })
    }
  }

  getUserDetails = async () => {
    this.setState({apiStatusForUser: stateOfContainer.pending})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      const updateUserList = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        userDetails: updateUserList,
        apiStatusForUser: stateOfContainer.success,
      })
    } else {
      this.setState({apiStatusForUser: stateOfContainer.fail})
    }
  }

  updateCheckbox = event => {
    const {EmployList} = this.state
    const CheckBoxInList = EmployList.filter(each => each === event.target.id)
    if (CheckBoxInList.length === 0) {
      this.setState(
        prevState => ({
          EmployList: [...prevState.EmployList, event.target.id],
        }),
        this.getCompanyDetails,
      )
    } else {
      const filterData = EmployList.filter(each => each !== event.target.id)
      this.setState(
        {
          EmployList: filterData,
        },
        this.getCompanyDetails,
      )
    }
  }

  updateRadio = event => {
    this.setState({salaryId: event.target.id}, this.getCompanyDetails)
  }

  renderLoader = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailViewForJobDetails = () => (
    <div className="failView-background">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="submit"
        className="fail-retry"
        onChange={this.getUserDetails}
      >
        Retry
      </button>
    </div>
  )

  renderFailForUser = () => (
    <div className="failUserContainer">
      <button
        className="UserRetryBtn"
        onChange={this.getUserDetails}
        type="submit"
      >
        Retry
      </button>
    </div>
  )

  renderUser = () => {
    const {userDetails} = this.state
    const {name, profileImageUrl, shortBio} = userDetails
    return (
      <div className="userContainer">
        <img src={profileImageUrl} alt="profile" className="user-img" />
        <h1 className="user-heading">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderUserContainer = () => {
    const {apiStatusForUser} = this.state

    switch (apiStatusForUser) {
      case stateOfContainer.success:
        return this.renderUser()
      case stateOfContainer.initial:
        return this.renderLoader()
      case stateOfContainer.fail:
        return this.renderFailForUser()
      default:
        return null
    }
  }

  renderJobContainer = () => {
    const {apiStatusForJOb} = this.state
    switch (apiStatusForJOb) {
      case stateOfContainer.success:
        return this.renderJOBDetails()
      case stateOfContainer.fail:
        return this.renderFailViewForJobDetails()
      case stateOfContainer.pending:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderJOBDetails = () => {
    const {companyDetails} = this.state
    return (
      <>
        {companyDetails.length > 0 ? (
          <ul className="jobItemContainer">
            {companyDetails.map(eachData => (
              <JobItem itemDetails={eachData} key={eachData.id} />
            ))}
          </ul>
        ) : (
          this.renderNoJobsView()
        )}
      </>
    )
  }

  renderSearch = () => {
    const {searchInput} = this.state
    return (
      <div className="search-bar">
        <input
          type="search"
          className="search-input"
          placeholder="search"
          value={searchInput}
          onChange={this.onchangeSearch}
          onKeyDown={this.searchInputDown}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onClickSearchBtn}
          className="search-button"
        >
          <BsSearch className="search-icon" />{' '}
        </button>
      </div>
    )
  }

  renderTypeOfEmployment = () => (
    <div className="TypeAndRadio-container">
      {this.renderUserContainer()}
      <hr />
      <h1 className="headingForType">Type of Employment</h1>
      <ul className="ulForTypeSelection">
        {employmentTypesList.map(eachItems => (
          <li
            key={eachItems.employmentTypeId}
            className="listItemForTypeSelection"
          >
            <input
              type="checkbox"
              id={eachItems.employmentTypeId}
              onChange={this.updateCheckbox}
              value="label"
            />
            <label htmlFor={eachItems.employmentTypeId}>
              {eachItems.employmentTypeId}
            </label>
          </li>
        ))}
      </ul>
      <hr />
      <h1 className="headingForType">Salary Range</h1>
      <ul className="ulForTypeSelection">
        {salaryRangesList.map(eachItems => (
          <li
            key={eachItems.salaryRangeId}
            className="listItemForTypeSelection"
          >
            <input
              type="radio"
              id={eachItems.salaryRangeId}
              onChange={this.updateRadio}
            />
            <label htmlFor={eachItems.salaryRangeId}>{eachItems.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  render() {
    return (
      <div>
        <Headers />
        <div className="background">
          <div>
            {this.renderSearch()}
            {this.renderTypeOfEmployment()}
          </div>
          {this.renderJobContainer()}
        </div>
      </div>
    )
  }
}

export default Jobs
