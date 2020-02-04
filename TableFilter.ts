import { SelectionController } from '@compreno/classes/TableFilter/controllers/SelectionController';
import { Subject } from 'rxjs';
import { PaginationController } from '@compreno/classes/TableFilter/controllers/PaginationController';
import { SortingController } from '@compreno/classes/TableFilter/controllers/SortingController';
import {
  IPagination, ISelection, ISorting, ITableFilterParams,
} from '@compreno/classes/TableFilter/TableFilter.interfaces';
import { ColumnFilterController } from '@compreno/classes/TableFilter/controllers/FilterController';
import { PropertiesFilterController } from '@compreno/classes/TableFilter/controllers/PropertiesFilterController';

export class TableFilter {
  onParamsChanged: Subject<ITableFilterParams>;
  totalCount: number = 0;

  private selectionController: SelectionController;
  private paginationController: PaginationController;
  private sortingController: SortingController;
  private propertiesFilterController: PropertiesFilterController;

  private params: ITableFilterParams;
  private propertiesFilterOnChange$: Subject<any>;
  private emitChangesTimeout;

  constructor() {
    this.params = {};
    this.selectionController = new SelectionController();
    this.paginationController = new PaginationController();
    this.sortingController = new SortingController();

    // TODO: Check subscriptions killing
    this.selectionController.onChange.subscribe((selection: ISelection) => {
      this.params.selection = selection;
      this.emitOnParamsChanged();
    });
    this.paginationController.onChange.subscribe((pagination: IPagination) => {
      this.params.pagination = pagination;
      this.emitOnParamsChanged();
    });
    this.sortingController.onChange.subscribe((sorting: ISorting) => {
      this.params.sorting = sorting;
      this.emitOnParamsChanged();
    });

    this.setPropertiesFilterController(new PropertiesFilterController());

    this.onParamsChanged = new Subject();
  }

  clear() {
    this.selectionController.clear();
    this.paginationController.clear();
    this.sortingController.clear();
    if (this.propertiesFilterController) this.propertiesFilterController.clear();

    this.emitOnParamsChanged();
  }

  setTotalCount(totalCount: number) {
    this.totalCount = totalCount;
    this.selectionController.setTotalCount(this.totalCount);
    this.paginationController.setTotalCount(this.totalCount);
  }

  setPropertiesFilterController(controller: PropertiesFilterController) {
    this.propertiesFilterController = controller;

    if (this.propertiesFilterOnChange$) this.propertiesFilterOnChange$.unsubscribe();

    this.propertiesFilterOnChange$ = this.propertiesFilterController.onChange;
    this.propertiesFilterOnChange$.subscribe((propertiesFilter) => {
      this.params.propertiesFilter = propertiesFilter;
      this.emitOnParamsChanged();
    });

  }

  getSelectionController(): SelectionController {
    return this.selectionController;
  }

  getPaginationController(): PaginationController {
    return this.paginationController;
  }

  getSortingController(): SortingController {
    return this.sortingController;
  }

  getPropertiesFilterController(): PropertiesFilterController {
    return this.propertiesFilterController;
  }

  setFilterParams(params: ITableFilterParams): void {
    if (params.selection) {
      this.selectionController.setValue(params.selection);
    }

    if (params.pagination) {
      this.paginationController.setValue(params.pagination);
    }

    if (params.sorting) {
      this.sortingController.setValue(params.sorting);
    }

    if (params.propertiesFilter && this.propertiesFilterController) {
      this.propertiesFilterController.setValue(params.propertiesFilter);
    }
  }

  getFilterParams(): ITableFilterParams {
    return { ...this.params };
  }

  getFilterParamValue(
    paramName: string,
  ): any {
    // todo needs no check all controller's values and get first coincidence
    console.error('Not Implemented getFilterParamValue');

    return null;
  }

  protected emitOnParamsChanged() {
    if (this.emitChangesTimeout) {
      clearTimeout(this.emitChangesTimeout);
    }

    this.emitChangesTimeout = setTimeout(() => {
      this.onParamsChanged.next(this.getFilterParams());
    }, 100);
  }
}
