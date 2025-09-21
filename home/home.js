import { LightningElement,api, track } from 'lwc';
import getVehicle from "@salesforce/apex/LeaseAndDriveController.getVehicle";
import createBooking from "@salesforce/apex/LeaseAndDriveController.createBooking";
import defaultphotoUrl from "@salesforce/resourceUrl/defaultCar";
import updateVehicle from "@salesforce/apex/LeaseAndDriveController.updateVehicle";

export default class Home extends LightningElement {
        @api role;
        @track isrenter=false;
        @track vehicles=[];
        @api userName;
        @track vehicleId;
        @track defaultphotoUrl=defaultphotoUrl
        location;
        todate;
        fromdate;
        spinner=false;
        isModelOpen=false;
        isAddVehicle=false;

       
        connectedCallback(){
            if(this.role=='Renter')
                this.isrenter=true;
            else{
                this.spinner = true;
                    getVehicle({
                        role: this.role,
                        userName: this.userName
                        })
                    .then(result => {
                        console.log("inside getvehicle");
                    // Map the result to include photoLink for each vehicle
                    this.vehicles = result;
                    // .map(vehicle => {
                    // const photoLink = vehicle.ContentDocumentLinks && vehicle.ContentDocumentLinks.length > 0 
                    // ? '/sfc/servlet.shepherd/version/download/' + vehicle.ContentDocumentLinks[0].LatestPublishedVersionId 
                    // : null; // Default to null if no photo is found
                // return { ...vehicle, photoLink }; // Add photo link to each vehicle object
                // });

                console.log(JSON.stringify(this.vehicles));

                this.spinner = false;
                })
                .catch(error => {
                this.spinner = false; // Ensure spinner is stopped on error
                const toast = this.template.querySelector('c-toast-message');
                toast.message = JSON.stringify(error);
                toast.variant = 'Error';
                toast.showToast();
                });

        }
    }

        handleChange(event){
            const eve=event.target.name;
            if(eve=='fromDate'){
                this.fromdate=event.target.value;
            }
            if(eve=='toDate'){
                this.todate=event.target.value;
            }
            if(eve=='location')
                this.location=event.target.value;
        }

        handleSearch(){
            let today = new Date();
            let formattedDate = today.getFullYear() + '-' + 
                    ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
                    ('0' + today.getDate()).slice(-2);
            console.log('today',formattedDate);
            console.log('todate',this.todate);
            
            if(this.todate<this.fromdate){
                const toast=this.template.querySelector('c-toast-message');
                toast.message='To date cannot be less than from date';
                toast.variant='error';
                toast.showToast();
            }
            else if(this.todate==null || this.fromdate==null){
                const toast=this.template.querySelector('c-toast-message');
                toast.message='Please enter from and to date';
                toast.variant='error';
                toast.showToast();
            }
            else if(this.todate<formattedDate||this.fromdate<formattedDate){
                const toast=this.template.querySelector('c-toast-message');
                toast.message='Booking can only be created for future dates';
                toast.variant='error';
                toast.showToast();
            }
            else{
                this.spinner = true;
                console.log(this.role,this.userName,this.location,this.todate,this.fromdate);
                getVehicle({
                    role: this.role,
                    userName: this.userName,
                    location: this.location,
                    toDate: this.todate,
                    fromDate: this.fromdate
                })
                .then(result => {
                    console.log('result',result);
                    
                    this.vehicles = result;
                    // .map(vehicle => {
                    //     console.log('photolink');
                    //     const photoLink = vehicle.ContentDocumentLinks.length > 0 
                    //         ? '/sfc/servlet.shepherd/version/download/' + vehicle.ContentDocumentLinks[0].LatestPublishedVersionId 
                    //         : this.defaultphotoUrl; // Default to null if no photo is found
                            
                    //     return { ...vehicle, photoLink }; // Add photo link to each vehicle object
                    // });
                
                    console.log(JSON.stringify(this.vehicles));
                
                    if (this.vehicles.length === 0) {
                        const toast = this.template.querySelector('c-toast-message');
                        toast.message = 'No vehicles available';
                        toast.variant = 'error';
                        toast.showToast();
                    }
                
                    this.spinner = false;
                })
                .catch(error => {
                    this.spinner = false;
                    const toast = this.template.querySelector('c-toast-message');
                    toast.message = JSON.stringify(error);
                    toast.variant = 'error';
                    toast.showToast();
                });
                
        }
        }
        openModel(event){
        this.vehicleId=event.target.name;
        console.log('vehid',this.vehicleId);
        this.title='Booking';
        this.message='Do you want to create a booking for this vehicle?';
        this.isModelOpen=true;
        
        }
        closeModel(){
            this.isModelOpen=false;
        }
        handleBooking(){
            console.log('handle booking');
            this.spinner=true;
            createBooking({fromdate:this.fromdate, todate:this.todate, userName:this.userName, vehId:this.vehicleId})
            .then(result=>{
                console.log(result);
                this.spinner=false;
                const toast=this.template.querySelector('c-toast-message');
                toast.message='Booking successfully created';
                toast.variant='success';
                toast.showToast();

            })
            .catch(error=>{
                console.log(JSON.stringify(error));
                const toast=this.template.querySelector('c-toast-message');
                toast.message=JSON.stringify(error.body.message);
                toast.variant='error';
                toast.showToast();
                this.spinner=false;
            })
            this.isModelOpen=false;
            
        }
        addVehicle(){
            this.isAddVehicle=true;
        }
        cancelVehicle(){
            this.isAddVehicle=false;
        }
        saveVehicle(){
            console.log('in home save');
            
            const toast=this.template.querySelector('c-toast-message');
                toast.message=JSON.stringify("Vehicle added successfully");
                toast.variant='success';
                toast.showToast();
            this.isAddVehicle=false;
            this.connectedCallback();
        }
        changeStatus(event){
            const number=event.target.name;
            this.spinner=true;
            updateVehicle({veh:number})
            .then(result=>{
                this.spinner=false;
                const toast=this.template.querySelector('c-toast-message');
                toast.message=JSON.stringify('Status changed successfully');
                toast.variant='success';
                this.connectedCallback();
            })
            .catch(error=>{
                console.log(JSON.stringify(error));
                const toast=this.template.querySelector('c-toast-message');
                toast.message=JSON.stringify(error.body.message);
                toast.variant='error';
                this.spinner=false;
        })
    }

}