public class LeaseAndDriveController {
    public LeaseAndDriveController() {

    }

    @AuraEnabled
    public static string registerUser( customer__c userDetail){
        string randStr= generateRandomString();
            Id renterId = Schema.SObjectType.customer__c.getRecordTypeInfosByDeveloperName()
            .get('Renter').getRecordTypeId();
            Id leaserId = Schema.SObjectType.customer__c.getRecordTypeInfosByDeveloperName()
                      .get('Leaser').getRecordTypeId();
    //    try{ System.debug('enter apex'); 
            userDetail.Password__c=randStr;
            if(userDetail.Role__c=='Renter'){
                userDetail.RecordTypeId=renterId;
            }
            else
               { userDetail.RecordTypeId=leaserId;}
           System.debug('newUser :'+userDetail);   
       insert userDetail;
        return sendMail(userDetail.Email__c, 'Account Created Successfully', userDetail.Password__c);
    // } catch(DmlException e) {
        // return ('The following exception has occurred: ' + e.getMessage());
    // }
    
    }

    @AuraEnabled
    public static customer__c getDetail(string email, string password){
        System.debug('enter getdetail');
        customer__c userDetail=[select id, Name,Email__c,Phone__c,Dob__c,DL__c,Role__c,Password__c from customer__c where Email__c=:email and Password__c=:password limit 1];
        System.debug('userdetails'+userDetail);
       return userDetail;
    }

    @AuraEnabled
    public static List<booking__c> getBookingHistory(String userName, String role) {
        if(role=='Leaser'|| role=='leaser'){
            customer__c leaserId=[select id, Email__c from customer__c where Email__c=:userName limit 1];
        return [SELECT name,customer__r.Email__c,customer__r.Name,status__c,fromDate__c,toDate__c, vehicle__r.number__c,vehicle__r.owner__c,vehicle__r.price__c, vehicle__r.model__c,vehicle__r.color__c from booking__c
        WHERE  vehicle__r.owner__c = :leaserId.id order by name desc];
        }
        else{
            system.debug([SELECT name,isCancellabe__c,customer__r.Email__c,customer__r.Name,fromDate__c,toDate__c, vehicle__r.number__c,vehicle__r.price__c, vehicle__r.model__c,vehicle__r.color__c from booking__c
        WHERE  customer__r.Email__c = :userName order by name desc]);
        return [SELECT name,isCancellabe__c,customer__r.Email__c,customer__r.Name,status__c,fromDate__c,toDate__c, vehicle__r.number__c,vehicle__r.price__c, vehicle__r.model__c,vehicle__r.color__c from booking__c
        WHERE  customer__r.Email__c = :userName order by name desc];
        }
       
     }

     @AuraEnabled
     public static void cancelBooking(String bookingname){
        try {
            System.debug(bookingname);
            list<booking__c> booking=[select Name,status__c from booking__c where Name=:bookingname limit 1];
            booking[0].status__c='declined';
            System.debug('booking'+booking);
            update booking;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
     }

     @AuraEnabled
public static List<vehicle__c> getVehicle(String userName, String role, Date toDate, Date fromDate, String location) {
    try {
        List<vehicle__c> vehicles;
        System.debug(role);
        if (role == 'leaser') {
            
            Customer__c leaserId = [SELECT Id, Email__c FROM Customer__c WHERE Email__c = :userName LIMIT 1];
            vehicles = [SELECT Id, Name, Number__c, Price__c, Model__c, Color__c, Type__c, Status__c,Address__c 
                        FROM vehicle__c 
                        WHERE Owner__c = :leaserId.Id];
        } else {
            
            vehicles = [SELECT Id, Name, Number__c, Price__c, Model__c, Color__c, Type__c, Status__c,Address__c 
            FROM vehicle__c 
                        WHERE Address__c = :location AND Status__c = 'Active'];
            System.debug(vehicles);
            Set<Id> vehIdSet = new Set<Id>();
            for (vehicle__c veh : vehicles) {
                vehIdSet.add(veh.Id);
            }
            
            List<booking__c> newveh = [SELECT Id, Vehicle__c, ToDate__c, FromDate__c 
                                        FROM booking__c 
                                        WHERE Vehicle__c IN :vehIdSet 
                                        AND (ToDate__c > :fromDate OR (FromDate__c < :toDate AND FromDate__c>:fromDate))];
                                        

            for (booking__c veh2 : newveh) {
                vehicle__c removeVeh= [SELECT Id, Name, Number__c, Price__c, Model__c, Color__c, Type__c, Status__c,Address__c 
                FROM vehicle__c 
                WHERE Id =:veh2.Vehicle__c limit 1];
                System.debug(removeVeh);
                if(vehicles.indexOf(removeVeh)>-1)
                vehicles.remove(vehicles.indexof(removeVeh));
            }

        }
        System.debug(vehicles);
        return vehicles;

    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}


     @AuraEnabled
     public static void createBooking(date todate, date fromdate, string userName, id vehId ){
        try {
            booking__c booking=new booking__c();
        booking.customer__c=[select id from customer__c where Email__c=:userName limit 1].id;
        booking.vehicle__c=vehId;
        booking.fromdate__c=fromdate;
        booking.toDate__c=todate;
        system.debug(vehId);
        Insert booking;
        system.debug(booking);
        } catch (Exception e) {
            System.debug(e);
            System.debug(e.getLineNumber());
            throw new AuraHandledException(e.getMessage());
            
        }
     }
@AuraEnabled
public static void giveRating(string vehNumber,integer rating, string comment, string email){
    try {
        id vehId=[select id,number__c from vehicle__c where number__c=:vehNumber limit 1].id;
        id cId=[select id from customer__c where Email__c=:email limit 1].id;
        list<Rating__c> oldr=[select id, vehicle__c, customer__c from Rating__c where vehicle__c=:vehId and customer__c=:cId];
        System.debug(oldr);
        if(!oldr.isEmpty()){
            oldr[0].rate__c=rating;
            oldr[0].comment__c=comment;
            update oldr;
         }
         else{
        Rating__c r=new Rating__c();
         r.rate__c=rating;
         r.vehicle__c=vehId;
         r.customer__c=cId;
         r.comment__c=comment;
         insert r;
         System.debug(r);
         }
    } catch (Exception e) {
        System.debug(e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static Rating__c getRating(string vehNumber, string email){
    try {
        id vehicle=[select id,number__c from vehicle__c where number__c=:vehNumber limit 1].id;
        id customer=[select id from customer__c where Email__c=:email limit 1].id;
        Rating__c r=[select rate__c,customer__c,vehicle__c,comment__c from Rating__c where vehicle__c=:vehicle and customer__c=:customer limit 1];
        return r;
    } catch (Exception e) {
        System.debug(e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static string addVehicle( vehicle__c veh, string email){
    try {
        System.debug(veh);
        veh.owner__c=[select id from customer__c where Email__c=:email limit 1].id;
        veh.status__c=	'Pending';
            insert veh;
        return veh.id;
    } catch (Exception e) {
        System.debug(e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static void uploadPhoto(String recordId, String fileName, String base64Data, String contentType) {
    try {
        // Create a ContentVersion object
        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = fileName; // Set the desired name (photo or document)
        contentVersion.PathOnClient = fileName; // Path on client can be the same
        contentVersion.VersionData = EncodingUtil.base64Decode(base64Data);
        contentVersion.ContentLocation = 'S';
        contentVersion.FirstPublishLocationId = recordId; // Associate with the vehicle__c record
        insert contentVersion;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static void updateVehicle(string veh){
    try {
            vehicle__c vehicle=[select id,number__c,status__c from vehicle__c where number__c=:veh];
            if(vehicle.status__c=='Active'){
                vehicle.status__c='InActive';
            }
            else if(vehicle.status__c=='InActive'){
                vehicle.status__c='Active';  
            } 
            update vehicle;
    } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static list<vehicle__c> getPendingVehicle(){
    try {
        list<vehicle__c> veh=[select id,number__c,status__c,type__c,model__c,color__c,address__c from vehicle__c where status__c=:'Pending'];
        System.debug('Pending vehicle '+veh);
        
        return veh;
    } catch (Exception e) {
        System.debug(e.getMessage());
        throw new AuraHandledException(e.getMessage());
    }
}
@AuraEnabled
public static void approvalProcess(string vehicleid, string status) {
    try {
        vehicle__c v=[select id,number__c,status__c from vehicle__c where number__c=:vehicleid limit 1];
        if(status=='Approve'){
            v.status__c='Active';
        }
        else if(status=='Reject'){
            v.status__c='Declined';
        }
        update v;
     } catch (Exception e) {
        throw new AuraHandledException(e.getMessage());
    }
}



    public static string generateRandomString(){
        final String chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz1234567890';
        String randStr = '';
        while (randStr.length() < 5) {
           Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), chars.length());
           randStr += chars.substring(idx, idx+1);
        }
            system.debug('Value----'+randStr); 
            return randStr;
    }

    public static string sendMail(String address, String subject, String password) {
        String body='Your Registered \n Email='+address+' \n and password is= '+password;
        
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {address};
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setPlainTextBody(body);
        
        Messaging.SendEmailResult[] results = Messaging.sendEmail(
                                 new Messaging.SingleEmailMessage[] { mail });
        return inspectResults(results);
    }
    // Helper method
    private static string inspectResults(Messaging.SendEmailResult[] results) {
        string sendResult = 'true';
        
        for (Messaging.SendEmailResult res : results) {
            if (res.isSuccess()) {
                return ('Account Registered successfully: Please Check your mail');
            }
            else {
                sendResult = 'false';
               return ('The following errors occurred: ' + res.getErrors());                 
            }
        }
        return sendResult;
    }
}