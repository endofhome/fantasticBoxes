describe('service: Order', function() {

  var order;

  beforeEach(function(){
    module('FantasticBoxCo');
  });

  beforeEach(inject(function(Order) {
    order = Order;
  }));

  describe('initialisation', function() {
    it('initialises with box dims and quantity at 0', function() {
      expect(order.width).toEqual(0);
      expect(order.height).toEqual(0);
      expect(order.length).toEqual(0);
      expect(order.quantity).toEqual(0);
    });

    it("initialises with cardboard grade set to '-'", function() {
      expect(order.cardboardGrade).toEqual('-');
    });

    it("initialises with print quality set to '-'", function() {
      expect(order.printQuality).toEqual('-');
    });

    it('initialises with extras set as an empty array and extra flags set to false', function() {
      expect(order.extras).toEqual([]);
      expect(order.handles).toEqual(false);
      expect(order.reinforcedBottom).toEqual(false);
    });

    it('initialises with no brand discount to be applied - discount factor set to 1', function() {
      expect(order.brandDiscount).toEqual(1);
    });
  });

  describe('adding extras', function() {
    it('extras are added to an array of extras when they are selected', function() {
      order.toggleHandles();
      order.toggleReinforcedBottom();
      expect(order.extras).toEqual(jasmine.arrayContaining(['Handles']));
      expect(order.handles).toEqual(true);
      expect(order.extras).toEqual(jasmine.arrayContaining(['Reinforced Bottom']));
      expect(order.reinforcedBottom).toEqual(true);
    });
  });

  describe('calculating the surface area of a box', function() {
    it('returns the surface area', function() {
      order.width = 1;
      order.height = 1;
      order.length = 1;
      expect(order.surfaceArea()).toEqual(6);
    });
  });

  describe('calculating the cost of the cardboard option', function() {
    it('returns the correct cost for "A" grade', function() {
      order.cardboardGrade = 'A';
      expect(order.cardboardCost(1)).toEqual(0.2);
    });
    it('returns the correct cost for "B" grade', function() {
      order.cardboardGrade = 'B';
      expect(order.cardboardCost(1)).toEqual(0.1);
    });
    it('returns the correct cost for "C" grade', function() {
      order.cardboardGrade = 'C';
      expect(order.cardboardCost(1)).toEqual(0.05);
    });
  });

  describe('calculating the cost of the print option', function() {
    it('returns the correct cost for 3-color and no brand discount given', function() {
      order.printQuality = '3-color';
      expect(order.printCost(1)).toEqual(0.2);
      expect(order.brandDiscount).toEqual(1);
    });
    it('returns the correct cost for 2-color and no brand discount given', function() {
      order.printQuality = '2-color';
      expect(order.printCost(1)).toEqual(0.1);
      expect(order.brandDiscount).toEqual(1);
    });
    it('returns the correct cost for black-only and no brand discount given', function() {
      order.printQuality = 'black-only';
      expect(order.printCost(1)).toEqual(0.05);
      expect(order.brandDiscount).toEqual(1);
    });
    it('returns the correct cost for no-printing and no brand discount given', function() {
      order.printQuality = 'no-printing';
      expect(order.printCost(1)).toEqual(0);
      expect(order.brandDiscount).toEqual(1);
    });
    it('sets the discount factor to 0.95 when selecting FantasticBoxCo branding', function() {
      order.printQuality = 'FantasticBoxCo-branding';
      order.printCost(1);
      expect(order.brandDiscount).toEqual(0.95);
    });
  });

  describe('resetting the brand discount', function() {
    it('the discount can be reset', function() {
      order.brandDiscount = 0.70;
      order.resetDiscount();
      expect(order.brandDiscount).toEqual(1);
    });
  });

  describe('cost of extras', function() {
    beforeEach(function() {
      order.quantity = 10;
    });

    describe('calculating the cost of the handles', function() {
      it('handle price is returned for correct quantity ordered', function() {    
        order.handles = true;
        expect(order.handlesCost()).toEqual(1);
      });
    });

    describe('calculating the cost of the reinforced bottom', function() {
      it('reinforcing price is returned for the correct quantity ordered', function() {
        order.reinforcedBottom = true;
        expect(order.reinforcedBottomCost()).toEqual(0.5);
      });
    });
  });

  describe('checking invalid options with error messages', function() {

    beforeEach(function(){
      spyOn(order, 'errorMessage');
    });

    xit('errorMessage is called if user tries to order type C cardboard with a box over 2m^2', function() {
      order.width = 1;
      order.height = 1;
      order.length = 1;   
      order.validateCardboardGradeC();
      expect(order.cardboardGrade !== 'C');
      expect(order.errorMessage).toHaveBeenCalledWith('Sorry - "C" grade cardboard not available for boxes over 2m^2');
    });
    xit('errorMessage is called if user tries to order reinforced bottom with type "B" cardboard', function() {
      order.cardboardGrade = 'B';
      order.validateReinforcedBottom();
      expect(order.errorMessage).toHaveBeenCalledWith('Sorry - reinforced bottom only available for "A" grade cardboard');
    });
    xit('alerts user if they try to order reinforced bottom with type "C" cardboard', function() {
      order.cardboardGrade = 'C';
      order.validateReinforcedBottom();
      expect(order.errorMessage).toHaveBeenCalledWith('Sorry - reinforced bottom only available for "A" grade cardboard');
    });
  });

  describe('invalid reinforced bottom revision', function() {

    beforeEach(function() {
      order.extras =  ['Handles', 'Reinforced Bottom'];
    });

    it('reinforced bottom is removed from order if user revises cardboard grade to B', function() {
      order.cardboardGrade = 'B';
      order.validateNewCardboardGrade();
      expect(order.reinforcedBottom).toEqual(false);
      expect(order.extras).toEqual(['Handles']);
    });
    it('reinforced bottom is removed from order if user revises cardboard grade to C', function() {
      order.cardboardGrade = 'C';
      order.validateNewCardboardGrade();
      expect(order.reinforcedBottom).toEqual(false);
      expect(order.extras).toEqual(['Handles']);
    });
  });

  describe('invalid cardboard grade revision', function() {
    it('cardboard grade C is removed if user revises box size to over 2m^2', function() {
      order.cardboardGrade = 'C';
      order.width = 1;
      order.height = 1;
      order.length = 1;
      order.validateNewSize();
      expect(order.cardboardGrade).toEqual('-');   
    });
  });

  describe('calculating the grand total', function() {
    beforeEach(function() {
      order.width = 1;
      order.height = 1;
      order.length = 1;
      order.cardboardGrade = 'A';
    });
    it('one box with no discount and no extras', function() {
      order.quantity = 1;
      order.printQuality = '3-color';
      expect(order.calculateTotal()).toEqual('2.40');
    });
    it('two boxes with 5% discount and no extras', function() {
      order.quantity = 2;
      order.printQuality = 'FantasticBoxCo-branding';
      expect(order.calculateTotal()).toEqual('2.28');
    });
    it('three boxes with no discount and handles', function() {
      order.quantity = 3;
      order.printQuality = '3-color';
      order.handles = true;
      expect(order.calculateTotal()).toEqual('7.50');
    });
    it('ten boxes with no discount and reinforced bottoms', function() {
      order.quantity = 10;
      order.printQuality = '3-color';
      order.reinforcedBottom = true;
      expect(order.calculateTotal()).toEqual('24.50');
    });
    it('seven boxes with no discount, handles and reinforced bottoms', function() {
      order.quantity = 7;
      order.printQuality = '3-color';
      order.handles = true;
      order.reinforcedBottom = true;
      expect(order.calculateTotal()).toEqual('17.85');
    });
    it('nine boxes with 5% discount, handles and reinforced bottoms', function() {
      order.quantity = 9;
      order.printQuality = 'FantasticBoxCo-branding';
      order.handles = true;
      order.reinforcedBottom = true;
      expect(order.calculateTotal()).toEqual('11.54');
    });
  });
});