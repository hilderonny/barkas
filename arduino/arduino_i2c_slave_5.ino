#include <Wire.h>

void setup() {
  //I2C-Adresszuweisung: Slave 5 
  Wire.begin(5);
  //Handler für das I2C-Empfangsereignis festlegen (siehe unten)
  Wire.onReceive(receiveEvent);
  for (int i=2; i < 14; i++) pinMode(i, OUTPUT);
}

void loop() {}

void receiveEvent(int howMany){
  while(Wire.available())
  {
    int val = Wire.read();
    int idx = val >> 4;
    int on = val & 1;
    digitalWrite(idx, on);
  }
}
