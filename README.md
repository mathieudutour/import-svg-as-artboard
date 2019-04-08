# Import SVG as Artboards

Sketch imports SVG as a Group, but it doesn't support groups that do not fit its content.
So if you would have an SVG of 100px\*100px with a single centered circle inside of 20px radius, Sketch will create a Group of 40px\*40px with a Circle inside.

This plugin allows you to import SVG as Artboards instead, so that the offset is preserved.

## Installation

- [Download](./releases/download/latest/import-svg-as-artboard.sketchplugin.zip) the latest release of the plugin
- Un-zip
- Double-click on import-svg-as-artboard.sketchplugin

## Development Guide

_This plugin was created using `skpm`. For a detailed explanation on how things work, checkout the [skpm Readme](https://github.com/skpm/skpm/blob/master/README.md)._

### Usage

Install the dependencies

```bash
npm install
```

Once the installation is done, you can run some commands inside the project folder:

```bash
npm run build
```

To watch for changes:

```bash
npm run watch
```

Additionally, if you wish to run the plugin every time it is built:

```bash
npm run start
```

### Debugging

To view the output of your `console.log`, you have a few different options:

- Use the [`sketch-dev-tools`](https://github.com/skpm/sketch-dev-tools)
- Run `skpm log` in your Terminal, with the optional `-f` argument (`skpm log -f`) which causes `skpm log` to not stop when the end of logs is reached, but rather to wait for additional data to be appended to the input

## License

MIT
