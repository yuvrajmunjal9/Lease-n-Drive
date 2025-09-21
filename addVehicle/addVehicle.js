import { LightningElement,api, track } from 'lwc';
import addVehicle from "@salesforce/apex/LeaseAndDriveController.addVehicle";
import uploadPhoto from '@salesforce/apex/LeaseAndDriveController.uploadPhoto';
export default class AddVehicle extends LightningElement {
    @track vehicle={};
    @track email;
    @track spinner=false;
    recordId;
    @track photoFileName = '';
    @track photoFileContent = '';
    @track photoFileType = '';
    
    @track documentFileName = '';
    @track documentFileContent = '';
    @track documentFileType = '';

    handleInputChange(event) {
        this.vehicle[event.target.name]=event.target.value;
        console.log(this.vehicle);
        
        
    }
    handlePhotoChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.photoFileName = 'photo_' + file.name; // Name it as 'photo'
            this.photoFileType = file.type;

            const reader = new FileReader();
            reader.onloadend = () => {
                this.photoFileContent = reader.result.split(',')[1]; // Get Base64 part
            };
            reader.readAsDataURL(file);
        }
    }
    handleDocumentChange(event) {
        const file = event.target.files[0];
        if (file) {
            this.documentFileName = 'document_' + file.name; // Name it as 'document'
            this.documentFileType = file.type;

            const reader = new FileReader();
            reader.onloadend = () => {
                this.documentFileContent = reader.result.split(',')[1]; // Get Base64 part
            };
            reader.readAsDataURL(file);
        }
    }

    handleSave(){
        this.spinner=true;
        this.email=sessionStorage.getItem("email");
        addVehicle({veh:this.vehicle, email:this.email})
        .then(result => {
        this.recordId = result;
        this.handlePhotoSubmit();
        this.dispatchEvent(new CustomEvent('save'));
        this.spinner=false;
        })
        .catch(error => {
            const toast = this.template.querySelector('c-toast-message');
            toast.message = 'Error';
            toast.variant = 'error';
            toast.showToast();
            this.spinner=false;

        });
    }
    handlePhotoSubmit() {
        // Upload the photo
        if (this.photoFileContent) {
            uploadPhoto({ 
                recordId: this.recordId, 
                fileName: this.photoFileName, 
                base64Data: this.photoFileContent, 
                contentType: this.photoFileType 
            })
            .then(() => {
                console.log('Photo uploaded successfully');
            })
            .catch(error => {
                console.error('Error uploading photo: ', error);
            });
        } else {
            console.error('No photo selected or photo is empty');
        }
        // Upload the document
        if (this.documentFileContent) {
            uploadPhoto({ 
                recordId: this.recordId, 
                fileName: this.documentFileName, 
                base64Data: this.documentFileContent, 
                contentType: this.documentFileType 
            })
            .then(() => {
                console.log('Document uploaded successfully');
            })
            .catch(error => {
                console.error('Error uploading document: ', error);
            });
        } else {
            console.error('No document selected or document is empty');
        }
    }
   

    handleCancel(){
        this.dispatchEvent(new CustomEvent('cancel'));
    }
}
