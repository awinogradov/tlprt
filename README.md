# Teleport

> npm i --save-dev tlprt

## Usage

``` js
'use strict';

const teleport = require('tlprt');

teleport({
    libName: 'example',
    techs: ['css', 'bemhtml.js'],
    platforms: ['desktop'],
    entities: ['button', 'link', 'select'],
    except: ['i-bem', 'ua'],
    json: true, // generate json file with paths
    levels: {
      desktop: [
        '/Users/hero/example/common.blocks',
        '/Users/hero/example/desktop.blocks'
      ],
      // ...
    }
}).then(assets => {
  console.log(JSON.stringify(assets, null, 2));
  // {
  // "css": {
  //   "button": [
  //     "/Users/hero/example/common.blocks/button/button.css",
  //   ],
  //   "link": [
  //     "/Users/hero/example/common.blocks/link/link.css",
  //   ],
  //   "select": [
  //     "/Users/hero/example/common.blocks/select/select.css",
  //   ]
  // },
  // "bemhtml.js": {
  //   "button": [
  //     "/Users/hero/example/common.blocks/button/button.bemhtml.js",
  //   ],
  //   "link": [
  //     "/Users/hero/example/common.blocks/link/link.bemhtml.js",
  //   ],
  //   "select": [
  //     "/Users/hero/example/common.blocks/select/select.bemhtml.js",
  //   ]
  // },
  // "combined": {
  //   "css": "/Users/hero/example/.teleport/example.css",
  //   "bemhtml.js": [
  //     "/Users/hero/example/common.blocks/button/button.bemhtml.js",
  //     "/Users/hero/example/common.blocks/link/link.bemhtml.js",
  //     "/Users/hero/example/common.blocks/select/select.bemhtml.js"
  //   ],
  //   "ddsl.js": "/Users/hero/example/.teleport/example.ddsl.js"
  // }
  // }
});
```

### License MIT
