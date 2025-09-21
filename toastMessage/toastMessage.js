import { LightningElement,api,track } from 'lwc';

export default class ToastMessage extends LightningElement {
  @api message;
  
    @api variant = 'info'; // 'success', 'warning', 'error', or 'info'
    @track cname;
    @api duration = 3000; // Default duration of 3 seconds
    visible = false;

    @api showToast() {
        this.visible = true;
        this.cname='slds-notify slds-notify_toast slds-theme_'+this.variant;
        if (this.duration > 0) {
            setTimeout(() => {
                this.closeToast();
            }, this.duration);
        }
    }

    closeToast() {
        this.visible = false;
    }
}