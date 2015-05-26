Lucy Doc
========

A Javascript documentation parser based on Lua library [lut.Doc](http://doc.lubyk.org/lut.Doc.html).

---------------------------------------------------------------------------------
-- LIBRARY NOT RELEASED YET. TRANSCRIPTION FROM LUA TO JAVASCRIPT IN PROGRESS. --
---------------------------------------------------------------------------------

The parser supports Latex math, literate programming, object and array content
documentation and *does not use Javadoc* comments but leaves the user free to
format documentation in a way that makes the most sense to end users.

## Installation


```shell
  npm install lucy-doc --save
```

## Usage

```js
  require('lucy-doc').make({
    sources: [
      'foo/DocTest.js',
      'foo/Other.js',
      {path:'examples', prepend:'examples/foo'},
    ],
    copy: [
      {path:'examples', prepend: 'examples/foo', filter: /\.(js|png)/},
    ],
    target: 'doc',
    format: 'html',
    header: `
      <a href='http://lucidity.io'>
        <img alt='lucy logo' src='img/logo.png'/>
        <h1>Lucidity documentation</h1>
      </a>`,
    footer: "made with <a href='lucy.Doc.html'>lucy.Doc</a>",
  })
```

## Tests

```shell
   npm test
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Especialy, do not use semicolons for statements where they are not required, use comma
at the beginning of lines for lists and dictionaries.

Add unit tests for any new or changed functionality. Test your code.

## Release History

* 0.1.0 Initial release
