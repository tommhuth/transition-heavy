
import React, { useRef, useEffect, useState } from "react"
import { useLocation, navigate } from "@reach/router"
import { motion } from "framer-motion"
import { useAnimationFrame, throttle } from "../utils"
import Config from "../Config"
import { useStore } from "../store"
import ResizeObserver from "resize-observer-polyfill"

const urls = [
    "/", "/index", "/article-1"
]
const transition = {
    duration: Config.TRANSITION_DURATION / 1000,
    ease: [0.76, 0, 0.24, 1]
}
const variants = {
    initial(transitionType) {
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
        } else {
            return {}
        }
    },
    exit(transitionType) {
        if (transitionType === "bottom") {
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
    try {
        return urls[urls.indexOf(current) + direction] || null
    } catch (e) {
        return null
    }
}

export default function Page({ children, backgroundColor = "white", path }) {
    let main = useRef()
    let location = useLocation()
    let { transitionType } = location.state || {}
    let y = useRef(0)
    let targetY = useRef(0)
    let [height, setHeight] = useState(location.pathname)
    let [owner] = useState(location.key)
    let [triggerTop, setTriggerTop] = useState(0)
    let [triggerBottom, setTriggerBottom] = useState(0)
    let transitioning = useStore(store => store.transitioning)

    useEffect(() => {
        document.body.style.height = height + "px"
        document.body.style.backgroundColor = backgroundColor
    }, [height])

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

    useEffect(() => {
        if (triggerTop === 1 && !transitioning) {
            let next = getUrl(path, -1)

            if (next) {
                navigate(next, { state: { transitionType: "top" } })
            }
        }

        if (triggerBottom === 1 && !transitioning) {
            let next = getUrl(path, 1)

            if (next) {
                navigate(next, { state: { transitionType: "bottom" } })
            }
        }
    }, [triggerBottom, triggerTop, transitioning, path])

    useEffect(() => {
        let startY = 0
        let pullThreshold = 150
        let wheelThreshold = 100
        let onTouchStart = (e) => {
            startY = e.changedTouches[0].pageY
        }
        let onTouchEnd = () => {
            if (transitioning) {
                return
            }

            setTriggerBottom(0)
            setTriggerTop(0)
        }
        let onTouchMove = (e) => {
            if (transitioning) {
                return
            }

            let scrollY = Math.abs(y.current)
            let dy = startY - e.changedTouches[0].pageY

            if (scrollY >= Math.floor(height - window.innerHeight) && dy > 0) {
                e.preventDefault()
                setTriggerBottom((dy / pullThreshold).clamp(0, 1))
            }

            if (scrollY <= 0 && dy < 0) {
                e.preventDefault()
                setTriggerTop((Math.abs(dy) / pullThreshold).clamp(0, 1))
            }
        }
        let onWheel = (e) => {
            let scrollY = Math.abs(y.current)

            console.log(scrollY)

            if (scrollY <= 0 && e.deltaY < 0) {
                e.preventDefault()
                setTriggerTop((Math.abs(e.deltaY) / wheelThreshold).clamp(0, 1))
            }

            if (scrollY >= Math.floor(height - window.innerHeight) && e.deltaY > 0) {
                e.preventDefault()
                setTriggerBottom((e.deltaY / wheelThreshold).clamp(0, 1))
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
            custom={transitionType}
            exit={"exit"}
            variants={variants}
            animate={"enter"}
            initial={"initial"}
        >
            <div
                style={{
                    position: "absolute",
                    fontSize: 16 + (triggerBottom * 16),
                    left: "50%",
                    marginLeft: "-1em",
                    bottom: "1em"
                }}
            >
                {Math.floor(triggerBottom * 100)}%
            </div>
            <div
                style={{
                    position: "absolute",
                    fontSize: 16 + (triggerTop * 16),
                    left: "50%",
                    marginLeft: "-1em",
                    top: "1em"
                }}
            >
                {Math.floor(triggerTop * 100)}%
            </div>
            {children}
        </motion.main>
    )
}