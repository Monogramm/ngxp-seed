
class InvalidCharacterError extends Error {
}

/**
 * Convert A String to Base64 String or Vice-Versa.
 *
 * Custom implementation expected to work on all platforms.
 *
 * Taken from there: https://github.com/hdeshev/nativescript-ntlm-demo/blob/master/app/base64.js
 */
export class Base64 {
    /**
     * Allow characters for Base64.
     */
    private static readonly CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    /**
     * Convert a String to Base64 String.
     *
     * @param textString a String
     *
     * @returns a Base64 String
     */
    public static btoa(textString: string): string {
        const str: String = String(textString);

        let output = '';
        for (
            // initialize result and counter
            let block: number, charCode: number, idx = 0, map: string = Base64.CHARS;
            // if the next str index does not exist:
            //   change the mapping table to "="
            //   check if d has no fractional digits
            str.charAt(idx | 0) || (map = '=', idx % 1);
            // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
            output += map.charAt(63 & block >> 8 - idx % 1 * 8)
        ) {
            charCode = str.charCodeAt(idx += 3 / 4);
            if (charCode > 0xFF) {
                throw new InvalidCharacterError('"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.');
            }
            block = block << 8 | charCode;
        }

        return output;
    }

    /**
     * Convert a Base64 String to String.
     *
     * @param base64String a Base64 String
     *
     * @returns a String
     */
    public static atob(base64String: string): string {
        const str: String = String(base64String).replace(/=+$/, '');

        if (str.length % 4 === 1) {
            throw new InvalidCharacterError('"atob" failed: The string to be decoded is not correctly encoded.');
        }

        let output = '';
        for (
            // initialize result and counters
            let bc = 0, bs: number, buffer: string | number, idx = 0;
            // get next character
            buffer = str.charAt(idx++);
            // character found in table? initialize bit storage and add its ascii value;
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = Base64.CHARS.indexOf(buffer);
        }

        return output;
    }

}
