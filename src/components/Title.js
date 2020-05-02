import React, { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import cn from "classnames"
import Only from "./Only"
import { Link, useNavigate } from "@reach/router"
import { transition } from "./Page"
import { useSpring, useTransform } from "framer-motion"

function Splash({ backgroundColor }) {
    let maxhHeight = 350
    let width = window.innerWidth
    let acceleration = useRef(0)
    let direction = useRef()
    let h = useSpring(maxhHeight, { damping: 5 })
    let y = useTransform(h, value => maxhHeight - value)
    let tid = useRef()

    useEffect(() => {
        let onMouseMove = e => {
            acceleration.current = Math.abs(e.movementY)
            direction.current = e.movementY > 0 ? "down" : "up"
        }

        window.addEventListener("mousemove", onMouseMove)

        return () => window.removeEventListener("mousemove", onMouseMove)
    }, [])

    return (
        <svg
            viewBox={`0 0 ${width} ${maxhHeight}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{
                position: "absolute",
                overflow: "visible",
                width: "100%",
                bottom: 0,
                left: 0,
                right: 0
            }}
        >
            <motion.rect
                onMouseOver={() => {
                    if (direction.current === "down") {
                        clearTimeout(tid.current)
                        h.set(maxhHeight - acceleration.current / 2)
                        tid.current = setTimeout(() => h.set(maxhHeight + acceleration.current), 300)
                    } else {
                        h.set(maxhHeight + acceleration.current)
                    }
                }}
                onMouseLeave={() => {
                    h.set(maxhHeight)
                }}
                x={0}
                y={y}
                width={width}
                height={h}
                fill={backgroundColor}
            />
        </svg>
    )
}

export default function Title({ children, next, url, backgroundColor = "#ccc", color = "#000" }) {
    let Component = next ? motion.a : motion.h1
    let navigate = useNavigate()
    let ref = useRef() 

    return (
        <Component
            className={cn("title", { "title--next": next })}
            ref={ref}
            animate={{ paddingTop: next ? 100 : 300, transition }}
            initial={{ paddingTop: 100 }}
            onClick={(e) => {
                e.preventDefault()

                let { top } = ref.current.getBoundingClientRect()

                navigate(url, {
                    state: {
                        transitionType: "adjacent",
                        adjacentY: top
                    }
                })
            }}
            style={{
                color,
                backgroundColor: next ? null : backgroundColor
            }}
            to={url}
        >
            <Only if={next}>
                <Splash backgroundColor={backgroundColor} color={color} />
            </Only>

            <span
                className="title__inner" 
            >
                {children}
            </span>
        </Component>
    )
}