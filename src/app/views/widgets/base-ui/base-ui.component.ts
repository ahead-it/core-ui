import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FieldTypeEnum, ObjectUtilsService } from 'src/app/core';
import { LayoutService } from '../../services/layout.service';
import { UIActionsService } from '../../services/ui-actions.service';

@Component({
  selector: '[base-ui]',
  templateUrl: './base-ui.component.html'
})
export class BaseUIComponent implements OnInit {

  @Input() item: any;
  @Input() componentControl: any;
  @Input() parentFormGroup!: FormGroup;
  @Input() noCaption: boolean = false;

  componentEnabled$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * Returns True if data inside component is modified by user.
   * Used to avoid useful messages to server.
   */
  isModified = false;

  private _originalValue: any;
  public get originalValue(): any {
    return this._originalValue;
  }
  public set originalValue(value: any) {
    this._originalValue = value;
  }

  constructor(protected uiActions: UIActionsService, 
    protected layoutService: LayoutService,
    protected utils: ObjectUtilsService) {
  }

  ngOnInit() {
  }

  /**
   * Blur on input field standard event handler
   * @param e Event
   */
  blurInput(e: Event) {
    if (this.isModified) { // this.parentFormGroup.controls[this.item.codename].dirty &&
      this.uiActions.itemValidate(e, this.componentControl.page.id, this.item.id);
      this.setModified(false);
    }
  }

  /**
   * isModified property setter
   * @param isModified Current value
   */
  setModified(isModified: boolean) {

    if (this.isModified !== isModified)
      this.isModified = isModified;
  }

  getTextFieldType(): string {
    switch (this.item.fieldtype) {
      case FieldTypeEnum.TextField:
      default: {
        return 'text';
      }

      case FieldTypeEnum.Password:
        return 'password';

      case FieldTypeEnum.Number:
      case FieldTypeEnum.NumberDecimal:
        return 'number';
    }
  }

  getTextFieldStep(): string {
    switch (this.item.fieldtype) {
      default: {
        return '0';
      }

      case FieldTypeEnum.NumberDecimal:
        return '0.1';

      case FieldTypeEnum.Number:
        return '1';
    }
  }

  showEditIcon(): boolean {
    return !(this.getTextFieldType() === 'number');
  }
}
