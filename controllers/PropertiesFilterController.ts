import { Subject } from 'rxjs';
import { IPropertiesFilter, ITableFilterController } from '../TableFilter.interfaces';
import { CommonController } from '@compreno/classes/TableFilter/controllers/CommonController';

export class PropertiesFilterController extends CommonController implements ITableFilterController<IPropertiesFilter> {
  onChange: Subject<IPropertiesFilter>;

  protected params: IPropertiesFilter;

  private defaultValue: any;

  constructor() {
    super();
  }

  setDefaultValue(defaultValue: any) {
    if (typeof defaultValue !== 'object') throw new Error('defaultValue should be an object');

    this.defaultValue = defaultValue;
  }

  getDefaultValue(): IPropertiesFilter {
    return this.defaultValue || super.getDefaultValue();
  }

  clearProperty(propertyName: string) {
    const model = this.getValue();
    const defaultPropertyValue = (this.getDefaultValue() || {})[propertyName];
    if (model[propertyName] && model[propertyName] !== defaultPropertyValue) {
      delete model[propertyName];
      this.setValue(model);
    }
  }
}
