import "../assets/styles/app.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Router, Location } from "@reach/router"
import { AnimatePresence } from "framer-motion"
import Home from "./pages/Home"
import Index from "./pages/Index"
import Article1 from "./pages/Article1"


ReactDOM.render(
    <Location>
        {({ location }) => (
            <AnimatePresence initial={false}>
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
        )}
    </Location>,
    document.getElementById("root")
)