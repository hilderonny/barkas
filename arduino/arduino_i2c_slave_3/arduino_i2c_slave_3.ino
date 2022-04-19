#include <Wire.h>

const int ADDR = 3;

void setup() {
  //I2C-Adresszuweisung
  Wire.begin(ADDR);
  //Handler für das I2C-Empfangsereignis festlegen (siehe unten)
  Wire.onReceive(receiveEvent);
  for (int i=0; i < 18; i++) pinMode(i, OUTPUT);
}

void loop() {}

void receiveEvent(int howMany){
  while(Wire.available())
  {
    int val = Wire.read();
    int idx = val >> 3;
    int on = val & 1;
    digitalWrite(idx, on);
  }
}
