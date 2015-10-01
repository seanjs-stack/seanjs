'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('user', ['core']);
ApplicationConfiguration.registerModule('user.admin', ['core.admin']);
ApplicationConfiguration.registerModule('user.admin.routes', ['core.admin.routes']);
