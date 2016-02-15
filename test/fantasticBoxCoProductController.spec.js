describe('FantasticBoxCoProductController', function() {

  var ctrl;

  beforeEach(function(){
    module('FantasticBoxCo');
  });

  beforeEach(inject(function($controller) {
    ctrl = $controller('FantasticBoxCoProductController');
  }));

  describe('initialisation', function() {
    it('initialises at the first tab', function() {
      expect(ctrl.tab).toEqual(1);
    });
  });
});