import { Subject } from 'rxjs';
import { IPagination, ITableFilterController } from '@compreno/classes/TableFilter/TableFilter.interfaces';
import { CommonController } from '@compreno/classes/TableFilter/controllers/CommonController';

export class PaginationController extends CommonController implements ITableFilterController<IPagination> {
  totalCount: number;
  onChange: Subject<IPagination>;
  onTotalCountChange: Subject<number>;

  protected params: IPagination;

  constructor() {
    super();
    this.totalCount = 0;
    this.onTotalCountChange = new Subject();
  }

  setTotalCount(totalCount: number) {
    this.totalCount = totalCount;
    this.onTotalCountChange.next(this.totalCount);
  }

  setItemsPerPage(perPage) {
    this.params = {...this.params, itemsPerPage: perPage };
    this.onChange.next(this.params);
  }

  getDefaultValue(): IPagination {
    return { itemsPerPage: 50, currentPage: 1 };
  }

  getValue(): IPagination {
    return super.getValue();
  }

  clear(): void {
    super.clear();
    this.setTotalCount(0);
  }
}
