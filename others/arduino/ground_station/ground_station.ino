
void setup() {
  Serial.begin(9600);  // Start serial communication at 9600 bps
}

String startMessageChar = "!";
String endMessageChar = "@";

void loop() {

  int x = 102 + random(0, 10);
  int y = 127 + random(0, 10);
  int z = 299 + random(0, 10);
  String location = CreateVector(x, y, z);
  String data = startMessageChar + "DRONE A, 192.108.22, FRIENDLY," + location + endMessageChar; // TODO - Finalize data and indices for data
  Serial.println(data);
  delay(200);  
}

String CreateVector(int x, int y, int z) {
  return "(" + String(x) + "|" + String(y) + "|" + String(z) + ")";
}
g
void FillArray(char * ar, int batteryPercentage)
{
  ar[0] = batteryPercentage;
}