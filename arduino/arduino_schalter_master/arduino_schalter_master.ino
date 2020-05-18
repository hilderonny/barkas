#include <Wire.h>

/**
 * Armaturenbrettschalter als Master.
 * 
 * Kommuniziert direkt mit den Slaves 3-5
 * und funktioniert ohne Raspi wie ein normales
 * Armaturenbrett.
 * 
 * Normalerweise hat dieser Arduino die Slaveadresse 6.
 * 
 * Tutorial: https://dronebotworkshop.com/i2c-arduino-arduino/
 */

const int BLINKPERIODE = 500; // Alle 500 ms soll der Blinktakter umschalten
const int DELAY = 100; // Alle 50 ms sollen die Schaltanweisungen gesendet werden, damit auch verlorene Pakete ankommen
const int BLINKCOUNT = BLINKPERIODE / DELAY;

// I2C Adressen
const int ARMATUREN_ADDR = 3;
const int HINTEN_ADDR = 4;
const int VORN_ADDR = 5;

// Eingangspins
const int I_STANDLICHT = 0;
const int I_ABBLENDLICHT = 2;
const int I_HUPE = 3;
const int I_LICHTHUPE = 4;
const int I_BLINKER_LINKS = 5;
const int I_BLINKER_RECHTS = 6;
const int I_WARNBLINKER = 7;
const int I_NEBLERVORN = 8;
const int I_NEBLERHINTEN = 9;
const int I_INNENLICHT = 10;
const int I_HECKSCHEIBENHEIZUNG = 11;
const int I_RUECKWAERTSGANG = 12;
const int I_BREMSE = 13;

// Ausgangspins vorn
const int O_FERNLICHT_VORN_RECHTS = 2;
const int O_ABBLENDLICHT_VORN_RECHTS = 3;
const int O_STANDLICHT_VORN_RECHTS = 4;
const int O_BLINKER_VORN_RECHTS = 5;
const int O_NEBLER_VORN_RECHTS = 6;
const int O_FERNLICHT_VORN_LINKS = 7;
const int O_ABBLENDLICHT_VORN_LINKS = 8;
const int O_STANDLICHT_VORN_LINKS = 9;
const int O_BLINKER_VORN_LINKS = 10;
const int O_NEBLER_VORN_LINKS = 11;
const int O_DECKENLAMPE = 12;
const int O_TUERLAMPE= 13;

// Ausgangspins hinten
const int O_BREMSLICHT_HINTEN_MITTE = 2;
const int O_BREMSLICHT_HINTEN_LINKS = 3;
const int O_RUECKLICHT_HINTEN_LINKS = 4;
const int O_BLINKER_HINTEN_LINKS = 5;
const int O_NEBELSCHLUSSLEUCHTE = 6;
const int O_KENNZEICHEN_HINTEN_LINKS = 7;
const int O_BREMSLICHT_HINTEN_RECHTS = 8;
const int O_RUECKLICHT_HINTEN_RECHTS = 9;
const int O_BLINKER_HINTEN_RECHTS = 10;
const int O_RUECKFAHRLEUCHTE = 11;
const int O_KENNZEICHEN_HINTEN_RECHTS = 12;

// Ausgangspins Armaturenbrett
const int O_A_WARNBLINKSCHALTER = 0;
const int O_A_TACHOHINTERGRUND_LINKS = 2;
const int O_A_TACHOHINTERGRUND_RECHTS = 3;
const int O_A_TEMPERATURHINTERGRUND_LINKS = 4;
const int O_A_TEMPERATURHINTERGRUND_RECHTS = 5;
const int O_A_BLINKER = 6;
const int O_A_GELB = 7;
const int O_A_TANKLEER = 8;
const int O_A_FERNLICHT = 9;
const int O_A_WLAN = 10;
const int O_A_BLUETOOTH = 11;
const int O_A_RASPBERRYPI = 12;
const int O_A_BATTERIE = 13;
const int O_A_STANDHEIZUNG = 14;
const int O_A_HANDBREMSE = 15;
const int O_A_NEBLER_VORN = 16;
const int O_A_NEBLER_HINTEN = 17;

int blinkzaehler = 0;
byte blinkerAn = 0;
byte blinkLinks = 0;
byte blinkRechts = 0;

byte EINGAENGE[14];
byte ARMATUREN[14];
byte VORN[14];
byte HINTEN[14];

void sendToArmaturen() {
  Wire.beginTransmission(ARMATUREN_ADDR);
  for (int i = 0; i < 14; i++) {
    Wire.write((i << 3) | ARMATUREN[i]);
  }
  Wire.endTransmission();
}

void sendToVorn() {
  Wire.beginTransmission(VORN_ADDR);
  for (int i = 0; i < 14; i++) {
    Wire.write((i << 3) | VORN[i]);
  }
  Wire.endTransmission();
}

void sendToHinten() {
  Wire.beginTransmission(HINTEN_ADDR);
  for (int i = 0; i < 14; i++) {
    Wire.write((i << 3) | HINTEN[i]);
  }
  Wire.endTransmission();
}

void switchBlink() {
  blinkerAn = 1 - blinkerAn;
  VORN[O_BLINKER_VORN_LINKS] = blinkLinks & blinkerAn;
  VORN[O_BLINKER_VORN_RECHTS] = blinkRechts & blinkerAn;
  HINTEN[O_BLINKER_HINTEN_LINKS] = blinkLinks & blinkerAn;
  HINTEN[O_BLINKER_HINTEN_RECHTS] = blinkRechts & blinkerAn;
}

void verarbeiteEingaenge() {
  // Standlicht
  VORN[O_STANDLICHT_VORN_LINKS] = EINGAENGE[I_STANDLICHT];
  VORN[O_STANDLICHT_VORN_RECHTS] = EINGAENGE[I_STANDLICHT];
  HINTEN[O_RUECKLICHT_HINTEN_LINKS] = EINGAENGE[I_STANDLICHT];
  HINTEN[O_RUECKLICHT_HINTEN_RECHTS] = EINGAENGE[I_STANDLICHT];
  ARMATUREN[O_A_TACHOHINTERGRUND_LINKS] = EINGAENGE[I_STANDLICHT];
  ARMATUREN[O_A_TEMPERATURHINTERGRUND_RECHTS] = EINGAENGE[I_STANDLICHT];
  // Abblendlicht
  VORN[O_ABBLENDLICHT_VORN_LINKS] = EINGAENGE[I_ABBLENDLICHT];
  VORN[O_ABBLENDLICHT_VORN_RECHTS] = EINGAENGE[I_ABBLENDLICHT];
  ARMATUREN[O_A_TACHOHINTERGRUND_RECHTS] = EINGAENGE[I_ABBLENDLICHT];
  ARMATUREN[O_A_TEMPERATURHINTERGRUND_LINKS] = EINGAENGE[I_ABBLENDLICHT];
  // Lichthupe / Fernlicht
  // Blinker
  blinkLinks = EINGAENGE[I_BLINKER_LINKS] | EINGAENGE[I_WARNBLINKER];
  blinkRechts = EINGAENGE[I_BLINKER_RECHTS] | EINGAENGE[I_WARNBLINKER];
  // Bremse
  HINTEN[O_BREMSLICHT_HINTEN_LINKS] = EINGAENGE[I_BREMSE];
  HINTEN[O_BREMSLICHT_HINTEN_MITTE] = EINGAENGE[I_BREMSE];
  HINTEN[O_BREMSLICHT_HINTEN_RECHTS] = EINGAENGE[I_BREMSE];
}

void setup() {
  Wire.begin(); // Als Master initialisieren
  for (int i = 0; i < 14; i++) pinMode(i, INPUT_PULLUP); // Eingänge definieren
  //Serial.begin(9600);
  //Serial.println("I2C Master Demonstration");
}

void loop() {
  delay(DELAY);

  // Eingänge lesen
  for (int i = 0; i < 14; i++) {
    EINGAENGE[i] = 1 - digitalRead(i);
    //Serial.print(EINGAENGE[i]);
  }
  //Serial.println("");
  verarbeiteEingaenge();

  // Blinktakter
  blinkzaehler++;
  if (blinkzaehler > BLINKCOUNT) {
    blinkzaehler = 0;
    switchBlink();
  }

  // Ausgänge schalten
  sendToVorn();
  sendToHinten();
  sendToArmaturen();
}
