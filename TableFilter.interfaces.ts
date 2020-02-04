import { Subject } from 'rxjs';

export interface ITableFilterController<T> {
  onChange: Subject<T>;
  patchValue(value: T): void;
  setValue(value: T): void;
  getValue(): T;
  getDefaultValue(): T;
  clear(): void;
}

export interface ITableFilterParams {
  selection?: ISelection;
  pagination?: IPagination;
  sorting?: ISorting;
  propertiesFilter?: IPropertiesFilter;
}

export interface ISelection {
  include: string[];
  exclude: string[];
  all: boolean;
}

export interface IPropertiesFilter {
  [key: string]: any;
  selection?: ISelection;
  children?: IPropertiesFilter[];
}

export interface IPagination {
  itemsPerPage?: number;
  currentPage?: number;
}

export interface ISorting {
  [field: string]: 1 | -1;
}

// additional filters:
export interface IFilterParams {
  [field: string]: any;
}

// @fixme: remove interfaces names conflict and simplify union
// tslint:disable-next-line
export interface FilterParams {
  filter?: IFilterParams;
}

export interface IWorkflowTabPropertiesFilterParams {
  projectId?: string;
}
export interface IWorkflowTabTableFilterParams extends ITableFilterParams {
  propertiesFilter?: IWorkflowTabPropertiesFilterParams;
}
// workflow tab end
