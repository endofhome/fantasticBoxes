(function () {
  "use strict";

  fantasticBoxCo.controller('FantasticBoxCoProductController', ['$window', function($window) {  
    
    this.tab = 1;
    this.width = 0;
    this.height = 0;
    this.length = 0;
    this.quantity = 0;
    this.cardboardGrade = '-';
    this.printQuality = '-';
    this.extras = [];
    this.handles = false;
    this.reinforcedBottom = false;
    this.brandDiscount = 1;

    this.validateCardboardGradeC = function() {
      if (this.surfaceArea() < 2) {
        this.cardboardGrade = 'C';
      } else {
        this.errorMessage('Sorry - "C" type cardboard not available for boxes over 2m^2');
      }
    };

    this.validateReinforcedBottom = function() {
      if (this.cardboardGrade === 'A') {
        this.toggleReinforcedBottom();
      } else {
        this.errorMessage('Sorry - reinforced bottom only available for type "A" cardboard');
      }
    };

    this.errorMessage = function(msg) {
      $window.alert(msg);
    };

    this.toggleHandles = function() {
      var h = 'Handles';
      var index;
      if (!this.handles){
        this.extras.push(h);
        this.handles = true;
      } else {
        index = this.extras.indexOf(h);
        this.extras.splice(index, 1);
        this.handles = false;
      }
    };

    this.toggleReinforcedBottom = function() {
      var rb = 'Reinforced Bottom';
      var index;
      if (!this.reinforcedBottom){
        this.extras.push(rb);
        this.reinforcedBottom = true;
      } else {
        index = this.extras.indexOf(rb);
        this.extras.splice(index, 1);
        this.reinforcedBottom = false;
      }
    };

    this.surfaceArea = function() {
      return (2*(this.height*this.width))+(2*(this.height*this.length))+(2*(this.width*this.length));
    };

    this.cardboardCost = function(surfaceArea) {
      var cardboardOptions = {
        'A': 0.2, 
        'B': 0.1, 
        'C': 0.05
      };
      return (cardboardOptions[this.cardboardGrade] * surfaceArea)
    };

    this.printCost = function(surfaceArea) {
      var printOptions = {
        '3-color':                 0.2,
        '2-color':                 0.1,
        'black-only':              0.05,
        'no-printing':             0,
        'FantasticBoxCo-branding': 0
      };
      this.resetDiscount();
      if (this.printQuality === 'FantasticBoxCo-branding') {
        this.brandDiscount = 0.95;
      };
      return (printOptions[this.printQuality] * surfaceArea);
    };

    this.resetDiscount = function() {
      this.brandDiscount = 1;
    };

    this.handlesCost = function() {
      if (this.handles === true) {
        return (this.quantity * 0.10);
      }
      return 0;
    };

    this.reinforcedBottomCost = function() {
      if (this.reinforcedBottom === true) {
        return (this.quantity * 0.05);
      }
      return 0;
    };

    this.calculateTotal = function() {
      var quantity = this.quantity;
      var surfaceArea = this.surfaceArea();
      var cardboardUnitTotal = (this.cardboardCost(surfaceArea));
      var printUnitTotal = (this.printCost(surfaceArea));
      var discount = this.brandDiscount;
      var total = ((quantity * (cardboardUnitTotal + printUnitTotal)) + this.handlesCost() + this.reinforcedBottomCost()) * discount;
      return total.toFixed(2);
    };

  }]);
}());