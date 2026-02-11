import { Component } from '@angular/core';

@Component({
  selector: 'app-customerA-widget',
  template: `
    <div class="customerA-widget">
      <h3>CustomerA Custom Widget</h3>
      <app-shared-button variant="primary">
        Core Button (Should be Blue)
      </app-shared-button>
      
      <button class="customerA-custom-btn">
        CustomerA Custom Button (Should be Red)
      </button>
    </div>
  `,
  styleUrls: ['./customerA-widget.component.scss']
})
export class CustomerAWidgetComponent {}