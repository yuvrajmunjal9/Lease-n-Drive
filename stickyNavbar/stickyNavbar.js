import { LightningElement } from 'lwc';
import backgroundpic from "@salesforce/resourceUrl/background";
export default class StickyNavbar extends LightningElement {
     currPage;
     LogoUrl = backgroundpic;
     handleClick(event) {
        // Get all list items
        const items = this.template.querySelectorAll('li');

        // Remove the 'active' class from all items
        items.forEach(item => {
            item.classList.remove('active');
        });
        this.currPage=event.currentTarget.classList[0];
        console.log(this.currPage);
        // Add the 'active' class to the clicked item
        event.currentTarget.classList.add('active');
        const newEvent=new CustomEvent('page',{
            detail:this.currPage
        });
        this.dispatchEvent(newEvent);
        
    }
}