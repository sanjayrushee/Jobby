import './index.css'

const FilterList = props => {
  const {employmentDetais, updateFileterJobId} = props
  const {label, employmentTypeId} = employmentDetais
  const onChagneupdateCheckbox = () => {
    updateFileterJobId(employmentTypeId)
  }
  return (
    <li className="listForCheckbox">
      <input
        type="checkbox"
        id={label}
        onChange={onChagneupdateCheckbox}
        values="label"
      />
      <label htmlFor={label}>{employmentTypeId}</label>
    </li>
  )
}

export default FilterList
