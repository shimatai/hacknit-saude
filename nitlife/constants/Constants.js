'use strict';

import { SQLite } from 'expo';

module.exports = {
    Database: SQLite.openDatabase('nitlife.db'),
    URL: {
        API: "http://34.192.46.82:8080",
        //API: "http://10.1.0.81:8080"
    }
}
