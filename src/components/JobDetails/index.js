import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {FiExternalLink} from 'react-icons/fi'
import Headers from '../Header'
import './index.css'

const stateOfContainer = {
  success: 'SUCCESS',
  fail: 'FAIL',
  pending: 'PENDING',
  initial: 'INITIAL',
}

class JobDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    getSkills: [],
    lifeAtCompany: [],
    apiStatus: stateOfContainer.initial,
  }

  componentDidMount() {
    this.getDetailsOfJob()
  }

  getDetailsOfJob = async () => {
    this.setState({
      apiStatus: stateOfContainer.pending,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const option = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, option)
    const data = await response.json()
    const jobList = data.job_details
    const updateDateJobDetails = {
      companyLogoUrl: jobList.company_logo_url,
      companyWebsiteUrl: jobList.company_website_url,
      employmentType: jobList.employment_type,
      id: jobList.id,
      title: jobList.title,
      packagePreAnnum: jobList.package_per_annum,
      jobDescription: jobList.job_description,
      skills: jobList.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      })),
      lifeAtCompany: {
        description: jobList.life_at_company.description,
        imageUrl: jobList.life_at_company.image_url,
      },
      location: jobList.location,
      packagePerAnnum: jobList.package_per_annum,
      rating: jobList.rating,
    }
    const updateSimilarJobs = data.similar_jobs.map(eachItems => ({
      companyLogoUrl: eachItems.company_logo_url,
      id: eachItems.id,
      employmentType: eachItems.employment_type,
      jobDescription: eachItems.job_description,
      location: eachItems.location,
      rating: eachItems.rating,
      title: eachItems.title,
    }))

    if (response.ok) {
      this.setState({
        jobDetails: updateDateJobDetails,
        similarJobs: updateSimilarJobs,
        getSkills: updateDateJobDetails.skills,
        lifeAtCompany: updateDateJobDetails.lifeAtCompany,
        apiStatus: stateOfContainer.success,
      })
    } else {
      this.setState({apiStatus: stateOfContainer.fail})
    }
  }

  renderJobDetails = () => {
    const {getSkills, lifeAtCompany, jobDetails, similarJobs} = this.state
    const {
      jobDescription,
      title,
      rating,
      packagePreAnnum,
      location,
      employmentType,
      companyLogoUrl,
      companyWebsiteUrl,
    } = jobDetails

    return (
      <>
        <div className="job-card">
          <div className="logo-title-container-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-card"
            />
            <div className="title-rating-container-card">
              <h1 className="job-title-card">{title}</h1>
              <div className="rating-container-card">
                <AiFillStar className="star-icon-card" />
                <p className="rating-number-card">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-package-container-card">
            <div className="icon-type-container-card">
              <IoLocationSharp className="type-icon" />
              <p className="type-text">{location}</p>
            </div>
            <div className="icon-type-container-card">
              <BsFillBriefcaseFill className="type-icon" />
              <p className="type-text">{employmentType}</p>
            </div>
            <p className="package-text">{packagePreAnnum}</p>
          </div>
          <div>
            <hr className="separator" />
          </div>
          <div className="description-link">
            <link rel="stylesheet" href="https://www.google.com" />
            <h1 className="description-heading-card">Description</h1>
            <a href={companyWebsiteUrl} className="company-link">
              Visit
              <FiExternalLink className="external-link-logo" />{' '}
            </a>
          </div>
          <p className="job-description-card">{jobDescription}</p>
          <h1 className="headingForSkillAndChange">Skills</h1>

          <ul className="skill-unlist">
            {getSkills.map(eachItems => {
              const {imageUrl, name} = eachItems
              return (
                <li key={name} className="skill-list">
                  <img src={imageUrl} alt={name} className="skill-image" />
                  <p className="skill-name">{name}</p>
                </li>
              )
            })}
          </ul>
          <div className="lifeAtCompanyContainer">
            <div className="lifeAtCompanyHeadingAndPara">
              <h1 className="headingForSkillAndChange">Life at Company</h1>
              <p className="lifeAtCompanyPara">{lifeAtCompany.description}</p>
            </div>

            <div>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="lifeAtCompanyUrl"
              />
            </div>
          </div>
        </div>

        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similar-job-ul">
            {similarJobs.map(eachItems => (
              <li key={eachItems.id} className="similar-job-list">
                <div className="similar-title-container-card">
                  <img
                    src={eachItems.companyLogoUrl}
                    alt="similar job company logo"
                    className="company-logo-card"
                  />
                  <div className="similar-job-heading-container">
                    <h1 className="similar-job-title">{eachItems.title}</h1>
                    <div className="rating-container-card">
                      <AiFillStar className="star-icon-card" />
                      <p className="rating-number-card">{rating}</p>
                    </div>
                  </div>
                </div>
                <h1>Description</h1>
                <p>{eachItems.jobDescription}</p>
                <div className="location-package-container-card">
                  <div className="icon-type-container-card">
                    <IoLocationSharp className="type-icon" />
                    <p className="type-text">{eachItems.location}</p>
                  </div>
                  <div className="icon-type-container-card">
                    <BsFillBriefcaseFill className="type-icon" />
                    <p className="type-text">{eachItems.title}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailView = () => (
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
        onChange={this.getDetailsOfJob}
      >
        Retry
      </button>
    </div>
  )

  renderTheFinalView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case stateOfContainer.pending:
        return this.renderLoader()
      case stateOfContainer.success:
        return this.renderJobDetails()
      case stateOfContainer.fail:
        return this.renderFailView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Headers />
        <div className="jobDetails">{this.renderTheFinalView()}</div>
      </>
    )
  }
}
export default JobDetails
