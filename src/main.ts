import "@/styles/index.scss"; // imports the default styles
import {drawSmiley, getMessage} from "@/scripts/welcome.ts";

const app = document.querySelector('#app') as HTMLDivElement; // selects the entry point of the HTML

app.innerHTML = `
    <h1>${getMessage()}</h1>
    <svg id="smiley"></svg>
`;

drawSmiley();