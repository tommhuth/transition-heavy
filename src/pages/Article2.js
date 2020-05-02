
import React, { useEffect, useState } from "react"
import { Link } from "@reach/router"
import Page from "../components/Page"
import Container from "../components/Container" 
 


export default function Article2({ path }) { 

    return (
        <Page path={path}>
            <Container>
                <h1 className="h2">Nullam in viverra ligula, non fringilla  </h1>
                <p className="p2">Nullam in viverra ligula, non fringilla metus. Nunc auctor ipsum a risus feugiat placerat. Vivamus venenatis sagittis leo eget porttitor. Etiam et euismod nunc. Fusce ac tincidunt turpis, eget sag.</p>
                <p className="p">Ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis dapibus sodales. Maecenas viverra tempor risus efficitur pharetra. Nulla a lectus at nibh congue pretium venenatis ut augue. Mauris eget nisl sit amet erat posuere accumsan. Praesent lacus tellus, faucibus tincidunt varius non, condimentum vitae mi. </p>
                <p className="p">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis dapibus sodales. Maecenas viverra tempor risus efficitur phare  nibh congue pretium venenatis ut augue. Mauris eget nisl sit amet erat posuere accumsan. Praesent lacus tellus, faucibus tincidunt varius non, condimentum vitae mi. </p>
                <p className="p">Dolor sit amet, consectetur adipiscing elit. Aenean mattis dapibus sodales. Maecenas viverra tempor risus efficitur pharetra. Nulla a lectus at nibh congue pretium venenatis ut augue. Mauris eget nisl sit amet erat posuere accumsan. Praesent lacus tellus, faucibus tincidunt varius non, condimentum vitae mi. </p>
                
                <Link to="/" state={{ transitionType: "top" }}>Back</Link>
            </Container>
        </Page>
    )
}