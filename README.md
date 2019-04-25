# Lee Fallat - 2019-04-24

## Installation

Please make sure you have the latest `npm` and `node` installed. I prefer to use `nvm` to manage multiple versions of these software. You can find the installation instructions [here](https://github.com/creationix/nvm#installation-and-update).

Now run the following to start the client:
```
  cd client
  npm install
  npm run serve
```

Then open another terminal/console and type this to run the documents service:
```
  cd server
  npm install
  npm run serve
```

Then go to http://localhost:3131 in your web browser.

## Security

The application should take care of the following security concerns:
- Any XSS should not be possible, since all external data displayed is sanitized through React, i.e. document titles.
- The frontend goes into a loading state between various requests, acting as a client-side rate limiter. This is not enough to prevent this type of abuse (mentioned below).
- All state is shared since the application is public, and has no user system. There is no information to steal!

Below are a list of security concerns that will need to be addressed:
- Rate limiting to prevent malicious users from abusing the service
- Server side file size checking to avoid massive files from being uploaded
- Truncate extremely long file names (set an upper limit) to prevent potientally ugly client rendering
- Prevent uploading of duplicate documents (via hashing)

Essentially a lot of server side checking, since clients are free to interact with the service as please outside of the web browser frontend, via `curl` or `wget` for example.

## Improvements

In addition to the above, the API could be improved with:
- A user or "favoriting" system to keep track of a user's uploaded documents, or their favorites
- A tagging system to search related documents
- Pre-rendered document content previews
- A pagination mechanism to avoid downloading potentially a few billion files at once

## Libraries

React is used to implement components. Components are highly reusable UI building blocks. They can be composed and transformed to create more interesting user experiences. It's a good idea to use React in particular for it's large community, conceptually simple rendering model, and it's best security feature, sanitizing html to avoid malicious XSS attacks.

Sass is used to style these components. Sass provides several mechanisms to keep code DRY, such as variables, mixins and modules. Overall it makes it easier to maintain CSS.

Webpack and babel are used together to bundle the application, and perform several transforms to support older browsers while being able to use newer JavaScript standards and JSX.

Jest and Enzyme are used to write component tests. The reason I went with this setup is I find Jest particularly easy to setup, and I was told Enzyme is being used over there.

## API

### GET /documents
#### Parameters (application/json)
- query: string
  - A string that will be compared against document titles. By default, if missing, will return all documents uploaded.

#### Returns
`200` status code and a `{ files: [ { name: string, sizeInBytes: number, id: string } ]}` object.
`400` status code on error and a `{ message }` object explaining the failure.

### POST /documents
#### Parameter (image/png, image/jpg)
The image file to upload to the server.

#### Returns
`200` status code and a `{ name: string, sizeInBytes: number, id: string }` object.
`400` status code on error and a `{ message }` object explaining the failure.

### DELETE /documents/:id
#### Parameters (Query string)
- id: string
  - An identifier to a file you want to delete.

#### Returns
`200` status code on success.
`400` status code on error and a `{ message }` object explaining the failure.

## Other notes

The API is mocked with `json-server`. It does not actually save binary data anywhere - just the information, because of the nature of this project. The proper thing to do would be to build a file management service with a user system.
