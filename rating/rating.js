import { LightningElement ,api, track} from 'lwc';
import giveRating from "@salesforce/apex/LeaseAndDriveController.giveRating";
import getRating from "@salesforce/apex/LeaseAndDriveController.getRating";
export default class Rating extends LightningElement {
    
    @api vehicleNumber;
    @track rating=" ";
    @track email;
    @track spinner=false;
    @track comment;

    connectedCallback(){
        this.spinner=true;
        this.email=sessionStorage.getItem("email");
        getRating({vehNumber:this.vehicleNumber, email:this.email})
        .then(result=>{
            console.log(JSON.stringify(result));
            if(!result.isEmpty()){
            this.rating=result.Rate__c;
            this.comment=result.comment__c;
            }
            this.spinner=false;
        })
        .catch(error=>{
            console.log('ERROR : ',error);
            this.spinner=false;
        })
    }
    handleRatingChange(event){
        const name=event.target.name;
        if(name=='quantity')
        this.rating = event.target.value;
        else{
            this.comment=event.target.value;
        }
    }

    handleSave(){
        
        console.log('iside save');
        this.spinner=true;
        giveRating({vehNumber:this.vehicleNumber, rating:this.rating, comment: this.comment, email:this.email})
        .then(result=>{
            console.log('Result : ',JSON.stringify(result));
            const notification = this.template.querySelector('c-toast-message');
                    notification.message = 'Rating updated successfully';
                    notification.variant = 'success';
                    notification.showToast();
                    this.spinner=false;
                    this.handleCancel();
        })
        .catch(error=>{
            console.log('ERROR : ',error.body.message);
            const notification = this.template.querySelector('c-toast-message');
                    notification.message = error.body.message;
                    notification.variant = 'error';
                    notification.showToast();
                    this.spinner=false;
                    this.handleCancel();
        })
        
    }
    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'));
    }
}