import { LightningElement, track ,api} from 'lwc';
import getBookingHistory from "@salesforce/apex/LeaseAndDriveController.getBookingHistory";
import cancelBooking from "@salesforce/apex/LeaseAndDriveController.cancelBooking";
export default class History extends LightningElement {
    @api userName;
    @api role;
    @track isrenter=false;
    @track bookingsDetails = [];
    @track isModelOpen=false;
    @track isRating=false;
    @api title;
    @api message;
    @track status;
    @track vehicleNumber;
    spinner=false;

    connectedCallback(){
        console.log(this.role);
        if(this.role=='Renter')
        this.isrenter=true;
        this.spinner=true;
        getBookingHistory({userName:this.userName,role:this.role})
        .then(data=>{
            this.bookingsDetails=data;            
            console.log('vehicles : ',JSON.stringify(this.bookingsDetails));
            this.spinner=false;
        })
        .catch(error=>{
            console.log('ERROR : ',error.body.message);
            this.spinner=false;
        })
       
    }
    openModel(event){
        this.status=event.target.dataset.id;
        console.log('clicked');
        this.title='Cancel Booking';
        this.message='Do you really want to cancel this booking?';
        this.isModelOpen=true;
        
    }
    cancelBooking(){
        this.spinner=true;
        cancelBooking({bookingname:this.status})
        .then(result=>{
            console.log(result);
            this.isModelOpen=false;
            const notification = this.template.querySelector('c-toast-message');
                    notification.message = 'Booking cancelled Successfully';
                    notification.variant = 'error';
                    notification.showToast();
                    this.connectedCallback();
                    this.spinner=false;
        })
        .catch(error=>{
            console.log('Error :',error.body.message);
            this.spinner=false;
        })
    
    }
    saveModel(){
            this.cancelBooking();
        
        
    }
    closeModel(){
        this.isModelOpen=false;
        this.isRating=false;
    }

    giveRating(event){
        this.vehicleNumber=event.target.name;
       console.log('inside giveRating');
       
        this.isRating=true;
        
    }
    
   
}
