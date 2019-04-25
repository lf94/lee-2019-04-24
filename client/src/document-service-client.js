// To simulate requests taking time
function fakeWaitTime(cb) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      cb().then(res).catch(rej);
    }, 3000);
  });
}

export class DocumentServiceClient {
  constructor(apiUrl) {
    this.url = apiUrl;
  }

  fetchAllFiles() {
    return fakeWaitTime(() => fetch(this.url).then(resp => resp.json()));
  }

  // Mocking the search functionality - normally the remote service takes care of this.
  searchForFiles(searchString) {
    return fakeWaitTime(() => this
      .fetchAllFiles()
      .then(files =>
        files.filter(file => file.name.toLowerCase().indexOf(searchString.toLowerCase()) >= 0)
      ));
  }

  // There's no reason to actually upload any files for this project.
  // So we'll just upload the name and size. This means there can be:
  // * Duplicate files on the server side
  // * Extremely long file names
  // * Even though there is client-side file size limit, nothing is stopping anyone from using curl to upload massive files
  uploadFile(file) {
    const {
      name,
      size
    } = file;
    return fakeWaitTime(() => fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        sizeInBytes: size
      })
    }).then(resp => resp.json()));
  }

  deleteFileById(id) {
    return fakeWaitTime(() => fetch(`${this.url}/${id}`, {
      method: 'DELETE',
    }));
  }
}
