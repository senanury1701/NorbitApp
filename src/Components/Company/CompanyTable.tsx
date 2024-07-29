import React, { Fragment, useEffect, useState } from "react";
import { Modal, ModalFooter, ModalBody, ModalHeader, CardBody, Col, Row, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import {   InputGroupText } from "reactstrap";
import { fetchCompanies } from '../../slices/thunks';

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
  flexRender,
  PaginationState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import CompanyEditModal from '../Company/CompanyEditModal'; 
import CompanyAddModal from '../Company/CompanyAddModal';
import CompanyViewModal from '../Company/CompanyViewModal';
import { useAppDispatch } from '../hooks';
import { deleteCompany } from '../../slices/company/thunks';
import {  useSelector } from 'react-redux';

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
  debounce = 1000, 
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
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
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

const ComponyTable = ({
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
  const dispatch = useAppDispatch();
  const { count } = useSelector((state:any) => state.company);


  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };
  

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
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
    setPageSize,
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

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
 const pageSize = 5; 
  const totalPages = Math.ceil(count / pageSize);

  const getCanPreviousPage = () => page > 0;
  const getCanNextPage = () => page < totalPages - 1;

  const previousPage = () => {
    if (getCanPreviousPage()) setPage(prev => prev - 1);
  };

  const nextPage = () => {
    if (getCanNextPage()) setPage(prev => prev + 1);
  };

  const goToPage = (pageIndex: any) => {
    if (pageIndex >= 0 && pageIndex < totalPages) setPage(pageIndex);
  };


  useEffect(() => {
    dispatch(fetchCompanies(page + 1, search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, page]);

  useEffect(() => {
    setPage(0);
    dispatch(fetchCompanies(page + 1, search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const pageZero = () => {
    setPage(0)
  }
  const handleSearchChange = (value: string | number) => {
    setSearch(value.toString());
  };

  const handleEdit = (rowData:any) => {
    setSelectedRowData(rowData);
    setModalEditOpen(true);
  };

  const toggleEdit = () => {
    setModalEditOpen(!modalEditOpen);
  };

  const handleAdd = () => {
    setModalAddOpen(true);
  };

  const toggleAdd = () => {
    setModalAddOpen(!modalAddOpen);
  };

  const handleView = (id:any) => {
    setSelectedRowId(id);
    setModalViewOpen(true);
  };

  const toggleView = () => {
    setModalViewOpen(!modalViewOpen);
  };

  const onClickDelete = (id: any) => {
    dispatch(deleteCompany(id));
    setPage(0)
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
                <Col xs={6} md={6} className='d-flex'>              
                    <InputGroupText className="input-group-text">
                      <i className="bx bx-search-alt search-icon"></i>
                    </InputGroupText>
                    <DebouncedInput
                      type="text"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                    />                
                </Col>
                <Col xs={6} md={6} className="text-md-end text-center">
                  <button
                    className="btn btn-primary createTask"
                    type="button"
                    onClick={handleAdd}
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
                  <Dropdown isOpen={dropdownOpen[row.original.id]} toggle={() => toggleDropdown(row.original.id)}>
                    <DropdownToggle caret color='primary'>
                      <i className="ri-view-details align-bottom" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => onClickDelete(row.original.id)}>
                        <i className="ri-delete-bin-5-fill align-bottom" /> Delete 
                      </DropdownItem>
                      <DropdownItem onClick={() => handleEdit(row.original)}>
                        <i className="ri-pencil-fill align-bottom" /> Edit
                      </DropdownItem>
                      <DropdownItem onClick={()=> handleView(row.original.id)}>
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
        <Col sm>
          <div className="text-muted">
            Total result <span className="fw-semibold ms-1">{count}</span>
          </div>
        </Col>
        <Col sm="auto">
          <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
            <li className={!getCanPreviousPage() ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link" onClick={previousPage}>Previous</Link>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li className="page-item" key={index}>
                <Link
                  to="#"
                  className={page === index ? "page-link active" : "page-link"}
                  onClick={() => goToPage(index)}
                >
                  {index + 1}
                </Link>
              </li>
            ))}
            <li className={!getCanNextPage() ? "page-item disabled" : "page-item"}>
              <Link to="#" className="page-link" onClick={nextPage}>Next</Link>
            </li>
          </ul>
        </Col>
      </Row>

      <Modal isOpen={modalEditOpen} toggle={toggleEdit} modalClassName="zoomIn" centered tabIndex={-1}>
        <ModalHeader className="p-3 bg-success-subtle"> Edit </ModalHeader>
        <ModalBody className='z-2'>
          <CompanyEditModal rowData={selectedRowData} toggleEdit={toggleEdit} />
        </ModalBody>
        <ModalFooter>
          <button onClick={toggleEdit}>Close</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalAddOpen} toggle={toggleAdd} centered tabIndex={-1}>
        <ModalHeader className="p-3 bg-success-subtle"> Add </ModalHeader>
        <ModalBody>
          <div>
            <CompanyAddModal toggleAdd={toggleAdd} pageZero={pageZero}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <button onClick={toggleAdd}>Close</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalViewOpen} toggle={toggleView} modalClassName="zoomIn" centered tabIndex={-1}>
        <ModalHeader className="p-3 bg-success-subtle"> View </ModalHeader>
        <ModalBody style={{ minHeight: '500px' }}>
          <CompanyViewModal rowId={selectedRowId}/>
        </ModalBody>
        <ModalFooter>
          <button onClick={toggleView}>Close</button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default ComponyTable;
