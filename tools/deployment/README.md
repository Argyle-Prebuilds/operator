# Argyle Operator Deployment Example

This guide is a collection of scripts that can be used to streamline deployment of this application. These scripts can
be used separately or in conjunction with each other.

## Github Actions

Github Actions can be used to automatically deploy changes to infrastructure as well as deploy the actual software.
Github Actions can be configured to trigger builds on push, pull request merge, manually, scheduled, periodically
(more at: https://docs.github.com/en/actions/reference/events-that-trigger-workflows). A number of secrets have to be
provided for the whole workflow to function properly.

### Required Github Secrets

* `ACTIONS_RUNNER_DEBUG`(optional) - Runner diagnostic logging provides additional log files that contain information
  about how a runner is executing a job (set value to `true`).
* `ACTIONS_STEP_DEBUG` (optional) - Step debug logging increases the verbosity of a job's logs during and after a job's
  execution (set value to `true`). Ref. https://docs.github.com/en/actions/managing-workflow-runs/enabling-debug-logging
* `API_PROD_ENV` - Contents of environment variables file used by the backend, template can be found at:
  `tools/deployment/production/provision/api/remote/api.prod.env.template`
* `FRONTEND_PROD_ENV` - Contents of frontend environment variables, template:
  `tools/deployment/production/provision/api/remote/frontend.prod.env.template`
* `GOOGLE_CREDENTIALS` - Service Account Key created in Google Cloud (json format), this will be used to deploy the
  infrastructure on given GC account
* `SSH_PRIVATE_KEY` - Private SSH key that will be used to connect to the target VM from GH Actions. Can be later used
  to connect to the VM from local computer.
* `TF_API_TOKEN` - Terraform Cloud Organization token, this token is used to save terraform state to the cloud for
  simplicity.

### Configurable parameters

There are additional parameters available in Github Actions, this form is available
under `Actions -> Terraform -> Run workflow`, which is where the deployment can be manually triggered. The whole scheme
for inputs can be found in `.github/workflows/terraform.yml` under `on: -> workflow_dispatch: -> inputs:`.

More detailed description of these inputs:

* `Domain name` - Domain name that the deployment should be configured to use, this domain has to be first registered
  under Google Cloud DNS as a DNS zone (example: `domain.example.com`)
* `DNS zone name` - DNS Zone Name as registered in Google Cloud DNS (example: `domain-example-com`)
* `Google Cloud project ID` - ID of the project in Google Cloud that should be used for this deployment (
  example: `lending-operator-project`)
* `Terraform Cloud Organization` - Organization ID as configured in Terraform Cloud (example: `ExampleInc`)
* `Terraform Cloud workspace` - Workspace ID as configured in Terraform Cloud (example: `my-workspace`)

## Google Cloud

Google Cloud is used to create the actual infrastructure for this example, DNS Service and Compute Engine will be used.
Everything other than creating a DNS zone is taken care of by terraform and Github Actions.

### Prerequisites

1. Create a service account and fetch the `.json` key, paste it to `GOOGLE_CREDENTIALS` Secret in
   Github `Actions secrets`
2. Create a DNS zone for a domain that will be used, domain's NS entries should be configured to match the ones provided
   in the newly created DNS zone.

**Warning! This example does not cover automatic teardown of the infrastructure, it has to be done manually!**

## Terraform Cloud

Terraform is used to deploy the infrastructure via terraform template files which can be found
at `tools/deployment/production/infrastructure/`.

In this case Terraform Cloud is used to simplify state management. States are by default saved on local disk, each
trigger of Github Actions workflow destroys previous build machine and thus the state saved on it. TF Cloud allows to
save and manage that state in a cloud account, which will be required to execute this workflow.

Most of the critical settings are parameterized (`variables.tf` file) and configured via ENV vars prepended
by `TF_VAR_`:

```
TF_VAR_region=us-east1
TF_VAR_zone=us-east1-c
```

This will overwrite defaults found in `variables.tf` file, a good example of this practice can be found
in `.github/workflows/terraform.yml`.

### Prerequisites

1. Create a TF Cloud account (https://www.terraform.io/cloud)
2. Create an Organization
3. Select Organization and go to `Workspaces`, click on `+ New workspace`, complete the form and
   select `API-driven workflow`
4. Select an Organization and go to `Settings -> API Tokens` and create an `Organization Token`, this token should be
   saved in `TF_API_TOKEN` in Github Actions

## Ansible

Ansible is used to actually provision the VM, it's a series of steps that include installing all the requirements,
copying required files, building frontend and creating Docker images. It's a simplified example that demonstrates how
the provision flow should happen.

Whole process can be seen in `tools/deployment/production/provision/api/install.yml`

Ansible scripts can be additionally parameterized via runtime parameters `--extra-vars "domain_name=domain.example.com"`
, more at https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#defining-variables-at-runtime