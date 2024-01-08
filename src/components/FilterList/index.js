const FilterList = props => {
  const {employmentDetais, updateFileterJobId} = props
  const {label, employmentTypeId} = employmentDetais
  const onChagneupdateCheckbox = () => {
    updateFileterJobId(employmentTypeId)
  }
  return (
    <li>
      <input type="checkbox" id={label} onChange={onChagneupdateCheckbox} />
      <label htmlFor={label}>{employmentTypeId}</label>
    </li>
  )
}

export default FilterList
