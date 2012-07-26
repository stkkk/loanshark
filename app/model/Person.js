/*
 * File: app/model/Person.js
 *
 * This file was generated by Sencha Architect version 2.0.0.
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

Ext.define('Payback.model.Person', {
    extend: 'Ext.data.Model',

    uses: [
        'Payback.model.Debt'
    ],

    config: {
        identifier: {
            type: 'uuid'
        },
        proxy: {
            type: 'localstorage',
            id: 'Person'
        },
        hasMany: {
            associationKey: 'person_id',
            model: 'Payback.model.Debt',
            autoLoad: true,
            foreignKey: 'person_id',
            name: 'debts',
            store: {
                remoteFilter: false,
                modelDefaults: null
            }
        },
        fields: [
            {
                name: 'id',
                type: 'auto'
            },
            {
                name: 'name'
            },
            {
                name: 'phone'
            },
            {
                name: 'email'
            },
            {
                defaultValue: 0,
                name: 'balance',
                type: 'float'
            }
        ]
    },

    calcBalance: function() {
        return this.set('balance', this.debts().sum('balance'));

    }

});