import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveVoronoi } from '@nivo/voronoi';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveCalendar } from '@nivo/calendar';

const colorPalette = [
  '#2697ff',
  '#26e5ff',
  '#ffcf26',
  '#ee2727',
  '#ffa113',
  '#19e9aa',
  '#ff43ca',
];
export function ClassCounterPie({ classCounter }) {
  return (
    <ResponsivePie
      data={classCounter}
      colors={colorPalette}
      margin={{ top: 40, right: 0, bottom: 40, left: 0 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
      arcLinkLabelsSkipAngle={10}
      arcLinkLabelsTextColor="#333333"
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
      arcLabelsTextColor={{
        from: 'color',
        modifiers: [['darker', 2]],
      }}
      legends={[
        {
          anchor: 'right',
          direction: 'column',
          justify: false,
          translateX: 0,
          translateY: 0,
          itemsSpacing: 38,
          itemWidth: 80,
          itemHeight: 10,
          itemTextColor: '#999',
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 15,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
              },
            },
          ],
        },
      ]}
    />
  );
}

export function HighriskVoronoi({ voronoi }) {
  return (
    <ResponsiveVoronoi
      data={voronoi}
      xDomain={[0, 640]}
      yDomain={[0, 480]}
      enableLinks={true}
      linkLineColor="#cccccc"
      cellLineColor="#2697ff"
      pointSize={6}
      pointColor="#2697ff"
      margin={{ top: 1, right: 1, bottom: 1, left: 1 }}
    />
  );
}

export function HistoryCalendar({ history }) {
  return (
    <ResponsiveCalendar
      data={history}
      from="2015-03-01"
      to="2016-07-12"
      emptyColor="#eeeeee"
      colors={colorPalette}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={40}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'row',
          translateY: 36,
          itemCount: 4,
          itemWidth: 42,
          itemHeight: 36,
          itemsSpacing: 14,
          itemDirection: 'right-to-left',
        },
      ]}
    />
  );
}
