# import-from-console

![Demo](assets/demo.gif)

## Installation

Install it from [Chrome Web Store]()

## Usage

Open Chrome devtools console, a function named `$i` could be used to import JavaScript and CSS resources.

```js
// Import latest version
$i('jquery')

// Import specific version
$i('jquery@2')

// Also, you can import a valid script URL
$i('https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js')

// CSS is supported, too
$i('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')
```

![URL](assets/css.gif)

## How does it work?

1. If argument passed is a valid URL, load it directly
2. If argument has version like `jquery@2`, try to load it from unpkg
3. Else, try to load it from cdnjs

Step 2 and 3 are also available as `$i.unpkg` or `$i.cdnjs`. If you are certain about which CDN to use, these are better choices.

## License

MIT
