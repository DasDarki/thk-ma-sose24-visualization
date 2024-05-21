import * as d3 from "d3";

export interface Practice {
    render(parent: HTMLDivElement): Promise<void> | void;
}

export enum BarChartType {
    Horizontal,
    Vertical,
}

export interface BarChartOptions {
    parentElement?: HTMLElement;
    width?: number;
    height?: number;
    margin?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    type?: BarChartType;
    barColor?: string;
}

export interface BarChartConfig<T> {
    parentElement: HTMLElement;
    width: number;
    height: number;
    margin: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    verticalKey: keyof T;
    horizontalKey: keyof T;
    type: BarChartType;
    barColor: string;
}

export class BarChart<T = any> {
    private readonly _config: BarChartConfig<T>;
    private _data: T[] = [];
    private _svg: d3.Selection<SVGSVGElement, unknown, null, undefined> = null!;
    private _xScale: d3.ScaleLinear<number, number> | d3.ScaleBand<string> = null!;
    private _yScale: d3.ScaleLinear<number, number> | d3.ScaleBand<string> = null!;

    public constructor(data: T[], numericKey: keyof T, labelKey: keyof T, config?: BarChartOptions) {
        this._data = data;
        this._config = {
            parentElement: config?.parentElement || document.body,
            width: config?.width || 400,
            height: config?.height || 114,
            margin: {
                top: config?.margin?.top || 10,
                right: config?.margin?.right || 20,
                bottom: config?.margin?.bottom || 50,
                left: config?.margin?.left || 50
            },
            verticalKey: numericKey,
            horizontalKey: labelKey,
            type: config?.type || BarChartType.Horizontal,
            barColor: config?.barColor || '#4682B4'
        };

        this.initVis();
        this.updateVis();
        this.renderVis();
    }

    private initVis(): void {
        this._svg = d3.select(this._config.parentElement).append("svg");

        this._svg.attr('width', this._config.width + this._config.margin.left + this._config.margin.right)
            .attr('height', this._config.height + this._config.margin.top + this._config.margin.bottom)
            .append('g')
            .attr('transform', `translate(${this._config.margin.left}, ${this._config.margin.top})`);
    }

    public updateVis(): void {
        if (this._config.type === BarChartType.Horizontal) {
            this._xScale = d3.scaleLinear()
                .domain([0, d3.max(this._data, d => d[this._config.verticalKey] as number)!])
                .range([0, this._config.width]);

            this._yScale = d3.scaleBand()
                .domain(this._data.map(d => d[this._config.horizontalKey] as string))
                .range([0, this._config.height])
                .padding(0.1);
        } else {
            this._xScale = d3.scaleBand()
                .domain(this._data.map(d => d[this._config.horizontalKey] as string))
                .range([0, this._config.width])
                .padding(0.1);

            this._yScale = d3.scaleLinear()
                .domain([0, d3.max(this._data, d => d[this._config.verticalKey] as number)!])
                .range([this._config.height, 0]);
        }
    }

    public renderVis(): void {
        this._svg.selectAll('*').remove();

        const g = this._svg.append('g')
            .attr('transform', `translate(${this._config.margin.left}, ${this._config.margin.top})`);

        if (this._config.type === BarChartType.Horizontal) {
            const xAxis = d3.axisBottom(this._xScale as d3.ScaleLinear<number, number>).ticks(5).tickSizeOuter(0);
            const yAxis = d3.axisLeft(this._yScale as d3.ScaleBand<string>).tickSizeOuter(0);

            g.append('g')
                .attr('class', 'axis x-axis')
                .attr('transform', `translate(0, ${this._config.height})`)
                .call(xAxis);

            g.append('g')
                .attr('class', 'axis y-axis')
                .call(yAxis);

            g.selectAll('.bar')
                .data(this._data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('fill', this._config.barColor)
                .attr('x', 0)
                .attr('width', d => (this._xScale as d3.ScaleLinear<number, number>)(d[this._config.verticalKey] as number))
                .attr('height', (this._yScale as d3.ScaleBand<string>).bandwidth())
                .attr('y', d => (this._yScale as d3.ScaleBand<string>)(d[this._config.horizontalKey] as string)!);
        } else {
            const xAxis = d3.axisBottom(this._xScale as d3.ScaleBand<string>).tickSizeOuter(0);
            const yAxis = d3.axisLeft(this._yScale as d3.ScaleLinear<number, number>).ticks(5).tickSizeOuter(0);

            g.append('g')
                .attr('class', 'axis x-axis')
                .attr('transform', `translate(0, ${this._config.height})`)
                .call(xAxis);

            g.append('g')
                .attr('class', 'axis y-axis')
                .call(yAxis);

            g.selectAll('.bar')
                .data(this._data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('fill', this._config.barColor)
                .attr('x', d => (this._xScale as d3.ScaleBand<string>)(d[this._config.horizontalKey] as string)!)
                .attr('width', (this._xScale as d3.ScaleBand<string>).bandwidth())
                .attr('y', d => (this._yScale as d3.ScaleLinear<number, number>)(d[this._config.verticalKey] as number)!)
                .attr('height', d => this._config.height - (this._yScale as d3.ScaleLinear<number, number>)(d[this._config.verticalKey] as number)!);
        }
    }

    public get data(): T[] {
        return this._data;
    }

    public set data(data: T[]) {
        this._data = data;
        this.updateVis();
        this.renderVis();
    }
}
