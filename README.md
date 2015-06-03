single_resource_REST_API

-The server side is to be used with a Node Foreman global install: https://github.com/strongloop/node-foreman
-Precede commands with "nf run".
-Folder must contain a .env file containing a secret, i.e. APP_SECRET=8eb647e0db650da4c7
-"nf run npm test", or just "nf run grunt test"

-For client-side testing and dev:
-"grunt build:dev" or "grunt build:test" will create the relevant bundle for each .html file.
  -app/index.html and test/client/test.html, respectively.

-Currently, neither watch nor the webpack development server are set up, only manual checks.