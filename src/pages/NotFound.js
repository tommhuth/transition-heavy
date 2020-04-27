
import React, { useEffect } from "react" 
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container"


export default function NotFound({ path }) {
    return (
        <Page path={path}>
            <Container> 
                <h1 className="h1"> 404</h1>
                <Link to="/" state={{ transitionType: "bottom" }}>Home</Link>
            </Container>
        </Page>
    )
}