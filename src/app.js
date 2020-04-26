import "../assets/styles/app.scss"

import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Router, Location, globalHistory } from "@reach/router"
import { AnimatePresence } from "framer-motion"
import { useStore } from "./store"
import Article1 from "./pages/Article1"
import Splash from "./pages/Splash"
import Index from "./pages/Index"

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
                                <Index path="/content" key="contents" />
                                <Article1 path="/article-1" key="splash" />
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
