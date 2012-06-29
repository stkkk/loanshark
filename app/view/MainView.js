/*
 * File: app/view/MainView.js
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

Ext.define('Payback.view.MainView', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.MainView',

    requires: [
        'Payback.view.Summary',
        'Payback.view.Debts',
        'Payback.view.Prey'
    ],

    config: {
        items: [
            {
                xtype: 'Summary',
                tab: {
                    iconCls: 'icon-home',
                    iconMask: true,
                    baseCls: 'x-button',
                    flex: 1,
                    iconAlign: 'center'
                },
                itemId: 'Summary',
                title: ' '
            },
            {
                xtype: 'Debts',
                tab: {
                    iconCls: 'icon-debt',
                    iconMask: true,
                    baseCls: 'x-button',
                    flex: 1,
                    iconAlign: 'center'
                },
                itemId: 'Debt',
                title: ' '
            },
            {
                xtype: 'Prey',
                tab: {
                    iconCls: 'icon-contacts',
                    iconMask: true,
                    baseCls: 'x-button',
                    flex: 1,
                    iconAlign: 'center'
                },
                itemId: 'Prey',
                title: ' '
            }
        ],
        tabBar: {
            docked: 'top',
            itemId: 'mytabbar',
            ui: 'light',
            layout: {
                align: 'stretchmax',
                type: 'hbox'
            }
        }
    }

});