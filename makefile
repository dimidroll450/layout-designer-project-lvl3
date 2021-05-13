install:
	npm install

lint:
	npx stylelint ./app/scss/**/*.scss
	npx pug-lint ./app/pug/*.pug

watch:
	gulp watch

deploy:
	npx surge ./build/