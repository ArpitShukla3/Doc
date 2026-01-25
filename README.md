# Doc Editor (Frontend)

A modern, dual-mode document editor that seamlessly integrates rich text editing with freehand drawing.

## Features

### ✍️ Text Mode
-   **Rich Text Editing**: Powered by [Quill](https://quilljs.com/), giving you a robust writing experience.
-   **Formatting**: Support for Bold, Italic, and Underline.
-   **Clean Interface**: Minimalist design with a focus on content.

### 🎨 Draw Mode
-   **Freehand Drawing**: Draw directly on top of your content using SVG-based strokes.
-   **Tools**:
    -   **Pen**: Standard drawing tool.
    -   **Highlighter**: Translucent strokes that fade over time for temporary emphasis.
    -   **Eraser**: Remove unwanted strokes.
-   **Customization**:
    -   **Colors**: Choose from a palette of vibrant colors.
    -   **Stroke Width**: Adjustable thickness for pen and highlighter.
-   **Dynamic Cursor**: Custom cursor that visually represents your current tool's size and color.

### 🛠️ Interface
-   **Floating Menubar**: A context-aware floating toolbar to switch between Text and Draw modes, select tools, and adjust settings.
-   **Sidebar Navigation**: Easy navigation between pages.

## Tech Stack

-   **Framework**: [React 19](https://react.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
-   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
-   **Routing**: [React Router v7](https://reactrouter.com/)

## Getting Started

### Prerequisites
-   Node.js (Latest LTS recommended)
-   npm

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    The app should be running at `http://localhost:5173` (or the port shown in your terminal).

## Development

-   `npm run build`: Build the app for production.
-   `npm run lint`: Run ESLint to check for code quality issues.
-   `npm run preview`: Preview the production build locally.