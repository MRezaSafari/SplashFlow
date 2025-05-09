# SplashFlow

## DEMO

**LIVE DEMO**: [https://splash-flow.vercel.app/](https://splash-flow.vercel.app/)

<video src="demo.webm" controls autoplay></video>

![Watch the video](demo.png)

## Purpose

SplashFlow is a web application designed to allow users to seamlessly search for images. It provides a clean, fast, and intuitive interface for discovering and exploring visual content.

## Technologies Used

SplashFlow is built with a modern tech stack, focusing on performance, developer experience, and scalability:

*   **Framework**: [Next.js](https://nextjs.org/) (React Framework)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: Custom components built with React
*   **Icons**: [@tabler/icons-react](https://tabler-icons.io/)
*   **Animation**: [Framer Motion](https://www.framer.com/motion/)
*   **Schema Validation**: [Zod](https://zod.dev/)

## Why Next.js over Vite?

While Vite is an excellent build tool known for its speed, Next.js was chosen for SplashFlow primarily for its robust **API routes** feature. This allows for the creation of backend endpoints directly within the Next.js project, simplifying the architecture for features that require server-side logic, such as fetching data from external image APIs, handling user authentication (if planned), or other backend tasks. This integrated approach streamlines development and deployment.

## How to Contribute

We welcome contributions to SplashFlow! To get started:

1.  **Fork the repository.**
2.  **Clone your fork:**
    ```bash
    git clone https://github.com/MRezaSafari/splashflow.git
    cd splashflow
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a new branch for your feature or bug fix:**
    ```bash
    git checkout -b feature/your-feature-name
    ```
    or
    ```bash
    git checkout -b fix/your-bug-fix-name
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

6.  **Make your changes.**
7.  **Lint your code:**
    ```bash
    npm run lint
    ```
8.  **Commit your changes:**
    ```bash
    git commit -m "feat: Describe your feature"
    ```
    (Please follow [Conventional Commits](https://www.conventionalcommits.org/) if possible)
9.  **Push to your branch:**
    ```bash
    git push origin feature/your-feature-name
    ```
10. **Create a Pull Request** against the `main` (or `develop`) branch of the original repository.

Please ensure your code adheres to the project's linting rules and that your commits are clear and descriptive.

Feel free to suggest improvements or report issues!
