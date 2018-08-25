'use strict';

import { SQLite } from 'expo';

module.exports = {
    Database: SQLite.openDatabase('nitlife.db'),
    URL: {
        //API: "http://pwa.pouk.me:8080",
        API: "http://10.1.0.81:8080"
    }
}
