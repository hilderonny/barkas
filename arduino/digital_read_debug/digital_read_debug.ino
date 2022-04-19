// 13 Bit, dabei Bit 2 immer 0, weil nicht verbunden
// 1 1111 1111 1101 = 8189
// Pin 2 ist nicht zuverlässig, weil das auf dem Serial IO liegt
// und eben diese zum Debuggen verwendet wird.

int val;
int fullval;

void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 13; i++) pinMode(i, INPUT_PULLUP);
}

void loop() {
  fullval = 0;
  for (int i = 0; i < 13; i++) {
    val = digitalRead(i);
    fullval |= val << i;
    Serial.print(val);
  }
  Serial.print(" ");
  Serial.println(fullval);
  delay(100);
}
