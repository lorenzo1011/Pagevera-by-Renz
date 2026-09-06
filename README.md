# Pagevera — PDF Flipbook Reader

**Pagevera** is a standalone PDF flipbook web app created by **Renz Acero**. It converts a local PDF into an interactive page-turning reader with thumbnails, search, bookmarks, notes, highlights, zoom, fullscreen, audio effects, background music, and custom preview backgrounds.

The app runs in the browser, but the development tools require **Node.js** and **npm**.

## 1. What you need

| Requirement | Purpose |
| --- | --- |
| Node.js LTS | Runs the development server and build tools |
| npm | Installs the project dependencies |
| VS Code | Opens and edits the source code |
| A modern browser | Runs the PDF viewer, such as Chrome, Edge, Firefox, or Safari |
| The Pagevera ZIP file | Contains the project source code |

You do not need PHP, WordPress, a database, an API key, or a web hosting account to run the local version.

## 2. Install Node.js

Download the **LTS** version from the official Node.js website:

[Download Node.js LTS](https://nodejs.org/en/download)

Use the default installation options. On Windows, keep the option that adds Node.js to the system PATH enabled. On macOS, install the `.pkg` installer. On Linux, use the official installation instructions for your distribution.

After installation, close and reopen VS Code or your terminal so the new PATH is loaded.

Verify the installation by opening a terminal and running:

```bash
node --version
npm --version
```

You should see version numbers. Any recent Node.js LTS release is suitable. If the terminal says `node is not recognized`, `command not found`, or a similar message, restart the terminal first. If the problem continues, reinstall Node.js and make sure the PATH option is enabled.

## 3. Install VS Code

Download Visual Studio Code from:

[Download Visual Studio Code](https://code.visualstudio.com/download)

Install it using the default options. The optional command-line integration is useful but not required.

## 4. Extract and open Pagevera

Download the Pagevera ZIP file and extract it to a normal project folder. Avoid opening the project directly inside the ZIP preview.

A typical extracted folder should contain files similar to these:

```text
pdf-flipbook-app/
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── public/
│   └── pagevera-mark.svg
└── src/
    ├── main.js
    ├── reader-tools.css
    └── style.css
```

Open VS Code, select **File → Open Folder**, and choose the extracted `pdf-flipbook-app` folder.

## 5. Open the VS Code terminal

In VS Code, select:

```text
Terminal → New Terminal
```

Confirm that the terminal is inside the project folder. The prompt should show a path ending in something like:

```text
pdf-flipbook-app
```

If the terminal is in another folder, change into the project folder. For example:

```bash
cd path/to/pdf-flipbook-app
```

On Windows PowerShell, the command may look like this:

```powershell
cd "C:\Users\YourName\Documents\pdf-flipbook-app"
```

## 6. Install project dependencies

Run this command once after extracting the project:

```bash
npm install
```

This reads `package.json` and downloads the required packages, including:

- **Vite**, which runs the local development server.
- **PDF.js**, which reads and renders PDF pages.
- **PageFlip**, which provides the page-turning animation.

The command creates a `node_modules` folder. This folder is intentionally not included in the ZIP because it can be recreated by running `npm install`.

## 7. Start Pagevera in development mode

Run:

```bash
npm run dev
```

Vite will print a local address similar to:

```text
http://localhost:5173/
```

Open that address in your browser. Keep the terminal running while using the app. To stop the server, press:

```text
Ctrl + C
```

On macOS, `Ctrl + C` is also used in the terminal.

## 8. Use the application

Click **Open PDF** or **Choose a PDF** and select a PDF file from your computer. The PDF remains local in the browser and is not uploaded to a server.

The main controls support page navigation, page jumping, zoom, fullscreen, printing, and downloading. Use the left sidebar to view thumbnails, search extracted PDF text, open bookmarks, or review notes.

Use the reader controls below the book for these annotations:

| Control | Function |
| --- | --- |
| Star | Bookmark the current page |
| Pencil | Create a note for the current page |
| Highlight | Mark or unmark the current page |
| Search | Find a word and jump to matching pages |
| Settings | Configure sound, music, and preview background |

Bookmarks, notes, and highlights are saved in the browser's local storage for the document. Scanned PDFs that contain only images do not have searchable text unless they have been processed with OCR.

## 9. Add sound, music, and a background

Open **Settings** in the top-right area of the app.

For page-turn sounds, leave the built-in sound enabled or upload an MP3, WAV, or OGG file. Adjust the flip sound volume with the slider.

For background music, upload an audio file and press **Play**. Browsers normally block automatic audio playback, so music requires an explicit click. The music can be stopped, looped, and adjusted with its volume slider.

For the preview background, upload a JPG, PNG, WebP, or GIF file. Adjust the overlay to keep the PDF pages readable. Use **Reset to default gradient** to remove the uploaded image.

All selected media remains in the current browser session. The app does not send the files to a server.

## 10. Create a production build

When you want to create an optimized version, run:

```bash
npm run build
```

The generated production files are placed in the `dist` folder. To preview the production build locally, run:

```bash
npm run preview
```

Open the local address shown in the terminal. The development command is still the easiest option while editing the project.

## 11. Common problems

### `npm` or `node` is not recognized

Node.js is not installed correctly or the terminal has not loaded the updated PATH. Install Node.js LTS, close VS Code, reopen it, and run `node --version` again.

### `npm install` fails

Check that the terminal is inside the Pagevera project folder and that the computer has an internet connection. Then try:

```bash
npm cache verify
npm install
```

Do not delete `package-lock.json` unless you understand the dependency changes that will result.

### Port 5173 is already in use

Vite will usually select another port and print it in the terminal. Open the exact URL shown by Vite. Alternatively, stop the other development server and run `npm run dev` again.

### The PDF does not open

Confirm that the selected file ends in `.pdf` and is not corrupted. Try opening the same file in a normal PDF reader. Very large PDFs may take longer to render because the initial version prepares all pages for the flipbook.

### Search does not find text

The PDF may be a scanned image-only document. Use OCR first, then open the OCR-processed PDF in Pagevera.

### Music does not start

Press the **Play** button directly inside the app. This is expected browser behavior caused by autoplay restrictions.

### The layout looks outdated after an update

Stop the development server with `Ctrl + C`, run `npm install` again, restart with `npm run dev`, and hard-refresh the browser using `Ctrl + Shift + R` on Windows/Linux or `Cmd + Shift + R` on macOS.

## 12. Project commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production build |
| `npm run preview` | Preview the production build |

## 13. Developer information

```text
Application: Pagevera
Type: Standalone PDF Flipbook Reader
Developer: Renz Acero
```

## References

[1]: https://nodejs.org/en/download "Node.js official downloads"
[2]: https://code.visualstudio.com/download "Visual Studio Code official downloads"

## Fullscreen mode

Click the fullscreen button below the book to enter the immersive reader mode. Pagevera requests fullscreen for the complete reader area, recalculates the page frame, and increases the maximum book size so the two-page spread uses the available screen more effectively. Exit fullscreen with the same button or the browser Escape key.

## Responsive layout behavior

Pagevera recalculates its book frame with a `ResizeObserver`, window resize listener, orientation-change listener, and fullscreen-change listener. Fullscreen mode uses the maximum available reader viewport while preserving the PDF page aspect ratio. Desktop and wide tablet layouts use a two-page spread. Narrow portrait devices automatically switch to a compact single-page layout so pages remain readable. The bottom toolbar uses touch-friendly targets, safe-area padding, and responsive wrapping so it does not cover the book on mobile screens.

## Direct page surface and mobile single-page mode

The book stage is transparent and has no intermediate border, shadow, fixed max-size, or extra inner padding around the white PDF pages. PageFlip dimensions are recalculated from the available viewport by the `ResizeObserver`, resize listener, fullscreen listener, and orientation listener. Viewports below 768px automatically use a single-page view; wider screens use a two-page spread when the available aspect ratio allows it.

## Full app-shell responsiveness

Responsive behavior applies to the complete application, not only the flipbook. The header actions, document sidebar, mobile menu drawer, viewer status row, bottom toolbar, settings panel, search results, thumbnails, bookmarks, and notes adapt across desktop, tablet, mobile portrait, and mobile landscape widths. Tablet and phone layouts collapse the document sidebar into a drawer, make settings full-width on small screens, reduce header spacing, and preserve safe-area space for touch controls.
