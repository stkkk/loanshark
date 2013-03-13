/*
 * File: app/controller/Debt.js
 *
 * This file was generated by Sencha Architect version 2.2.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Payback.controller.Debt', {
    extend: 'Ext.app.Controller',

    config: {
        routes: {
            '/Debt/:id': 'gotoDebtDetail'
        },

        refs: {
            DebtDetail: {
                autoCreate: true,
                selector: 'DebtDetail',
                xtype: 'DebtDetail'
            },
            myDebtDataView: '#myDebtDataView',
            myPaymentDataView: '#myPaymentDataView',
            addPaymentButton: '#addPayment',
            emailDebtButton: '#emailDebt',
            MainView: 'MainView',
            addDebtButton: '#addDebt',
            debtHeaderLabel: '#debtHeaderLabel',
            paymentHistoryLabel: '#paymentHistoryLabel'
        },

        control: {
            "#addDebt": {
                tap: 'onAddDebtTap'
            },
            "#saveDebt": {
                tap: 'onSaveDebtTap'
            },
            "#cancelDebt": {
                tap: 'onCanelButtonTap'
            },
            "#myDebtDataView": {
                itemswipe: 'onDataviewItemSwipe',
                itemtap: 'onDataviewItemTap'
            },
            "#emailDebt": {
                tap: 'onEmailDebtTap'
            }
        }
    },

    onAddDebtTap: function(button, e, eOpts) {
        var form = this.getDebtDetail();
        form.reset();
        form.setRecord(null); //remove record from form

        //sets date field to today
        form.down('datepickerfield').setValue(new Date());

        //clears filter placed on Payment store
        Ext.getStore('Payments').clearFilter();

        //hides buttons and payment data view on new debts
        this.getAddPaymentButton().hide();
        this.getMyPaymentDataView().hide();
        this.getEmailDebtButton().hide();
        this.getDebtHeaderLabel().hide();
        this.getPaymentHistoryLabel().hide();

        //remember previous panel to return to
        this.prevPanel = Ext.Viewport.getActiveItem();

        //set selectfield to record name if exists
        var prevRecord = this.prevPanel.getRecord();
        if(prevRecord) {
            var name = prevRecord.get('name');
            form.down('selectfield').setValue(name);
        }

        //update url
        this.getApplication().getHistory().add(new Ext.app.Action({
            url: '/Debt/add'
        }), true);

        //set active item
        Ext.Viewport.setActiveItem(form);
    },

    onSaveDebtTap: function(button, e, eOpts) {

        var form = this.getDebtDetail(),
            record = form.getRecord(),
            values = form.getValues(),
            person = this.getDebtDetail().down('selectfield').record; //gets person from selectfield

            values.amount = (values.amount)?values.amount.toFixed(2):0;


        if(record) { //edit old record

            //sets values from form into record
            record.set(values);

            //if the person is changed in the record
            if (record.isModified('person_id')) {
                record.getPerson().debts().remove(record); //remove debts from old
                record.setPerson(values.person_id); //sets new person

                //bug in the framework(reported as TOUCH-3106),sets up the Person instance again with the correct person value
                delete record.PersonBelongsToInstance;
                record.getPerson(); // bug, Sets up the Person instance reference again
            }

            record.set('balance',0); //setting the balance calls the convert field again to update the debt
            record.save();

        } else {  //new record 
            var debt = person.debts().add(values)[0]; //add values
            person.debts().sync();
            debt.getPerson(); //bug in the framework(reported as TOUCH-3073), this associates the debt with the person in the store
        }

        //calc balance for the person
        person.calcBalance();

        //load data into debt store from localStorage
        Ext.getStore('Debts').load();

        //update people store
        Ext.getStore('People').load(function(){
            this.getApplication().getController('Summary').updateSummary();
        },
        this);

        //refresh debt panel dataview with any new data
        this.getMainView().getInnerItems()[1].down('dataview').refresh();

        //update url
        this.getApplication().getHistory().add(new Ext.app.Action({
            url: '/Debt'
        }), true);

        //set active item
        Ext.Viewport.setActiveItem(this.prevPanel);
    },

    onCanelButtonTap: function(button, e, eOpts) {
        this.getDebtDetail().reset(); //reset form

        //update url
        if(this.prevPanel instanceof Payback.view.MainView) {
            this.getApplication().getHistory().add(new Ext.app.Action({
                url: '/Debt'
            }), true);
        }

        //set active item
        Ext.Viewport.setActiveItem(this.prevPanel);
    },

    onDataviewItemSwipe: function(dataview, index, target, record, e, eOpts) {
        var deleteButtons = dataview.query('button');

        //hides other delete buttons
        for (var i=0; i < deleteButtons.length; i++) {
            deleteButtons[i].hide();
        }

        var labels = Ext.select(target.getObservableId() +' .money-label');
        labels.hide();

        //shows current delete button
        target.query('button')[0].show();

        //hides delete button if anywhere else is tapped
        Ext.Viewport.element.on({tap:function(){
            target.query('button')[0].hide();
            labels.show();
        }, single:true});
    },

    onDataviewItemTap: function(dataview, index, target, record, e, eOpts) {

        var form = this.getDebtDetail();
        form.setRecord(record); //sets record for the form

        //clears filter on store and sets a new one, this shows only the payments associated with the debt tapped
        Ext.getStore('Payments').clearFilter();
        Ext.getStore('Payments').filter("debt_id", record.get('id'));

        //update debt balance label
        var header = this.getDebtHeaderLabel();
        var balance = record.get('balance');
        var str = ((balance<0)?'-':'')+'$'+Math.abs(balance).toFixed(2);
        header.setHtml(str);

        //show hidden components if any
        this.getAddPaymentButton().show();
        this.getMyPaymentDataView().show();
        this.getEmailDebtButton().show();
        this.getDebtHeaderLabel().show();
        this.getPaymentHistoryLabel().show();

        //remember previous panel to return to
        this.prevPanel = Ext.Viewport.getActiveItem();

        //scroll to top
        this.getDebtDetail().getScrollable().getScroller().scrollToTop();

        //update url if not on contact detail
        if(dataview.up('panel') instanceof Payback.view.Debts) {
            this.getApplication().getHistory().add(new Ext.app.Action({
                url: '/Debt/' + (index+1)
            }), true);
        }

        Ext.Viewport.setActiveItem(form);

        //set headerLabel font size, this needs to be after the active item is set
        var fontSize = 75;
        var maxHeight = header.getHeight();
        var maxWidth = Ext.Viewport.getWindowWidth()-20;
        var textHeight;
        var textWidth;
        do {
            header.setStyle({'font-size': fontSize+'px'});
            textHeight = header.innerHtmlElement.getHeight();
            textWidth = header.innerHtmlElement.getWidth();
            fontSize = fontSize - 1;
        } while ((textHeight > maxHeight || textWidth > maxWidth) && fontSize > 3);
        header.setStyle({'padding-top': (100-textHeight)/2+'px'}); //center text
    },

    onEmailDebtTap: function(button, e, eOpts) {

        var record = this.getDebtDetail().getRecord();
        record.set('balance',0); //calls convert field again on debt, this updates the debt with any new payments added to debt

        var person = this.getDebtDetail().down('selectfield').record, //gets person from selectfield
        email = person.get('email'),
        name = person.get('name'),
        subject = encodeURIComponent("Where's my money?!"),
        body = encodeURIComponent("Dear "+name+",\n\nYou owe me $"+record.get('balance')+". Pay soon or my friend Li'l Abe will come pay ya a visit.\n\nSincerely,\n\nYour friendly neighborhood loan shark");

        window.location.href = "mailto:"+email+"?subject=" + subject+"&body="+body; 
    },

    gotoDebtDetail: function(id) {

        this.getMainView().setActiveItem(1);

        if(id=="add") {
            this.getAddDebtButton().onTap();
        } else {

            id--;
            var dataView = this.getMyDebtDataView();
            var dataItem = dataView.getItems().getAt(0).getInnerItems()[id];

            if(dataItem) {
                this.onDataviewItemTap(dataView,id,null, dataItem.getRecord());  
            }
        }
    }

});