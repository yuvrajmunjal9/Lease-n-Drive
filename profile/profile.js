import { LightningElement,api, track } from 'lwc';
import backgroundpic from "@salesforce/resourceUrl/image1";
import profileimg from "@salesforce/resourceUrl/profile";
export default class Profile extends LightningElement {
    @track backgroundpic=backgroundpic;
    @track profileimg=profileimg;
    @api  customer={
     Name: 'Augustine',
     Email__c:'your.email@example.com',
     Phone__c:'123-456-7890',
     DL__c:'ABC1234',
     DOB__c:'15-08-2002',   
     Role__c: 'Renter' // or 'Leaser'
    }

    get bgImageStyle() {
        return `background-image: url(${backgroundpic});`;
    }

    connectedCallback(){
        console.log(JSON.stringify(this.customer));
    }
}