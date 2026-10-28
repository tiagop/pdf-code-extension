# Change Log

All notable changes to the "pdf-viewer-for-vs-code" extension will be documented in this file.

## [1.0.7] - 2026-10-28

- PDF loading errors are shown as plain text instead of HTML.
- Update dependencies and fix serialize-javascript security alerts in build tooling.

## [1.0.6] - 2026-10-25

- Update PDF.js to 6.4.
- Fix JPEG 2000 and JBIG2 images not showing (common in scanned PDFs).
- Fix some PDFs only showing a small strip of the page with a scrollbar.
- Grayscale toggle now follows the VS Code theme and exposes its state to screen readers.
- Grayscale setting is remembered per PDF within a workspace, across reloads and reopening.
- Text selection highlight is also shown in grayscale.

## [1.0.4] - 2026-02-13

- Add grayscale toggle.

## [1.0.3] - 2026-02-11

- Add logo.

## [1.0.2] - 2026-02-10

- Text is now selectable.

## [1.0.1] - 2026-02-09

- Fix PDF.js not included in the extension

## [1.0.0] - 2026-02-09

- Initial release