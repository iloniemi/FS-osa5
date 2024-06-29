import PropTypes from 'prop-types'

const InputRow = ({name, value, setValue}) => (
  <div>
    {name}
      <input
        type="text"
        value={value}
        name={name}
        onChange={({target}) => setValue(target.value)}
      />      
  </div>
)

InputRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
}

export default InputRow