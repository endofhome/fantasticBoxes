describe('FantasticBoxCoProductController', function() {
  beforeEach(module('FantasticBoxCo'));

  var ctrl;

  beforeEach(inject(function($controller) {
    ctrl = $controller('FantasticBoxCoProductController');
  }));

  describe('initialisation', function() {
    it('initialises at the first tab', function() {
      expect(ctrl.tab).toEqual(1);
    });
  }); 
});