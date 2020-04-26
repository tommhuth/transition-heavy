
import React, { useRef, useEffect, useState } from "react"
import { useLocation } from "@reach/router"
import { motion } from "framer-motion"
import { useAnimationFrame, throttle } from "../utils"
import Config from "../Config"
import ResizeObserver from "resize-observer-polyfill"


const transition = {
    duration: Config.TRANSITION_DURATION / 1000,
    ease: [0.76, 0, 0.24, 1]
}
const variants = {
    initial(transitionType) { 
        if (transitionType === "bottom") {
            return {
                top: "100vh",
                paddingTop: 100
            }
        } else if (transitionType === "top") {
            return {
                top: 0,
                height: "0vh",
                zIndex: 10,
                minHeight: 0,
                transition
            }
        } else {
            return {}
        }
    },
    exit(transitionType) {
        if (transitionType === "bottom") {
            return {
                top: -100,
                transition
            }
        } else if (transitionType === "top") {
            return {
                top: 100,
                transition
            }
        } else {
            return {}
        }
    },
    enter(transitionType) {
        if (transitionType === "bottom") {
            return {
                top: 0,
                paddingTop: 0,
                transition
            }
        } else if (transitionType === "top") {
            return {
                top: 0,
                height: "100vh",
                paddingTop: 0,
                transitionEnd: {
                    height: null,
                    zIndex: null,
                    minHeight: null
                },
                transition
            } 
        } else {
            return {}
        }
    }
}

export default function Page({ children, backgroundColor = "white" }) {
    let main = useRef()
    let location = useLocation()
    let { transitionType } = location.state || {}
    let y = useRef(0)
    let targetY = useRef(0)
    let [height, setHeight] = useState(location.pathname)
    let [owner] = useState(location.key)

    useEffect(() => {
        document.body.style.height = height + "px"
        document.body.style.backgroundColor = backgroundColor
    }, [height])

    useAnimationFrame(() => {
        y.current += (targetY.current - y.current) * .125

        main.current.style.transform = `translateY(${y.current}px) translateZ(0)`
        main.current.style.backgroundColor = `translateY(${y.current}px) translateZ(0)`
    })

    useEffect(() => {
        let listener = throttle(entries => {
            setHeight(entries[0].contentRect.height)
        }, 500)
        let resizer = new ResizeObserver(listener)

        resizer.observe(main.current)

        return () => resizer.disconnect()
    }, [])

    useEffect(() => {
        let onScroll = () => {
            if (owner === location.key) {
                targetY.current = (-window.scrollY)
            }
        }
        let { height } = main.current.getBoundingClientRect()

        setHeight(height)

        window.addEventListener("scroll", onScroll, { passive: true })

        return () => window.removeEventListener("scroll", onScroll, { passive: true })
    }, [location.key, owner])

    return (
        <motion.main
            className="page"
            ref={main}
            custom={transitionType}
            exit={"exit"}
            variants={variants}
            animate={"enter"}
            initial={"initial"}
        >
            {children}
        </motion.main>
    )
}