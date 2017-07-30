import $i from '../app/scripts.babel/importer'

const TIMEOUT = 8000
const prefix = 'color:blue'
const strong = 'color:blue;font-weight:bold'
const error = 'color:red'

describe('Console Importer', function() {
  beforeEach(function() {
    window.$i = $i
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
  })

  // describe('append', function() {
  //   it('should be append to window', function() {
  //     expect(typeof window.$i).toBe('function');
  //   });
  // });

  describe('import JS URL', function() {
    const url = `https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js`

    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i(url)
    })

    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(document.querySelector(`script[src="${url}"]`)).toBe(null)
        expect(window.$.fn.jquery).toBe('3.1.1')
        expect(console.log).toHaveBeenCalledWith(
          `%c[$i]: %c${url}%c is loaded.`,
          prefix,
          strong,
          ''
        )
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
        expect(document.querySelector(`script[src="${url}"]`)).toBe(null)
        // expect(console.log).toHaveBeenCalledWith(
        //   `%c[$i]: %cFail to load %c${url}%c, is this URL%c%c correct?`,
        //   error,
        //   '',
        //   strong,
        //  '',
        //   '',
        //   ''
        // )
        done()
      }, TIMEOUT)
    })
  })

  describe('import CSS URL', function() {
    const url =
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'

    beforeEach(function() {
      spyOn(console, 'log').and.callThrough()
      $i(url)
    })

    it('should import', function(done) {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
      setTimeout(() => {
        expect(document.querySelector(`link[src="${url}"]`)).toBe(null)
        // expect(getComputedStyle(document.body).boxSizing).toBe('border-box');
        // expect(console.log).toHaveBeenCalledWith(
        //   `%c[$i]: %c${url}%c is loaded.`,
        //   prefix,
        //   strong,
        //   ''
        // );
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

    it('should not import', function() {
      expect(console.log).toHaveBeenCalledWith(
        `%c[$i]: %c${url}%c is loading, please be patient...`,
        prefix,
        strong,
        ''
      )
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
        expect(window.$.fn.jquery).toBeDefined()
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cjquery%c is loading, please be patient...',
          prefix,
          strong,
          ''
        )
        // expect(console.log).toHaveBeenCalledWith(
        //   jasmine.any(),
        //   prefix,
        //   strong,
        //   ''
        // );
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

        expect(window.$.fn.jquery).toBeDefined()
        expect(console.log).toHaveBeenCalledWith(
          '%c[$i]: %cjquery%c is loading, please be patient...',
          prefix,
          strong,
          ''
        )
        // expect(console.log).toHaveBeenCalledWith(
        //   jasmine.any(),
        //   prefix,
        //   strong,
        //   ''
        // );
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
})
