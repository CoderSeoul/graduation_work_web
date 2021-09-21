import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { HighriskVoronoi, ClassCounterPie, HistoryCalendar } from './charts';
import EnhancedTable from './dataTable';
import ButtonAppBar from './appbar';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BasicGrid({
  recordedAt,
  deviceId,
  voronoi,
  classCounter,
  tableData,
  setSelectedIndexs,
  selectedIndexs,
}) {
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    setHeight(ref.current.clientWidth * 0.75);
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ButtonAppBar title={deviceId} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Item elevation={0}>
            <CardHeader style={{ textAlign: 'left' }} title={'Voronoi'} />
            <div ref={ref} style={{ width: '100%', height: height }}>
              <HighriskVoronoi voronoi={voronoi} />
            </div>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item
            elevation={0}
            style={{
              overflowY: 'scroll',
            }}
          >
            <CardHeader style={{ textAlign: 'left' }} title={'Recent Data'} />
            <div style={{ width: '100%', height: height }}>
              <EnhancedTable
                setSelectedIndexs={setSelectedIndexs}
                selectedIndexs={selectedIndexs}
                tableData={tableData}
              />
            </div>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item elevation={0}>
            <CardHeader style={{ textAlign: 'left' }} title={'Count'} />
            <div style={{ width: '100%', height: height }}>
              <ClassCounterPie classCounter={classCounter} />
            </div>
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item>xs=8</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
