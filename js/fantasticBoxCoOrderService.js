(function () {
  "use strict";

  fantasticBoxCo.service('Order', ['Flash', function(Flash) {  

    var self = this;
    self.width = 0;
    self.height = 0;
    self.length = 0;
    self.quantity = 0;
    self.cardboardGrade = '-';
    self.printQuality = '-';
    self.extras = [];
    self.handles = false;
    self.reinforcedBottom = false;
    self.brandDiscount = 1;
    self.errorId = 1;

    self.validateNewSize = function() {
      if ((self.surfaceArea() >= 2) && (self.cardboardGrade === 'C')) {
        self.cardboardGrade = '-';
      }
    };

    self.validateCardboardGradeC = function() {
      if (self.surfaceArea() < 2) {
        self.cardboardGrade = 'C';
      } else {
        resetCardboardSelectorButton();
        self.cardboardGrade = '-';
        self.errorMessage('Sorry - "C" grade cardboard not available for boxes over 2m^2');
      }
    };

    self.validateNewCardboardGrade = function() {
      if (self.cardboardGrade !== 'A') {
        self.reinforcedBottom = false;
        removeReinforcedBottom();
      }
    };

    self.validateReinforcedBottom = function() {
      if (self.cardboardGrade === 'A') {
        self.toggleReinforcedBottom();
      } else {
        resetReinforcedBottomSelectorButton();
        self.errorMessage('Sorry - reinforced bottom only available for "A" grade cardboard');
      }
    };

    self.errorMessage = function(msg) {
      self.errorId = Flash.create('warning', msg, 3000);
    };

    self.dismissFlashMsg = function() {
      Flash.dismiss(self.errorId);
    };

    self.toggleHandles = function() {
      var h = 'Handles',
          index = self.extras.indexOf(h);
      if (!self.handles){
        self.extras.push(h);
        self.handles = true;
      } else {
        self.extras.splice(index, 1);
        self.handles = false;
      }
    };

    self.toggleReinforcedBottom = function() {
      var rb = 'Reinforced Bottom',
          index = self.extras.indexOf(rb);
      if (!self.reinforcedBottom){
        self.extras.push(rb);
        self.reinforcedBottom = true;
      } else {
        self.extras.splice(index, 1);
        self.reinforcedBottom = false;
      }
    };

    self.surfaceArea = function() {
      return (2*(self.height*self.width))+(2*(self.height*self.length))+(2*(self.width*self.length));
    };

    self.cardboardCost = function(surfaceArea) {
      var cardboardOptions = {
        'A': 0.2, 
        'B': 0.1, 
        'C': 0.05
      };
      return (cardboardOptions[self.cardboardGrade] * surfaceArea);
    };

    self.printCost = function(surfaceArea) {
      var printOptions = {
        '3-color':                 0.2,
        '2-color':                 0.1,
        'black-only':              0.05,
        'no-printing':             0,
        'FantasticBoxCo-branding': 0
      };
      self.resetDiscount();
      if (self.printQuality === 'FantasticBoxCo-branding') {
        self.brandDiscount = 0.95;
      }
      return (printOptions[self.printQuality] * surfaceArea);
    };

    self.resetDiscount = function() {
      self.brandDiscount = 1;
    };

    self.handlesCost = function() {
      if (self.handles === true) {
        return (self.quantity * 0.10);
      }
      return 0;
    };

    self.reinforcedBottomCost = function() {
      if (self.reinforcedBottom === true) {
        return (self.quantity * 0.05);
      }
      return 0;
    };

    self.calculateTotal = function() {
      var quantity = self.quantity,
          surfaceArea = self.surfaceArea(),
          cardboardUnitTotal = (self.cardboardCost(surfaceArea)),
          printUnitTotal = (self.printCost(surfaceArea)),
          discount = self.brandDiscount,
          total = ((quantity * (cardboardUnitTotal + printUnitTotal)) + self.handlesCost() + self.reinforcedBottomCost()) * discount;
      return total.toFixed(2);
    };

    var resetCardboardSelectorButton = function() {
      document.step2Form.cardboardSelectorC.checked=false;
    };

    var resetReinforcedBottomSelectorButton = function() {
      document.step4Form.reinforcedBottom.checked=false;
    };

    var removeReinforcedBottom = function() {
      var index = self.extras.indexOf('Reinforced Bottom');
      self.extras.splice(index, 1);
    };

  }]);
}());