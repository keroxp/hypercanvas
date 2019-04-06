all: dist/mod.js dist/browser.js
dist/mod.js: mod.ts
	yarn run tsc
dist/browser.js: dist/mod.js
	yarn run rollup dist/mod.js --name hypercanvas --format iife > dist/browser.js