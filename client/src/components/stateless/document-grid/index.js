import React from 'react';
import { DocumentTile } from '~/components/stateless/document-tile';
import { prettyPrintFileSize, aggregateFileSizes } from '~/utils';

export const DocumentGrid = React.memo(({
  files = [],
  isLoading = false,
  onDelete
}) => {
  if (!(files instanceof Array)) {
    files = [];
  }

  const totalFiles = files.length;
  const totalFilesSizeInKb = prettyPrintFileSize('kb', aggregateFileSizes(files));

  const documentTiles = files.map(({ name, sizeInBytes, id, beingProcessed }) => <DocumentTile
    key={ id }
    id={ id }
    title={ name }
    sizeInBytes={ sizeInBytes }
    beingProcessed={ beingProcessed }
    onDelete={ onDelete }
  />);

  return (<div className="document-grid">
    <div className="document-grid-info">
      <div className="document-grid-info__total-files">{ totalFiles } documents</div>
      <div className="document-grid-info__total-files-size">Total size: { totalFilesSizeInKb }</div>
    </div>
    { isLoading
      ? <div className="document-grid__loading-indicator">Loading...</div>
      : files.length === 0
        ? null
        : <div className="document-grid-tiles">{ documentTiles }</div>
    }
  </div>);
});
