# Bridge from Juno to Starknet for carbonABLE tokens

## Developpment

Create an env file

```
JUNO_ADMIN_ADDRESS=changeme
STARKNET_ADMIN_ADDRESS=changeme
API_URL=http://localhost:8080
```

Run project locally

```shell
make run
```

## Deployment

Make sure you have [flyctl](https://fly.io/docs/hands-on/install-flyctl/) installed.

To deploy **preprod** env:

```shell
make deploy_preprod
```

To deploy **prod** env:

```shell
make deploy_prod
```
