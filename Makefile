#!/bin/bash

# modified from a superb post found on http://sergimansilla.com/blog/test-coverage-node/

# node executables locally installed
MOCHA=node_modules/.bin/mocha
ISTANBUL=node_modules/.bin/istanbul

# test files to be executed
TESTS=$(shell find test/ -name "*.js" | sort)
# directory where coverage report is stored once generated
REPORTS="coverage-reports"

default:
	@echo "Specify an action."
	@exit 1

coverage: test-once
	@echo "Ensuring lcov is present..."
	@type lcov >/dev/null 2>&1\
	 && echo "lcov present."\
	 || (echo "lcov not present.\nrun apg-get install lcov" && exit 1)
	@echo "Going to instrument code with istanbul..."
	@$(ISTANBUL) instrument --output index-cov index.js
	@$(ISTANBUL) instrument --output examples-cov examples
	@mv index.js index-orig && mv index-cov index.js
	@mv examples examples-orig && mv examples-cov examples
	@echo "Generating coverage report with istanbul..."
	@ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	@echo "Moving report to '$(REPORTS)' and removing instrumented code..."
	@test -d $(REPORTS) || mkdir $(REPORTS)
	@mv lcov.info $(REPORTS)/
	@rm index.js && rm -rf examples
	@mv index-orig index.js && mv examples-orig examples
	@echo "Generating html report..."
	@genhtml $(REPORTS)/lcov.info --output-directory $(REPORTS)/
	@echo "Opening html report..."
	@google-chrome $(REPORTS)/index.html

clean:
	@echo "Deleting '$(REPORTS)' directory"
	@rm -rf $(REPORTS)

test-once:
	@$(MOCHA) -R progress --bail $(TESTS)

test:
	@$(MOCHA) -R spec --bail --watch $(TESTS)

show-test-files:
	@echo $(TESTS) | tr " " "\n"

.PHONY: coverage clean test show-test-files
