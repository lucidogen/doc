/*

  # Documentation extractor

  lucy.Doc parses javascript comments and extracts the documentation from these
  comments. For usage, see lucy.Doc.new.

  It parses indifferently multiline comments like this:
  
    /&ast;
    Some text in comments.

    Some more text.
    &ast;/

  and single line comments like this:
  
    // Some text in comments.
    // 
    // Some more text.

  # Parsing modes

  By using the special comment `// doc:[option]`, you can change how the parsing
  is done.

  ## Literate programming

  The parser can generate full script documentation with all js code when set
  to "lit" (for literate). Turn this option off by setting "nolit".

    // doc:lit
    // This part is considered literate programming and all comments and js
    // code will be shown in the documentation.
    const x
    
    doSomething(x)

    // doc:nolit
    // End of literate part: only the library "lib" will be documented.

  ## Loose documentation

  By setting `// doc:loose`, the parser will generate a single TODO about
  missing documentation and will not generate any more TODO entries for
  each undocummented function or parameter.
  
  Even if the function names look obvious while writing the code and
  documentation seems superfluous, users will usually appreciate some real
  phrases describing what the function does. Using "loose" is not a good
  idea but can make the documentation more readable if most of the functions
  are not documented.

  # Extraction

  ## Module and class extraction

  All functions and constants defined in `lib` are extracted even if they are
  not yet documented. Using `lib` as single entry point for the declared module
  or class makes spotting function declarations easy while browsing code. It is
  also consistent between class and module function declarations. Methods are
  simply declared in `lib.prototype`. Example:

  Module definition:

    const lib = {}

    // module function
    lib.foo = function(a, b) {
    }

    module.exports = lib

  Class definition:

    // Constructor
    const lib = function(firstname, lastname) {
    }

    // class function (same as module function)
    lib.foo = function(a, b) {
    }

    // method
    lib.prototype.fullname = function() {
      return this.firstname + ' ' + this.lastname
    }

    module.exports = lib

  ES6 class definition will be implemented as soon as they are supported without
  harmony flags.

  If a function definition does not follow this convention, it can be
  documented with a commented version of the function definition:

    // Special function declaration.
    // lib.bing = function(a, b, c)
    lib.bing = somelib.bang

    // Out of file function definition.
    // lib.prototype.connect = function(server)

    // Out of file constant definition
    // lib.Default

  To ignore functions, use `// nodoc` as documentation:

    // nodoc
    lib.badOldLegacyFunction = function(x, y) {
    }

  ## Module constants and parameters

  All parameters defined against `lib` are documented unless `// nodoc` is used.

    lib.foo = 4
    lib.bar = 5

    // nodoc
    lib.old_foo = 4

  When Javascript is used as a description language, it is often useful to
  document object keys. This is done by using `// doc`.

  The parsed parameters for table 'key' is stored in `doc.params[key]` in
  parsing order. In the following example, this is `doc.params.ATTRIBS`.

    // # Attributes (example)
    // This is an example of attributes documentation.
    
    const ATTRIBS = { // doc
      // Documentation on first key.
      first_name = '',

      // Documentation on second key.
      last_name = '',

      // ## Sub-title
      // Some text for this group of attributes.

      phone = {default = '', format = '000 000 00 00'},
    }

    const LIST = [ // doc
      // Documentation of first element in list
      'js ~> 5.1',

      // Other element
      'lucy ~> 1.0',
    ]

  We also support comma first objects and array definitions in which case the
  documentation must come on the same line as the entry:

    const LIST = // doc
      [ 'js ~> 5.1'   // Documentation of first element in list
      , 'lucy ~> 1.0' // Other element
      , 'sky ~> 1.0'  // Last element
      ]
  Such a list will create the following documentation:

*/
// # Attributes (example)
// This is an example of attributes documentation.

const ATTRIBS = { // doc
  // Documentation on first key.
  first_name = '',

  // Documentation on second key.
  last_name = '',

  // ## Sub-title
  // Some text for this group of attributes.

  phone = {default = '', format = '000 000 00 00'},
}

const LIST = [ // doc
  // Documentation of first element in list
  'js ~> 5.1',

  // Other element
  'lucy ~> 1.0',
]

/*

  # Preamble

  You must start your file with a preample containing a title for the class
  or module and some description.

    /&ast;
      
      # Full title for the file/class
    
      This first paragraph is the summary.
    
      Some more description.
    
    &ast;/

  # Math

  The `[math]` tag can be used to generate mathematics from latex code. When
  outputing *html*, the page uses [MathJax](http://www.mathjax.org) when outputing html.
  Here is an example of mathematics inline and as standalone paragraph:

    // Some documentation with inline
    // [math]\gamma[/math] math. And now a
    // standalone math paragraph:
    //
    // [math]\frac{\partial}{\partial\theta_j}J(\theta) = \frac{1}{m}\sum_{i=1}^m(\theta^{T}x^{(i)}-y^{(i)})x_j^{(i)}[/math]

  The result for the code above is:

  Some documentation with inline [math]\gamma[/math] math. And now a
  standalone math paragraph:
  
  [math]\frac{\partial}{\partial\theta_j}J(\theta) = \frac{1}{m}\sum_{i=1}^m(\theta^{T}x^{(i)}-y^{(i)})x_j^{(i)}[/math]

  If you *hover* with the mouse over the formula, it zooms.
  
  # Javascript code
  
  You can insert code snippets by indenting the code with two spaces. Here is
  an example of some normal text and some Javascript and C++ code.

    /&ast;
    Some JS code:

      const foo = {name: 'Lucy'}
      // print something
      console.log(foo.name)
    
    And a C++ example:

      #cpp
      float x = 1.0;
      printf("Result = %.2f\n", x);
    &ast;/

  This results in:

  Some JS code:

    const foo = {name: 'Lucy'}
    // print something
    console.log(foo.name)
  
  And a C++ example:

    #cpp
    float x = 1.0;
    printf("Result = %.2f\n", x);

  As you can see, you have to declare other languages with `#name` if the code
  is not Javascript. When using `#txt`, the code is not styled with prettyprint. The
  code lang can also contain multiple words. The first word is the language and
  the following are used for CSS class styling.

  Special ascii art code:

    #txt ascii
    +////////+
    | a box  |
    +////////+

  # Styles, links

  You can enhance your comments with links, bold, italics and images.

  Some links are automatically created when the parser sees `module.Class` like
  this lucy.Doc or `#Some-const-id`. A custom link is made with `[link title](http://example.com)`.

  Bold is done by using asterisks: `some text with *bold* emphasis`. Italics are
  inserted with underscores: `some text _with italic_ emphasis`.

  You can add images with `![alt text](/path/to/image.jpg)`.

  Inline code is inserted with backticks:
  
    // This is `inline code`.

  You can also insert raw html with `<html>` tag.

    <html><a href='example.com'>hello</a></html>

  # Lists

  There are two kinds of lists available. The first one is simply a bullet list:

    #txt
    * First element
    * Second element with more text
      that wraps around
    * Third

  Which renders as:

  * First element
  * Second element with more text
    that wraps around
  * Third

  The second style is for definitions:

    #txt
    + some key:       is used to do something.
    + other long key: is used with a very long definition that
                      wraps around and even more text that goes
                      beyond.
    + `last key`:     is a code key.

  Renders as:

  + some key:       is used to do something.
  + other long key: is used with a very long definition that
                    wraps around and even more text that goes
                    beyond.
  + `last key`:     is a code key.

  # Special paragraphs

  You can create special paragraphs by starting them with one of the special
  keywords in upercase:  `TODO, FIXME, WARN, NOTE`.

    TODO This is a todo definition

    FIXME This is a fixme

    NOTE This paragraph is a note.

    WARN This is a warning.

  These end up like this (todo and fixme are repeated at the end of
  the file, but not for this example).

  TODO - This is a todo definition

  FIXME - This is a fixme

  NOTE This paragraph is a note.

  WARN This is a warning.

*/
const strftime = require('strftime')

const private = {}
const parser  = {}
const CODE = '§§'
const ALLOWED_OPTIONS = {lit = true, loose = true}
const DEFAULT_HEADER = ' '
const DEFAULT_FOOTER = " Documentation generated on ${strftime('%Y-%m-%d')} with <a href='http://doc.lucidity.io/lucy.Doc.html'>lucy.Doc</a> "
// list of files to copy in generated documentation.
const ASSETS = 
  { 'css/bootstrap.min.css'
  , 'css/bootstrap-responsive.min.css'
  , 'css/docs.css'
  , 'img/glyphicons-halflings-white.png'
  , 'img/glyphicons-halflings.png'
  , 'js/bootstrap.min.js'
  }

// # Constructor

// Parse the content of a file given by `path` and return an lut.Doc object 
// containing the documentation of the class.
//
// Usage example:
//
//   require 'lut'
//   const doc = lut.Doc('path/to/File.lua', {target = 'doc'})
//   lub.writeall('doc/File.html', doc:toHtml())
//
// When documenting multiple files it is better to use #make.
//
// Possible keys in `def` (all are optional if `path` is given):
//
// + code       : If `path` is nil, parse the given code.
// + name       : Used when no `path` is provided.
// + navigation : Navigation menu on the right.
// + children   : List of classes (in main content part).
// + head       : HTML content to insert in `<head>` tag.
// + index_head : HTML content to insert in `<head>` tag of index file.
// + css        : Path to a CSS file to use instead of `css/docs.css`.
// + header     : HTML code to display in header (lub.Template evaluated).
// + footer     : HTML code to display in footer (lub.Template evaluated).
// + target     : Target directory (only used when using PNG image generation
//                for math code.
const lib = function(path, def) {
  def = def or {}

  this.path   = path
  this.name   = def.name
  this.target = def.target
  this.header = def.header || DEFAULT_HEADER
  this.footer = def.footer || DEFAULT_FOOTER
  this.navigation = def.navigation || {}
  this.children   = def.children || {}
  this.sections   = {}
  // List of documented parameters.
  this.params     = {}
  this.opts       = def.opts || def
  
  if (def.navigation) {
    this.module   = this.navigation.__fullname
    this.name     = this.children.__name
    if (def.toplevel) {
      this.toplevel = true
      this.fullname = this.name
      this.navigation = this.children
    } else {
      if (this.navigation.__fullname) {
        this.fullname = this.navigation.__fullname + '.' + this.name
      } else {
        this.fullname = this.name
      }
    }
  } else if(path) {
    const info    = private.parseName(path)
    this.module   = info.module
    this.name     = info.name
    this.fullname = info.fullname
  } else {
    console.assert(this.name, 'A name or path is required')
  }

  if (path) {
    private.parseFile(this, path)
  } else if (def.code) {
    private.parseCode(this, def.code)
  } else {
    // make dummy doc
    private.newSection(this, 0, this.name)
    this.group.list.push({text: '', klass: 'summary'})
  }

  if (this.children && this.children.length > 0) {
    const children = this.children
    const section  = this.section
    children.forEach(function(name) {
      const child = children[name]

      // Use 'klass' key for children elements.
      const group =
        { klass: child.__fullname
        , name:  child.__name
        , list: [ child.__summary
                , child.__img
                ]
        }

      if (child.__fixme) {
        child.__fixme.list[0].forEach(function(p) { group.list.push(p) })
      }

      if (child.__todo) {
        child.__todo.list[0].forEach(function(p) { group.list.push(p) })
      }

      section.list.push(group)
    }  
  }

  if (this.todo) {
    this.sections.push(this.todo)
  }

  if (this.fixme) {
    this.sections.push(this.fixme)
  }
}

lib.prototype.type = 'lucy.Doc'

// nodoc
lib.ASSETS = ASSETS

// Generate the documentation for multiple files.
//
// The `sources` parameter lists paths to JS files or directories to parse and
// document.
//
// + target:  parameter is the path to the directory where all the
//            output files will be written.
// + format:  is the type of output desired. Only 'html' format is supported
//            for now.
// + sources: lists path to glob for lua files. A source can also be a object
//            with a `prepend` key used to change the location of the files
//            in the documentation.
// + copy:    lists the path to glob for static content to copy in `target`.
//            Optionally, use `prepend` to copy in sub-directory and `filter`
//            to select files.
// + header:  html code that will be inserted in every html page as header.
// + footer:  html code that will be inserted in every html page as footer.
//
// Usage:
//
//   const Doc = require('lucy-doc')
//   Doc.make({
//     sources: [
//       'lib/doc/DocTest.js',
//       'lib/doc/Other.js',
//       {path:'doc', prepend:'examples/foo'},
//     ],
//     copy: [
//       {path:'doc', prepend: 'examples/foo', filter: '%.js'},
//     ],
//     target: 'doc',
//     format: 'html',
//     header: `
//       <a href='http://lucidity.io'>
//         <img alt='lucy logo' src='img/logo.png'/>
//         <h1>Lucidity documentation</h1>
//       </a>`,
//     footer: "made with <a href='lucy.Doc.html'>lucy.Doc</a>",
//   })
function lib.make(def)
  const format = def.format or 'html'
  const output = assert(private.output[format])
  const mod_output = assert(private.mod_output[format])
  // Prepare output
  lub.makePath(def.target)

  // Copy base assets
  private.copyAssets[def.format](def.target)
  if (def.copy) {
    private.copyFiles(def.copy, def.target)
  end


  // Parse all files and create a tree from the directories and
  // files to parse.
  // { name = 'xxxx', sub, { name = 'xxx', subsub }}.
  const tree = {is_root = true}
  private.parseSources(tree, def.sources)

  private.makeDoc(tree, def)
end

// # Methods

// Render the documentation as html. If a `template` is provided, it is used
// instead of the default one. This is mainly used for testing since you usually
// want to have some navigation menus which are extracted by creating the
// documentation in batch mode with #make.
function lib:toHtml(template)
  return private.output.html(this, template)
end

function private.parseSources(tree, sources)
  const prepend = sources.prepend
  const ignore  = sources.ignore
  for _, mpath in ipairs(sources) do
    if (type(mpath) == 'table') {
      private.parseSources(tree, mpath)
    else
      const mpath = lub.absolutizePath(mpath)
      if (lub.fileType(mpath) == 'directory') {
        for path in lub.Dir(mpath):glob '%.lua' do
          if (ignore and path:match(ignore)) {
            // ignore
          else
            private.insertInTree(tree, path, mpath, prepend)
          end
        end
      } else if (not lub.exist(mpath) then
        error("Path '"+mpath+"' does not exist.")
      else
        private.insertInTree(tree, mpath, lub.dir(mpath), prepend)
      end
    end
  end
end

function private.insertInTree(tree, fullpath, base, prepend)
  // Remove base from path
  const path = string.sub(fullpath, string.len(base) + 2, -1)
  if (prepend) {
    path = prepend + '/' + path
  end
  if (not match(path, '/') and not match(base, '/lib$')) {
    // base is too close to file, we need to have at least one
    // folder level to get module name. If we are scanning "lib", consider
    // files inside to be module definitions.
    const o = base
    base = lub.dir(base)
    return private.insertInTree(tree, fullpath, base)
  end
  const curr = tree
  const list = lub.split(path, '/')
  const last = #list
  for i, part in ipairs(list) do
    // transform foo/init.lua into foo.lua
    const is_init

    if (i == last) {
      is_init = part == 'init.lua'
      // Remove extension
      part = match(part, '(.*)%.lua$')
    end

    if (is_init) {
      curr.__file = fullpath
    } else if (not part then
      error("Bad file name '"+path+"'.")
    else
      if (not curr[part]) {
        const fullname
        if (curr.__fullname) {
          fullname = curr.__fullname + '.' + part
        else
          fullname = part
        end
        curr[part] = { __name = part, __fullname = fullname}
        lub.insertSorted(curr, part)
      end
      curr = curr[part]

      if (i == last) {
        curr.__file = fullpath
      end
    end
  end
end

function private.makeDoc(tree, def)
  for _, elem_name in ipairs(tree) do
    const elem = tree[elem_name]
    // Depth first so that we collect all titles and summary first.
    private.makeDoc(elem, def)
    const children, navigation
    if (tree.is_root) {
      children   = elem
      navigation = elem
    else
      children   = elem
      navigation = tree
    end

    const doc = lib.new(elem.__file, {
      // Parent & siblings navigation (right menu)
      navigation = tree,
      // Children navigation (listed in main div)
      children   = elem,
      target     = def.target,
      toplevel   = tree.is_root,
      opts       = def,
    })
    
    elem.__title   = doc.sections[1].title
    elem.__summary = doc.sections[1][1][1]
    const img = doc.sections[1][1][2]
    if (img and match(img.text or '', '^!%[')) {
      elem.__img = img
    end
    elem.__todo    = doc.todo
    elem.__fixme   = doc.fixme
    const trg = def.target + '/' + doc.fullname + '.' + def.format

    doc.header = def.header and lub.Template(def.header):run {this = elem}
    doc.footer = lub.Template(def.footer or DEFAULT_FOOTER):run {this = elem}

    lub.writeall(trg, private.output[def.format](doc, def.template))
  end

  if (tree.is_root) {
    tree.__name = 'index'
    // Create index.html file

    // Support for meta tag in index page.
    if (def.index_head) {
      def.head = def.index_head
    end

    const doc = lib.new(nil, {
      code = def.index or [=[ 
//[[//////////
  # Table of contents

//]]//////////
]=],
      // Parent & siblings navigation (right menu)
      navigation = tree,
      // Children navigation (listed in main div)
      children   = tree,
      target     = def.target,
      toplevel   = false,
      opts       = def,
    })

    doc.header = def.header and lub.Template(def.header):run {this = tree}
    doc.footer = lub.Template(def.footer or DEFAULT_FOOTER):run {this = tree}
    
    const trg = def.target + '/index.' + def.format
    lub.writeall(trg, private.output[def.format](doc, def.template))
  end

end


private.parseName = function(path) {
  const name, module, fullname
  const name = path.match(/([^\/]+)\.js$/)
  console.assert(name, "Invalid path '${path}'")
  module = path.match(/([^\/]+)\/[^\/]+$/)
  if (module) {
    fullname = module + '.' + name
  } else {
    fullname = name
  }
  
  return {module:module, name:name, fullname:fullname}
}

function private:parseFile(path)
  const file = assert(io.open(path, "r"))
  const it = file:lines()
  private.doParse(this, function()
    return it()
  end)
  io.close(file)
end

function private:parseCode(code)
  const lines = lub.split(code, '\n')
  const it = ipairs(lines)
  const i = 0
  private.doParse(this, function()
    const _, l = it(lines, i)
    i = i + 1
    return l
  end)
end

function private:doParse(iterator)
  const state = parser.start
  const line_i = 0
  // This is true on entering a state.
  const entering = true
  for line in iterator do
    const replay = true
    line_i = line_i + 1
    while replay do
      // if (this.name == 'Doc') {
      //   print(string.format("%3i %-14s %s", line_i, state.name or 'SUB', line))
      // end
      replay = false
      for i=1,#state do
        const matcher = state[i]
        if (not matcher.on_enter or entering) {
          const m = pack(match(line, matcher.match))
          if (m[1]) {
            const move = matcher.move
            if (matcher.output) {
              matcher.output(this, line_i, unpack(m))
              if (this.force_move) {
                // We need this to avoid calling move and (enter/exit) just to
                // test if we need to move.
                move = this.force_move
                this.force_move = nil
              end
            end
            const state_exit = state.exit
            if (type(move) == 'function') {
              if (state_exit  then state_exit(this)) {
              state, replay = move(this)
              if (not state) {
                const def = debug.getinfo(move)
                error("Error in state definition "+ match(def.source, '^@(.+)$') + ':' + def.linedefined)
              end
              entering = true
              if (state.enter then state.enter(this)) {
            } else if (not move then
              // do not change state
              entering = false
            else
              if (state_exit  then state_exit(this)) {
              state = move
              entering = true
              if (state.enter then state.enter(this)) {
            end
            break
          end
        end
      end
    end
  end

  if (state.exit) {
    state.exit(this)
  end

  if (state.eof) {
    state.eof(this, line_i)
  end
  // Clean draft content
  this.para  = nil
  this.scrap = nil
end

//=============================================== Helpers
const USED_TYPES = {
  TODO  = true,
  FIXME = true,
  WARN  = true,
  NOTE  = true,
}

function private:addTodo(i, text)
  private.todoFixme(this, i, '', 'TODO', text)
  private.flushPara(this)
end

function private:todoFixme(i, all, typ, text)
  if (not USED_TYPES[typ]) {
    return private.addToPara(this, i, all)
  end
  const group = this.in_func or this.group

  const no_list, txt = match(text, '^(-) *(.*)$')
  if (no_list) {
    text = txt
  end

  typ = string.lower(typ)
  table.insert(group, this.para)
  this.para = {
    span = typ,
    text = text,
  }
  // If TODO/FIXME message starts with '-', do not show in lists.
  if (no_list then return) {

  const list = this[typ]
  if (not list) {
    // Section for todo or fixme
    list = {
      name  = string.upper(typ),
      title = string.upper(typ),
      // A single group with all fixmes and todos.
      {},
    }
    this[typ] = list
  end
  table.insert(list[1], {
    span  = typ,
    text  = text,
    // This is to find function reference when the todo is shown
    // outside the function documentation.
    group = group,
    file  = this.fullname,
    section_name = this.section.name,
  })
end

function private:newFunction(i, typ, fun, params)
  const i = #this.group
  if (this.group[i] and this.group[i].text == 'nodoc') {
    // ignore last para
    table.remove(this.group)
    this.para = nil
    return
  end

  // Store last group as function definition
  if (typ == ':') {
    this.group.fun = fun
  } else if (typ == '.' then
    this.group.class_fun = fun
  else
    this.group.global_fun = fun
  end
  this.group.params = params
  private.useGroup(this)
  this.in_func = this.group
end

function private:newConstant(i, const)
  const i = #this.group
  if (this.group[i] and this.group[i].text == 'nodoc') {
    // ignore last para
    table.remove(this.group)
    this.para = nil
    return
  end

  // Store last group as function definition
  this.group.const = const
  private.useGroup(this)
  this.in_func = this.group
end

function private:newParam(i, key, params, typ)
  typ = typ or 'param'
  const i = #this.group
  if (this.group[i] and this.group[i].text == 'nodoc') {
    // ignore last para
    table.remove(this.group)
    this.para = nil
    return
  end

  // Store last group as param definition
  this.group[typ] = key
  this.group.params = params

  if (typ == 'tparam') {
    // This is to have creation order
    table.insert(this.curr_param, this.group)
    this.curr_param[key] = this.group
  } else if (typ == 'lparam' then
    table.insert(this.curr_param, this.group)
    this.curr_param[key] = this.group
  else
    table.insert(this.params, this.group)
    this.params[key] = this.group
  end

  private.useGroup(this)
  this.group = {}
end

function private:newAttrib(i, title, prefix)
  const code = code or '= {'
  private.flushPara(this)
  table.insert(this.group, {
    // Documenting an attribute
    attr = title, prefix = prefix
  })
  private.useGroup(this)
end

function private:newTitle(i, title, typ)
  typ = typ or 'title'
  private.flushPara(this)
  table.insert(this.group, {
    heading = typ, text = title
  })
  private.useGroup(this)
end

function private:useGroup()
  const s = this.section
  if (s[#s] ~= this.group) {
    table.insert(s, this.group)
  end
end

function private:addToPara(i, d)
  if (not this.para) {
    this.para = { klass = this.next_para_class}
    this.next_para_class = nil
  end
  const para = this.para
  if (para.text) {
    //para.text = para.text + '\n' + d or ''
    para.text = para.text + ' ' + d or ''
  else
    para.text = d or ''
  end
end

// Add with newline.
function private:addToParaN(i, d)
  if (not this.para) {
    this.para = { klass = this.next_para_class}
    this.next_para_class = nil
  end
  const para = this.para
  if (para.text) {
    para.text = para.text + '\n' + d or ''
  else
    para.text = d or ''
  end
end

function private:addToList(i, tag, text, definition)
  const key
  if (definition) {
    key  = text
    text = definition
  end
  const para = this.para
  if (not para) {
    this.para = {list = {}, text = text, key = key}
  } else if (not para.list then
    // Save previous paragraph.
    private.flushPara(this)
    // Start new list
    this.para = {list = {}, text = text, key = key}
  else
    // Move previous element in list
    table.insert(para.list, {text = para.text, key = para.key})
    // Prepare next.
    para.text = text
    para.key  = key
  end
end

function private:newSection(i, title)
  private.flushPara(this)
  this.group = {}
  this.section = {this.group}
  table.insert(this.sections, this.section)
  this.section.title = title
  const name = title
  if (#this.sections == 1) {
    name = this.name
  else
    name = gsub(title, ' ', '-')
  end
  this.section.name = name
end

function private:flushPara()
  if (this.para) {
    table.insert(this.group, this.para)
  end
  this.para = nil
end

//=============================================== Doc parser

// A parser state is defined with:
// {MATCH_KEY, SUB-STATES, match = function}
// list of matches, actions
parser.start = {
  // matchers
  { match  = '^%-%-%[%[',
    move   = {
      // h2: new section
      { match  = '^ *# (.+)$',
        output = function(this, i, d)
          private.newSection(this, i, d)
          this.next_para_class = 'summary'
        end,
        move   = function() return parser.mgroup end,
      },
      // h3: new title
      { match  = '^ *## (.+)$',
        output = private.newTitle,
        move   = function() return parser.mgroup end,
      },
      { match  = '^%-%-%]',
        output = function(this, i)
          print(string.format("Missing '# title' in preamble from '%s'.", this.fullname))
          // make dummy doc
          private.newSection(this, i, this.fullname)
          table.insert(this.group, {text = '', klass = 'summary'})
        end,
        move   = function() return parser.mgroup end,
      },
    }
  },

  eof = function(this, i)
    print(string.format("Reaching end of document without finding preamble documentation in '%s'.", this.fullname))
    // make dummy doc
    private.newSection(this, i, this.fullname)
    table.insert(this.group, {text = '', klass = 'summary'})
  end,
}

// Multi-line documentation
parser.mgroup = {
  // End of multi-line comment
  { match  = '^%-%-%]',
    output = private.flushPara,
    move   = function(this) return this.back or parser.end_comment end,
  },
  // h2: new section
  { match = '^ *# (.+)$',
    output = private.newSection,
  },
  // h3: new title
  { match = '^ *## (.+)$',
    output = private.newTitle,
  },
  // out of file function
  { match  = '^ *function lib([:%.])([^%(]+)(.*)$',
    output = private.newFunction,
  },
  // out of file constant
  { match  = '^ *lib%.(.*)$',
    output = private.newConstant,
  },
  // todo, fixme, warn
  { match = '^ *(([A-Z][A-Z][A-Z][A-Z]+):? ?(.*))$',
    output = private.todoFixme,
  },
  // math section
  { match = '^ *%[math%]',
    move  = function() return parser.mmath, true end,
  },
  // list
  { match = '^ *(%*+) +(.+)$',
    output = private.addToList,
  },
  // definition list
  { match = '^ *(%+) +(.-): *(.+)$',
    output = private.addToList,
  },
  // end of paragraph
  { match = '^ *$', 
    output = private.flushPara,
    move = {
      // code
      { match = '^   ',
        output = private.flushPara,
        move  = function() return parser.mcode, true end,
      },
      { match = '',
        move  = function() return parser.mgroup, true end,
      },
    },
  },
  // normal paragraph
  { match = '^ *(.+)$',
    output = private.addToPara,
  },
}

parser.mcode = {
  // first line
  { match  = '^    (.*)$',
    output = function(this, i, d)
      const lang = match(d, '#(.+)')
      if (lang) {
        d = nil
      else
        lang = 'lua'
      end
      lang = string.lower(lang)
      this.para = {code = lang, text = d}
    end,
    move = {
      // code
      { match  = '^    (.*)$',
        output = private.addToParaN,
      },
      // empty line
      { match  = '^ *$', 
        output = function(this, i)
          private.addToParaN(this, i, '')
        end,
      },
      // end of code
      { match  = '', 
        output = function(this, i, d)
          private.flushPara(this)
        end,
        move = function() return parser.mgroup, true end,
      },
    },
  },
}

parser.code = {
  // first line
  { match  = '^ *%-%-   (.*)$',
    output = function(this, i, d)
      const lang = match(d, '#([^ ]+.+)')
      if (lang) {
        d = nil
      else
        lang = 'lua'
      end
      lang = string.lower(lang)
      this.para = {code = lang, text = d}
    end,
    move = {
      // code
      { match  = '^ *%-%-   (.*)$',
        output = private.addToParaN,
      },
      // empty line
      { match  = '^ *%-%- *$', 
        output = function(this, i)
          private.addToParaN(this, i, '')
        end,
      },
      // end of code
      { match  = '', 
        output = function(this, i, d)
          private.flushPara(this)
        end,
        move = function() return parser.group, true end,
      },
    },
  },
}

parser.mmath = {
  // Inline
  { match  = '^ *%[math%](.*)%[/math%]', 
    output = function(this, i, d)
      if (d == '') return
      private.flushPara(this)
      this.para = {math = 'inline', text = d}
      private.flushPara(this)
    end,
    move = function() return parser.mgroup end,
  },
  { match  = '^ *%[math%](.*)',
    output = function(this, i, d)
      private.flushPara(this)
      this.para = {math = 'block', text = d}
    end,
  },
  // End of math
  { match  = '^(.*)%[/math%]', 
    output = function(this, i, d)
      private.addToPara(this, i, d)
      private.flushPara(this)
    end,
    move = function() return parser.mgroup end,
  },
  { match  = '^(.*)$',
    output = private.addToPara,
  },
}

parser.math = {
  // One liner
  { match  = '^ *%-%- *%[math%](.*)%[/math%]', 
    output = function(this, i, d)
      private.flushPara(this)
      this.para = {math = true, text = d}
      private.flushPara(this)
    end,
    move = function() return parser.group end,
  },
  { match  = '^ *%-%- *%[math%](.*)',
    output = function(this, i, d)
      private.flushPara(this)
      this.para = {math = true, text = d}
    end,
  },
  // End of math
  { match  = '^ *%-%- (.*)%[/math%]', 
    output = function(this, i, d)
      private.addToPara(this, i, d)
      private.flushPara(this)
    end,
    move = function() return parser.group end,
  },
  { match  = '^ *%-%- (.*)$',
    output = private.addToPara,
  },
}

parser.group = {
  // code
  { match = '^ *%-%-   ',
    on_enter = true, // only match right after entering.
    output   = private.flushPara,
    move     = function() return parser.code, true end,
  },
  // end of comment
  { match  = '^ *[^%- ]',
    output = private.flushPara,
    move   = function(this) return this.back or parser.end_comment, true end
  },
  { match  = '^ *$',
    output = private.flushPara,
    move   = function(this)
      if this.back then
        return this.back, true
      else
        return parser.lua
      end
    end,
  },
  // new section
  { match  = '^ *%-%- *# (.+)$',
    output = private.newSection,
  },
  // new title
  { match  = '^ *%-%- *## (.+)$',
    output = private.newTitle,
  },
  // out of file function definition
  { match  = '^ *%-%- *function lib([:%.])([^%(]+)(.*)$',
    output = private.newFunction,
  },
  // out of file constant
  { match  = '^ *%-%- *lib%.(.*)$',
    output = private.newConstant,
  },
  // math section
  { match = '^ *%-%- *%[math%]',
    move  = function() return parser.math, true end,
  },
  // todo, fixme, warn
  { match = '^ *%-%- *(([A-Z][A-Z][A-Z][A-Z]+):? ?(.*))$',
    output = private.todoFixme,
  },
  // list
  { match = '^ *%-%- *(%*+) +(.+)$',
    output = private.addToList,
  },
  // definition list
  { match = '^ *%-%- *(%+) +(.-): *(.+)$',
    output = private.addToList,
  },
  // end of paragraph
  { match = '^ *%-%- *$', 
    output = private.flushPara,
    move = {
      // code
      { match = '^ *%-%-   ',
        output = private.flushPara,
        move  = function() return parser.code, true end,
      },
      { match = '',
        move  = function() return parser.group, true end,
      },
    },
  },
  // normal paragraph
  { match = '^ *%-%- *(.+)$',
    output = private.addToPara,
  },
  eof = private.flushPara,
}

// This is called just after the comment block ends.
parser.end_comment = {
  // lib function
  { match  = '^function lib([:%.])([^%(]+) *(%(.-%))',
    output = private.newFunction,
    move   = function() return parser.lua end,
  },
  // lib param
  { match  = 'lib%.([a-zA-Z_0-9]+) *= *(.+)$',
    output = function(this, i, key, def)
      const def2 = match(def, '^(.-) *%-%- *doc *$')
      if def2 then
        // Special case where a lib attribute itthis is documented
        this.curr_param = {}
        this.params[key] = this.curr_param
        private.newAttrib(this, i, key, '.')
        this.force_move = parser.params
      else
        if this.group[1] and this.group[1].heading then
          // Group is not for us
          this.group = {}
          if not this.loose then
            private.addTodo(this, i, 'MISSING DOCUMENTATION')
          end
          private.newParam(this, i, key, def)
        else
          private.newParam(this, i, key, def)
        end
      end
    end
  },
  // global function
  { match  = '^function ([^:%.%(]+) *(%(.-%))',
    output = function(this, i, name, params)
      private.newFunction(this, i, '', name, params)
    end
  },
  // Match anything moves to raw code
  { match = '',
    move = function(this) return parser.lua, true end,
  }
}

parser.lua = {
  enter = function(this)
    if this.lit then
      // Make sure we use previous comment.
      private.useGroup(this)
      this.group = {}
      this.para = {code = 'lua'}
    end
  end,
  exit = function(this)
    if this.lit then
      if lub.strip(this.para.text or '') == '' then
        // Do not insert code for blank lines.
        this.para = nil
      else
        private.flushPara(this)
        private.useGroup(this)
      end
    end
  end,
  // Undocummented function
  { match  = '^(function lib([:%.])([^%(]+) *(%(.-%)).*)$',
    output = function(this, i, all, typ, fun, params)
      if this.lit then
        private.addToParaN(this, i, all)
      else
        this.group = {}
        if not this.loose then
          private.addTodo(this, i, 'MISSING DOCUMENTATION')
        end
        private.newFunction(this, i, typ, fun, params)
      end
    end,
  },
  // Undocummented param
  { match  = '^(lib%.([a-zA-Z_0-9]+) *= *(.+))$',
    output = function(this, i, all, key, def)
      if this.lit then
        private.addToParaN(this, i, all)
      else
        this.group = {}
        // document all params
        // match(def, '^({) *$') or
        const def2 = match(def, '^(.-) *%-%- *doc *$')
        if def2 then
          // Special case where a lib attribute itthis is documented
          this.curr_param = {}
          this.params[key] = this.curr_param
          private.newAttrib(this, i, key, '.')
          this.force_move = parser.params
        else
          if not this.loose then
            private.addTodo(this, i, 'MISSING DOCUMENTATION')
          end
          private.newParam(this, i, key, def)
        end
      end
    end,
  },
  // end of function
  { match  = '^(end.*)$',
    output = function(this, i, d)
      this.in_func = nil
      if this.lit then private.addToParaN(this, i, d) end
    end,
  },
  // move out of literate programming
  { match  = '^%-%- doc:no(.+)$',
    output = function(this, i, d)
      assert(ALLOWED_OPTIONS[d], string.format("Invalid option '%s' in '%s'.", d, this.name))
      this[d] = false
    end,
  },
  // enter literate programming
  { match  = '^%-%- doc:(.+)$',
    output = function(this, i, d)
      assert(ALLOWED_OPTIONS[d], string.format("Invalid option '%s' in '%s'.", d, this.name))
      if d == 'loose' then
        private.addTodo(this, i, 'INCOMPLETE DOCUMENTATION')
      end
      this[d] = true
    end,
  },
  // params
  { match  = '^ *(.-) *= *{ %-%- *doc *$',
    output = function(this, i, key)
      this.curr_param = {}
      this.params[key] = this.curr_param
      // remove 'const' prefix
      const k = match(key, '^const *(.+)$')
      key = k or key
      private.newAttrib(this, i, key)
    end,
    move = function() return parser.params end,
  },
  // todo, fixme, warn
  { match = '^ *(%-%- *([A-Z][A-Z][A-Z][A-Z]+):? ?(.*))$',
    // This does not support multiline todo.
    output = function(this, ...)
      private.todoFixme(this, ...)
      private.flushPara(this)
    end
  },
  { match  = '^ *%-%- +(.+)$',
    move = function(this)
      // Temporary group (not inserted in section).
      this.group = {}
                           // replay last line
      return parser.group, true
    end,
  },
  { match  = '^%-%-%[%[',
    output = function(this)
      // Temporary group (not inserted in section).
      this.group = {}
    end,
    move = function() return parser.mgroup end,
  },
  { match = '^(.*)$',
    output = function(this, ...)
      if this.lit then
        private.addToParaN(this, ...)
      end
    end,
  },
}

parser.params = {
  { match  = '^ *%-%- *## *(.*)$',
    output = function(this, i, d)
      private.newTitle(this, i, d, 'param')
      private.useGroup(this)
    end,
  },
  { match  = '^ *%-%- +(.+)$',
    output = function(this, i, d)
      // Temporary group (not inserted in section).
      this.group = {}
    end,
    move = function(this)
      this.back = parser.params
      // replay last line
      return parser.group, true
    end,
  },
  { match  = '^%-%-%[%[ *(.*)$',
    output = function(this, i, d)
      private.addToPara(this, i, d)
      // Temporary group (not inserted in section).
      this.group = {}
    end,
    move = function(this)
      this.back = parser.params
      return parser.mgroup
    end,
  },
  // param definition
  { match  = '^ *([a-zA-Z0-9_]+) *= *(.*), *$',
    output = function(this, i, key, d)
      private.newParam(this, i, key, d, 'tparam')
    end,
  },
  // list entry
  { match  = '^ *(.*), *$',
    output = function(this, i, value)
      private.newParam(this, i, value, nil, 'lparam')
    end,
  },
  // end of params definition
  { match = '^}',
    output = function(this, i)
      private.newAttrib(this, i, '}')
      private.useGroup(this)
    end,
    move = function(this)
      this.back = nil
      return parser.lua
    end
  },
  { match = '',
    output = function(this)
      private.flushPara(this)
      this.group = {}
    end,
  },
}


// debugging
for k, v in pairs(parser) do
  v.name = k
end

//=============================================== 

// Output individual class definitions
private.output = {}
// Output module with class summary
private.mod_output = {}

private.copyAssets = {}

function private.getTemplate(format)
  const filename = 'template.'+format
  return lub.content(lub.path('|assets/doc/'+filename))
end

//=============================================== HTML TEMPLATE
function private.output:html(template)
  const tmplt = lub.Template(template or private.getTemplate('html'))
  return tmplt:run {this = this, private = private}
end

function private.mod_output.html(module, def, modules)
  const tmplt = lub.Template(def.template or private.getTemplate('html'))
  // Create a pseudo class with classes as methods and class summary
  // as method documentation.
  const this = {
    name = module.name,
    title = module.name,
    fullname = module.name,
    sections = {},
    navigation = modules,
    header = def.header,
    footer = def.footer or DEFAULT_FOOTER,
  }
  const section = {name = modules.name, title = module.name}
  table.insert(this.sections, section)
  for _, klass in ipairs(module) do
    const def = module[klass]
    // A group = class doc
    table.insert(section, {
      klass = def.fullname,
      name  = def.name,
      { text = def.summary },
    })
  end
  setmetatable(this, lib)
  return tmplt:run {this = this, private = private}
end

function private.copyFiles(list, target)
  if list.prepend then
    target = target + '/' + list.prepend
  end
  const filter = list.filter
  if type(filter) == 'string' then
    filter = {filter}
  end
  for _, mpath in ipairs(list) do
    const len = string.len(mpath)
    if filter then
      for _, filt in ipairs(filter) do
        for src in lub.Dir(mpath):glob(filt) do
          const path = string.sub(src, len + 2)
          const trg  = target + '/' + path
          lub.copy(src, trg)
        end
      end
    else
      for src in lub.Dir(mpath):list() do
        const path = string.sub(src, len + 2)
        const trg  = target + '/' + path
        lub.copy(src, trg)
      end
    end
  end
end

function private.copyAssets.html(target)
  const src_base = lub.path '|assets'
  for _, path in ipairs(lib.ASSETS) do
    const src = src_base + '/doc/' + path
    const trg = target + '/' + path
    lub.writeall(trg, lub.content(src))
  end
end

const function escapeHtml(text)
  return gsub(
    gsub(text,
      '<', '&lt;'
    ),
      '>', '&gt;'
    )
end

function private:paraToHtml(para)
  const text = para.text or ''
  if para.klass then
    return "<p class='"+para.klass+"'>"+private.textToHtml(this, text)+"</p>"
  } else if (para.attr then
    // Starting attribute documentation
    if para.attr == '}' then
      // end of definition
      return "<h4 class='entry attrib'>}</h4>"
    else
      const prefix = para.prefix and '<span>.</span>' or ''
      return "<h4 id='"+para.attr+"' class='entry param'>"+prefix+private.textToHtml(this, para.attr)+' = {</h4>'
    end
  } else if (para.heading then
    return "<h4 class='sub-"+para.heading+"'>"+private.textToHtml(this, text)+"</h4>"
  } else if (para.math then
    return "<p>"+private.mathjaxTag(this, para)+"</p>"
  } else if (para.code then
    const tag
    const k =
    match(para.code or '', '^txt( .+)?$')
    if match(para.code, '^txt') then
      tag = "<pre class='"+para.code+"'>"
    else
      tag = "<pre class='prettyprint lang-"+para.code+"'>"
    end
    return tag + 
      private.autoLink(gsub(escapeHtml(text), '%%%%', ''), nil)+
      "</pre>"
  } else if (para.span then
    return private.spanToHtml(this, para)
  } else if (para.list then
    // render list
    return private.listToHtml(this, para)
  else
    const raw = match(text, '^ *<html>(.-)</html>')
    if raw then return raw end
    return "<p>"+private.textToHtml(this, text)+"</p>"
  end
end

function private:spanToHtml(para)
  const ref = ''
  const ref_name
  if para.group then
    if this.fullname ~= para.file then
      ref = para.file + '.html'
    end
    if para.group.fun then
      if ref then
        ref = ref + '#' + para.group.fun
      else
        ref = '#' + para.group.fun
      end
      ref_name = '#' + para.group.fun
    } else if (para.section_name then
      if ref then
        ref = ref + '#' + para.section_name
      else
        ref = '#' + para.section_name
      end
      ref_name = para.section_name
    end
    ref = "<span class='ref'><a href='"+ref+"'>"+ref_name+"</a></span>"
  end
  return "<p class='"+para.span+"'>" +
         ref +
         "<span>"+string.upper(para.span)+"</span> "+
         private.textToHtml(this, para.text)+
         "</p>"
end

function private.autoLink(p, codes)
  // method link lut.Doc#make or lut.Doc.make
  if codes then
    // para auto-link
    p = gsub(p, ' ([a-z]+%.[A-Z]+[a-z][a-zA-Z]+)([#%.])([a-zA-Z_]+)', function(klass, typ, fun)
      table.insert(codes, string.format(" <a href='%s.html#%s'>%s%s%s</a>", klass, fun, klass, typ, fun))
      return CODE+#codes
    end)
  else
    // code auto-link
    p = gsub(p, '([a-z]+%.[A-Z]+[a-z][a-zA-Z]+)([#%.])([a-zA-Z_]+)', function(klass, typ, fun)
      return string.format("<a href='%s.html#%s'>%s%s%s</a>", klass, fun, klass, typ, fun)
    end)
  end
  // auto-link lut.Doc
  p = gsub(p, ' ([a-z]+%.[A-Z]+[a-z0-9][a-zA-Z]*)([%. %(])', " <a href='%1.html'>%1</a>%2")
  return p
end

function private:textToHtml(text)
  // filter content
  const p = escapeHtml(text or '')
  // We could replace textToHtml with a walking parser to avoid double parsing.
  
  // code
  const codes = {}
  p = gsub(p, '%[math%](.-)%[/math%]', function(latex)
    table.insert(codes, private.mathjaxTag(this, {math = 'inline', text = latex}))
    return CODE+#codes
  end)

  p = gsub(p, '`(.-)`', function(code)
    table.insert(codes, '<code>'+code+'</code>')
    return CODE+#codes
  end)
  p = private.autoLink(p, codes)
  // section link #Make or method link #foo
  p = gsub(p, ' #([A-Za-z]+[A-Za-z_-]+)', function(name)
    table.insert(codes, string.format(" <a href='#%s'>%s</a>", name, name:gsub('-', ' ')))
    return CODE+#codes
  end)

  p = gsub(p, '^#([A-Za-z]+[A-Za-z_]+)', function(name)
    table.insert(codes, string.format(" <a href='#%s'>%s</a>", name, name))
    return CODE+#codes
  end)

  // strong
  p = gsub(p, '%*([^\n]-)%*', '<strong>%1</strong>')
  // em
  p = gsub(p, ' _(.-)_ ', ' <em>%1</em> ')
  p = gsub(p, '^_(.-)_', '<em>%1</em>')
  p = gsub(p, '_(.-)_$', '<em>%1</em>')
  // ![Dummy example image](img/box.jpg)
  p = gsub(p, '!%[(.-)%]%((.-)%)', "<img alt='%1' src='%2'/>")
  // link [some text](http://example.com)
  p = gsub(p, '%[([^%]]+)%]%(([^%)]+)%)', function(text, href)
    return "<a href='"+href+"'>"+text+"</a>"
  end)

  if #codes > 0 then
    p = gsub(p, CODE+'([0-9]+)', function(id)
      return codes[tonumber(id)]
    end)
  end
  return p
end

function private:listToHtml(para)
  if para.text then
    // Flush last list element.
    table.insert(para.list, {text = para.text, key = para.key})
    para.text = nil
    para.key  = nil
  end

  if para.list[1].key then
    // definition list
    const out = "<table class='definition'>\n"
    for _, line in ipairs(para.list) do
      out = out + "  <tr><td class='key'>"+
            private.textToHtml(this, line.key) +"</td><td>" +
            private.textToHtml(this, line.text)+"</td></tr>\n"
    end
    return out + '\n</table>'
  else
    // bullet list
    const out = '<ul>\n'
    for _, line in ipairs(para.list) do
      out = out + '<li>' + private.textToHtml(this, line.text) + '</li>\n'
    end
    return out + '</ul>'
  end
end

const function osTry(cmd)
  const ret = os.execute(cmd)
  if ret ~= 0 then
    printf("Could not execute '%s'.", cmd)
  end
  return ret
end

function private:mathjaxTag(para)
  if match(para.text, '^ *$') then return '' end
  if para.math == 'inline' then
    return '\\('+para.text+'\\)'
  else
    return '$$'+para.text+'$$'
  end
end

function private:latexImageTag(para)
  const target = this.target
  const latex = para.text
  const mock = '[latex]'+latex+'[/latex]'
  // Cannot process latex if we do not have an output target
  if not target then return mock end

  const pre, post = '', ''
  const type = match(latex, '^ *\\begin\\{(.-)}')
  if not type or
    (type ~= 'align' and
    type ~= 'equation' and
    type ~= 'itemize') then
    pre = '\\['
    post = '\\]'
  end

  if this.latex_img_i then
    this.latex_img_i = this.latex_img_i + 1
  else
    this.latex_img_i = 1
  end
  const img_name = this.fullname + '.' + this.latex_img_i + '.png'
  const img_id   = 'latex'+this.latex_img_i

  const template = lub.Template(private.LATEX_IMG_TEMPLATE)
  const content = template:run { pre = pre, latex = latex, post = post }
  // Create tmp file
  // write content
  // create image
  // copy image to target/latex/doc.DocTest.1.png
  // return image tag
  const tempf = 'tmpf' + math.random(10000000, 99999999)

  lub.makePath(tempf)
  lub.makePath(target + '/latex')
  lub.writeall(tempf + '/base.tex', content)
  if osTry(string.format('cd %s && latex -interaction=batchmode "base.tex" &> /dev/null', tempf)) ~= 0 then
    lub.rmTree(tempf, true)
    return mock
  end
  if osTry(string.format('cd %s && dvips base.dvi -E -o base.ps &> /dev/null', tempf)) ~= 0 then
    lub.rmTree(tempf, true)
    return mock
  end
  if osTry(string.format('cd %s && convert -density 150 base.ps -matte -fuzz 10%% -transparent "#ffffff" base.png', tempf, target, img_name)) ~= 0 then
    lub.rmTree(tempf, true)
    return mock
  end
  if osTry(string.format('mv %s/base.png %s/latex/%s', tempf, target, img_name)) ~= 0 then
    lub.rmTree(tempf, true)
    return mock
  end
  lub.rmTree(tempf, true)
  return string.format("<code id='c%s' class='prettyprint lang-tex' style='display:none'>%s</code><img class='latex' id='%s' onclick='$(\"#c%s\").toggle()' src='latex/%s'/>", img_id, latex, img_id, img_id, img_name)
end

private.LATEX_IMG_TEMPLATE = `
\documentclass[10pt]{article}
\usepackage[utf8]{inputenc}
\usepackage{amssymb}

\usepackage{amsmath}
\usepackage{amsfonts}
% \usepackage{ulem}     % strikethrough (\sout{...})
\usepackage{hyperref} % links


% shortcuts
\DeclareMathOperator*{\argmin}{arg\,min}
\newcommand{\ve}[1]{\boldsymbol{#1}}
\newcommand{\ma}[1]{\boldsymbol{#1}}
\newenvironment{m}{\begin{bmatrix}}{\end{bmatrix}}

\pagestyle{empty}
\begin{document}
{{pre}}
{{latex}}
{{post}}
\end{document}
}` 
return lib

