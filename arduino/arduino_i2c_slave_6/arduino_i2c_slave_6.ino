#include <Wire.h>

// Armaturenbrettschalter

const int ADDR = 6;

int val;
int fullval;
byte valarray[2];

void setup() {
  //I2C-Adresszuweisung
  Wire.begin(ADDR);
  // Handler für Abfrage von Master
  Wire.onRequest(sendData);
  for (int i = 0; i < 13; i++) pinMode(i, INPUT_PULLUP);
}

void loop() {
  fullval = 0;
  for (int i = 0; i < 13; i++) {
    val = digitalRead(i);
    fullval |= val << i;
  }
  valarray[0] = (fullval >> 8) & 0xFF;
  valarray[1] = fullval & 0xFF;
}

void sendData(){
  Wire.write(valarray, 2);
}
