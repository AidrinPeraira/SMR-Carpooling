import type { Preview } from "@storybook/react-vite";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light Mode" },
          { value: "dark", icon: "moon", title: "Dark Mode" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const currentTheme = context.globals.theme;

      return (
        <div
          className={`
             p-4 w-full flex min-h-screen justify-center items-center 
             ${currentTheme == "dark" ? "dark" : ""}
           `}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
