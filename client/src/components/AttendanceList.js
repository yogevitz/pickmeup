import React, { forwardRef } from 'react';
import { tableIcons } from "../utils";
import MaterialTable from 'material-table';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import { withTranslation } from "react-i18next";

function AttendanceList(props) {
  const [state, setState] = React.useState({});

  const { t, setMarkAction } = props;

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
        toolbar: {
          searchPlaceholder: t('common.search')
        }
      }}
      components={{
        Action: setMarkAction,
      }}
    />
  );
}

export default withTranslation()(AttendanceList);
