install:
	npm install

lint:
	npx stylelint ./app/scss/**/*.scss
	npx htmlhint ./app/pug/*.html

watch:
	gulp watch

deploy:
	npx surge ./build/