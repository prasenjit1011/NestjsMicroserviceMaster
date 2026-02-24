npm install -g azure-functions-core-tools@4 --unsafe-perm true

func --version
func init --worker-runtime javascript
func init . --javascript


# make a folder and init an Azure Functions project
mkdir my-azure-func && cd my-azure-func
# init a JavaScript project for Functions

# create a single HTTP-triggered function named "products"
func new --name products --template "HTTP trigger" --authlevel "anonymous"




# make a folder and init an Azure Functions project
mkdir my-azure-func && cd my-azure-func
# init a JavaScript project for Functions
func init --javascript

# create a single HTTP-triggered function named "products"
func new --name products --template "HTTP trigger" --authlevel "anonymous"
