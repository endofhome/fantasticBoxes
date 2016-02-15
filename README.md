# FantasticBoxCo

### Approach
This is a frontend-only project so I chose to use the AngularJS framework - I had some familiarity with Angular and a desire to learn more. Tests are written/run using Jasmine, Karma and Protractor.

I have revisited this in mid-February. The first thing I wanted to do was to thin out the controller, which I did by moving most of the logic found there into a service. I gave some of my functions a refractoring treament replacing lengthy switch statements with hash lookups. I also wanted to replace the clunky invalid order alerts with flash messages, which I have done using [angular-flash-alert](https://github.com/sachinchoolur/angular-flash). I have been unable to test this in quite the way I would like - I should be testing at the last point in my service as it calls the angular-flash module but I haven't successfully found a way to do this. Currently my tests finish slightly early.

I wanted to improve the user experience when an option is selected that is currently disallowed. I didn't want the radio buttons to show as being selected on the UI in this situation, but I did want them to call a flash message. After some experimentation, I found a way to do this by manipulating the radio button DOM elements from my Angular service which is absolutely unsatisfactory - it's breaking the [Law of Demeter](https://en.wikipedia.org/wiki/Law_of_Demeter) and also the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle). It's also resulted in 3 of my unit tests being set as pending. I have also introduced an intermittent [$rootScope:inprog] error (printed to the console) which I believe is related to this.

I am currently working on writing my first set of custom directives which will improve the readability of the HTML. Apart from revisiting the issues mentioned above I would also like to revisit the tests, particularly writing some Protractor tests.


### Usage

Prerequisites:
Node.js/NPM/Karma/Protractor installed on your machine.

Clone this repo:
``` git clone git@github.com:forty9er/fantasticBoxes.git ```

Install dependencies:
``` npm install ```

nb. Bower dependencies will be automatically installed.

Spin up the server:
``` http-server ```


### Testing

To run the unit tests from the root directory:
``` karma start test/karma.conf.js ```

To run the feature tests from the root directory:
``` webdriver-manager start ```
``` protractor test/e2e/conf.js ```


### TODO
* Refractoring: 
* Use directives for DOM manipulation.
* More comprehensive unit testing
* More comprehensive feature testing
* Better handling of invalid orders/form validation/no alerts