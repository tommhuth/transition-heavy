import "../assets/styles/app.scss"

import React, { useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { Router, Location } from "@reach/router"
import { AnimatePresence } from "framer-motion"
import Home from "./pages/Home"
import Index from "./pages/Index"
import Article1 from "./pages/Article1"
import { useStore } from "./store"  

function App() { 
    let setNavigating = useStore(store => store.setNavigating)

    return (
        <Location>
            {({ location }) => (
                <> 
                    <AnimatePresence 
                        onExitComplete={()=> setNavigating(false)}
                        initial={false}
                    >
                        <Router
                            primary={false}
                            key={location.key} 
                            location={location}
                        >
                            <Home path="/" />
                            <Index path="/table-of-contents" />
                            <Article1 path="/article-1" />
                        </Router>
                    </AnimatePresence>
                </>
            )}
        </Location>
    )
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)