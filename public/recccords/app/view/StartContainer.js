/*
 * File: app/view/StartContainer.js
 *
 * This file was generated by Sencha Architect
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.3.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.3.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Recccords.view.StartContainer', {
    extend: 'Ext.Container',
    alias: 'widget.startcontainer',

    config: {
        layout: {
            type: 'card'
        },
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'vbox'
                },
                items: [
                    {
                        xtype: 'button',
                        centered: false,
                        itemId: 'mybutton3',
                        margin: '35 25 5 25',
                        minHeight: 50,
                        padding: 0,
                        styleHtmlContent: true,
                        text: 'Sign Up'
                    },
                    {
                        xtype: 'button',
                        id: 'signInButton',
                        margin: '15 25 0 25',
                        minHeight: 50,
                        styleHtmlContent: true,
                        text: 'Sign In'
                    }
                ]
            }
        ]
    }

});