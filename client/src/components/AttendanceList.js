import React, { forwardRef } from 'react';
import MaterialTable from 'material-table';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import SaveAlt from '@material-ui/icons/SaveAlt';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import FirstPage from '@material-ui/icons/FirstPage';
import Save from '@material-ui/icons/Save';
import LastPage from '@material-ui/icons/LastPage';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import AddBox from '@material-ui/icons/AddBox';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import Check from '@material-ui/icons/Check';
import FilterList from '@material-ui/icons/FilterList';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import Remove from '@material-ui/icons/Remove';
import Checkbox from "@material-ui/core/Checkbox";

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

  const { onApproveChange } = props;

  return (
    <MaterialTable
      title={props.title}
      columns={props.columns}
      data={props.data}
      icons={tableIcons}
      options={{
        toolbar: true,
        paging: false,
        selection: true,
        showTextRowsSelected: false,
        showSelectAllCheckbox: false,
        exportButton: true,
        exportAllData: true,
        toolbarButtonAlignment: 'right',
      }}
      actions={[{
        icon: <SupervisorAccountIcon />,
        onClick: () => {},
        position: 'row',
      }]}
      onSelectionChange={props.onSelectionChange}
      localization={{
        header: {
          actions: <SupervisorAccountIcon />
        },
      }}
      components={{
        Action: rowProps => (
          <Checkbox
            icon={<AssignmentTurnedInOutlinedIcon />}
            checkedIcon={<AssignmentTurnedInIcon />}
            checked={!rowProps.data.tableData.checked && rowProps.data.approved === '1'}
            onChange={(event) => onApproveChange(event, rowProps)}
            color="primary"
            disabled={rowProps.data.tableData.checked}
            variant="contained"
            style={{textTransform: 'none'}}
            size="small"
            tooltip='Approve'
          />
        ),
      }}
    />
  );
}