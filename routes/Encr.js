// Encr.js
const crypto = require('crypto');

class Encr {
  constructor(text, password, isEncrypting) {
    this.text = text;
    this.password = password;
    this.isEncrypting = isEncrypting;
    this.enhancedPassword = this.enhancePassword(password);
  }

  enhancePassword(password) {
    const len = password.length;

    if (len % 5 === 0) {
      const suffix = password.slice(-4); // last 4 characters
      const reversed = suffix.split('').reverse().join('');
      return reversed + password.slice(0, -4);
    } else if (len % 4 === 0) {
      const suffix = password.slice(-3); // last 3 characters
      return suffix + password + suffix;
    } else if (len % 3 === 0) {
      const suffix = password.slice(-2); // last 2 characters
      const reversed = suffix.split('').reverse().join('');
      return suffix + reversed + password + suffix;
    } else if (len % 2 === 0) {
      const suffix = password.slice(-1); // last 1 character
      return suffix + suffix + password + suffix + suffix;
    } else {
      const suffix = password.slice(-4); // last 4 characters
      const reversed = suffix.split('').reverse().join('');
      return reversed + password + reversed;
    }
  }

  encrypt() {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.enhancedPassword, salt, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(this.text, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    return Buffer.from(JSON.stringify({
      encrypted,
      salt: salt.toString('base64'),
      iv: iv.toString('base64')
    })).toString('base64'); // Final base64 for writing to file
  }

  decrypt() {
    const decoded = Buffer.from(this.text, 'base64').toString('utf8');
    const { encrypted, salt, iv } = JSON.parse(decoded);

    const key = crypto.scryptSync(this.enhancedPassword, Buffer.from(salt, 'base64'), 32);
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      key,
      Buffer.from(iv, 'base64')
    );

    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  run() {
    return this.isEncrypting ? this.encrypt() : this.decrypt();
  }
}

module.exports = Encr;
