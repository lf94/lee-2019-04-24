import React from 'react';
import { render } from 'react-dom';
import { DocumentServiceClient } from './document-service-client';
import { FileManager } from './components/stateful/file-manager';

const API_URL = 'http://localhost:9000/documents';

const documentClient = new DocumentServiceClient(API_URL);
const mountPoint = document.getElementById('root');
render(<FileManager
  filesFetcher={ () => documentClient.fetchAllFiles() }
  onSearch={ term => documentClient.searchForFiles(term) }
  onUpload={ file => documentClient.uploadFile(file) }
  onDelete={ fileId => documentClient.deleteFileById(fileId) }
/>, mountPoint);
