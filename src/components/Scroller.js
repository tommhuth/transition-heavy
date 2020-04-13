import React, { useEffect, useRef } from "react"
import { useLocation, navigate } from "@reach/router"
import { useStore } from "../store"
import { useAnimationFrame } from "../hooks"
import Config from "../Config"

export default function Scroller({ children }) {
    let location = useLocation()
    let wrapper = useRef()
    let targetScroll = useRef(0)
    let currentScroll = useRef(0)
    let smooth = useRef(.1)
    let navigating = useStore(store => store.navigating)
    let setNavigating = useStore(store => store.setNavigating)
    let setMaxScroll = useStore(store => store.setMaxScroll)
    let setScrollPosition = useStore(store => store.setScrollPosition)
    let prevScrollPosition = useRef(-1)

    useEffect(() => {
        let height = wrapper.current.offsetHeight
        let maxScroll = height - window.innerHeight

        setMaxScroll(maxScroll)
    }, [])

    useAnimationFrame(() => {
        let ds = targetScroll.current - currentScroll.current
        let height = wrapper.current.offsetHeight
        let maxScroll = height - window.innerHeight

        targetScroll.current = Math.max(Math.min(targetScroll.current, 0), -maxScroll)

        if (Math.abs(ds) > .01) {
            currentScroll.current += (targetScroll.current - currentScroll.current) * smooth.current
        } else {
            currentScroll.current = targetScroll.current
        }

        if (prevScrollPosition.current !== currentScroll.current) {
            setScrollPosition(-currentScroll.current)
        }

        wrapper.current.style.transform = "translateY(" + currentScroll.current + "px)"
        prevScrollPosition.current = currentScroll.current

    })

    useEffect(() => {
        let startY = 0
        let startTime = 0
        let startScroll = 0
        let onTouchStart = e => {
            if (navigating) {
                return
            }

            startTime = new Date()
            startY = e.changedTouches[0].pageY
            startScroll = targetScroll.current
        }
        let onTouchMove = e => {
            if (navigating) {
                return
            }

            let next = startY - e.changedTouches[0].pageY

            smooth.current = .7
            targetScroll.current = startScroll + next * -1.5
        }
        let onTouchEnd = e => {
            if (navigating) {
                return
            }

            let distance = e.changedTouches[0].pageY - startY
            let velocity = Math.abs(distance / (new Date() - startTime))

            smooth.current = .1

            if (Math.abs(velocity) > .5) {
                targetScroll.current += distance * (Math.abs(velocity) + 1.5)
            }

            if (Math.abs(distance) < 10) {
                targetScroll.current = currentScroll.current
            }
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: true })
        window.addEventListener("touchend", onTouchEnd, { passive: true })

        return () => {
            window.removeEventListener("touchstart", onTouchStart, { passive: true })
            window.removeEventListener("touchmove", onTouchMove, { passive: true })
            window.removeEventListener("touchend", onTouchEnd, { passive: true })
        }
    }, [navigating])

    useEffect(() => {
        let height = wrapper.current.offsetHeight
        let maxScroll = height - window.innerHeight
        let onWheel = (e) => {
            if (navigating) {
                return
            }

            targetScroll.current += -e.deltaY * (e.deltaMode === 1 ? 20 : 1)

            if (targetScroll.current > 0) {
                targetScroll.current = 0
            }

            if (targetScroll.current < -maxScroll) {
                targetScroll.current = -maxScroll
            }


            if (currentScroll.current === 0 && e.deltaY < -10) {
                let urls = Config.URLS
                let previousUrl = urls[urls.findIndex(i => i.url === location.pathname) - 1]

                if (previousUrl) {

                    navigate(previousUrl.url, {
                        state: { origin: "top" },
                        replace: false
                    })
                    setNavigating(true)
                    setTimeout(() => setNavigating(false), Config.TRANSITION_DURATION)
                }
            }

            if (currentScroll.current === -maxScroll && e.deltaY > 10) {
                let urls = Config.URLS
                let nextUrl = urls[urls.findIndex(i => i.url === location.pathname) + 1]

                if (nextUrl) {
                    navigate(nextUrl.url, {
                        state: { origin: nextUrl.origin },
                        replace: false
                    })
                    setNavigating(true)
                    setTimeout(() => setNavigating(false), Config.TRANSITION_DURATION)
                }
            }
        }

        window.addEventListener("wheel", onWheel, { passive: true })

        return () => {
            window.removeEventListener("wheel", onWheel, { passive: true })
        }
    }, [navigating])

    return (
        <div ref={wrapper}>
            {children}
        </div>
    )
}