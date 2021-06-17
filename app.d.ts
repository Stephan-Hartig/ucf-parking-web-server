import mysql = require('mysql');
/**
 * Augment the global variable with `conn`.
 */
declare global {
    namespace NodeJS {
        interface Global {
            document: Document;
            window: Window;
            navigator: Navigator;
            conn: mysql.Connection;
        }
    }
}
export declare let conn: mysql.Connection;
