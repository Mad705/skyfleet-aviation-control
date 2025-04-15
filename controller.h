#include<iostream>
#include<string>
#include<vector>
#include<map>
#include<iomanip>
using namespace std;

// Forward declarations
class Flight;
class Passenger;
class Ticket;

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
            try {
                capacity = stoi(d); 
            } catch (...) {
                capacity = 0; 
            }
            id = a;
            name = b;
            model = c;
            avail = e;
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
    protected:
        std::string id, password, name;
        int age;
        std::string country, role;
    
    public:
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
        std::string availability, crewRole;
    
        Crew(const std::string& _id, const std::string& _password, const std::string& _name,
             const std::string& _age, const std::string& _country, const std::string& _role,
             const std::string& _availability, const std::string& _crewRole)
        {
            id = _id;
            password = _password;
            name = _name;
            age = std::stoi(_age);  // string to int conversion
            country = _country;
            role = _role;
            availability = _availability;
            crewRole = _crewRole;
        }
    
        void updateAvail(const std::string& new_status) {
            availability = new_status;
        }
    
        void getDetails() const override {
            std::cout << "\n======= Crew Member Details =======\n";
            Person::getDetails();
            std::cout << "Crew Role    : " << crewRole << "\n"
                      << "Availability : " << availability << "\n";
            std::cout << "===================================\n";
        }
    };

// Ticket
class Ticket {
    private:
        std::string id, datetime, seatNumber;
        double price;
        std::string flight_id;
        std::string passenger_id;
    
    public:
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


   
    void addBaggage(Baggage b) {
        baggageList.push_back(b);
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
// Flight (Subject for Observer Pattern)
class Flight : public FlightSubject {
public:
    std::string id, src, dest, datetime, status;
    int basePrice;
    vector<vector<int>> seatPricing; // 10 rows × 6 seats
    vector<vector<Passenger*>> passengerList;
    Aircraft ac;
    map<std::string, Crew> crewMap;
    vector<Baggage> baggageList;
    int gate, runway;
    Flight(const std::string& _id, const std::string& _src, const std::string& _dest, const std::string& _datetime, int _basePrice, Aircraft _ac)
    : id(_id), src(_src), dest(_dest), datetime(_datetime), basePrice(_basePrice), ac(_ac), status("Scheduled") {

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
    void updateStatus(std::string newStatus);
    void displaySeatMatrix();
    void displayPassengerList();
    void displayBaggageList();
};

// Factory Pattern for Flight
class FlightFactory {
public:
};

// Factory Pattern for Ticket
class TicketFactory ;

// Singleton Pattern for FlightManager
class FlightManager {
private:
    static FlightManager* instance;
    FlightManager() {}
public:
    map<std::string, Flight*> flightMap;
    map<std::string, Aircraft*> aircraftMap;

    static FlightManager* getInstance() {
        if (!instance) instance = new FlightManager();
        return instance;
    }

    void addFlight(Flight* fl) ;
    void addAircraft(Aircraft* ac);
    void displayFlights();
};

FlightManager* FlightManager::instance = nullptr;

// Singleton ResourceManager
class ResourceManager {
private:
    static ResourceManager* instance;
    ResourceManager() {}
public:
    map<int, Flight*> gates;
    map<int, Flight*> runways;
    map<std::string, Crew> crewMap;

    static ResourceManager* getInstance() {
        if (!instance) instance = new ResourceManager();
        return instance;
    }

    void assignGate(int gateNo, Flight* fl);
    void assignRunway(int runwayNo, Flight* fl) ;
    void assignCrew(Crew c) ;
};

// Initialize ResourceManager
ResourceManager* ResourceManager::instance = nullptr;


