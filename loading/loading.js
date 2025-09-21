import { LightningElement,api,track} from 'lwc';
import carLogo from "@salesforce/resourceUrl/loader";

export default class Loading extends LightningElement {
    @track carlogo=carLogo;
}