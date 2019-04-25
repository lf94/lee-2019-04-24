import React from 'react';
import { DocumentGrid } from '~/components/stateless/document-grid';

const MAX_FILE_UPLOAD_LIMIT_IN_BYTES = 1024*1024*10;

export class FileManager extends React.Component {
  constructor(props) {
    super(props);

    let { files = [] } = props;

    if (!(files instanceof Array)) {
      files = [];
    }

    this.state = {
      files,
      isLoading: false,
      failureMessage: ''
    };

    this.searchInputTimeout = null;
    this.onSearch = this.onSearch.bind(this);
    this.onUpload = this.onUpload.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onOverlayClose = this.onOverlayClose.bind(this);
  }

  componentDidMount() {
    const { filesFetcher } = this.props;

    this.setState({ isLoading: true }, () => {
      filesFetcher()
        .then(files => {
          this.setState({ files });
        })
        .catch(({ message }) => {
          this.setState({ failureMessage: message });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    });
  }

  onUpload({ target }) {
    const { onUpload } = this.props;
    const { files } = target;

    if (files.length === 0) {
      return;
    }

    const { name, size } = files[0];

    if (size >= MAX_FILE_UPLOAD_LIMIT_IN_BYTES) {
      return this.setState({ failureMessage: 'We only accept png and jpg images 10MB or less.' });
    }

    this.setState({ isLoading: true }, () => {
      onUpload({ name, size })
        .then(({ id }) => {
          const { files } = this.state;
          const fileNew = { id, name, sizeInBytes: size };
          this.setState({ files: [...files, fileNew] });
        })
        .catch(({ message }) => {
          this.setState({ failureMessage: message });
        })
        .finally(() => {
          // Not clearing this means a user cannot select the same file twice
          target.value = '';
          this.setState({ isLoading: false });
        });
    });
  }
  
  onDelete(fileId) {
    const { onDelete } = this.props;
    const { files } = this.state;

    const filesWithSelectedDisabled = files.map(file => {
      if (file.id === fileId) {
        file.beingProcessed = true;
      }
      return file;
    });

    this.setState({ files: filesWithSelectedDisabled }, () => {
      onDelete(fileId)
        .then(() => {
          const { files } = this.state;
          const filesWithDeletedOneRemoved = files.filter(file => file.id !== fileId);
          this.setState({ files: filesWithDeletedOneRemoved });
        })
        .catch(({ message }) => {
          const filesWithSelectedReenabled = files.map(file => {
            if (file.id === fileId) {
              file.beingProcessed = undefined;
            }
            return file;
          });
          this.setState({
            files: filesWithSelectedReenabled,
            failureMessage: message
          });
        });
    });
  }

  // On each input, resets the timer, then sets a timer to set the state after 3 seconds
  onSearch({ target }) {
    const { onSearch } = this.props;

    clearTimeout(this.searchInputTimeout);
    this.searchInputTimeout = setTimeout(() => {
      this.setState({ isLoading: true }, () => {
        onSearch(target.value)
          .then(files => {
            this.setState({ files });
          })
          .catch(({ message }) => {
            this.setState({ failureMessage: message });
          })
          .finally(() => {
            this.setState({ isLoading: false });
          });
      });
    }, 1000);
  }

  onOverlayClose() {
    this.setState({ failureMessage: '' });
  }

  render() {
    const {
      files,
      isLoading,
      failureMessage
    } = this.state;

    return (<div className="file-manager">
      <div className="file-manager-actions">
        <div className="file-manager-actions-left">
          <input type="text"
            className="file-manager__search-input"
            onChange={ this.onSearch }
            placeholder="Search documents..."
            disabled={ isLoading }/>
        </div>
        <div className="file-manager-actions-right">
          <label htmlFor="document-uploader" className="file-manager__uploader-label">Upload</label>
          <input type="file"
            className="file-manager__uploader-input"
            id="document-uploader"
            name="document-uploader"
            accept=".png,.jpg"
            multiple={false}
            onChange={ this.onUpload }
            disabled={ isLoading }/>
        </div>
      </div>
      { failureMessage.length > 0 && <div className="file-manager-action-overlay">
        <div className="file-manager-action-overlay__message">{ failureMessage }</div>
        <button onClick={ this.onOverlayClose }>Dismiss</button>
      </div>}
      <div className="file-manager-data">
        <DocumentGrid
          isLoading={ isLoading }
          files={ files }
          onDelete={ this.onDelete }/>
      </div>
    </div>);
  }
}
