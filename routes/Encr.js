// Encr.js

class Encr {
  constructor(original, password, encript) {
    this.org = original;
    this.pssw = password;
    this.encript = encript;
    this.notComplete = !this.isDefenceMode();
    this.tmpNewPss = "";
  }

  isDefenceMode() {
    if (this.pssw.length > 8) {
      const tmpSuffix = this.pssw.slice(-4);
      if (
        tmpSuffix.charAt(0) === tmpSuffix.charAt(1) &&
        tmpSuffix.charAt(2) === tmpSuffix.charAt(3)
      ) {
        this.pssw = this.shorter(4);
        this.tmpNewPss = this.pssw.slice(-3);
        this.pssw =
          this.shorter(3) + this.tmpNewPss.split("").reverse().join("");
        return false;
      }
      return true;
    }
    return true;
  }

  shorter(i) {
    return this.pssw.slice(0, this.pssw.length - i);
  }

  seed() {
    let ext;
    if (this.pssw.length % 5 === 0) ext = "''$$,,?,3^&@!..,";
    else if (this.pssw.length % 4 === 0) ext = "&@!''$,3^.$,,?.,";
    else if (this.pssw.length % 3 === 0) ext = "$,''$,,^3&?.,@!.";
    else if (this.pssw.length % 2 === 0) ext = "'$,3^,.?,'$@!.,&";
    else ext = "?,3^&'$,'$,@.,!.";

    this.pssw += ext;
    ext += this.pssw.slice(0, Math.floor(this.pssw.length / 3)) + "..,^@";

    this.pssw = this.resort(this.pssw.concat(ext, ext), true);

    if (this.encript) {
      this.org = ext + this.pssw + this.org + ext + this.pssw;
    } else {
      const prefixLen = ext.concat(this.pssw).length;
      this.org = this.org.slice(prefixLen);
      this.org = this.org.slice(
        0,
        this.org.length - (ext.length + this.pssw.length)
      );
    }
  }

  resort(a, st) {
    if (a.length <= 1) return a;
    let a1 = "";
    let a2 = "";
    let a3 = "";

    if (st) {
      const mid = Math.floor(a.length / 2);
      a1 = a.slice(0, mid);
      a2 = a.slice(mid);
      let i = 0;
      for (; i < a1.length && i < a2.length; i++) {
        a3 += a1.charAt(i) + a2.charAt(i);
      }
      if (a2.length > a1.length) a3 += a2.slice(i);
      return a3;
    } else {
      let j = a.length;
      let k = j % 2 !== 0 ? 1 : 0;
      j -= k;
      let i = 0;
      for (; i < j; i += 2) {
        a1 += a.charAt(i);
        a2 += a.charAt(i + 1);
      }
      a3 = a1 + a2;
      if (k === 1) a3 += a.charAt(i);
      return a3;
    }
  }

  encr() {
    let o = "";
    let k;

    if (this.encript) {
      this.seed();
      k = Math.floor(this.org.length / 3);
      o = this.resort(this.org, true);
      const part1 = this.resort(o.slice(0, k), true);
      const part2 = this.resort(o.slice(k), true);
      return part1.concat(part2);
    } else {
      k = Math.floor(this.org.length / 3);
      o = this.resort(this.org.slice(0, k), false).concat(
        this.resort(this.org.slice(k), false)
      );
      this.org = this.resort(o, true);
      this.seed();
      if (this.notComplete) {
        return (
          this.org +
          "Password___12345678900987654321___DefenceMode___12345678900987654321___12345678900987654321___is___12345678900987654321___ON"
        );
      } else {
        return this.org;
      }
    }
  }
}

module.exports = Encr;
