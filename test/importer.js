import '../app/scripts.babel/importer'

const TIMEOUT = 4000
const prefix = 'color:blue'
const strong = 'color:blue;font-weight:bold'
const error = 'color:red'
const jsUrl =
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'
const cssUrl =
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'

describe('Console Importer', function() {
  it('should append to window', function() {
    expect(typeof window.$i).toBe('function')
    expect(typeof console.$i).toBe('function')
  })

  it('should throw error when argument is invalid', function() {
    expect(() => $i({})).toThrowError(
      'Argument should be a string, please check it.'
    )
  })

  it('should not output ugly string', function() {
    expect($i.toString()).toBe('$i')
  })

  describe('import JS URL', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i(jsUrl)
    })

    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${jsUrl}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          `%c[$i]: %c${jsUrl}%c is loaded.`,
          prefix,
          strong,
          ''
        )
        expect(window.$.fn.jquery).toBe('3.1.1')
        done()
      }, TIMEOUT)
    })
  })

  describe('import invalid JS URL', function() {
    const url = 'https://test.js'
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i(url)
    })

    it('should not import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          `%c[$i]: %cFail to load %c${url}%c, is this URL%c%c correct?`,
          error,
          '',
          strong,
          '',
          '',
          ''
        )
        done()
      }, TIMEOUT)
    })
  })

  describe('import CSS URL', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i(cssUrl)
    })

    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${cssUrl}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(getComputedStyle(document.body).boxSizing).toBe('border-box')
        expect(console.log).toHaveBeenCalledWith(
          `%c[$i]: %c${cssUrl}%c is loaded.`,
          prefix,
          strong,
          ''
        )
        done()
      }, TIMEOUT)
    })
  })

  describe('import invalid CSS URL', function() {
    const url = 'https://test.css'

    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i(url)
    })

    it('should not import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          `%c[$i]: %cFail to load %c${url}%c, is this URL%c%c correct?`,
          error,
          '',
          strong,
          '',
          '',
          ''
        )
        done()
      }, TIMEOUT)
    })
  })

  describe('import keyword', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i('jquery')
    })
    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %cSearching for %cjquery%c, please be patient...`,
        prefix,
        '',
        strong,
        ''
      )
      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cjquery%c is loading, please be patient...',
          prefix,
          strong,
          ''
        )
        expect(console.log).toHaveBeenCalledWith(
          jasmine.any(String),
          prefix,
          strong,
          ''
        )
        expect(window.$.fn.jquery).toBeDefined()
        done()
      }, TIMEOUT)
    })
  })

  describe('import keyword not matching completely', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i('jq')
    })
    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %cSearching for %cjq%c, please be patient...`,
        prefix,
        '',
        strong,
        ''
      )
      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cjq%c not found, import %cjquery%c instead.',
          prefix,
          strong,
          '',
          strong,
          ''
        )
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cjquery%c is loading, please be patient...',
          prefix,
          strong,
          ''
        )
        expect(console.log).toHaveBeenCalledWith(
          jasmine.any(String),
          prefix,
          strong,
          ''
        )
        expect(window.$.fn.jquery).toBeDefined()
        done()
      }, TIMEOUT)
    })
  })

  describe('import keyword with no results', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    })
    it('should log error', function(done) {
      setTimeout(() => {
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cSorry, %caaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa%c not found, please try another keyword.',
          error,
          '',
          strong,
          ''
        )
        done()
      }, TIMEOUT)
    })
  })

  describe('import specific version', function() {
    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i('jquery@2')
    })
    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        '%c[$i]: %cjquery@2%c is loading, please be patient...',
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(window.$.fn.jquery[0]).toBe('2')
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cjquery@2%c(https://unpkg.com/jquery@2) is loaded.',
          prefix,
          strong,
          ''
        )
        done()
      }, TIMEOUT)
    })
  })

  it('Remove script tag after injected', function(done) {
    $i(jsUrl)
    expect(document.querySelector(`script[src="${jsUrl}"]`)).toBe(null)
    setTimeout(() => {
      expect(document.querySelector(`script[src="${jsUrl}"]`)).toBe(null)
      done()
    }, TIMEOUT)
  })

  describe('Meta tag', function() {
    it('should remove after executed', function(done) {
      $i(jsUrl)
      expect(document.querySelector('meta[name=referrer]')).toBe(null)
      setTimeout(() => {
        expect(document.querySelector('meta[name=referrer]')).toBe(null)
        done()
      }, TIMEOUT)
    })
    it('should not be changed if existing', function(done) {
      const meta = document.createElement('meta')
      meta.name = 'referrer'
      meta.content = 'origin'
      document.head.appendChild(meta)
      $i(jsUrl)
      expect(document.querySelector('meta[name=referrer]').content).toBe(
        'origin'
      )
      setTimeout(() => {
        expect(document.querySelector('meta[name=referrer]').content).toBe(
          'origin'
        )
        done()
      }, TIMEOUT)
    })
  })
})
