import "../assets/styles/app.scss"
import "./polyfill"

import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Router, Location, globalHistory } from "@reach/router"
import { AnimatePresence } from "framer-motion"
import { useStore } from "./store"
import Article1 from "./pages/Article1"
import Article2 from "./pages/Article2"
import Splash from "./pages/Splash"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"

history.scrollRestoration = "manual" 

function App() {
    let setTransitioning = useStore(store => store.setTransitioning)
    let setAction = useStore(store => store.setAction)
    let transitioning = useStore(store => store.transitioning)

    useEffect(() => {
        globalHistory.listen(({ action }) => {
            setAction(action)
            setTransitioning(true)
        })
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
                                <Splash path="/" />
                                <Index path="/index" />
                                <Article1 path="/article-1" />
                                <Article2 path="/article-2" />
                                <NotFound default />
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