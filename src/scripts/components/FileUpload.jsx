import React, {Component, PropTypes as Types} from 'react';

class FileUpload extends Component {
  static displayName = 'FileUpload';
  static propTypes = {
    handleFile: Types.func.isRequired,
  };

  handleFile(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    this.fileText.textContent = file.name;

    reader.onload = this.props.handleFile;

    reader.readAsDataURL(file);
  }

  render() {
    return (
      <label className="file">
        <input type="file" accept="image/*" onChange={this.handleFile.bind(this)} />
        <span ref={el => this.fileText = el} className="file-custom">Choose file...</span>
      </label>
    );
  }
}

export default FileUpload;
