
import React, { useEffect, useState, useRef, useMemo } from "react"
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container" 

export default function Splash({ path }) {
    return (
        <Page path={path}>
            <Container full>
                <h1 className="p"> Splash screen</h1>
                <Link to="/index" state={{ transitionType: "bottom" }}>Next</Link>
 
            </Container>
        </Page>
    )
}

