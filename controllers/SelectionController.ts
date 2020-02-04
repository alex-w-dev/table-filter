import { Subject } from 'rxjs';
import { ISelection, ITableFilterController } from '@compreno/classes/TableFilter/TableFilter.interfaces';
import { CommonController } from '@compreno/classes/TableFilter/controllers/CommonController';

export class SelectionController extends CommonController implements ITableFilterController<ISelection> {
  totalCount: number;
  onChange: Subject<ISelection>;

  protected params: ISelection;

  constructor() {
    super();
    this.totalCount = 0;
  }

  setTotalCount(totalCount: number) {
    this.totalCount = totalCount;
  }

  getDefaultValue(): ISelection {
    return {
      include: [],
      exclude: [],
      all: false
    };
  }

  getValue(): ISelection {
    return super.getValue();
  }

  clear(): void {
    super.clear();
    this.setTotalCount(0);
  }

  getSelectedCount(): number {
    if (this.params.all) {
      return this.totalCount - this.params.exclude.length;
    } else {
      return this.params.include.length;
    }
  }

  selectItem(item): void {
    const indexOfExclude = this.params.exclude.indexOf(item);
    const indexOfInclude = this.params.include.indexOf(item);

    if (!this.params.all && indexOfInclude === -1) {
      this.params.include.push(item);
    }
    if (indexOfExclude !== -1) {
      this.params.exclude.splice(indexOfExclude, 1);
    }

    this.emitChanges();
    this.allFlagSynchronize();
  }

  unSelectItem(item): void {
    const indexOfExclude = this.params.exclude.indexOf(item);
    const indexOfInclude = this.params.include.indexOf(item);
    if (indexOfExclude === -1) {
      this.params.exclude.push(item);
    }
    if (!this.params.all && indexOfInclude !== -1) {
      this.params.include.splice(indexOfInclude, 1);
    }

    this.emitChanges();
    this.allFlagSynchronize();
  }

  selectAll(): void {
    this.params.include.length = 0;
    this.params.exclude.length = 0;
    this.params.all = true;

    this.emitChanges();
  }

  unSelectAll(): void {
    if (!this.isSomeSelected()) return;

    this.params.include.length = 0;
    this.params.exclude.length = 0;
    this.params.all = false;

    this.emitChanges();
  }

  toggleAllSelection(): void {
    if (this.params.all) {
      this.unSelectAll();
    } else {
      this.selectAll();
    }
  }

  toggleItemSelection(item: any): void {
    if (this.isItemSelected(item)) {
      this.unSelectItem(item);
    } else {
      this.selectItem(item);
    }
  }

  isItemSelected(item): boolean {
    if (this.params.all) {
      return this.params.exclude.indexOf(item) === -1;
    } else {
      return this.params.include.indexOf(item) !== -1;
    }
  }

  isSomeSelected(): boolean {
    return !!(this.params.all || this.params.include.length);
  }

  isSomeSelectedButNotAll(): boolean {
    return this.isSomeSelected() && !this.isAllSelected();
  }

  isAllSelected(): boolean {
    return this.params.all && !this.params.exclude.length;
  }

  private allFlagSynchronize() {
    if (!this.totalCount) return;
    if (this.params.all && this.params.exclude.length === this.totalCount) this.unSelectAll();
    if (!this.params.all && this.params.include.length === this.totalCount) this.selectAll();
  }
}
