import { ISorting, ITableFilterController } from '@compreno/classes/TableFilter/TableFilter.interfaces';
import { Subject } from 'rxjs';
import { CommonController } from '@compreno/classes/TableFilter/controllers/CommonController';

export class SortingController extends CommonController implements ITableFilterController<ISorting> {
  onChange: Subject<ISorting>;
  protected params: ISorting;

  constructor() {
    super();
  }

  progressSort(fieldName, multi?) {
    // just single field
    const sorting = this.getValue();
    if (sorting[fieldName]) {
      if (sorting[fieldName] === 1) {
        this.setValue({
          [fieldName]: -1,
        });
      } else if (sorting[fieldName] === -1) {
        this.setValue({});
      }
    } else {
      this.setValue({
        [fieldName]: 1
      });
    }
  }

  isSortAscending(fieldName) {
    const sorting = this.getValue();

    return sorting[fieldName] && sorting[fieldName] === 1;
  }

  isSortDescending(fieldName) {
    const sorting = this.getValue();

    return sorting[fieldName] && sorting[fieldName] === -1;
  }

  isSorted(fieldName) {
    const sorting = this.getValue();

    return !!sorting[fieldName];
  }
}
