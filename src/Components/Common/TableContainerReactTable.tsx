import React, { Fragment, useEffect, useState } from "react";
import { CardBody, Col, Row, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import {
  Column,
  Table as ReactTable,
  ColumnFiltersState,
  FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

const Filter = ({
  column
}: {
  column: Column<any, unknown>;
  table: ReactTable<any>;
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input {...props} value={value} id="search-bar-0" className="form-control border-0 search" onChange={e => setValue(e.target.value)} />
  );
};

interface TableContainerProps {
  columns?: any;
  data?: any;
  isGlobalFilter?: any;
  handleTaskClick?: any;
  customPageSize?: any;
  tableClass?: any;
  theadClass?: any;
  trClass?: any;
  iscustomPageSize?: any;
  thClass?: any;
  divClass?: any;
  SearchPlaceholder?: any;
  handleLeadClick?: any;
  handleCompanyClick?: any;
  handleContactClick?: any;
  handleTicketClick?: any;
  isBordered?: any;
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  isBordered
}: TableContainerProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    setPageSize,
    getState
  } = table;

  interface DropdownState {
    [key: number]: boolean;
  }

  const [dropdownOpen, setDropdownOpen] = useState<DropdownState>({});

  const toggleDropdown = (rowId: number) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [rowId]: !prevState[rowId]
    }));
  };

  const handleAdd = () => {
    console.log('add');
  };

  const onClickDelete = (id: any) => {
    console.log('delete' + id);
  };

  const handleClickUpdate = (id: any) => {
    console.log('update' + id);
  };

  const handleClickView = (id: any) => {
    console.log('view' + id);
  };

  useEffect(() => {
    Number(customPageSize) && setPageSize(Number(customPageSize));
  }, [customPageSize, setPageSize]);

  return (
    <Fragment>
      {isGlobalFilter && (
        <Row className="mb-3">
          <CardBody className="border border-dashed border-end-0 border-start-0">
            <form>
              <Row className="align-items-center">
                <Col xs={6} md={6}>
                  <div className="search-box me-2 mb-2 d-inline-block w-100">
                    <DebouncedInput
                      value={globalFilter ?? ''}
                      onChange={value => setGlobalFilter(String(value))}
                      placeholder={SearchPlaceholder}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                </Col>
                <Col xs={6} md={6} className="text-md-end text-center">
                  <button
                    className="btn btn-primary createTask"
                    type="button"
                    onClick={() => handleAdd()}
                  >
                    <i className="ri-add-fill align-bottom" /> Add
                  </button>
                </Col>
              </Row>
            </form>
          </CardBody>
        </Row>
      )}

      <div className={divClass} style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Table hover className={tableClass}>
          <thead className={theadClass}>
            {getHeaderGroups().map((headerGroup: any) => (
              <tr className={trClass} key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    className={thClass}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <React.Fragment>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: '',
                          desc: ' ',
                        }[header.column.getIsSorted() as string] ?? null}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </React.Fragment>
                    )}
                  </th>
                ))}
                <th className={thClass}>Actions</th>
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map((row: any) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td>
                  <Dropdown isOpen={dropdownOpen[row.id]} toggle={() => toggleDropdown(row.id)}>
                    <DropdownToggle caret color='primary'>
                      <i className="ri-view-details align-bottom" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => onClickDelete(row.id)}>
                        <i className="ri-delete-bin-5-fill align-bottom" /> Delete
                      </DropdownItem>
                      <DropdownItem onClick={() => handleClickUpdate(row.id)}>
                        <i className="ri-pencil-fill align-bottom" /> Edit
                      </DropdownItem>
                      <DropdownItem onClick={() => handleClickView(row.id)}>
                        <i className="ri-eye-fill align-bottom" /> View
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
          <div className="text-muted">
            Showing <span className="fw-semibold ms-1">{getState().pagination.pageSize}</span> of <span className="fw-semibold">{data.length}</span> Results
          </div>
        </div>
        <div className="col-sm-auto">
          <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li className={!getCanPreviousPage() ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link" onClick={previousPage}>Previous</Link>
            </li>
            {getPageOptions().map((item: any, key: number) => (
              <React.Fragment key={key}>
                <li className="page-item">
                  <Link
                    to="#"
                    className={getState().pagination.pageIndex === item ? "page-link active" : "page-link"}
                    onClick={() => setPageIndex(item)}
                  >
                    {item + 1}
                  </Link>
                </li>
              </React.Fragment>
            ))}
            <li className={!getCanNextPage() ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link" onClick={nextPage}>Next</Link>
            </li>
          </ul>
        </div>
      </Row>
    </Fragment>
  );
};

export default TableContainer;
