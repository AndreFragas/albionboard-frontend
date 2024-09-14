import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {Grid} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {cloneDeep} from 'lodash';
import {useState} from 'react';
import {useTranslate} from 'src/@prismafive/hooks/use-translate';
import {ColumnBox} from '../../shared-box-sx';
import {DefaultTable} from '../default-table';
import {SwapTableOperationType, SwapTableProps} from './types';

export function SwapTable(props: SwapTableProps) {
  const {translate} = useTranslate();
  const [leftSelected, setLeftSelected] = useState<string[]>([]);
  const [rightSelected, setRightSelected] = useState<string[]>([]);

  function leftArrowClick() {
    if (props.disabled) return;
    leftTableManager(rightSelected, 'add');
    rightTableManager(rightSelected, 'remove');
    setRightSelected([]);
  }

  function rightArrowClick() {
    if (props.disabled) return;
    leftTableManager(leftSelected, 'remove');
    rightTableManager(leftSelected, 'add');
    setLeftSelected([]);
  }

  function leftTableManager(ids: string[], actionType: SwapTableOperationType) {
    if (ids.length === 0) return;
    let newLeftData: any[] = [];
    if (actionType === 'add') {
      newLeftData = cloneDeep(props.leftData);
      props.rightData.forEach((element: any) => {
        if (props.rightGetRowId) {
          if (ids.includes(element[props.rightGetRowId])) newLeftData.push(element);
        } else {
          if (ids.includes(element.id)) newLeftData.push(element);
        }
      });
    } else {
      props.leftData.forEach((element: any) => {
        if (props.rightGetRowId) {
          if (!ids.includes(element[props.rightGetRowId])) newLeftData.push(element);
        } else {
          if (!ids.includes(element.id)) newLeftData.push(element);
        }
      });
    }
    return props.setLeftData(newLeftData);
  }

  function rightTableManager(ids: any[], actionType: SwapTableOperationType) {
    if (ids.length === 0) return;
    let newRightData: any[] = [];
    if (actionType === 'add') {
      newRightData = cloneDeep(props.rightData);
      props.leftData.forEach((element: any) => {
        if (props.leftGetRowId) {
          if (ids.includes(element[props.leftGetRowId])) newRightData.push(element);
        } else {
          if (ids.includes(element.id)) newRightData.push(element);
        }
      });
    } else {
      props.rightData.forEach((element: any) => {
        if (props.leftGetRowId) {
          if (!ids.includes(element[props.leftGetRowId])) newRightData.push(element);
        } else {
          if (!ids.includes(element.id)) newRightData.push(element);
        }
      });
    }
    return props.setRightData(newRightData);
  }

  return (
    <Grid
      container
      sx={{
        margin: props.margin ?? 0,
        '& .MuiGrid-item': {
          padding: 0,
        },
      }}
    >
      <Grid item xs={12} sm={5}>
        {props.leftTableName && <Typography>{translate(props.leftTableName)}</Typography>}
        <DefaultTable
          columnDefinition={props.leftColumnDefinition}
          data={props.leftData}
          selectedCheckBoxes={leftSelected}
          setSelectedCheckBoxes={(selected: any[]) => setLeftSelected(selected)}
          getRowId={props.leftGetRowId ? (row: any) => row[props.leftGetRowId!] : undefined}
        />
      </Grid>
      <Grid item xs={12} sm={1}>
        <Box sx={{...ColumnBox, alignItems: 'center', height: '100%'}}>
          <Button onClick={rightArrowClick}>
            <ArrowForwardIcon
              fontSize="large"
              sx={{
                border: '2px solid black',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            />
          </Button>
          <Button onClick={leftArrowClick}>
            <ArrowBackIcon
              fontSize="large"
              sx={{
                border: '2px solid black',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            />
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        {props.rightTableName && <Typography>{translate(props.rightTableName)}</Typography>}
        <DefaultTable
          columnDefinition={props.rightColumnDefinition}
          data={props.rightData}
          selectedCheckBoxes={rightSelected}
          setSelectedCheckBoxes={(selected: any[]) => setRightSelected(selected)}
          getRowId={props.rightGetRowId ? (row: any) => row[props.rightGetRowId!] : undefined}
        />
      </Grid>
    </Grid>
  );
}
