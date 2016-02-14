(function () {
  "use strict";

  fantasticBoxCo.controller('FantasticBoxCoProductController', ['Order', function(Order) {  
    
    var self = this;
    self.tab = 1;
    self.order = Order;

  }]);
}());