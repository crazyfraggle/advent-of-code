const fs = require("fs");

const data = fs.readFileSync("input4.txt", "utf-8");

const rawPassports = data.split("\n\n").filter((line) => !!line);

const passports = rawPassports.map((passport) => {
  console.log(`passport: ${passport}`);
  return passport.split(/[\s]/g).reduce((obj, field) => {
    const [key, val] = field.split(":");
    if (key && val) {
      console.log(`key: ${key}, val: ${val}, field: ${field}`);
      obj[key] = val;
    }
    return obj;
  }, {});
});

const validatePassport = (passport) => {
  const isValid =
    passport.hasOwnProperty("byr") &&
    passport.hasOwnProperty("iyr") &&
    passport.hasOwnProperty("eyr") &&
    passport.hasOwnProperty("hgt") &&
    passport.hasOwnProperty("hcl") &&
    passport.hasOwnProperty("ecl") &&
    passport.hasOwnProperty("pid");
  // console.log(`${JSON.stringify(passport)} isValid: ${isValid}`);
  return isValid;
};

const validatePassportProperly = (passport) => {
  const yearValidation = (prop, low, high) => {
    const validYear =
      passport.hasOwnProperty(prop) &&
      passport[prop] >= low &&
      passport[prop] <= high;
    if (!validYear) {
      console.log(`Invalid year for ${prop}: ${passport[prop]}`);
    }
    return validYear;
  };

  const heightValidation = () => {
    const heightReg = /^([\d]+)(in|cm)$/;
    const validMatch =
      passport.hasOwnProperty("hgt") && passport.hgt.match(heightReg);

    if (!validMatch) {
      console.log(`Invalid height: ${passport["hgt"]}`);
      return false;
    }

    if (validMatch[2] == "in") {
      const inches = validMatch[1];
      const validInches = inches >= 59 && inches <= 76;
      if (!validInches) {
        console.log(`Invalid height in inches: ${passport["hgt"]}`);
        return false;
      }
    } else if (validMatch[2] == "cm") {
      const cms = validMatch[1];
      const validCms = cms >= 150 && cms <= 193;
      if (!validCms) {
        console.log(`Invalid height in centimeters: ${passport["hgt"]}`);
        return false;
      }
    }
    return true;
  };

  const hairColorValidation = () => {
    const hairColorReg = /^#[a-f0-9]{6}$/;
    const validHair =
      passport.hasOwnProperty("hcl") && passport.hcl.match(hairColorReg);
    if (!validHair) {
      console.log(`Invalid Hair color: ${passport["hcl"]}`);
    }
    return validHair;
  };

  const eyeColorValidation = () => {
    const eyeColorReg = /^(amb|blu|brn|gry|grn|hzl|oth)$/;
    const validEye =
      passport.hasOwnProperty("ecl") && passport.ecl.match(eyeColorReg);
    if (!validEye) {
      console.log(`Invalid eye color: ${passport["ecl"]}`);
    }
    return validEye;
  };

  const pidValidation = () => {
    const validPid =
      passport.hasOwnProperty("pid") && passport.pid.match(/^(\d){9}$/);
    if (!validPid) {
      console.log(`Invalid PID: ${passport["pid"]}`);
    }
    return validPid;
  };

  const isValid =
    yearValidation("byr", 1920, 2002) &&
    yearValidation("iyr", 2010, 2020) &&
    yearValidation("eyr", 2020, 2030) &&
    heightValidation() &&
    hairColorValidation() &&
    eyeColorValidation() &&
    pidValidation();

  // console.log(`${JSON.stringify(passport)} isValid: ${isValid}`);
  return isValid;
};

console.log(
  `Number of valid passports: ${passports.filter(validatePassport).length}`
);

console.log(
  `Number of properly valid passports: ${
    passports.filter(validatePassportProperly).length
  }`
);
