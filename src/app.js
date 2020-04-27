import "../assets/styles/app.scss"

import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Router, Location, globalHistory } from "@reach/router"
import { AnimatePresence } from "framer-motion"
import { useStore } from "./store"
import Article1 from "./pages/Article1"
import Splash from "./pages/Splash"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"



/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function (min = 0, max = 1) {
    return Math.min(Math.max(this, min), max)
}


function App() {
    let setTransitioning = useStore(store => store.setTransitioning)
    let transitioning = useStore(store => store.transitioning)

    useEffect(() => {
        globalHistory.listen(() => setTransitioning(true))
    }, [])

    useEffect(() => {
        document.body.style.overflow = transitioning ? "hidden" : null
    }, [transitioning])

    return (
        <Location>
            {({ location }) => {
                return (
                    <>
                        <AnimatePresence
                            onExitComplete={() => setTransitioning(false)}
                            initial={false}
                        >
                            <Router
                                primary={false}
                                key={location.key}
                                location={location}
                            >
                                <Splash path="/" key="splash" />
                                <Index path="/index" key="index" />
                                <Article1 path="/article-1" key="splash" />
                                <NotFound default key="404" />
                            </Router>
                        </AnimatePresence>
                    </>
                )
            }}
        </Location>
    )
}
 
ReactDOM.render(
    <App />,
    document.getElementById("root")
)