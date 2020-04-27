
import React, { useEffect } from "react" 
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container"


export default function Home({ path }) {
    return (
        <Page path={path}>
            <Container full> 
                <h1 className="h1"> Splash screen</h1>
                <Link to="/index" state={{ transitionType: "bottom" }}>Next</Link>
            </Container>
        </Page>
    )
}