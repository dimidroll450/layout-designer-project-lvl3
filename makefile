install:
	npm install

lint:
	npx stylelint ./app/scss/**/*.scss
	npx htmlhint ./app/*.html

watch:
	gulp watch

deploy:
	npx surge ./build/