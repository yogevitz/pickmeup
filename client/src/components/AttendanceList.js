import React, { forwardRef } from 'react';
import { tableIcons } from "../utils";
import MaterialTable from 'material-table';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import Remove from '@material-ui/icons/Remove';

export default function AttendanceList(props) {
  const [state, setState] = React.useState({});

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    CheckCircleIcon: forwardRef((props, ref) => <CheckCircleIcon {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Save: forwardRef((props, ref) => <Save {...props} ref={ref} />),
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

  const { setMarkAction } = props;

  return (
    <MaterialTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      icons={tableIcons}
      options={{
        toolbar: true,
        paging: false,
        selection: false,
        showTextRowsSelected: false,
        showSelectAllCheckbox: false,
        exportButton: true,
        exportAllData: true,
        toolbarButtonAlignment: 'right',
        showEmptyDataSourceMessage: false,
      }}
      actions={[{
        icon: <SupervisorAccountIcon />,
        onClick: () => {},
        position: 'row',
      }]}
      localization={{
        header: {
          actions: <SupervisorAccountIcon />
        },
      }}
      components={{
        Action: setMarkAction,
      }}
    />
  );
}