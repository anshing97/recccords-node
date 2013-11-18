/*
 * File: app/store/ReleaseStore.js
 *
 * This file was generated by Sencha Architect version 2.2.3.
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

Ext.define('Recccords.store.ReleaseStore', {
    extend: 'Ext.data.Store',

    requires: [
        'Recccords.model.Release'
    ],

    config: {
        model: 'Recccords.model.Release',
        storeId: 'ReleaseStore',
        proxy: {
            type: 'ajax',
            url: 'collection/',
            reader: {
                type: 'json',
                rootProperty: 'releases'
            }
        },
        fields: [
            {
                name: 'id'
            },
            {
                mapping: 'basic_information.thumb',
                name: 'thumb',
                type: 'string'
            },
            {
                mapping: 'basic_information.title',
                name: 'title',
                type: 'string'
            },
            {
                mapping: 'basic_information.artists[0].name',
                name: 'artist'
            }
        ]
    }
});