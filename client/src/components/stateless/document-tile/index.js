import React from 'react';
import { prettyPrintFileSize } from '~/utils';

export const DocumentTile = React.memo(({
  id,
  title = 'Untitled',
  sizeInBytes = '0',
  beingProcessed = false,
  onDelete
}) => {
  if (typeof title !== 'string') {
    title = 'Untitled';
  }

  sizeInBytes = parseFloat(sizeInBytes);
  if (isNaN(sizeInBytes)) {
    sizeInBytes = 0.0;
  }

  if (onDelete !== undefined && !(onDelete instanceof Function)) {
    onDelete = undefined;
  }

  const sizeInKilobytes = prettyPrintFileSize('kb', sizeInBytes);

  return (<div className="document-tile">
    { beingProcessed &&
      <div className="document-tile__processing-overlay"><div><div></div></div></div>
    }
    <div className="document-tile__title">{ title }</div>
    <div className="document-tile-bar">
      <div className="info">
        <div className="document-tile__size">{ sizeInKilobytes }</div>
      </div>
      <div className="action">
        { onDelete && <div className="document-tile__delete">
            <button onClick={ () => onDelete(id) }>Delete</button>
        </div> }
      </div>
    </div>
  </div>);
});
