#include<iostream>
#include<string>
#include<vector>
#include<map>
#include<iomanip>
#include "model.h"
using namespace std;

// Forward declarations
class Flight;
class Passenger;
class Ticket;
class FlightManager;
class Datarepo;
class ResourceManager;
class Crew;

// Strategy Pattern for Pricing
class PricingStrategy {
public:
    virtual double calculatePrice(double basePrice) = 0;
};

class EconomyPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice) override {
        return basePrice;
    }
};

class PremiumPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice) override {
        return basePrice * 1.2;
    }
};

class BusinessPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice) override {
        return basePrice * 1.5;
    }
};

class FirstPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice) override {
        return basePrice * 2.0;
    }
};

class SeatBooking {
private:
    PricingStrategy* strategy;
public:
    SeatBooking(PricingStrategy* strat) : strategy(strat) {}
    double getFinalPrice(double basePrice) {
        return strategy->calculatePrice(basePrice);
    }
};

// Observer Pattern
class Observer {
public:
    virtual void update(const std::string& status) = 0;
};

class PassengerObserver : public Observer {
private:
    std::string name;
    
public:
    PassengerObserver(std::string n) : name(n) {}
    void update(const std::string& status) override {
        cout << "Passenger " << name << " notified: Flight status changed to " << status << endl;
    }
};



// Aircraft
class Aircraft {
    public:
        std::string id, name, model;
        int capacity;
        std::string avail;
        Aircraft(){}
        Aircraft(const std::string& a, const std::string& b, const std::string& c, const std::string& d, const std::string& e) {
            id = a;
            name = b;
            model = c;
            avail = e;
            try {
                capacity = stoi(d);
            } catch (const std::invalid_argument& e) {
                std::cerr << "Error: Invalid capacity value '" << d << "' for aircraft ID " << a << ". Setting capacity to 0." << std::endl;
                capacity = 0;
            } catch (const std::out_of_range& e) {
                std::cerr << "Error: Capacity value '" << d << "' for aircraft ID " << a << " is out of range. Setting capacity to 0." << std::endl;
                capacity = 0;
            }
        }
    
        void update_status(const std::string& new_status) {
            avail = new_status;
        }
    };
    

// Baggage
class Baggage {
    public:
        std::string id, status,flight_id,owner_id;
        double height, width, weight;
        Baggage(){}
        Baggage(const std::string& a, const std::string& b, const std::string& c, const std::string& d, const std::string& e,const std::string& f,const std::string& g) {
            id = a;
            status = g;
            owner_id=b;
            flight_id=f;
            try {
                height = stod(c);
                width = stod(d);
                weight = stod(e);
            } catch (...) {
                height = width = weight = 0.0;
            }
        }
        void getBaggageDetails() {
            cout << "Baggage ID: " << id << ", Status: " << status << endl;
        }
    };
    

// Person Base Class

class Person {
        
    
    public:
    std::string id, name;
        int age;
        std::string country, role;
        virtual void getDetails() const {
            std::cout << "ID       : " << id << "\n"
                      << "Name     : " << name << "\n"
                      << "Age      : " << age << "\n"
                      << "Country  : " << country << "\n"
                      << "Role     : " << role << "\n";
        }
    
        virtual ~Person() {} // virtual destructor for proper cleanup
    };
    
    // Crew
    class Crew : public Person {
    public:
        std::string availability, crewRole,flight_id;
        Crew(){}
        Crew(const std::string& _id, const std::string& _name,
            const std::string& _age, const std::string& _country, const std::string& _role,
            const std::string& _availability, const std::string& _crewRole,const std::string& _flight_id)
       {
           id = _id;
           name = _name;
           country = _country;
           role = _role;
           availability = _availability;
           crewRole = _crewRole;
           flight_id=_flight_id;
           try {
               age = std::stoi(_age);  // string to int conversion
           } catch (const std::invalid_argument& e) {
               std::cerr << "Error: Invalid age value '" << _age << "' for crew member ID " << _id << ". Setting age to 0." << std::endl;
               age = 0;
           } catch (const std::out_of_range& e) {
               std::cerr << "Error: Age value '" << _age << "' for crew member ID " << _id << " is out of range. Setting age to 0." << std::endl;
               age = 0;
           }
       }
        void updateAvail(const std::string& new_status) {
            availability = new_status;
        }
    
        void getDetails() const override {
            std::cout << "\n======= Crew Member Details =======\n";
            Person::getDetails();
            cout << "ID       : " << id << "\n"
                      << "Name     : " << name << "\n"
                      << "Age      : " << age << "\n"
                      << "Country  : " << country << "\n"
                      << "Role     : " << role << "\n"
                      << "Crew Role    : " << crewRole << "\n"
                      << "Availability : " << availability << "\n";
            std::cout << "===================================\n";
        }
    };

// Ticket
class Ticket {
    public:
        std::string id, datetime, seatNumber;
        double price;
        std::string flight_id;
        std::string passenger_id;
    
   
    Ticket(){}
        Ticket(std::string id, std::string datetime, std::string seatNumber, std::string price,
               std::string flight_id, std::string passenger_id) 
            : id(id), datetime(datetime), seatNumber(seatNumber), price(stod(price)),
              flight_id(flight_id), passenger_id(passenger_id) {}
    
              void getTicketDetails() {
                std::cout << "\n========== Ticket Details ==========\n";
                std::cout << " Ticket ID       : " << id << "\n";
                std::cout << " Passenger ID    : " << passenger_id << "\n";
                std::cout << " Flight ID       : " << flight_id << "\n";
                std::cout << " Seat Number     : " << seatNumber << "\n";
                std::cout << " Date & Time     : " << datetime << "\n";
                std::cout << " Price           : $" << std::fixed << std::setprecision(2) << price << "\n";
                std::cout << "====================================\n";
            }
    };
    

// Passenger
class Passenger : public Person, public Observer {
private:
    vector<Ticket> ticketList;
    vector<Baggage> baggageList;
    
    int wallet = 10000;
public:

    Passenger(){}
    Passenger(const std::string id, const std::string name, std::string age, 
        const std::string country, std::string walletAmount) {
    this->id = id;
    this->name = name;
    this->age = stoi(age);
    this->country = country;
    this->role = "Passenger";
    this->wallet = stoi(walletAmount);
    }

    void addBaggage(Baggage b) {
        baggageList.push_back(b);
    }
    void addTicket(Ticket t){
        ticketList.push_back(t);
    }
    void cancelBooking(Flight* fl) {}
    void addMoneyToWallet(int money) { wallet += money; }

    void update(const std::string& status) override {
        cout << "Passenger " << name << " notified: " << status << endl;
    }
};
class FlightSubject {
    private:
        vector<Observer*> observers;
        std::string status;
    public:
        void attach(Observer* o) {
            observers.push_back(o);
        }
    
        void setStatus(const std::string& newStatus) {
            status = newStatus;
            notifyAll();
        }
    
        void notifyAll() {
            for (auto* o : observers) {
                o->update(status);
            }
        }
    };
    class FlightManager {
        private:
            static FlightManager instance;
            FlightManager() {}
        public:
            unordered_map<std::string, Flight> flightMap;
            unordered_map<std::string, Aircraft> aircraftMap;
            static FlightManager& getInstance() {
                return instance;
            }
            void loadAircraftData() {
                vector<vector<std::string>> aircraftData = fetchData("aircraft");
                for (const auto& row : aircraftData) {
                    Aircraft ac(row[0], row[1], row[2], row[7], row[8]);
                    aircraftMap[row[0]] = ac;
                }
            }
            void loadflights();
            void addFlight(Flight* fl) ;
            void addAircraft(Aircraft* ac);
            void displayFlights();
        };
        
        FlightManager FlightManager::instance ;
        
        // Singleton ResourceManager using reference
        class ResourceManager {
            private:
                static ResourceManager instance; // instance object, not pointer
                ResourceManager() {}             // private constructor
            
            public:
                map<int, Flight> gates;
                map<int, Flight> runways;
                map<std::string, Crew> crewMap;
            
                // Return reference instead of pointer
                static ResourceManager& getInstance() {
                    return instance;
                }
                void loadCrewData() {
                    vector<vector<std::string>> crewData = fetchcrew();
                    for (const auto& row : crewData) {
                        Crew crewMember(row[0], row[1], row[3], row[4], row[5], row[7], row[8], row[9]);
                        crewMap[row[0]] = crewMember;
                    }
                }
                void loadGR();
               
            
                void assignGate(int gateNo, Flight* fl) ;
            
                void assignRunway(int runwayNo, Flight* fl) ;
            
                void assignCrew(const Crew& c);
            };
            ResourceManager ResourceManager::instance;
        
        class Datarepo{
            private:
                static Datarepo instance; // instance object, not pointer
                Datarepo() {}             // private constructor
            
            public:
            unordered_map<std::string,Ticket> ticketMap;
            unordered_map<std::string, Baggage> baggageMap;
            unordered_map<std::string, Passenger> passengerMap;
            
                // Return reference instead of pointer
                static Datarepo& getInstance() {
                    return instance;
                }
                void loadTicketData(){
                    vector<vector<std::string>> ticketData = fetchData("ticket");
                    for (const auto& row : ticketData) {
                        Ticket ticket(row[0], row[5], row[3], row[4], row[2], row[1]);
                        ticketMap[row[0]] = ticket;
                    }
                }
            
                void loadBaggageData(){
                    vector<vector<std::string>> baggageData = fetchData("baggage");
                    for (const auto& row : baggageData) {
                        Baggage baggage(row[0], row[1], row[2], row[3], row[4], row[5], row[6]);
                        baggageMap[row[0]] = baggage;
                    }
                }
                void loadpassData(){
                    vector<vector<std::string>> passData = fetchpass();
                    for (const auto& row : passData) {
                        Passenger ps(row[0], row[1], row[3], row[4], row[7]);
                       passengerMap[row[0]] = ps;
                    }
                }
            };
            Datarepo Datarepo::instance;
        
// Flight (Subject for Observer Pattern)
class Flight : public FlightSubject {
public:
    std::string id, src, dest, datetime, status;
    double basePrice;
    vector<vector<int>> seatPricing; // 10 rows × 6 seats
    vector<vector<Passenger*>> passengerList;
    Aircraft ac;
    map<std::string, Crew> crewMap;
    vector<Baggage> baggageList;
    std::string gate, runway;
    Flight(){};
    Flight(const std::string& _id, const std::string& _src, const std::string& _dest, const std::string& _datetime,std::string _ac,std::string _gate,std::string _runway, std::string _status,std::string _basePrice)
    : id(_id), src(_src), dest(_dest), datetime(_datetime), basePrice(stod(_basePrice)), status(_status),gate(_gate),runway(_runway) {
        FlightManager& fm = FlightManager::getInstance();
        if (fm.aircraftMap.find(_ac) != fm.aircraftMap.end()) {
            ac = fm.aircraftMap[_ac];
        } else {
            std::cerr << "Error: Aircraft ID " << _ac << " not found in FlightManager!\n";
            // You can throw an exception or assign a default Aircraft if needed
        }
    // Setup pricing strategies
    EconomyPricing economy;
    PremiumPricing premium;
    BusinessPricing business;
    FirstPricing first;

    // 10 rows × 6 seats → fill in pricing
    seatPricing = vector<vector<int>>(10, vector<int>(6, 0));
    passengerList = vector<vector<Passenger*>>(10, vector<Passenger*>(6, nullptr));

    for (int row = 0; row < 10; row++) {
        for (int col = 0; col < 6; col++) {
            PricingStrategy* strategy;

            if (row < 3)         strategy = &first;    // Rows 0–2: First Class
            else if (row < 5)    strategy = &business; // Rows 3–4: Business
            else if (row < 7)    strategy = &premium;  // Rows 5–6: Premium Economy
            else                 strategy = &economy;  // Rows 7–9: Economy

            SeatBooking booking(strategy);
            seatPricing[row][col] = booking.getFinalPrice(basePrice);
        }
    }

    gate = -1;
    runway = -1;
}
    void loadbaggage(){
        Datarepo& dm = Datarepo::getInstance();
        for(auto i:dm.baggageMap){
            if(id==i.second.flight_id){
                baggageList.push_back(i.second);
            }
        }
    }
    void loadpass(){
        Datarepo& dm = Datarepo::getInstance();
        for(auto i:dm.ticketMap){
            if(id==i.second.flight_id){
                std::string pass_id=i.second.passenger_id;
                std::string seatno=i.second.seatNumber;
                int i,j;
                j=seatno[1]-'0';
                i=seatno[0]-'A';
                Passenger* p1=&dm.passengerMap[pass_id];
                passengerList[i][j]=p1;

            }
        }
    }
    void loadcrewmem(){
        ResourceManager& rm = ResourceManager::getInstance(); // Singleton access
        for(auto i:rm.crewMap){
            if(id==i.second.flight_id){
                crewMap[i.second.crewRole]=i.second;
            }
        }
    }
    void updateStatus(std::string newStatus);
    void displaySeatMatrixPricePass(){
        // Inside Flight::displaySeatMatrixPricePass()

std::cout << "\n===== Seat Matrix for Flight " << id << " =====" << std::endl;
std::cout << "     "; // Initial padding for row numbers/letters

// Print column headers (A-F)
for (int j = 0; j < 6; ++j) {
    std::cout << std::setw(20) << std::left << static_cast<char>('A' + j);
}
std::cout << std::endl;
std::cout << "   +" << std::string(20 * 6, '-') << "+" << std::endl; // Separator line

for (int i = 0; i < 10; ++i) {
    // Print row number (adjust setw as needed)
    std::cout << std::setw(2) << std::right << i << " |";

    for (int j = 0; j < 6; ++j) {
        std::cout << std::left << "[";
        std::cout << "$" << std::setw(4) << std::right << seatPricing[i][j]; // Print price

        if (passengerList[i][j] != nullptr) {
            // Passenger found, print their ID (adjust width as needed)
            std::cout << " P:" << std::setw(8) << std::left << passengerList[i][j]->id << "]";
        } else {
            // No passenger, print "Empty"
            std::cout << " " << std::setw(9) << std::left << "Empty" << "]";
        }
         std::cout << std::left; // Reset alignment potentially
    }
    std::cout << std::endl; // Newline after each row
}
std::cout << "   +" << std::string(20 * 6, '-') << "+" << std::endl; // Footer separator line
std::cout << "==========================================" << std::endl;
    }
    void displayBaggageList();
    void displayCrew(){

    }
};

// Factory Pattern for Flight
class FlightFactory {
public:
};

// Factory Pattern for Ticket
class TicketFactory ;

// Singleton Pattern for FlightManager
void FlightManager::loadflights(){
    {
        vector<vector<std::string>> flData = fetchData("flight");
            for (const auto& row : flData) {
                Flight fl(row[0], row[1], row[2], row[3],row[4], row[5], row[6], row[7], row[8]);
                if(fl.status!="Scheduled"){
                    fl.loadbaggage();
                    fl.loadcrewmem();
                    fl.loadpass();
                }
                flightMap[row[0]] = fl;
            }
    }
};
void ResourceManager::loadGR(){
    vector<vector<std::string>> G=fetchData("gate"),R=fetchData("runway");
                    FlightManager& fm23 = FlightManager::getInstance();
                    for(auto i : G){
                        gates[stoi(i[0])]=fm23.flightMap[i[1]];
                    }
                    for(auto i : R){
                        runways[stoi(i[0])]=fm23.flightMap[i[1]];
                    }
};