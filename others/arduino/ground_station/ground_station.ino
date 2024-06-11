void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0));
}

void loop() {
  printData();
}

void printData() {
  // angular rates
  float angularRates[3] = { generateRandomValue(-30.0, 30.0), generateRandomValue(-30.0, 30.0), generateRandomValue(-30.0, 30.0) };

  // orientation
  float orientations[3] = { generateRandomValue(-30.0, 30.0), generateRandomValue(-30.0, 30.0), generateRandomValue(-30.0, 30.0) };

  // motor signals
  float motorSignals[4] = { generateRandomValue(1000.0, 1600.0), generateRandomValue(1400.0, 2000.0), generateRandomValue(1400.0, 1500.0), generateRandomValue(1000.0, 2000.0) };

  printArray(angularRates, 3);
  Serial.print("|");

  printArray(orientations, 3);
  Serial.print("|");

  printArray(motorSignals, 4);
  Serial.println();
}

float generateRandomValue(float minValue, float maxValue) {
  return minValue + (float)random(0, 10000) / 10000.0 * (maxValue - minValue);
}

void printArray(float* array, int size) {
  for (int i = 0; i < size; i++) {
    if (i > 0) {
      Serial.print(",");
    }
    Serial.print(array[i], 2);
  }
}