import React, {Component, PropTypes as Types} from 'react';

class FileUpload extends Component {
  static displayName = 'FileUpload';
  static propTypes = {
    handleFile: Types.func.isRequired,
  };

  handleFile(event) {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = this.props.handleFile;

    reader.readAsDataURL(file);
  }

  render() {
    return (
        <input type="file" className="form-control-file" onChange={this.handleFile.bind(this)} />
    );
  }
}

export default FileUpload;
