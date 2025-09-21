import { LightningElement,api, track } from 'lwc';

export default class Main extends LightningElement {
    @track login=true;
    @api customer={};
    @track currPage;
    @track activePg={
        home:false,
        history:false,
        profile:true,
        logOut:false
    };
    spinner=false;
    
    handleLoginData(event){
        
        this.customer=event.detail.customer;
        this.login=false;
        const toast=this.template.querySelector('c-toast-message');
        toast.message='Logged In Successful ';
        toast.variant='success';
        toast.showToast();
    }

    switchPage(event){
        this.currPage=event.detail;
        console.log('OUTPUT : ',this.currPage);
        this.activePg.home=false;
        this.activePg.history=false;
        this.activePg.profile=false;
        this.activePg.logOut=false;
   
    this.activePg[this.currPage]=true; 
    console.log('active page'+JSON.stringify(this.activePg));
    if(this.currPage=='logOut'){
        sessionStorage.clear()
        this.login=true;
    }
    
}
}