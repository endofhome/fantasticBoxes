# FantasticBoxCo

### Approach
I used AngularJS, tests are written/run using Jasmine, Karma and Protractor.


### Usage

Prerequisites:
Node.js/NPM/Karma/Protractor installed on your machine.

Clone this repo:
``` git clone <clone URL> ```

Install dependencies:
``` npm install ```
Bower dependencies will be automatically installed.

Spin up the server:
``` http-server ```

### Testing

To run the unit tests from the root directory:
``` karma start test/karma.conf.js ```

To run the feature tests from the root directory:
``` webdriver-manager start ```
``` protractor test/e2e/conf.js ```


### TODO
* Refractoring: 
* Use directives for DOM manipulation and thin out controller
* Use key/value pairs instead of switch statements
* More comprehensive unit testing
* More comprehensive feature testing
* Better handling of invalid orders/form validation/no alerts