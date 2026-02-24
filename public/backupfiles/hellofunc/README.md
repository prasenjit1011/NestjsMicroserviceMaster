
npm install -g azure-functions-core-tools@4 --unsafe-perm true
mkdir hello-func
cd hello-func
func init --worker-runtime node --language javascript
func new
func start
az login
az group create --name hello-func-rg --location eastus
az functionapp create \
  --resource-group hello-func-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name hello-func-app-12345 \
  --storage-account mystorage12345



func azure functionapp publish hello-func-app-12345



