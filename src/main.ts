import "@/styles/index.scss";
import type {Practice} from "@/scripts/_base.ts";
import {PracticeO3} from "@/scripts/03.ts";

const app = document.querySelector('#app') as HTMLDivElement;

function loadPractice(construct: new () => Practice) {
    const inst = new construct();
    inst.render(app);
}

loadPractice(PracticeO3);