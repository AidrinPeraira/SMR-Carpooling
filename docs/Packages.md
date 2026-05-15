# This document lists out the packages used in this project with details.

## Logger: 'consola'
- [Click here for Consola Logger Docs](https://www.npmjs.com/package/consola)
- This logger has the capability to handle both browser side and client side logging. 
- This enables a single logger package to be used for both next js and the backend services.
- This helps unify logs across the observability ignore-workspace-root-check
- If using any other logger we have to make sure it conditionaly checks the environment and return the methods accordingly. Most packages are purely server side and unavailable at the client side.

## Container: docker
- Creating an image for the project using docker is an industry best practice to ensure that the app runs in the same environment / runtime on all devices.
- Therefore a production image for the services using docker is mandatory.
- For development we use another docker image so that issues that may arise in the production image can be mitigated during devlopment.
- There are two Dockerfiles, one for production and the other for development, both of which are set to use multi stage builds and build caching.
- [Docker Security](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/) Here are some of the best practices i found online 
