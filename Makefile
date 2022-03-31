TS_NODE = node --experimental-specifier-resolution=node --loader=ts-node/esm/transpile-only

dev: install bootstrap
	pnpx devkit dev sg

build.sg: install bootstrap
	pnpx devkit build sg

release:
	pnpx changeset

release.version-packages:
	pnpx changeset version
	CI=false pnpm install --no-frozen-lockfile

release.from-packages:
	pnpx changeset publish

fmt:
	pnpx prettier --write "@querycap*/{,**/}{,**/}*.{ts,tsx,json,md}"

tsc:
	pnpx tsc --incremental --diagnostics -p tsconfig.json

test: install build jest

jest:
	NODE_OPTIONS=--experimental-vm-modules pnpx jest --coverage

cleanup:
	pnpm -r --filter=!webappkit exec rm -rf ./dist

build: bootstrap.monobundle build.babel-plugins
	pnpm -r --filter=!webappkit exec ../../node_modules/.bin/monobundle

pkg:
	devkit build --prod sg

preview:
	devkit preview sg

pkg.gh-page: test
	pnpx devkit build --prod sg gh-page
	cp ./public/web-sg/index.html  ./public/web-sg/404.html

build.babel-plugins:
	pnpm \
 		--filter='@querycap-ui/css-aliases' \
 		--filter='@querycap-ui/babel-preset-css-prop' \
 		exec monobundle

install:
	pnpm i

dep:
	pnpm up -r --latest
	pnpm i

bootstrap.monobundle:
	$(TS_NODE) ./@querycap-dev/monobundle/bin.ts ./@querycap-dev/monobundle

bootstrap:
	$(TS_NODE) ./@querycap-dev/monobundle/bin.ts ./@querycap-dev/devkit
	$(TS_NODE) ./@querycap-dev/monobundle/bin.ts ./@querycap-dev/vite-presets
