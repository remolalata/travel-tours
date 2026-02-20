'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import type { GridColDef, GridPaginationModel, GridRowId, GridValidRowModel } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

export type DataTableColumn<T extends GridValidRowModel> = GridColDef<T>;

type DataTablePaginationProps = {
  page: number;
  rowsPerPage: number;
  total: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
};

type AppDataTableProps<T extends GridValidRowModel> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  refreshing?: boolean;
  errorMessage?: string | null;
  emptyMessage?: string;
  pagination?: DataTablePaginationProps;
};

export default function AppDataTable<T extends GridValidRowModel>({
  columns,
  rows,
  rowKey,
  loading = false,
  refreshing = false,
  errorMessage,
  emptyMessage = 'No records found.',
  pagination,
}: AppDataTableProps<T>) {
  const paginationModel: GridPaginationModel | undefined = pagination
    ? {
        page: pagination.page,
        pageSize: pagination.rowsPerPage,
      }
    : undefined;

  return (
    <Box sx={{ width: '100%' }}>
      {errorMessage ? <Alert severity='error' sx={{ mb: 2 }}>{errorMessage}</Alert> : null}

      <DataGrid
        columns={columns}
        rows={rows}
        getRowId={(row) => rowKey(row) as GridRowId}
        loading={loading || refreshing}
        disableColumnMenu
        disableRowSelectionOnClick
        rowHeight={56}
        localeText={{
          noRowsLabel: emptyMessage,
        }}
        {...(pagination
          ? {
              pagination: true as const,
              paginationMode: 'server' as const,
              rowCount: pagination.total,
              paginationModel,
              pageSizeOptions: pagination.rowsPerPageOptions ?? [10, 20, 50],
              onPaginationModelChange: (model: GridPaginationModel) => {
                if (model.page !== pagination.page) {
                  pagination.onPageChange(model.page);
                }
                if (model.pageSize !== pagination.rowsPerPage) {
                  pagination.onRowsPerPageChange(model.pageSize);
                }
              },
            }
          : {})}
        sx={{
          border: '1px solid #eaecf0',
          borderRadius: '12px',
          backgroundColor: '#fff',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #eaecf0',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 600,
            color: '#1f2937',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: '1px solid #f1f3f5',
            color: '#1f2937',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: '#e8f4ff',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: '#fff3e8',
          },
          '& .MuiDataGrid-row.Mui-selected:hover': {
            backgroundColor: '#ffe8d1',
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #eaecf0',
          },
        }}
      />
    </Box>
  );
}
