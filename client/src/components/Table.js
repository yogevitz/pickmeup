import React, { forwardRef } from 'react';
import MaterialTable from 'material-table';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SaveAlt from '@material-ui/icons/SaveAlt';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import AddBox from '@material-ui/icons/AddBox';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import Remove from '@material-ui/icons/Remove';

export default function Table() {
  const [state, setState] = React.useState({
    columns: [
      { title: 'ID', field: 'id', type: 'numeric' },
      { title: 'Name', field: 'name' },
      { title: 'Contact Name', field: 'contactName' },
      { title: 'Contact Phone', field: 'contactPhone' },
      {
        title: 'Destination',
        field: 'destination',
      },
    ],
    data: [
      {
        id: 1,
        name: 'Beer Sheva Yellow Bus',
        contactName: 'Yosi Cohen',
        contactPhone: '0528108333',
        destination: 'Beer Sheva',
      },
      {
        id: 2,
        name: 'Beit Kama Mini Bus',
        contactName: 'Ben Levi',
        contactPhone: '0523712321',
        destination: 'Beit Kama',
      },
      {
        id: 3,
        name: 'BK Large Bus',
        contactName: 'Goni Levin Haimi',
        contactPhone: '0548332918',
        destination: 'Beit Kama',
      },
      {
        id: 4,
        name: 'Rahat 10',
        contactName: 'Hassan Abudugush',
        contactPhone: '0546478899',
        destination: 'Rahat',
      },
      {
        id: 5,
        name: 'Lehavim School Bus',
        contactName: 'Yaniv Gabot',
        contactPhone: '0544718732',
        destination: 'Lehavim',
      },
      {
        id: 6,
        name: 'Mishmar 2',
        contactName: 'Dani Duenias',
        contactPhone: '0541112827',
        destination: 'Mishmar Hanegev',
      },
    ],
  });

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  return (
    <MaterialTable
      title=""
      columns={state.columns}
      data={state.data}
      icons={tableIcons}
      options={{
        pageSize: 10,
        toolbar: true,
        paging: true
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              setState(prevState => {
                const data = [...prevState.data];
                data.push(newData);
                return { ...prevState, data };
              });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data];
                  data[data.indexOf(oldData)] = newData;
                  return { ...prevState, data };
                });
              }
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              setState(prevState => {
                const data = [...prevState.data];
                data.splice(data.indexOf(oldData), 1);
                return { ...prevState, data };
              });
            }, 600);
          }),
      }}
    />
  );
}