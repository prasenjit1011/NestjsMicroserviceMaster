// App.js
import React from "react";
const CustomerApp = React.lazy(() => import("customer/App"));
const ProductApp = React.lazy(() => import("product/App"));

export default function App() {
    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Panel</h2>
            <React.Suspense fallback="Loading Customer App">
                <CustomerApp />
            </React.Suspense>

            <React.Suspense fallback="Loading Product App">
                <ProductApp />
            </React.Suspense>
        </div>
    );
}

// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: "container",
            remotes: {
                customer: "customer@http://localhost:3001/remoteEntry.js",
                product: "product@http://localhost:3002/remoteEntry.js"
            },
            shared: { react: { singleton: true }, "react-dom": { singleton: true } }
        })
    ]
};

// CustomerApp.js
import React, { useState } from "react";
export default function App() {
    const [customers, setCustomers] = useState([]);
    const [name, setName] = useState("");

    const addCustomer = () => {
        setCustomers([...customers, { id: Date.now(), name }]);
        setName("");
    };

    const remove = (id) => {
        setCustomers(customers.filter(c => c.id !== id));
    };

    return (
        <div>
            <h3>Customer CRUD</h3>
            <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                placeholder="Customer name"
            />
            <button onClick={addCustomer}>Add</button>
            <ul>
            {customers.map(c => (
                <li key={c.id}>
                {c.name}
                <button onClick={()=>remove(c.id)}>Delete</button>
                </li>
            ))}
            </ul>

        </div>
    );
}

// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  devServer: { port: 3001 },

  plugins: [
    new ModuleFederationPlugin({
        name: "customer",
        filename: "remoteEntry.js",

        exposes: {
            "./App": "./src/App"
        },

        shared: { react: { singleton: true }, "react-dom": { singleton: true } }
    })
  ]
};

// ProductApp.js
import React, { useState } from "react";

export default function App() {

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), name }]);
    setName("");
  };

  const remove = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div>

      <h3>Product CRUD</h3>

      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Product name"
      />

      <button onClick={addProduct}>Add</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name}
            <button onClick={()=>remove(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  devServer: { port: 3002 },

  plugins: [
    new ModuleFederationPlugin({
      name: "product",
      filename: "remoteEntry.js",

      exposes: {
        "./App": "./src/App"
      },

      shared: { react: { singleton: true }, "react-dom": { singleton: true } }
    })
  ]
};

