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
  1.  Button
  2.  Input (Covers Search)
  3.  Checkbox / Toggle
  4.  Select (orm ropdown)
  5.  Menu Dropdown (Navigation/Actions)
  6.  Table
  7.  Pagination
  8.  Card
  9.  Modal
  10. Toast / Alert
  11. Spinner
  12. Sidebar
  13. Tabs

## vitest: Testing

- Vitest is the testing library used since it is inherentlt compatible with TS.
- Also the same package can be used to test both frontend and backend.

## testcontainers: Temp Containers for testing

- The recommended package from internet serches for spinning up temporoy containers for testing.
- An in memory MongoDB instnace was an option but it wss incompatiblw with the system. (Arch Linux) therefore the cutrrent choice.
- The library provides prebuilt classes for commonly used docker images like, redis, postgress etc.
- we can also manually spin up any container available as a docker image.

## message broker : RabbitMQ

- rabbiit mq acts like a smart queue
- this allows us to keep our serrvices dumb.
- services only have to pub and sub.
- all event management within the broker is done internally.
- The pub sub pattern implemented using a topic exchnage is implemented.
- this allows mutliple service to register their own respective queues that consume a copies of the same event.
- Dead Lettering is implemented using deadl letter exchange and deadl letter queue. The republish workflow is mannual using the rabbit mq web ui. No script right now.

## Hashing Service: crypto module form node

- Hadhing service uses the internal crypto module within node
- Using internal module reduces exposure to vulnerability in package
- almost similar secruity
- internal package also allows us to reduce the package size (minor)

## Token Service: jsonwebtoken

- Tokens are used to manage sessions
- jwt enables to keep the server stateless

## Session Store: Redis

- simple and fast

## API Testing: bruno

- api files live alongside project.
- offline
- can work from cli

## http-proxy-middleware : Proxy requests from API Gateway

- this is the industry standard
- it is supposedly more efficient to handle heavy traffic. (some low level advantage of being a wrapper around "http-proxy")
- this supports websocket requests ("express-http-proxy" does not. althogh that is simpler)
