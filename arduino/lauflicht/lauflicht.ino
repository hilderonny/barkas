void setup() {
  for (int i = 2; i < 18; i++) pinMode(i, OUTPUT);
}

void loop() {
  int on = 1;
  while(true) {
    for (int i = 2; i < 18; i++) digitalWrite(i, on);
    on = 1 - on;
    delay(500);
  }
}
