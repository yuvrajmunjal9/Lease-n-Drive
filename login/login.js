import { LightningElement,track } from 'lwc';
import getDetail from "@salesforce/apex/LeaseAndDriveController.getDetail"
import backgroundpic from "@salesforce/resourceUrl/background";
import logo from "@salesforce/resourceUrl/LandD";
import brownPhoto from "@salesforce/resourceUrl/brownPhoto";
export default class Login extends LightningElement {
    @track backgroundpic=backgroundpic;
    @track brownPhotoUrl = brownPhoto;
    @track logo =logo;
    @track email = '';
    @track password = '';
    @track register=false;
    customer={};
    @track spinner=false;
     get bgImageStyle() {
        return `background-image: url(${backgroundpic});`;
    }
    get coverpage() {
        return `background-image: url(${this.brownPhotoUrl});`;
    }

    connectedCallback(){
        console.log("inside connected callback");
        if(sessionStorage.getItem("email")){
            this.spinner=true;
            console.log("inside ls",sessionStorage.getItem("email"));
            this.email=sessionStorage.getItem("email");
            this.password=sessionStorage.getItem("password");
            this.handleLogin();
        }
    }
     
    handleInputChange(event) {
        const field = event.target.name.toLowerCase();
        console.log(field);
        if (field === 'email') {
            this.email = event.target.value.toLowerCase();
        } else if (field === 'password') {
            this.password = event.target.value;
        }
    }

    handleLogin() {
        // Add login logic here
        console.log("outside ");
        sessionStorage.setItem("email", this.email);
        sessionStorage.setItem("password", this.password);
            getDetail({email:this.email,password:this.password})
            .then(result => {
                this.customer=result;
                console.log("result"+JSON.stringify(this.customer));
                
                if(this.customer.Email__c && this.customer.Password__c){
                    
                this.dispatchEvent(new CustomEvent('loggedin', {
                    detail: {
                        customer:this.customer
                    }
                }));}
                else{
                    console.log("inside else");
                    const notification = this.template.querySelector('c-toast-message');
                    notification.message = 'Invalid Credentials';
                    notification.variant = 'error';
                    notification.showToast();
                }
                this.spinner=false;
            })
            .catch(error=>{
                console.log('ERROR : ',error.body.message);
                const notification = this.template.querySelector('c-toast-message');
                    notification.message = 'Invalid Credentials';
                    notification.variant = 'error';
                    notification.showToast();
                    this.spinner=false;
            })
         
    }
    handleRegister(event){
        console.log("inside handle register");
        this.register=!this.register
        if(event.detail.toast){
        const notification = this.template.querySelector('c-toast-message');
        notification.message = event.detail.message;
        notification.variant = event.detail.variant;
        notification.showToast();   
        }
    }

    handleClick() {
        this.template.querySelector('.brown-screen').classList.add('hidden');
        this.coverPage=false;
    }
    
}