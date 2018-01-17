const emailValidator = require('email-validator');
const ValidatePassword = require('validate-password');
const validator = new ValidatePassword({
    enforce: {
        lowercase: true,
        uppercase: true,
        specialCharacters: true,
        numbers: true
    }
});

export class UserDTO {
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public username: string,
        public verified: boolean = false,
        public active: boolean = false,
        public role: string = null,
        public createdAt: Date = null,
        public createdBy: string = null,
        public modifiedAt: Date = null,
        public modifiedBy: string = null,
        public owner: string = null
    ) { }
}

export class User extends UserDTO {
    deleted: boolean = false;
    deleting: boolean = false;

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
            createdAt ? new Date(createdAt) : null,
            createdBy || null,
            modifiedAt ? new Date(modifiedAt) : null,
            modifiedBy || null,
            owner || null
        );
    }

    isValidEmail() {
        return emailValidator.validate(this.email);
    }
    isValidPassword() {
        if (this.password === '') {
            return false;
        } else {
            var passwordData = validator.checkPassword(this.password);
            return passwordData.isValid;
        }
    }
}