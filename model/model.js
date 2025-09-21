import { LightningElement,api } from 'lwc';

export default class Model extends LightningElement {
    @api title;
    @api message;

    renderedCallback() {
        this.template.querySelector('.message-content').innerHTML = this.message;
    }
    handleSave(){
        this.dispatchEvent(new CustomEvent('save'));

    }
    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'));
    }
}