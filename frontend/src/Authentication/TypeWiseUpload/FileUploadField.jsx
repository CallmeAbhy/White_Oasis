import PropTypes from "prop-types";

const FileUploadField = ({ label, name, onChange, tooltip, accept }) => {
  return (
    <>
      <div className="flex flex-col mt-4">
        <label className="mb-1 relative group" htmlFor={name}>
          {label}

          {tooltip && (
            <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {tooltip}
            </span>
          )}
        </label>
        <input
          type="file"
          id={name}
          name={name}
          onChange={onChange}
          accept={accept}
          required
          className="p-2 rounded-xl border border-gray-300 focus:outline-none"
        />
      </div>
    </>
  );
};

FileUploadField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  tooltip: PropTypes.string,
  accept: PropTypes.string,
};

export default FileUploadField;
