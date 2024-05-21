import * as d3 from "d3";
import {Practice} from "@/scripts/_base.ts";

export class Practice01 implements Practice {
    public async render(parent: HTMLDivElement) {
        this.activity01(parent);

        await this.activity02(parent);

        await this.externalLoading();
    }

    private activity01(parent: HTMLDivElement) {
        parent.classList.add("svg--practice01");

        const sandwiches: Sandwich[] = [
            { name: "Thesis", price: 7.95, size: "large" },
            { name: "Dissertation", price: 8.95, size: "large" },
            { name: "Highlander", price: 6.50, size: "small" },
            { name: "Just Tuna", price: 6.50, size: "small" },
            { name: "So-La", price: 7.95, size: "large" },
            { name: "Special", price: 12.50, size: "small" }
        ];

        const svg = d3.select(parent)
            .append("svg")
            .attr("width", 500)
            .attr("height", 500);

        const gap = 10;
        const currY = 40;
        let currX = 10;

        for (const sandwich of sandwiches) {
            const size = this.getSandwichSize(sandwich);
            const color = this.getSandwichColor(sandwich);

            svg.append("circle")
                .attr("cx", currX + size / 2)
                .attr("cy", currY)
                .attr("r", size / 2)
                .attr("fill", color)
                .attr("stroke", "black");

            currX += size + gap;
        }
    }

    private async activity02(parent: HTMLDivElement) {
        const csv: any = await d3.csv("/data/01_02_cities_and_populations.csv");
        const cities: City[] = csv.map((row: any) => {
            return {
                country: row.country,
                city: row.city,
                population: parseInt(row.population),
                x: parseInt(row.x),
                y: parseInt(row.y),
                eu: row.eu === "true"
            };
        }).filter((city: City) => city.eu);

        const para = document.createElement("p");
        para.textContent = "Numer of Cities in the EU: " + cities.length;
        parent.appendChild(para);

        const svg = d3.select(parent)
            .append("svg")
            .attr("width", 700)
            .attr("height", 550);

        for (const city of cities) {
            const isSmall = city.population < 1_000_000;
            const radius = isSmall ? 4 : 8;

            svg.append("circle")
                .attr("cx", city.x)
                .attr("cy", city.y)
                .attr("r", radius)
                .attr("fill", "blue")
                .attr("stroke", "black");

            if (!isSmall) {
                svg.append("text")
                    .attr("x", city.x)
                    .attr("y", city.y - radius - 5)
                    .classed("city-label", true)
                    .text(city.city);
            }
        }
    }

    private getSandwichSize(sandwich: Sandwich): number {
        return sandwich.size === "small" ? 50 : 70;
    }

    private getSandwichColor(sandwich: Sandwich): string {
        return sandwich.price < 7 ? "green" : "red";
    }

    private async externalLoading() {
        try {
            const csv: any = await d3.csv("/data/01_01_sandwiches.csv");

            console.log("Practice 01 - Activity 02 - CSV Data successfully loaded:");
            console.log(csv);

            for (const row of csv) {
                row.price = parseFloat(row.price);
            }

            console.log("Practice 01 - Activity 02 - CSV Data successfully parsed:");
            console.log(csv);
        } catch (error) {
            console.error("Practice 01 - Activity 02 - Error loading CSV Data:");
            console.error(error);
        }
    }
}

interface Sandwich {
    name: string;
    price: number;
    size: "small" | "large";
}

interface City {
    country: string;
    city: string;
    population: number;
    x: number;
    y: number;
    eu: boolean;
}