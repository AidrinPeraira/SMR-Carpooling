# This document lists out the packages used in this project with details.

## consola : Logger
- [Click here for Consola Logger Docs](https://www.npmjs.com/package/consola)
- This logger has the capability to handle both browser side and client side logging. 
- This enables a single logger package to be used for both next js and the backend services.
- This helps unify logs across the observability ignore-workspace-root-check
- If using any other logger we have to make sure it conditionaly checks the environment and return the methods accordingly. Most packages are purely server side and unavailable at the client side.

## docker
- Creating an image for the project using docker is an industry best practice to ensure that the app runs in the same environment / runtime on all devices.
- Therefore a production image for the services using docker is mandatory.
- For development we use another docker image so that issues that may arise in the production image can be mitigated during devlopment.
- There are two Dockerfiles, one for production and the other for development, both of which are set to use multi stage builds and build caching.
- [Docker Security](https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/) Here are some of the best practices i found online 

## StoryBook : Ui Library Builder
- Crating reusable components for ui libraries is best done independantly. If the component functions without any coupling to business logic then it is an absolutely reusable ui component. Else it is just a split up code file
- StoryBoook is use to build and test ui components and elements independantly and convert them into a package that can be used by any project. 
- StoryBook in itself is a tiny frontend, isolated from our main frontend app.
- It is used to build the foolowing components
   1. Button
   2. Input (Covers Search)
   3. Checkbox / Toggle
   4. Select (orm ropdown)
   5. Menu Dropdown (Navigation/Actions)
   6. Table
   7. Pagination
   8. Card
   9. Modal
   10. Toast / Alert
   11. Spinner
   12. Sidebar
   13. Tabs
