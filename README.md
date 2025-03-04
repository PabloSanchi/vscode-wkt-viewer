# WKT Map Viewer for VS Code

A Visual Studio Code extension for visualizing Well-Known Text (WKT) geometries on an interactive map.

## Features

- 🗺️ Interactive map visualization of WKT geometries
- 🎨 Dark mode interface with modern styling
- ✨ Support for multiple geometries with different colors
- ⌨️ Keyboard shortcuts for quick access
- 📝 Text input for adding additional WKT strings
- 🔄 Real-time updates and visualization

## Supported WKT Types

- `POINT`
- `LINESTRING`
- `POLYGON`
- `MULTIPOINT`
- `MULTILINESTRING`
- `MULTIPOLYGON`

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "WKT Map Viewer"
4. Click Install

## Usage

### Via Command Palette

1. Select or place cursor on a line containing WKT
2. Open Command Palette (Ctrl+Shift+P)
3. Type "WKT: Show on Map"

### Via Keyboard Shortcut

- Windows/Linux: `(Ctrl+Shift+W)`
- Mac: `(Cmd+Shift+W)`

### Adding More Geometries

1. Open the WKT viewer
2. Enter WKT string in the input box
3. Click "Add" or press Enter

### Example WKT Strings

```wkt
POINT(30 10)
LINESTRING(30 10, 10 30, 40 40)
POLYGON((30 10, 40 40, 20 40, 10 20, 30 10))
```

## Development

### Prerequisites

- Node.js
- pnpm

### Running the Extension

1. Open in VS Code
2. Press F5 to start debugging
3. A new VS Code window will open with the extension loaded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

Apache 2.0

## Support

Found a bug? Have a feature request? [Create an issue](https://github.com/PabloSanchi/vscode-wkt-viewer/issues)
