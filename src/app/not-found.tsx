import Nav from "@/components/nav";
import { ActionLink, PageIntro } from "@/components/ui";
export default function NotFound(){return <><Nav/><main id="main-content" tabIndex={-1} className="hop-wrap"><PageIntro eyebrow="Let’s find your way / 404" title={<>That page<br/>has moved on.</>} actions={<ActionLink href="/">Find my starting point</ActionLink>}>The link may have changed. Head back to Hop, or explore the field guide for useful next steps.</PageIntro><ActionLink href="/learn" variant="quiet">Explore the field guide</ActionLink></main></>;}
