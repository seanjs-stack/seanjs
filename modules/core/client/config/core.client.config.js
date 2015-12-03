'use strict';

//Configuering the core module
angular.module('core').run(['Menus',
  function(Menus) {

    //Add the contact-us to the menu
    Menus.addMenuItem('topbar', {
      title: 'Contact us',
      state: 'contact-us',
      roles: ['*'] //All users
    });

  }
]);