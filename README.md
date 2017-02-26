# import-from-console

Import JavaScript and CSS resources from console, with one command.

## Installation

Install it from [Chrome Web Store]()

## Usage

Open Chrome devtools console, a function named `$i` could be used to import JavaScript and CSS resources.

![assets/demo.gif](Demo)

also, a valid URL is acceptable:

![assets/url.png](URL)

## How does it work?

1. If argument passed is a valid URL, load it directly
2. If argument has version like `jquery@2`, try to load it from unpkg
3. Else, try to load it from cdnjs

Step 2 and 3 are also available as `$i.unpkg` or `$i.cdnjs`. If you are certain about which CDN to use, these are better choices.

## License

MIT
