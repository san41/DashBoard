// Include libraries 
#include <Wire.h> 
//#include <LiquidCrystal_I2C.h>
#include <avr/wdt.h>

// Set the LCD address to 0x27 for a 16 chars and 2 line display
//LiquidCrystal_I2C lcd(0x27,16,2);  

// initialization of variables
bool firstStart = 0;
int readValue;
int screenDisplay = 0;
int motorspeed;
int currentspeed;
int restart;

int speedon = 0;

// initialization of variables OUTPUT / INPUT
int pinbuzzer = 9;
int enablePin = 3;
int motorPin1 = 1;
int motorPin2 = 0;
int resetbutton = 12;
int potard = 0;

// Screen display refresh variable 

int screen1 = 0;
int screen2 = 0; 
int screen3 = 0;
int actionRotary0 = 0;
int actionRotary1 = 0;

void setup()
{
   // Pin Mode Déclaration

  pinMode(pinbuzzer, OUTPUT);
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  pinMode(enablePin, OUTPUT);
  pinMode(resetbutton, INPUT);

  // initialization LCD Display
  //  lcd.init();
  //  lcd.backlight();

  // Opening message of the program with version
  //lcd.clear();
  //lcd.setCursor(5,0);
  //lcd.print("Version");
  //lcd.setCursor(7,1);
  //lcd.print("1.1");
  //delay(1000);
  digitalWrite(pinbuzzer, HIGH);
  delay(50);
  digitalWrite(pinbuzzer, LOW);
  // Display message 
  //lcd.clear();
  //lcd.print("Chargement");
  //lcd.setCursor(3,1);
  //lcd.print("configuration");
  //delay(1000);

  // Emission buzzer end configuration.
  digitalWrite(pinbuzzer, HIGH);
  delay(50);
  digitalWrite(pinbuzzer, LOW);
  delay(50);        
  digitalWrite(pinbuzzer, HIGH);
  delay(50);
  digitalWrite(pinbuzzer, LOW);
  //lcd.clear();
}
 
void loop (){

  readValue = analogRead(potard);
  restart = digitalRead(resetbutton);



  
  if (firstStart == 0){
    if(readValue < 500 || readValue >600){
      screenLCD(1,0);
    }else{
      screenLCD(2,0);
      firstStart = 1;
    }
  }else{
    if(readValue >= 500 && readValue <= 600){
      screenLCD(5,0);
      speedMotor(0,0);
    }else if(readValue < 500){
      if(readValue < 500 && readValue >= 451){
        screenLCD(3,10);
        speedMotor(30, 1);
      }else if(readValue < 451 && readValue >= 401){
        screenLCD(3,20);
        speedMotor(50, 1);
      }else if(readValue < 401 && readValue >= 351){
        screenLCD(3,30);
        speedMotor(75, 1);
      }else if(readValue < 351 && readValue >= 301){
        screenLCD(3,40);
        speedMotor(100, 1);
      }else if(readValue <  301 && readValue >= 251){
        screenLCD(3,50);
        speedMotor(125, 1);
      }else if(readValue < 251 && readValue >= 201){
        screenLCD(3,60);
        speedMotor(150, 1);
      }else if(readValue < 201 && readValue >= 151){
        screenLCD(3,70);
        speedMotor(175, 1);
      }else if(readValue < 151 && readValue >= 121){
        screenLCD(3,80);
        speedMotor(200, 1);
      }else if(readValue < 121 && readValue >= 90){
        screenLCD(3,90);
        speedMotor(225, 1);
      }else if(readValue < 90 && readValue >= 0){
        screenLCD(3,100);
        speedMotor(255, 1);
      }
    }else if (readValue > 600){
        screenLCD(4,0);  
        if(readValue >= 600 && readValue < 650){
        screenLCD(4,10);
        speedMotor(25, 0);
      }else if(readValue >= 650 && readValue < 700){
        screenLCD(4,20);
        speedMotor(50, 0);
      }else if(readValue >= 700 && readValue < 750){
        screenLCD(4,30);
        speedMotor(75, 0);
      }else if(readValue >= 750 && readValue < 800){
        screenLCD(4,40);
        speedMotor(100,0);
      }else if(readValue >= 800 && readValue < 850){
        screenLCD(4,50);
        speedMotor(125, 0);
      }else if(readValue >= 850 && readValue < 900){
        screenLCD(4,60);
        speedMotor(150, 0);
      }else if(readValue >= 900 && readValue < 950){
        screenLCD(4,70);
        speedMotor(175, 0);
      }else if(readValue >= 950 && readValue < 980){
        screenLCD(4,80);
        speedMotor(200, 0);
      }else if(readValue >= 980 && readValue < 1000){
        screenLCD(4,90);
        speedMotor(225, 0);
      }else if(readValue >= 1000 && readValue <= 1024){
        screenLCD(4,100);
        speedMotor(250, 0);
      }
    }
  }

  // Restart 
  if(restart == 1){
    wdt_enable(WDTO_30MS);
    for(;;);  
  }
}

void screenLCD(int message, int data){
  // Ligne de gestion LCD commenté car doute sur library 
//
//  motorspeed = data;
//
//  switch (message){
//    case 1:
//      if(screen1 == 0){
//        lcd.clear();                  
//        lcd.setCursor(0,0);           
//        lcd.print(" Regler vitesse");    
//        lcd.setCursor(1,1);           
//        lcd.print("au point mort. ");  
//        screen1 = 1;
//        screen2 = 0;
//        screen3 = 0;
//      }
//    break;
//    case 2:
//      if(screen2 == 0){
//        lcd.clear();                  
//        lcd.setCursor(0,0); 
//        lcd.println(" Point mort OK. ");
//        lcd.setCursor(0,1);           
//        lcd.print(" Attente ordre.");
//        screen2 = 1;
//        screen1 = 0;
//        screen3 = 0;
//      }
//    break;
//    case 3:
//      if(motorspeed != 0){
//        if(motorspeed != currentspeed){
//          lcd.clear();                  
//          lcd.setCursor(2,0); 
//          lcd.println("MARCHE AVANT  ");
//          lcd.setCursor(7,1);           
//          lcd.print(motorspeed);  
//          lcd.setCursor(10,1);           
//          lcd.print("%"); 
//          currentspeed = motorspeed;
//          screen2 = 0;
//          screen1 = 0;
//          screen3 = 0;
//        }
//      }
//    break;
//    case 4:
//      if(motorspeed != 0){
//        if(motorspeed != currentspeed){
//          lcd.clear();                  // start with a blank screen
//          lcd.setCursor(2,0); 
//          lcd.println("MARCHE ARRIERE  ");
//          lcd.setCursor(7,1);           
//          lcd.print(motorspeed);  
//          lcd.setCursor(10,1);           
//          lcd.print("%"); 
//          currentspeed = motorspeed;
//          screen2 = 0;
//          screen1 = 0;
//          screen3 = 0;
//      }
//    }
//    break;
//    case 5:
//      if(screen3 == 0){
//        lcd.clear();            
//        lcd.setCursor(1,0); 
//        lcd.println("POINT MORT PAS ");
//        lcd.setCursor(2,1);
//        lcd.println("DE ROTATION.   ");
//        screen3 = 1;
//        screen2 = 0;
//        screen1 = 0;
//      }
//    break;
//    default:
//    break;
//  }
}


void speedMotor(int speed, int rotation){
  switch (rotation){
    case 0 :
      if (actionRotary0 == 0){
        digitalWrite(motorPin1, LOW);
        digitalWrite(motorPin2, HIGH);
        actionRotary0 = 1;
        actionRotary1 = 0;
      }
    break;
    case 1 :
      if (actionRotary1 == 0){
        digitalWrite(motorPin1, HIGH);
        digitalWrite(motorPin2, LOW); 
        actionRotary0 = 0;  
        actionRotary1 = 1;  
      }
    break;
  }

  
  if(speed > speedon){
    digitalWrite(pinbuzzer, HIGH);
    delay(1000);
    digitalWrite(pinbuzzer, LOW);
    delay(2000);
     
    while(speedon >= speed){
      analogWrite(enablePin, speedon);
      speedon++;
      delay(10);
    }
  }else if (speed < speedon){
    while(speedon <= speed){
      analogWrite(enablePin, speedon); 
      speedon--;
      delay(10);
    }
  }
}
