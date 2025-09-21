import { LightningElement,track,api } from 'lwc';
import registerUser from "@salesforce/apex/LeaseAndDriveController.registerUser"
import backgroundpic from "@salesforce/resourceUrl/background";

export default class registration extends LightningElement {
    @track backgroundpic=backgroundpic;
    result;
    toast=false;
    @track customer={};
    @track roleOptions = [
        { label: 'Renter', value: 'Renter' },
        { label: 'Leaser', value: 'Leaser' }
    ];
    
    
    handleLogin(){
        this.dispatchEvent(new CustomEvent('close'));
      }
    get bgImageStyle() {
        return `background-image: url(${backgroundpic});`;
    }
    handleInputChange(event) {
        this.customer[event.target.name]=event.target.value;
        
    }

    handleRegister() {
        console.log(JSON.stringify(this.customer));
        registerUser({userDetail: this.customer})
        .then(result => {
            console.log(JSON.stringify(result));
            this.result=JSON.stringify(result);
            this.toast=true;
            this.handleLogin();
        })
        .catch(error=>{
            
            console.log('ERROR : ',error.body.message);
            const toast = this.template.querySelector('c-toast-message');
            toast.message = JSON.stringify(error);
            toast.variant = 'error';
            toast.showToast();
            
        })
        
        
    }
    handleLogin(){
        
    this.dispatchEvent(new CustomEvent('close',{
        detail: {
            message: this.result,
            variant: 'success',
            toast : this.toast
        }
        
        }));
    }
    
}