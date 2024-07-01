import PropTypes from 'prop-types'

const InputRow = ({ name, value, setValue, placeholder, testid }) => (
  <div>
    {name}
    <input
      type="text"
      value={value}
      name={name}
      onChange={({ target }) => setValue(target.value)}
      placeholder={placeholder || ''}
      data-testid={testid}
    />
  </div>
)

InputRow.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  testid: PropTypes.string,
}

export default InputRow