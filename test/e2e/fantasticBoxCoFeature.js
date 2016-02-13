describe('FantasticBoxCo Quote system', function() {

  beforeEach(function() {
    browser.get('http://localhost:8080');
  })

  describe('initialisation', function() {

    it('has a title', function() {
      expect(browser.getTitle()).toEqual('FantasticBoxCo');
    });
  });

});