import * as d3 from "d3";
import {BarChart, BarChartType, Practice} from "@/scripts/_base.ts";

export class PracticeO3 implements Practice {

    public async render(parent: HTMLDivElement): Promise<void> {
        const quarterlyReport = [
            { month: 'May', sales: 6900 },
            { month: 'June', sales: 14240 },
            { month: 'July', sales: 25000 },
            { month: 'August', sales: 17500 }
        ];

        const chart = new BarChart(quarterlyReport, 'sales', 'month', {
            parentElement: parent,
            type: BarChartType.Horizontal,
        });

        chart.updateVis();
        chart.renderVis();
    }

}