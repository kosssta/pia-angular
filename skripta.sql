DROP SCHEMA IF EXISTS `rasadnici`;

CREATE SCHEMA `rasadnici` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;

SET @@global.time_zone='+02:00';
SET @@session.time_zone='+02:00';

DROP TABLE IF EXISTS `rasadnici`.`korisnik`;

CREATE TABLE `rasadnici`.`korisnik` (
  `idKor` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_as_cs' NOT NULL,
  `password` VARCHAR(50) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_as_cs' NOT NULL,
  PRIMARY KEY (`idKor`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`poljoprivrednik`;

CREATE TABLE `rasadnici`.`poljoprivrednik` (
  `idPolj` INT NOT NULL,
  `ime` VARCHAR(50) NOT NULL,
  `prezime` VARCHAR(50) NOT NULL,
  `datum_rodjenja` DATE NOT NULL,
  `mesto_rodjenja` VARCHAR(50) NOT NULL,
  `kontakt_telefon` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idPolj`),
  CONSTRAINT `fk_idPolj`
    FOREIGN KEY (`idPolj`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`preduzece`;

CREATE TABLE `rasadnici`.`preduzece` (
  `idPre` INT NOT NULL,
  `punNaziv` VARCHAR(50) NOT NULL,
  `datumOsnivanja` DATE NOT NULL,
  `mesto` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `brojSlobodnihKurira` INT NOT NULL DEFAULT 5,
  PRIMARY KEY (`idPre`),
  CONSTRAINT `fk_IdPre`
    FOREIGN KEY (`idPre`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`administrator`;

CREATE TABLE `rasadnici`.`administrator` (
  `idAdm` INT NOT NULL,
  PRIMARY KEY (`idAdm`),
  CONSTRAINT `fk_idAdm`
    FOREIGN KEY (`idAdm`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`zahtev`;

CREATE TABLE `rasadnici`.`zahtev` (
  `idZah` INT NOT NULL AUTO_INCREMENT,
  `tip` VARCHAR(50) NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  `idKor` INT NOT NULL,
  PRIMARY KEY (`idZah`),
  UNIQUE INDEX `idKor_UNIQUE` (`idKor` ASC) VISIBLE,
  CONSTRAINT `fk_idKor_zahtev`
    FOREIGN KEY (`idZah`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`proizvod`;

CREATE TABLE `rasadnici`.`proizvod` (
  `idPro` INT NOT NULL AUTO_INCREMENT,
  `naziv` VARCHAR(50) NOT NULL,
  `proizvodjac` INT NOT NULL,
  `cena` DOUBLE NULL,
  PRIMARY KEY (`idPro`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`rasadnik`;

CREATE TABLE `rasadnici`.`rasadnik` (
  `idRas` INT NOT NULL AUTO_INCREMENT,
  `naziv` VARCHAR(50) NOT NULL,
  `mesto` VARCHAR(50) NOT NULL,
  `duzina` INT NOT NULL,
  `sirina` INT NOT NULL,
  `brojZasadjenihSadnica` INT NOT NULL DEFAULT 0,
  `voda` INT NOT NULL DEFAULT 200,
  `temperatura` DOUBLE NOT NULL DEFAULT 18,
  `idKor` INT NOT NULL,
  `poslatMail` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idRas`),
  INDEX `fk_idKor_rasadnik_idx` (`idKor` ASC) VISIBLE,
  CONSTRAINT `fk_idKor_rasadnik`
    FOREIGN KEY (`idKor`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`sadnica`;

CREATE TABLE `rasadnici`.`sadnica` (
  `idSad` INT NOT NULL AUTO_INCREMENT,
  `idPro` INT NOT NULL,
  `x` INT NULL,
  `y` INT NULL,
  `trajanjeSazrevanja` INT NOT NULL,
  `starost` INT NOT NULL DEFAULT 0,
  `idRas` INT NULL,
  `vlasnik` INT NOT NULL,
  `izvadjena` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`idSad`),
  INDEX `fk_idPro_sadnica_idx` (`idPro` ASC) VISIBLE,
  INDEX `fk_idRas_sadnica_idx` (`idRas` ASC) VISIBLE,
  INDEX `fk_idKor_sadnica_idx` (`vlasnik` ASC) VISIBLE,
  CONSTRAINT `fk_idPro_sadnica`
    FOREIGN KEY (`idPro`)
    REFERENCES `rasadnici`.`proizvod` (`idPro`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idRas_sadnica`
    FOREIGN KEY (`idRas`)
    REFERENCES `rasadnici`.`rasadnik` (`idRas`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idKor_sadnica`
    FOREIGN KEY (`vlasnik`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`preparat`;

CREATE TABLE `rasadnici`.`preparat` (
  `idPre` INT NOT NULL AUTO_INCREMENT,
  `idPro` INT NOT NULL,
  `idRas` INT NULL,
  `ubrzanje` INT NOT NULL,
  `vlasnik` INT NOT NULL,
  PRIMARY KEY (`idPre`),
  INDEX `fk_idPro_preparat_idx` (`idPro` ASC) VISIBLE,
  INDEX `fk_idRas_preparat_idx` (`idRas` ASC) VISIBLE,
  INDEX `fk_idKor_preparat_idx` (`vlasnik` ASC) VISIBLE,
  CONSTRAINT `fk_idPro_preparat`
    FOREIGN KEY (`idPro`)
    REFERENCES `rasadnici`.`proizvod` (`idPro`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idRas_preparat`
    FOREIGN KEY (`idRas`)
    REFERENCES `rasadnici`.`rasadnik` (`idRas`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idKor_preparat`
    FOREIGN KEY (`vlasnik`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`narudzbina`;

CREATE TABLE `rasadnici`.`narudzbina` (
  `idNar` INT NOT NULL AUTO_INCREMENT,
  `idPro` INT NOT NULL,
  `narucilac` INT NOT NULL,
  `rasadnik` INT NOT NULL,
  `kolicina` INT NOT NULL,
  `status` INT NOT NULL DEFAULT 0,
  `datum` DATETIME NOT NULL,
  PRIMARY KEY (`idNar`),
  INDEX `fk_idPro_narudzbina_idx` (`idPro` ASC) VISIBLE,
  INDEX `fk_idKor_narudzbina_idx` (`narucilac` ASC) VISIBLE,
  INDEX `fk_idRas_narudzbina_idx` (`rasadnik` ASC) VISIBLE,
  CONSTRAINT `fk_idPro_narudzbina`
    FOREIGN KEY (`idPro`)
    REFERENCES `rasadnici`.`proizvod` (`idPro`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idKor_narudzbina`
    FOREIGN KEY (`narucilac`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idRas_narudzbina`
    FOREIGN KEY (`rasadnik`)
    REFERENCES `rasadnici`.`rasadnik` (`idRas`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `rasadnici`.`komentar`;

CREATE TABLE `rasadnici`.`komentar` (
  `idKom` INT NOT NULL AUTO_INCREMENT,
  `komentar` VARCHAR(500) NOT NULL,
  `ocena` INT NOT NULL,
  `idKor` INT NOT NULL,
  `idPro` INT NOT NULL,
  PRIMARY KEY (`idKom`),
  INDEX `fk_idKor_komentar_idx` (`idKor` ASC) VISIBLE,
  INDEX `fk_idPro_komentar_idx` (`idPro` ASC) VISIBLE,
  CONSTRAINT `fk_idKor_komentar`
    FOREIGN KEY (`idKor`)
    REFERENCES `rasadnici`.`korisnik` (`idKor`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_idPro_komentar`
    FOREIGN KEY (`idPro`)
    REFERENCES `rasadnici`.`proizvod` (`idPro`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('1', 'admin', 'Admin.admin');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('2', 'pera', 'pera.Pera');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('3', 'zika', 'zika.Zika');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('4', 'mika', 'mika.Mika');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('5', 'vuksanovic', 'Vuksanovic.');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('6', 'vocni', 'vocni.Vocni');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('7', 'mavm', 'mavm.Mavm');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('8', 'milica', 'milica.Milica');
INSERT INTO `rasadnici`.`korisnik` (`idKor`, `username`, `password`) VALUES ('9', 'cvetni', 'cvetni.Cvetni');

INSERT INTO `rasadnici`.`administrator` (`idAdm`) VALUES ('1');

INSERT INTO `rasadnici`.`poljoprivrednik` (`idPolj`, `ime`, `prezime`, `datum_rodjenja`, `mesto_rodjenja`, `kontakt_telefon`, `email`) VALUES ('2', 'Petar', 'Petrovic', '1997-07-04', 'Pariz', '+381-65-123-456', 'rasadnici.pia@gmail.com');
INSERT INTO `rasadnici`.`poljoprivrednik` (`idPolj`, `ime`, `prezime`, `datum_rodjenja`, `mesto_rodjenja`, `kontakt_telefon`, `email`) VALUES ('3', 'Zika', 'Zikic', '1984-04-11', 'Beograd', '0621234567', 'k.maloparac@gmail.com');
INSERT INTO `rasadnici`.`poljoprivrednik` (`idPolj`, `ime`, `prezime`, `datum_rodjenja`, `mesto_rodjenja`, `kontakt_telefon`, `email`) VALUES ('4', 'Mika', 'Mikic', '1990-11-12', 'Nis', '061234567', 'rasadnici.pia@gmail.com');
INSERT INTO `rasadnici`.`poljoprivrednik` (`idPolj`, `ime`, `prezime`, `datum_rodjenja`, `mesto_rodjenja`, `kontakt_telefon`, `email`) VALUES ('8', 'Milica', 'Micic', '1975-11-01', 'Zajecar', '0667891230', 'rasadnici.pia@gmail.com');

INSERT INTO `rasadnici`.`preduzece` (`idPre`, `punNaziv`, `datumOsnivanja`, `mesto`, `email`) VALUES ('5', 'Vuksanovic', '2000-01-01', 'Pozega', 'rasadnici.pia@gmail.com');
INSERT INTO `rasadnici`.`preduzece` (`idPre`, `punNaziv`, `datumOsnivanja`, `mesto`, `email`) VALUES ('6', 'Vocni rasadnik', '2015-09-01', 'Subotica', 'rasadnici.pia@gmail.com');
INSERT INTO `rasadnici`.`preduzece` (`idPre`, `punNaziv`, `datumOsnivanja`, `mesto`, `email`) VALUES ('7', 'MAVM', '1931-12-15', 'Novi Sad', 'rasadnici.pia@gmail.com');
INSERT INTO `rasadnici`.`preduzece` (`idPre`, `punNaziv`, `datumOsnivanja`, `mesto`, `email`) VALUES ('9', 'Cvetni rasadnik', '1955-10-08', 'Ljubljana', 'rasadnici.pia@gmail.com');

INSERT INTO `rasadnici`.`zahtev` (`idZah`, `tip`, `status`, `idKor`) VALUES ('1', 'poljoprivrednik', '0', '8');
INSERT INTO `rasadnici`.`zahtev` (`idZah`, `tip`, `idKor`) VALUES ('2', 'preduzece', '9');

INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('1', 'Jabuka', '5', '150');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('2', 'Kruska', '5', '200');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('3', 'Sljiva', '5', '100');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('4', 'Kupina', '6', '80');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('5', 'Malina', '6', '125');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('6', 'Breskva', '6', '130');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('7', 'Jabuka', '6', '155');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('8', 'Jabuka', '7', '199');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('9', 'Jagoda', '7', '400');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('10', 'Malina', '7', '100');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('11', 'Kruska', '6', '185');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('12', 'Breskva', '7', '100');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('13', 'Djubrivo', '5', '1000');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('14', 'Djubrivo', '6', '1000');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('15', 'Djubrivo', '7', '950');
INSERT INTO `rasadnici`.`proizvod` (`idPro`, `naziv`, `proizvodjac`, `cena`) VALUES ('16', 'Ubrzavac rasta', '7', '1500');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('1', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('2', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('3', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('4', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('5', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('6', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('7', '1', '10', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('8', '1', '10', NULL, '5', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('9', '2', '9', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('10', '2', '9', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('11', '2', '9', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('12', '2', '9', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('13', '2', '9', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('14', '2', '9', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('15', '2', '9', NULL, '5', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('16', '3', '20', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('17', '3', '20', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('18', '3', '20', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('19', '3', '20', NULL, '5', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('20', '3', '20', NULL, '5', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('21', '4', '5', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('22', '4', '5', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('23', '4', '5', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('24', '4', '5', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('25', '4', '5', NULL, '6', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('26', '5', '11', NULL, '6', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('27', '6', '7', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('28', '6', '7', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('29', '6', '7', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('30', '6', '7', NULL, '6', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('31', '7', '10', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('32', '7', '10', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('33', '7', '10', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('34', '7', '10', NULL, '6', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('35', '8', '11', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('36', '8', '11', NULL, '7', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('37', '9', '5', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('38', '9', '5', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('39', '9', '5', NULL, '7', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('40', '10', '12', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('41', '10', '12', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('42', '10', '12', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('43', '10', '12', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('44', '10', '12', NULL, '7', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('45', '11', '15', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('46', '11', '15', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('47', '11', '15', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('48', '11', '15', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('49', '11', '15', NULL, '6', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('50', '11', '15', NULL, '6', '0');

INSERT INTO `rasadnici`.`rasadnik` (`idRas`, `naziv`, `mesto`, `duzina`, `sirina`, `idKor`, `poslatMail`) VALUES ('1', 'Rasadnik 1', 'Valjevo', '3', '3', '2', '0');
INSERT INTO `rasadnici`.`rasadnik` (`idRas`, `naziv`, `mesto`, `duzina`, `sirina`, `idKor`, `poslatMail`) VALUES ('2', 'Rasadnik 2', 'Subotica', '4', '5', '2', '0');
INSERT INTO `rasadnici`.`rasadnik` (`idRas`, `naziv`, `mesto`, `duzina`, `sirina`, `idKor`, `poslatMail`) VALUES ('3', 'Rasadnik 1', 'Sabac', '4', '4', '3', '0');
INSERT INTO `rasadnici`.`rasadnik` (`idRas`, `naziv`, `mesto`, `duzina`, `sirina`, `idKor`, `poslatMail`) VALUES ('4', 'Rasadnik 2', 'Valjevo', '3', '6', '4', '0');
INSERT INTO `rasadnici`.`rasadnik` (`idRas`, `naziv`, `mesto`, `duzina`, `sirina`, `idKor`, `poslatMail`) VALUES ('5', 'Rasadnik 1', 'Berlin', '4', '5', '4', '0');

INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('51', '12', '7', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('52', '12', '7', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('53', '12', '7', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('54', '12', '7', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('55', '12', '7', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('56', '12', '7', '2', '2', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('57', '12', '7', '2', '2', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('58', '12', '7', '2', '2', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('59', '12', '7', NULL, '7', '0');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`) VALUES ('60', '12', '7', NULL, '7', '0');

INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('1', '13', '5', '5');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('2', '13', '5', '5');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('3', '13', '5', '5');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('4', '13', '5', '5');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`, `idRas`) VALUES ('5', '13', '5', '2', '2');

INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('6', '14', '4', '6');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('7', '14', '4', '6');

INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('8', '15', '3', '7');

INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('9', '16', '8', '7');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('10', '14', '4', '6');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`) VALUES ('11', '14', '4', '6');

INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`, `idRas`) VALUES ('12', '15', '3', '2', '2');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`, `idRas`) VALUES ('13', '15', '3', '2', '2');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`, `idRas`) VALUES ('14', '15', '3', '2', '2');
INSERT INTO `rasadnici`.`preparat` (`idPre`, `idPro`, `ubrzanje`, `vlasnik`, `idRas`) VALUES ('15', '15', '3', '2', '2');

INSERT INTO `rasadnici`.`narudzbina` (`idNar`, `idPro`, `narucilac`, `rasadnik`, `kolicina`, `datum`) VALUES ('1', '1', '2', '1', '2', '2020-07-06 07:05:55');
INSERT INTO `rasadnici`.`narudzbina` (`idNar`, `idPro`, `narucilac`, `rasadnik`, `kolicina`, `datum`) VALUES ('2', '16', '2', '1', '1', '2020-07-08 09:05:55');
INSERT INTO `rasadnici`.`narudzbina` (`idNar`, `idPro`, `narucilac`, `rasadnik`, `kolicina`, `datum`) VALUES ('3', '15', '2', '1', '2', '2020-07-07 23:31:30');
INSERT INTO `rasadnici`.`narudzbina` (`idNar`, `idPro`, `narucilac`, `rasadnik`, `kolicina`, `datum`, `status`) VALUES ('4', '15', '2', '1', '2', '2020-07-07 23:31:30', '3');
INSERT INTO `rasadnici`.`narudzbina` (`idNar`, `idPro`, `narucilac`, `rasadnik`, `kolicina`, `datum`, `status`) VALUES ('5', '15', '2', '1', '2', '2020-07-07 23:31:30', '3');

INSERT INTO `rasadnici`.`komentar` (`idKom`, `komentar`, `ocena`, `idKor`, `idPro`) VALUES ('1', 'Odlican proizvod.', '5', '2', '15');

ALTER TABLE `rasadnici`.`sadnica` 
ADD COLUMN `ogranicenja` VARCHAR(500) NOT NULL DEFAULT '' AFTER `izvadjena`;
            
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`, `ogranicenja`) VALUES ('61', '11', '15', '2', '2', '0', '1,2,3');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`, `ogranicenja`) VALUES ('62', '11', '15', '2', '2', '0', '1,2,3');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`, `ogranicenja`) VALUES ('63', '11', '15', '2', '2', '0', '1,2,3');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`, `ogranicenja`) VALUES ('64', '11', '15', '2', '2', '0', '1,2,3');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`, `ogranicenja`) VALUES ('65', '11', '15', '2', '2', '0', '1,2,3');
INSERT INTO `rasadnici`.`sadnica` (`idSad`, `idPro`, `trajanjeSazrevanja`, `idRas`, `vlasnik`, `izvadjena`, `ogranicenja`) VALUES ('66', '11', '15', '2', '2', '0', '1,2,3');

UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '1');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '2');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '3');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '4');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '5');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '6');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '7');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '8');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '9');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '10');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '11');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '12');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '13');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '14');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '15');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '16');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '17');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '18');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '19');
UPDATE `rasadnici`.`sadnica` SET `ogranicenja` = '11' WHERE (`idSad` = '20');


delimiter $$

create procedure rasadnici.dodajSadnice(idPro int, proizvodjac int, trajanjeSazrevanja int, kolicina int, ogranicenja varchar(500))
begin
    while kolicina > 0 do
		insert into rasadnici.sadnica (idPro, trajanjeSazrevanja, vlasnik, ogranicenja)
			values (idPro, trajanjeSazrevanja, proizvodjac, ogranicenja);
        set kolicina = kolicina - 1;
    end while;
end$$

create procedure rasadnici.dodajPreparate(idPro int, proizvodjac int, ubrzanje int, kolicina int)
begin
	while kolicina > 0 do
		insert into rasadnici.preparat (idPro, vlasnik, ubrzanje)
			values (idPro, proizvodjac, ubrzanje);
		set kolicina = kolicina - 1;
    end while;
end$$

delimiter ;