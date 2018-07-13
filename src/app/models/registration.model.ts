export class RegistrationModel {

    private _email: string;
    private _username: string;
    private _first_name: string;
    private _last_name: string;
    private _password: string;

    constructor() {
    }

    get email(): string {
        return this._email;
    }

    set email(email: string) {
        this._email = email;
    }

    get username(): string {
        return this._username;
    }

    set username(username: string) {
        this._username = username;
    }

    get first_name(): string {
        return this._first_name;
    }

    set first_name(first_name: string) {
        this._first_name = first_name;
    }

    get last_name(): string {
        return this._last_name;
    }

    set last_name(last_name: string) {
        this._last_name = last_name;
    }

    get password(): string {
        return this._password;
    }

    set password(password: string) {
        this._password = password;
    }

}
