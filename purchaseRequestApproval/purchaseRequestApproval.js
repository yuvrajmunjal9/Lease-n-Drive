import { LightningElement, track,api } from 'lwc';
import getPendingVehicle from "@salesforce/apex/LeaseAndDriveController.getPendingVehicle";
import approvalProcess from "@salesforce/apex/LeaseAndDriveController.approvalProcess";
export default class MoviePurchaseRequest extends LightningElement {
    @track vehicles = [{
        number__c: '234567',
        status__c: '3456yg',
        type__c: 'sdfghj',
        model__c: 'jkgh',
        color__c: 'fgh',
        address__c: 'fdghbj'
    }];
    spinner=false;

    connectedCallback(){
        console.log('inside connectedCallback');
        console.log('vehicles: '+this.vehicles);
        this.spinner=true;
        getPendingVehicle()
        .then(result => {
            this.vehicles = result;
            console.log(JSON.stringify(this.vehicles));
            this.spinner=false;
        })
        .catch(error=>{
            console.log(error);
            this.spinner=false;
        });
    }

    handleClick(event) {
        // Handle approve action
     console.log("inside handleclick");
     this.spinner=true;
     approvalProcess({status:event.target.name ,vehicleid:event.target.dataset.id})
     .then(result=>{
         console.log("result");
         this.connectedCallback();
         this.spinner=false;
     })
     .catch(error=>{
         console.log(error);
         this.spinner=false;
     });
    }

  
}
