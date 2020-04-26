
import React, { useEffect } from "react" 
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container"


export default function Home() {
    return (
        <Page>
            <Container full> 
                <h1 className="h1"> Splash screen</h1>
                <Link to="/content" state={{ transitionType: "bottom" }}>Next</Link>
            </Container>
        </Page>
    )
}