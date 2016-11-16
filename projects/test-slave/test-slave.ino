#include <Wire.h>

byte buffer[2];


void setup() {
  Wire.begin(0x20);             // join i2c bus with address #8
  Wire.onReceive(receiveEvent); // register event
  Serial.begin(9600);           // start serial for output
}

void loop() {
  //
}

void receiveEvent(int count) {

//  Serial.print(count);
//  Serial.print("\n");
  String msg = getWord(Wire.read());
  byte b1 = Wire.read();
  byte b2 = Wire.read();
  uint16_t val = (b1 << 8) | b2;
  Serial.print(msg);
  Serial.print(val);

  Serial.print("\n");
}

String getWord(int hex) {
  switch (hex) {
    case 0x0: return "[ write   ], ";
    case 0x1: return "[ confirm ], ";
    case 0x3: return "[ update  ], ";
    case 0x4: return "[ turnoff ], ";
    case 0x6: return "[ int ref ], ";
    case 0x7: return "[ ext ref ], ";
    default: return "";
  }
}


