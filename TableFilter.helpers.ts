import { Subject } from 'rxjs/Subject';
import { TableFilter } from '@compreno/classes/TableFilter/TableFilter';
import { HelpersService } from '@compreno/services/helpers.service';

export class TableFilterHelpers {
  static merge(mainTableFilter: TableFilter, ...anyTableFilters: TableFilter[]) {
    const tableFilter: TableFilter = new TableFilter();

    tableFilter.getPaginationController().setValue(mainTableFilter.getPaginationController().getValue());

    tableFilter.getSelectionController().setValue(mainTableFilter.getSelectionController().getValue());

    for (const allInputTableFilter of [...anyTableFilters, mainTableFilter]) {
      tableFilter.getSortingController().patchValue(allInputTableFilter.getSortingController().getValue());
    }

    const propertiesFilterChildren = anyTableFilters.map((anyTableFilter) => {
      const anyPropertiesTableFilter = anyTableFilter.getPropertiesFilterController().getValue();
      anyPropertiesTableFilter.selection = anyTableFilter.getSelectionController().getValue();

      return anyPropertiesTableFilter;
    });
    tableFilter.getPropertiesFilterController().setValue(
      Object.assign(
        {
          children: propertiesFilterChildren,
        },
        mainTableFilter.getPropertiesFilterController().getValue(),
      )
    );

    return tableFilter;
  }

  /*
  * attention! tableFilter.propertiesFilter must have just string values
  * */
  static getFilteredData<T extends object>(tableFilter: TableFilter, items: T[], applyPagination: boolean = true): {
    filteredItems: T[],
    // filtered but not paginated items's length
    totalCount: number,
  } {
    const propertiesFilterValue = tableFilter.getPropertiesFilterController().getValue();
    const sortingValue = tableFilter.getSortingController().getValue();

    // filtering
    let filteredItems: T[] = items.filter((row) => {
      return Object.keys(propertiesFilterValue).every((filterName) => {
        const val = propertiesFilterValue[filterName].toLowerCase();
        const rowData = HelpersService.deepFind(row, filterName, '');

        if (rowData) {
          return rowData.toString().toLowerCase().includes(val) || !val;
        }
      });
    });

    const totalCount = filteredItems.length;

    // sorting
    if (sortingValue) {
      Object.keys(sortingValue).forEach((sortName) => {
        filteredItems = HelpersService.caseSensitiveSort(filteredItems, sortName, sortingValue[sortName]);
      });
    }

    // paginate
    if (applyPagination) {
      const paginationValue = tableFilter.getPaginationController().getValue();
      filteredItems = filteredItems.splice((paginationValue.currentPage - 1) * paginationValue.itemsPerPage, paginationValue.itemsPerPage);
    }

    return {
      filteredItems,
      totalCount,
    };
  }

  /* get selected items according table filter (uses for memory types) */
  static getSelectedItems<T extends object>(tableFilter: TableFilter, items: T[], selectionFieldName: string = 'id'): T[] {
    // filtering
    const filteredItems: T[] = TableFilterHelpers.getFilteredData(tableFilter, items, false).filteredItems;
    const tableFilterSelectionController = tableFilter.getSelectionController();

    return filteredItems
      .filter((item) => tableFilterSelectionController.isItemSelected(HelpersService.deepFind(item, selectionFieldName)));
  }
}
