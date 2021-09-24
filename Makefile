dev: install install.devkit
	pnpx devkit dev sg

release:
	pnpx changeset

release.version-packages:
	pnpx changeset version
	CI=false pnpm install

release.from-packages:
	pnpx changeset publish

fmt:
	pnpx prettier --write "@querycap*/{,**/}{,**/}*.{ts,tsx,json,md}"

tsc:
	pnpx tsc --incremental --diagnostics -p tsconfig.json

test: install build jest

jest:
	pnpx jest --coverage

cleanup:
	pnpm -r --filter=!webappkit exec rm -rf ./dist

build: install.monobundle build.babel-plugins
	pnpm -r --filter=!webappkit exec ../../node_modules/.bin/monobundle

pkg:
	devkit build --prod sg

pkg.gh-page: test
	pnpx devkit build --prod sg gh-page
	cp ./public/web-sg/index.html  ./public/web-sg/404.html

build.babel-plugins:
	pnpm --filter='@querycap-ui/core.macro' --filter='@querycap-ui/css-aliases' exec ../../node_modules/.bin/monobundle

install:
	pnpm i

install.monobundle:
	pnpx ts-node ./@querycap-dev/monobundle/bin.ts ./@querycap-dev/monobundle

install.devkit:
	pnpx ts-node ./@querycap-dev/monobundle/bin.ts ./@querycap-dev/devkit

install.pnpm:
	npm install --force -g pnpm
