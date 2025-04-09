#include<iostream>
#include<string>
#include<vector>
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

class BusinessPricing : public PricingStrategy {
public:
    double calculatePrice(double basePrice) override {
        return basePrice * 1.5;
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
    virtual void update(const string& status) = 0;
};

class PassengerObserver : public Observer {
private:
    string name;
public:
    PassengerObserver(string n) : name(n) {}
    void update(const string& status) override {
        cout << "Passenger " << name << " notified: Flight status changed to " << status << endl;
    }
};

class FlightSubject {
private:
    vector<Observer*> observers;
    string status;
public:
    void attach(Observer* o) {
        observers.push_back(o);
    }

    void setStatus(const string& newStatus) {
        status = newStatus;
        notifyAll();
    }

    void notifyAll() {
        for (auto* o : observers) {
            o->update(status);
        }
    }
};

// Aircraft
class Aircraft {
private:
    string id, name, model;
    int row1, row2, row3, row4, capacity;
    string avail;
public:
    void update_status(string new_status) { avail = new_status; }
};

// Baggage
class Baggage {
private:
    string id, status;
    double height, width, weight;
public:
    void getBaggageDetails() {
        cout << "Baggage ID: " << id << ", Status: " << status << endl;
    }
};

// Person Base Class
class Person {
protected:
    string id, password, name;
    int age;
    string country, role;
public:
    virtual void getDetails() {}
};

// Crew
class Crew : public Person {
private:
    string availability, role;
public:
    void updateAvail(string new_status) { availability = new_status; }
};

// Ticket
class Ticket {
private:
    string id, datetime, seatNumber;
    double price;
    Flight* fl;
    Passenger* pass;
public:
    void getTicketDetails();
};

// Flight (also a subject for Observer Pattern)
class Flight : public FlightSubject {
private:
    string id, src, dest, datetime, status;
    vector<vector<int>> seatPricing;
    vector<Passenger*> passengerList;
    Aircraft ac;
    vector<Crew> crewList;
    vector<Baggage> baggageList;
    int gate, runway;

public:
    void updateStatus(string newStatus) {
        status = newStatus;
        setStatus(newStatus); // Notify all observers
    }
    void displaySeatMatrix() {}
    void displayPassengerList() {}
    void displayBaggageList() {}
};

// Passenger
class Passenger : public Person, public Observer {
private:
    vector<Ticket> ticketList;
    vector<Baggage> baggageList;
    int wallet = 10000;
public:
    void bookFlight(Flight* fl) {
        fl->attach(this);
    }
    void addBaggage(Baggage b) {
        baggageList.push_back(b);
    }
    void cancelBooking(Flight* fl) {}
    void addMoneyToWallet(int money) { wallet += money; }

    void update(const string& status) override {
        cout << "Passenger " << name << " notified: " << status << endl;
    }
};

// Factory Pattern for Flight
class FlightFactory {
public:
    static Flight* createFlight(string id) {
        Flight* fl = new Flight();
        // Initialize flight attributes
        return fl;
    }
};

// Factory Pattern for Ticket
class TicketFactory {
public:
    static Ticket createTicket() {
        Ticket t;
        // Initialize ticket attributes
        return t;
    }
};

// Singleton Pattern for FlightManager
class FlightManager {
private:
    static FlightManager* instance;
    vector<Flight*> flightList;
    FlightManager() {}

public:
    static FlightManager* getInstance() {
        if (!instance) instance = new FlightManager();
        return instance;
    }

    void addFlight(Flight* fl) { flightList.push_back(fl); }
    void displayFlights() {}
};

FlightManager* FlightManager::instance = nullptr;

// ResourceManager with Singleton
class ResourceManager {
private:
    static ResourceManager* instance;
    ResourceManager() {}
    vector<pair<int, Flight*>> gates;
    vector<pair<int, Flight*>> runways;
    vector<pair<Crew, Flight*>> crewList;

public:
    static ResourceManager* getInstance() {
        if (!instance) instance = new ResourceManager();
        return instance;
    }
    void assignGate(int gateNo, Flight* fl) {}
    void assignRunway(int runwayNo, Flight* fl) {}
    void assignCrew(Crew c, Flight* fl) {}
};

ResourceManager* ResourceManager::instance = nullptr;

// MAIN DRIVER (optional for demo/testing)
int main() {
    FlightManager* fm = FlightManager::getInstance();
    Flight* fl = FlightFactory::createFlight("FL123");
    fm->addFlight(fl);

    Passenger* p1 = new Passenger();
    fl->attach(p1);
    fl->updateStatus("Boarding");

    return 0;
}
