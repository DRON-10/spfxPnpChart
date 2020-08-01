import * as React from 'react';
import styles from './SpfxPnpChart.module.scss';
import { ISpfxPnpChartProps } from './ISpfxPnpChartProps';
import { sp } from "@pnp/sp";
import { ChartControl, ChartType } from '@pnp/spfx-controls-react/lib/ChartControl';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

export default class SpfxPnpChart extends React.Component<ISpfxPnpChartProps, {}> {
  constructor(props: ISpfxPnpChartProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
  }

  @autobind
  private async _loadAsyncData(): Promise<Chart.ChartData> {
    const items: any[] = await sp.web.lists.getByTitle("Sales").items.select("Title", "Salesamt").get();
    let lblarr: string[] = [];
    let dataarr: number[] = [];
    items.forEach(element => {
      lblarr.push(element.Title);
      dataarr.push(element.Salesamt);
    });
    let chartdata: Chart.ChartData = {
      labels: lblarr,
      datasets: [{
        label: 'My data',
        data: dataarr
      }]
    };
    return chartdata;
  }

  public render(): React.ReactElement<ISpfxPnpChartProps> {
    return (
      <div className={styles.spfxPnpChart}>
        <ChartControl
          type={ChartType.Bar}
          datapromise={this._loadAsyncData()}
          options={{
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }} />

      </div>
    );
  }
}