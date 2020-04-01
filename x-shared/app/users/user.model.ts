import { validate } from 'email-validator';

// FIXME ValidatePassword is not a constructor
/*
import { ValidatePassword } from 'validate-password';

const validator = new ValidatePassword({
    enforce: {
        lowercase: true,
        uppercase: true,
        specialCharacters: true,
        numbers: true
    }
});
*/

export class UserDTO {
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public username: string,
        public verified = false,
        public active = false,
        public role: string = null,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) { }
}

export class User extends UserDTO {
    deleted = false;
    deleting = false;

    first_name: string;
    last_name: string;
    phone: string;
    address: string;

    constructor();
    constructor(
        email: string,
        password: string,
        username: string,
        verified: boolean,
        active: boolean,
        role: string,
        createdAt: Date,
        modifiedAt: Date,
        createdBy: string,
        modifiedBy: string,
        owner: string,
        id: string
    );
    constructor(
        email?: string,
        password?: string,
        username?: string,
        verified?: boolean,
        active?: boolean,
        role?: string,
        createdAt?: Date,
        modifiedAt?: Date,
        createdBy?: string,
        modifiedBy?: string,
        owner?: string,
        id?: string
    ) {
        super(
            id || null,
            email || null,
            password || null,
            username || null,
            verified || false,
            active || false,
            role || null,
            createdAt ? createdAt : new Date(),
            createdBy || null,
            modifiedAt || null,
            modifiedBy || null,
            owner || null
        );
    }

    isValidEmail() {
        return validate(this.email);
    }
    isValidPassword() {
        if (this.password === '') {
            return false;
        } else {
            // FIXME ValidatePassword is not a constructor
            // let passwordData = validator.checkPassword(this.password);
            // return passwordData.isValid;
            return true;
        }
    }
}
