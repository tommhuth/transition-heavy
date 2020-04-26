import React, { useRef, useEffect } from "react"

export function useAnimationFrame(callback) {
    // Use useRef for mutable variables that we want to persist
    // without triggering a re-render on their change
    const requestRef = React.useRef()
    const previousTimeRef = React.useRef()

    const animate = time => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current

            callback(deltaTime)
        }
        previousTimeRef.current = time
        requestRef.current = requestAnimationFrame(animate)
    }

    React.useEffect(() => {
        requestRef.current = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(requestRef.current)
    }, []) // Make sure the effect runs only once
}

export function useFirstRender() {
    let firstRender = useRef(true)

    useEffect(() => {
        firstRender.current = false
    }, [])

    return firstRender
}

// https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
export function throttle(func, limit) {
    let lastFunc
    let lastRan

    return function () {
        const context = this
        const args = arguments

        if (!lastRan) {
            func.apply(context, args)
            lastRan = Date.now()
        } else {
            clearTimeout(lastFunc)

            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args)
                    lastRan = Date.now()
                }
            }, limit - (Date.now() - lastRan))
        }
    }
}