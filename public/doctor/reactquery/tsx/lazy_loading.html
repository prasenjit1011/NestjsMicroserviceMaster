import React, {  lazy,  Suspense,  useState } from "react";
import ReactDOM from "react-dom/client";

const UserProfile = lazy(() => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                default: function UserProfileComponent() {
                    return (<h2>User Profile Component</h2>);
                }
            });
        }, 2000);
    });
});

function App() {
    const [showComponent, setShowComponent] = useState(false);
    function loadComponent() {
        setShowComponent(true);
    }
    return (
        <div    style={{    padding: "40px",    fontFamily: "Arial"    }}    >
            <button    onClick={loadComponent}    style={{    padding: "10px 20px",    cursor: "pointer"    }}    >
                Load Component
            </button>

            {
                showComponent && (
                    <Suspense
                        fallback={
                            <h3>
                                Loading Component...
                            </h3>
                        }
                    >

                        <UserProfile />

                    </Suspense>

                )
            }

        </div>

    );

}

/*
----------------------------------------
ReactDOM Render
----------------------------------------
*/

const root = ReactDOM.createRoot(
    document.getElementById("root")
);

root.render(
    <App />
);