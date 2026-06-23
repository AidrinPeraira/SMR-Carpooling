#Introduction

- This module builds UI componets and tests them using `storybook`
- It follows a simple folder structure based on functionality.
- All componets are then imported into `smr-frontend` as a dependency.

# Folder Structure

```
smr-ui/src/components/
├── actions/ # Components that trigger an event
│ ├── Button/ # e.g., Button.tsx, Button.stories.tsx, index.ts
│ └── IconButton/
├── data-display/ # Components that show information
│ ├── Avatar/
│ ├── Badge/
│ ├── Card/
│ ├── Table/
│ └── Tag/
├── feedback/ # Components that communicate system status
│ ├── Alert/
│ ├── Dialog/
│ ├── Spinner/
│ └── Toast/
├── forms/ # Components used to collect user input
│ ├── Checkbox/
│ ├── DatePicker/
│ ├── Dropdown/
│ ├── Input/
│ ├── Label/
│ ├── Search/
│ └── TimePicker/
├── layout/ # Components that structure the page visually
│ ├── Divider/
│ └── Sidebar/
└── navigation/ # Components that help the user move around
└── Pagination/
```

# How to use?

- install tha package and import the components to use. The list of components are:
  - Button
  - Label

- Also add the following line to `globals.css`

```
@import "@smr/ui/css";
```

# Custom Themes

This package uses tailwind v4 for css styles for the ui components. the default theme can be overidden by add the follwing css to you `globals.css` file and changes the values to match your requirement.

```
Sample css
```

# Sample Componets Showcase

[View the Component Blueprint Matrix](./src/sample.html)
