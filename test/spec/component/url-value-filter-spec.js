describe('URL Value filter', function () {
  'use strict'; 

  var $filter;
  var $sugar;

  beforeEach(function () {
    module('voyager.component');
    module('voyager.util');


    inject(function (_$filter_, _sugar_) {
      $filter = _$filter_;
      $sugar = _sugar_;
    });
    
  });

  it('should return a url', function () {
    var foo = 'http://google.com';
    var result = $filter('urlValue')(foo, 'urlValue');
    expect(result).toContain('<a href="http://google.com"');
  });

  it('should return default value of not a url', function () {
    var foo = 'foooo', result;
    result = $filter('urlValue')(foo, 'urlValue');
    expect(result).toBe(foo);
  });

});