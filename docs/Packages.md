# This document lists out the packages used in this project with details.

## Logger: 'consola'
- [Click here for Consola Logger Docs](https://www.npmjs.com/package/consola)
- This logger has the capability to handle both browser side and client side logging. 
- This enables a single logger package to be used for both next js and the backend services.
- This helps unify logs across the observability ignore-workspace-root-check
- If using any other logger we have to make sure it conditionaly checks the environment and return the methods accordingly. Most packages are purely server side and unavailable at the client side.
