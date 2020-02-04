import { Subject } from 'rxjs';
import { IFilterParams, ITableFilterController } from '@compreno/classes/TableFilter/TableFilter.interfaces';

export class CommonController implements ITableFilterController<IFilterParams> {
  onChange: Subject<IFilterParams>;

  protected params: IFilterParams;

  constructor() {
    this.params = this.getDefaultValue();
    this.onChange = new Subject();
  }

  setValue(params: any): void {
    if (typeof params !== 'object') throw new Error('params should be an object');

    if (JSON.stringify(this.params) !== JSON.stringify(params)) {
      this.params = { ...params };
      this.emitChanges();
    }
  }

  patchValue(params: any) {
    if (typeof params !== 'object') throw new Error('params should be an object');

    Object.assign(this.params, params);

    this.emitChanges();
  }

  getValue(): any {
    return { ...this.params };
  }

  getDefaultValue(): any {
    return {};
  }

  clear(): void {
    this.setValue(this.getDefaultValue());
  }

  emitChanges() {
    this.onChange.next(this.getValue());
  }
}
