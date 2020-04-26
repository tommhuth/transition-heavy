
import React, { useRef, useEffect, useState } from "react"
import { useLocation } from "@reach/router"
import { motion } from "framer-motion"
import { useAnimationFrame, throttle } from "../utils"
import Config from "../Config"
import ResizeObserver from "resize-observer-polyfill"
 import cn from "classnames"

export default function Container({ children, full }) {
     
 

    return (
        <motion.div
            className={cn("container", { "container--full": full})}
        >
            {children}
        </motion.div>
    )
}