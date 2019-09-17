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
int speedmap = 0;

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
       // map (variable lue, valeur max du potar pour avancer, valeur min potar pour avancer, valeur min du moteur, valeur max du moteur)
      // En gros, tu changes 35 et 170 qui fait que 35 c'est la vitesse du début et 170 la vitesse max
       speedmap = map(readValue, 499, 0, 35, 170);
       speedMotor(speedmap, 1);
    }else if (readValue > 600){
      speedmap = map(readValue, 601, 1024, 35, 170);
      speedMotor(speedmap, 0);
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
      do{
        analogWrite(enablePin, speedon); 
        speedon++;
        delay(10);
      }while (speedon < speed);

  }else if (speed < speedon){
      do{
        analogWrite(enablePin, speedon); 
        speedon--;
        delay(10);
      }while (speedon > speed);
  }
}
