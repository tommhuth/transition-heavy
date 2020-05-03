
import React, { useRef, useEffect, useState } from "react"
import { useLocation, navigate, globalHistory } from "@reach/router"
import { motion, useSpring } from "framer-motion"
import { useAnimationFrame, throttle } from "../utils"
import Config from "../Config"
import { useStore } from "../store"
import ResizeObserver from "resize-observer-polyfill"
import Only from "./Only"

const urls = [
    "/", "/index", "/article-1"
]
const transition = {
    duration: Config.TRANSITION_DURATION / 1000,
    ease: [0.76, 0, 0.24, 1]
}

export { transition }

const variants = {
    initial({ transitionType, action, adjacentY }) {
        if (action !== "PUSH") {
            return {}
        }

        if (transitionType === "bottom") {
            return {
                top: window.innerHeight,
                paddingTop: 100
            }
        } else if (transitionType === "top") {
            return {
                top: 0,
                height: 0,
                zIndex: 10,
                minHeight: 0,
                transition
            }
        } else if (transitionType === "adjacent") {
            return {
                top: adjacentY,
                zIndex: 10,
                transition
            }
        } else {
            return {}
        }
    },
    exit({ transitionType, action }) {
        if (action !== "PUSH") {
            return {}
        }

        if (transitionType === "bottom" || transitionType === "adjacent") {
            return {
                top: -300,
                transition
            }
        } else if (transitionType === "top") {
            return {
                top: 300,
                transition
            }
        } else {
            return {}
        }
    },
    enter({ transitionType, action }) {
        if (action !== "PUSH") {
            return {}
        }

        if (transitionType === "bottom" || transitionType === "adjacent") {
            return {
                top: 0,
                paddingTop: 0,
                transition
            }
        } else if (transitionType === "top") {
            return {
                top: 0,
                height: window.innerHeight,
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


function getUrl(current, direction = 1) {
    return urls[urls.indexOf(current) + direction] || null
}


export default function Page({
    children,
    backgroundColor = "white",
    path,
    hasAdjacent
}) {
    let main = useRef()
    let location = useLocation()
    let { transitionType, adjacentY } = location.state || {}
    let y = useRef(0)
    let targetY = useRef(0)
    let [height, setHeight] = useState(location.pathname)
    let [owner] = useState(location.key)
    let triggerTop = useSpring(0, { damping: 20, stiffness: 400, mass: .25 })
    let triggerBottom = useSpring(0, { damping: 20, stiffness: 400, mass: .25 })
    let transitioning = useStore(store => store.transitioning)
    let action = useStore(store => store.action)
    let tr = useRef(false)

    useEffect(() => {
        tr.current = transitioning
        
        triggerTop.set(0)
        triggerBottom.set(0)
    }, [transitioning])

    useEffect(() => {
        document.body.style.height = height + "px"
        document.body.style.backgroundColor = backgroundColor
    }, [height])

    useEffect(() => window.scrollTo(0, 0), [])

    // scroll raf
    useAnimationFrame(() => {
        let dy = targetY.current - y.current
        let ease = .1

        if (Math.abs(dy) < .05) {
            y.current = targetY.current
        } else {
            y.current += (targetY.current - y.current) * ease
        }

        main.current.style.transform = `translateY(${y.current}px) translateZ(0)`
    })

    // reszier
    useEffect(() => {
        let listener = throttle(entries => {
            setHeight(entries[0].contentRect.height)
        }, 500)
        let resizer = new ResizeObserver(listener)

        resizer.observe(main.current)

        return () => resizer.disconnect()
    }, [])

    // on scroll
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

    // raf nav triggers
    useAnimationFrame(() => {  
        if (triggerTop.get() >= 1 && !tr.current) {
            let next = getUrl(path, -1) 

            if (next) {
                tr.current = true

                navigate(next, { state: { transitionType: "top" } })
            }
        }

        if (triggerBottom.get() >= 1 && !tr.current) {
            let next = getUrl(path, 1) 

            if (next) {
                tr.current = true

                if (hasAdjacent) {
                    let title = main.current.querySelector(".title")
                    let { top } = title.getBoundingClientRect()

                    navigate(next, { state: { transitionType: "adjacent", adjacentY: top } })
                } else {
                    navigate(next, { state: { transitionType: "bottom" } })
                }
            }
        }
    })

    useEffect(() => {
        let startY = 0
        let pullThreshold = 150
        let wheelThreshold = 50
        let onTouchStart = (e) => {
            startY = e.changedTouches[0].pageY
        }
        let onTouchEnd = () => {
            if (transitioning) {
                return
            }

            triggerBottom.set(0)
            triggerTop.set(0)
        }
        let onTouchMove = (e) => {
            if (transitioning) {
                return
            }

            let scrollY = Math.abs(y.current)
            let dy = startY - e.changedTouches[0].pageY

            if (scrollY >= Math.floor(height - window.innerHeight) && dy > 0) {
                e.preventDefault()
                triggerBottom.set((dy / pullThreshold).clamp(0, 1))
            }

            if (scrollY <= 0 && dy < 0) {
                e.preventDefault()
                triggerTop.set((Math.abs(dy) / pullThreshold).clamp(0, 1))
            }
        }
        let onWheel = (e) => {
            let scrollY = Math.abs(y.current)

            if (scrollY <= 0 && e.deltaY < 0) {
                e.preventDefault()
                triggerTop.set((Math.abs(e.deltaY) / wheelThreshold).clamp(0, 1))
            }

            if (scrollY >= Math.floor(height - window.innerHeight) && e.deltaY > 0) {
                e.preventDefault()
                triggerBottom.set((e.deltaY / wheelThreshold).clamp(0, 1))
            }
        }

        window.addEventListener("wheel", onWheel, { passive: false })
        window.addEventListener("touchstart", onTouchStart, { passive: false })
        window.addEventListener("touchend", onTouchEnd, { passive: false })
        window.addEventListener("touchmove", onTouchMove, { passive: false })

        return () => {
            window.removeEventListener("wheel", onWheel, { passive: false })
            window.removeEventListener("touchstart", onTouchStart, { passive: false })
            window.removeEventListener("touchend", onTouchEnd, { passive: false })
            window.removeEventListener("touchmove", onTouchMove, { passive: false })
        }
    }, [height, transitioning])

    return (
        <motion.main
            className="page"
            ref={main}
            variants={variants}
            custom={{ transitionType, action, adjacentY }}
            style={{
                backgroundColor
            }}
            exit={"exit"}
            animate={"enter"}
            initial={"initial"}
        >
            <Only if={getUrl(path, -1)}>
                <motion.div
                    style={{
                        position: "absolute",
                        fontSize: 32,
                        opacity: triggerTop,
                        left: "50%",
                        transform: "translateX(-50%)",
                        top: "1em",
                        zIndex: 111
                    }}
                >
                    PREVIOUS
                </motion.div>
            </Only>

            {children}

            <Only if={getUrl(path, 1)}>
                <motion.div
                    style={{
                        position: "absolute",
                        fontSize: 32,
                        left: "50%",
                        opacity: triggerBottom,
                        transform: "translateX(-50%)",
                        bottom: "1em",
                        zIndex: 111
                    }}
                >
                    NEXT
                </motion.div>
            </Only>
        </motion.main>
    )
}