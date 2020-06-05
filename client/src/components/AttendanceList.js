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
        body: {
          addTooltip: t('common.add'),
          deleteTooltip: t('common.delete'),
          editTooltip: t('common.edit'),
          editRow: {
            saveTooltip: t('common.done'),
            cancelTooltip: t('common.cancel'),
            deleteText: t('toolbar.are-you-sure'),
          }
        },
        toolbar: {
          searchPlaceholder: t('common.search'),
          searchTooltip: t('common.search'),
          exportTitle: t('common.export'),
          showColumnsTitle: t('toolbar.columns-title'),
          addRemoveColumns: t('toolbar.add-or-remove-columns')
        },
        header: {
          actions: '',
        },
        pagination: {
          firstTooltip: t('pagination.first'),
          nextTooltip: t('pagination.next'),
          previousTooltip: t('pagination.previous'),
          lastTooltip: t('pagination.last'),
          labelRowsSelect: t('pagination.rows'),
          labelDisplayedRows: t('pagination.from-to-of-count'),
        }
      }}
      components={{
        Action: setMarkAction,
      }}
    />
  );
}

export default withTranslation()(AttendanceList);
