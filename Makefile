run:
	npx turbo dev

deploy_preprod:
	fly deploy --config ./fly.preprod.toml

deploy_prod:
	fly deploy --config ./fly.prod.toml
