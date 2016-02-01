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

    it('initialises with box dims and quantity at 0', function() {
      expect(ctrl.width).toEqual(0);
      expect(ctrl.height).toEqual(0);
      expect(ctrl.length).toEqual(0);
      expect(ctrl.quantity).toEqual(0);
    });

    it("initialises with cardboard grade set to '-'", function() {
      expect(ctrl.cardboardGrade).toEqual('-');
    });

    it("initialises with print quality set to '-'", function() {
      expect(ctrl.printQuality).toEqual('-');
    });

    it('initialises with extras set as an empty array and extra flags set to false', function() {
      expect(ctrl.extras).toEqual([]);
      expect(ctrl.handles).toEqual(false);
      expect(ctrl.reinforcedBottom).toEqual(false);
    });

    it('initialises with no brand discount to be applied - discount factor set to 1', function() {
      expect(ctrl.brandDiscount).toEqual(1);
    });
  });

  describe('adding extras', function() {
    it('extras are added to an array of extras when they are selected', function() {
      ctrl.toggleHandles();
      ctrl.toggleReinforcedBottom();
      expect(ctrl.extras).toEqual(jasmine.arrayContaining(['Handles']));
      expect(ctrl.handles).toEqual(true);
      expect(ctrl.extras).toEqual(jasmine.arrayContaining(['Reinforced Bottom']));
      expect(ctrl.reinforcedBottom).toEqual(true);
    });
  });

  describe('calculating the surface area of a box', function() {
    it('returns the surface area', function() {
      ctrl.width = 1;
      ctrl.height = 1;
      ctrl.length = 1;
      expect(ctrl.surfaceArea()).toEqual(6);
    });
  });

  describe('calculating the cost of the cardboard option', function() {
    it('returns the correct cost for "A" grade', function() {
      ctrl.cardboardGrade = 'A';
      expect(ctrl.cardboardCost(1)).toEqual(0.2);
    });
    it('returns the correct cost for "B" grade', function() {
      ctrl.cardboardGrade = 'B';
      expect(ctrl.cardboardCost(1)).toEqual(0.1);
    });
    it('returns the correct cost for "C" grade', function() {
      ctrl.cardboardGrade = 'C';
      expect(ctrl.cardboardCost(1)).toEqual(0.05);
    });
  });

  describe('calculating the cost of the print option', function() {
    it('returns the correct cost for 3-color and no brand discount given', function() {
      ctrl.printQuality = '3-color';
      expect(ctrl.printCost(1)).toEqual(0.2);
      expect(ctrl.brandDiscount).toEqual(1);
    });
    it('returns the correct cost for 2-color and no brand discount given', function() {
      ctrl.printQuality = '2-color';
      expect(ctrl.printCost(1)).toEqual(0.1);
      expect(ctrl.brandDiscount).toEqual(1);
    });
    it('returns the correct cost for black-only and no brand discount given', function() {
      ctrl.printQuality = 'black-only';
      expect(ctrl.printCost(1)).toEqual(0.05);
      expect(ctrl.brandDiscount).toEqual(1);
    });
    it('returns the correct cost for no-printing and no brand discount given', function() {
      ctrl.printQuality = 'no-printing';
      expect(ctrl.printCost(1)).toEqual(0);
      expect(ctrl.brandDiscount).toEqual(1);
    });
    it('sets the discount factor to 0.95 when selecting FantasticBoxCo branding', function() {
      ctrl.printQuality = 'FantasticBoxCo-branding';
      ctrl.printCost(1);
      expect(ctrl.brandDiscount).toEqual(0.95);
    });
  });

  describe('resetting the brand discount', function() {
    it('the discount can be reset', function() {
      ctrl.brandDiscount = 0.70;
      ctrl.resetDiscount();
      expect(ctrl.brandDiscount).toEqual(1);
    });
  });

  describe('cost of extras', function() {
    beforeEach(function() {
      ctrl.quantity = 10;
    });

    describe('calculating the cost of the handles', function() {
      it('handle price is returned for correct quantity ordered', function() {    
        ctrl.handles = true;
        expect(ctrl.handlesCost()).toEqual(1);
      });
    });

    describe('calculating the cost of the reinforced bottom', function() {
      it('reinforcing price is returned for the correct quantity ordered', function() {
        ctrl.reinforcedBottom = true;
        expect(ctrl.reinforcedBottomCost()).toEqual(0.5);
      });
    });
  });

  describe('checking invalid options', function() {
    it('alerts user if they try to order type C cardboard with a box over 2m^2', function() {;
      ctrl.width = 1;
      ctrl.height = 1;
      ctrl.length = 1;
      spyOn(window, 'alert');
      ctrl.validateCardboardGradeC();
      expect(window.alert).toHaveBeenCalledWith('Sorry - "C" type cardboard not available for boxes over 2m^2');
    });
    it('alerts user if they try to order reinforced bottom with type "B" cardboard', function() {;
      ctrl.cardboardGrade = 'B';
      spyOn(window, 'alert');
      ctrl.validateReinforcedBottom();
      expect(window.alert).toHaveBeenCalledWith('Sorry - reinforced bottom only available for type "A" cardboard');
    });
    it('alerts user if they try to order reinforced bottom with type "C" cardboard', function() {;
      ctrl.cardboardGrade = 'C';
      spyOn(window, 'alert');
      ctrl.validateReinforcedBottom();
      expect(window.alert).toHaveBeenCalledWith('Sorry - reinforced bottom only available for type "A" cardboard');
    });
  });

  describe('calculating the grand total', function() {
    beforeEach(function() {
      ctrl.width = 1;
      ctrl.height = 1;
      ctrl.length = 1;
      ctrl.cardboardGrade = 'A';
    });

    it('one box with no discount and no extras', function() {
      ctrl.quantity = 1;
      ctrl.printQuality = '3-color';
      expect(ctrl.calculateTotal()).toEqual('2.40');
    });
    it('two boxes with 5% discount and no extras', function() {
      ctrl.quantity = 2;
      ctrl.printQuality = 'FantasticBoxCo-branding';
      expect(ctrl.calculateTotal()).toEqual('2.28');
    });
    it('three boxes with no discount and handles', function() {
      ctrl.quantity = 3;
      ctrl.printQuality = '3-color';
      ctrl.handles = true;
      expect(ctrl.calculateTotal()).toEqual('7.50');
    });
    it('ten boxes with no discount and reinforced bottoms', function() {
      ctrl.quantity = 10;
      ctrl.printQuality = '3-color';
      ctrl.reinforcedBottom = true;
      expect(ctrl.calculateTotal()).toEqual('24.50');
    });
    it('seven boxes with no discount, handles and reinforced bottoms', function() {
      ctrl.quantity = 7;
      ctrl.printQuality = '3-color';
      ctrl.handles = true;
      ctrl.reinforcedBottom = true;
      expect(ctrl.calculateTotal()).toEqual('17.85');
    });
    it('nine boxes with 5% discount, handles and reinforced bottoms', function() {
      ctrl.quantity = 9;
      ctrl.printQuality = 'FantasticBoxCo-branding';
      ctrl.handles = true;
      ctrl.reinforcedBottom = true;
      expect(ctrl.calculateTotal()).toEqual('11.54');
    });
  });
});