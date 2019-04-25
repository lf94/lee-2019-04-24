export function prettyPrintFileSize(magnitude, sizeInBytes) {
  switch (magnitude) {
    case 'kb': 
      let sizeInKb = sizeInBytes / 1000.0;
      sizeInKb = sizeInKb >= 10.0 ? Math.round(sizeInKb) : sizeInKb.toFixed(2);
      sizeInKb = sizeInKb == '0.00' ? '0' : sizeInKb;
      return `${sizeInKb} kb`;
    default:
      return '';
  }
}

export function forceToNumber(data) {
  const firstPass = parseFloat(data);
  const secondPass = isNaN(firstPass) ? 0.0 : firstPass;
  return secondPass;
}

export function aggregateFileSizes(files) {
  return files.reduce((acc, curr) => acc + forceToNumber(curr.sizeInBytes), 0);
}
