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
            void addFlight(const crow::json::rvalue& flightData) ;
            void displayFlights();
            crow::json::wvalue getAllFlightsSeatMatrix();
            crow::json::wvalue getAvailableAircrafts();
            crow::json::wvalue getAllAircrafts();
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
                crow::json::wvalue gatesAndRunways();
                crow::json::wvalue getAvailCrews(){
                    crow::json::wvalue crewsJson;
                    int index = 0;
                    
                    for (const auto& pair : crewMap) {
                        const Crew& crew = pair.second;
                        crow::json::wvalue crewJson;
                       
                        if(crew.availability=="standby"){
                        // Basic person info
                        crewJson["id"] = crew.id;
                        crewJson["name"] = crew.name;
                        crewJson["role"] = crew.crewRole;  
                        crewJson["status"] = crew.availability;            
                        crewsJson[index++] = std::move(crewJson);
                        }
                    
                    
                }
                    return crewsJson;
                
                }
                crow::json::wvalue getAllCrews() {
                    crow::json::wvalue crewsJson;
                    int index = 0;
                    
                    for (const auto& pair : crewMap) {
                        const Crew& crew = pair.second;
                        crow::json::wvalue crewJson;
                        
                        // Basic person info
                        crewJson["id"] = crew.id;
                        crewJson["name"] = crew.name;
                        crewJson["country"] = crew.country;
                        crewJson["role"] = crew.role;
                        
                        // Crew-specific info
                        crewJson["availability"] = crew.availability;
                        crewJson["crewRole"] = crew.crewRole;
                        crewJson["flight_id"] = crew.flight_id;
                        
                        crewsJson[index++] = std::move(crewJson);
                    }
                    
                    return crewsJson;
                }
               
                
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
    Crew pilot,copilot,att1,gs1,att2,gs2;
    vector<Baggage> baggageList;
    std::string gate="NULL", runway="NULL";
    Flight(){};
    Flight(const std::string& _id, const std::string& _src, const std::string& _dest, const std::string& _datetime,std::string _ac,std::string _gate,std::string _runway, std::string _status,std::string _basePrice)
    : id(_id), src(_src), dest(_dest), datetime(_datetime), basePrice(stod(_basePrice)), status(_status),gate(_gate),runway(_runway) {
        FlightManager& fm = FlightManager::getInstance();
        cout<<"gate is : "<<_gate<<endl;
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
    crow::json::wvalue getSeatMatrixJson();
    void loadcrewmem() {
        ResourceManager& rm = ResourceManager::getInstance(); // Singleton access
        for (auto i : rm.crewMap) {
            if (id == i.second.flight_id) {
                if (i.second.crewRole == "pilot") {
                    pilot = i.second;
                } else if (i.second.crewRole == "copilot") {
                    copilot = i.second;
                } else if (i.second.crewRole == "attendant") {
                    if (att1.crewRole.empty()) { // Check if att1 is unassigned
                        att1 = i.second;
                    } else { // att1 is assigned, so assign to att2
                        att2 = i.second;
                    }
                } else if (i.second.crewRole == "ground-staff") {
                    if (gs1.crewRole.empty()) { // Check if gs1 is unassigned
                        gs1 = i.second;
                    } else { // gs1 is assigned, so assign to gs2
                        gs2 = i.second;
                    }
                }
            }
        }
    }
    crow::json::wvalue getFlightDetails();
    void updateStatus(std::string newStatus){
        status=newStatus;
    }
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
class FlightFactory {
    public:
        static Flight createFlight(const std::string& id, const std::string& src, 
                                 const std::string& dest, const std::string& datetime,
                                 const std::string& ac, const std::string& gate,
                                 const std::string& runway, const std::string& status,
                                 const std::string& basePrice) {
            return Flight(id, src, dest, datetime, ac, gate, runway, status, basePrice);
        }
    
        static Flight createFromJson(const crow::json::rvalue& flightData) {
            return Flight(flightData["id"].s(), 
                         flightData["src"].s(),
                         flightData["dest"].s(),
                         flightData["datetime"].s(),
                         flightData["ac"].s(),
                         flightData["gate"].s(),
                         flightData["runway"].s(),
                         flightData["status"].s(),
                         flightData["basePrice"].s());
        }
    };
// Factory Pattern for Ticket
class TicketFactory {
    public:
        static Ticket createTicket(const std::string& id, const std::string& passenger_id,
                                 const std::string& flight_id, const std::string& seatNumber,
                                 const std::string& price, const std::string& datetime) {
            return Ticket(id, datetime, seatNumber, price, flight_id, passenger_id);
        }
    
        static Ticket createFromJson(const crow::json::rvalue& ticketData) {
            return Ticket(ticketData["id"].s(),
                         ticketData["datetime"].s(),
                         ticketData["seatNumber"].s(),
                         ticketData["price"].s(),
                         ticketData["flight_id"].s(),
                         ticketData["passenger_id"].s());
        }
    };

// Singleton Pattern for FlightManager
void FlightManager::loadflights(){
    {
        vector<vector<std::string>> flData = fetchData("flight");
        displayTable(flData);
        cout<<"total flights : "<<flData.size()<<endl;
            for (const auto& row : flData) {
                Flight fl(row[0], row[1], row[2], row[3],row[4], row[5], row[6], row[7], row[8]);
                cout<<"gate inside : "<<fl.runway<<endl;
                if(fl.status!="Scheduled"){
                    fl.loadbaggage();
                    fl.loadcrewmem();
                    fl.loadpass();
                }
                flightMap[row[0]] = fl;
            }
            cout<<"total flights : "<<flightMap.size()<<endl;
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

crow::json::wvalue Flight::getFlightDetails() {
    crow::json::wvalue flightJson;
    
    // Basic flight info
    flightJson["id"] = id;
    flightJson["src"] = src;
    flightJson["dest"] = dest;
    flightJson["datetime"] = datetime;
    flightJson["status"] = status;
    
    // Aircraft details (always present)
    crow::json::wvalue aircraftJson;
    aircraftJson["id"] = ac.id;
    aircraftJson["name"] = ac.name;
    aircraftJson["model"] = ac.model;
    aircraftJson["capacity"] = ac.capacity;
    flightJson["aircraft"] = std::move(aircraftJson);
    
    // Crew details
    crow::json::wvalue crewJson;
    if (status == "Scheduled") {
        crewJson["pilot"] = "not assigned";
        crewJson["copilot"] = "not assigned";
        
        // Empty arrays with "not assigned" values
        crow::json::wvalue attendantsJson;
        attendantsJson[0] = "not assigned";
        crewJson["attendants"] = std::move(attendantsJson);
        
        crow::json::wvalue groundStaffJson;
        groundStaffJson[0] = "not assigned";
        crewJson["groundStaff"] = std::move(groundStaffJson);
    } else {
        vector<std::string> attendants;
        vector<std::string> groundStaff;
        
        crewJson["pilot"] = pilot.name.empty() ? "not assigned" : pilot.name;
        crewJson["copilot"] = copilot.name.empty() ? "not assigned" : copilot.name;
        
        // Add ground staff
        if (!gs1.name.empty()) groundStaff.push_back(gs1.name);
        if (!gs2.name.empty()) groundStaff.push_back(gs2.name);
        
        // Add attendants
        if (!att1.name.empty()) attendants.push_back(att1.name);
        if (!att2.name.empty()) attendants.push_back(att2.name);
        
        // Handle attendants
        if (attendants.empty()) {
            crow::json::wvalue attendantsJson;
            attendantsJson[0] = "not assigned";
            crewJson["attendants"] = std::move(attendantsJson);
        } else {
            crow::json::wvalue attendantsJson;
            for (size_t i = 0; i < attendants.size(); ++i) {
                attendantsJson[i] = attendants[i];
            }
            crewJson["attendants"] = std::move(attendantsJson);
        }
        
        // Handle ground staff
        if (groundStaff.empty()) {
            crow::json::wvalue groundStaffJson;
            groundStaffJson[0] = "not assigned";
            crewJson["groundStaff"] = std::move(groundStaffJson);
        } else {
            crow::json::wvalue groundStaffJson;
            for (size_t i = 0; i < groundStaff.size(); ++i) {
                groundStaffJson[i] = groundStaff[i];
            }
            crewJson["groundStaff"] = std::move(groundStaffJson);
        }
        
    }
    flightJson["crew"] = std::move(crewJson);
    flightJson["gate"] = gate;
    flightJson["runway"] = runway;
    // Gate and runway
    
    
    return flightJson;
}
crow::json::wvalue Flight::getSeatMatrixJson() {
    crow::json::wvalue seatMatrixJson;
    Datarepo& dm = Datarepo::getInstance();

    // Create rows A-J (0-9 in passengerList)
    for (int row = 0; row < 10; row++) {
        crow::json::wvalue rowJson;
        char rowChar = 'A' + row;

        // Create columns 1-6
        for (int col = 0; col < 6; col++) {
            crow::json::wvalue seatJson;
            std::string seatNumber = std::string(1, rowChar) + std::to_string(col + 1);
            seatJson["seatNumber"] = seatNumber;

            if (passengerList[row][col] != nullptr) {
                // Passenger exists in this seat
                Passenger* passenger = passengerList[row][col];
                crow::json::wvalue passengerJson;
                passengerJson["id"] = passenger->id;
                passengerJson["name"] = passenger->name;
                seatJson["passenger"] = std::move(passengerJson);
            } else {
                // Empty seat
                seatJson["passenger"] = nullptr;
            }

            // Add price information
            seatJson["price"] = seatPricing[row][col];

            // Add seat to row
            rowJson[col] = std::move(seatJson);
        }

        // Add row to seat matrix
        seatMatrixJson[row] = std::move(rowJson);
    }

    return seatMatrixJson;
}
crow::json::wvalue FlightManager::getAllFlightsSeatMatrix() {
    crow::json::wvalue response;
    int index = 0;

    for (auto& pair : flightMap) {
        Flight& flight = pair.second;
        crow::json::wvalue flightJson;

        // Basic flight info
        flightJson["id"] = flight.id;
        flightJson["src"] = flight.src;
        flightJson["dest"] = flight.dest;
        flightJson["datetime"] = flight.datetime;
        flightJson["status"] = flight.status;

        // Aircraft info
        crow::json::wvalue aircraftJson;
        aircraftJson["name"] = flight.ac.name;
        aircraftJson["model"] = flight.ac.model;
        flightJson["aircraft"] = std::move(aircraftJson);

        // Seat matrix
        flightJson["seatMatrix"] = flight.getSeatMatrixJson();

        // Add to response
        response[index++] = std::move(flightJson);
    }

    return response;
}
crow::json::wvalue FlightManager::getAvailableAircrafts() {
    crow::json::wvalue aircraftsJson;
    int index = 0;
    
    for (const auto& pair : aircraftMap) {
        const Aircraft& ac = pair.second;
        // Only include aircraft with 'standby' or 'assigned' status
        if (ac.avail == "standby") {
            crow::json::wvalue aircraftJson;
            aircraftJson["id"] = ac.id;
            aircraftJson["name"] = ac.name;
            aircraftJson["model"] = ac.model;
            aircraftJson["capacity"] = ac.capacity;
            aircraftJson["availability"] = ac.avail;
            
            aircraftsJson[index++] = std::move(aircraftJson);
        }
    }
    
    return aircraftsJson;
}
crow::json::wvalue FlightManager::getAllAircrafts() {
    crow::json::wvalue aircraftsJson;
    int index = 0;
    
    for (const auto& pair : aircraftMap) {
        const Aircraft& ac = pair.second;
        // Only include aircraft with 'standby' or 'assigned' status
         
            crow::json::wvalue aircraftJson;
            aircraftJson["id"] = ac.id;
            aircraftJson["name"] = ac.name;
            aircraftJson["model"] = ac.model;
            aircraftJson["capacity"] = ac.capacity;
            aircraftJson["availability"] = ac.avail;
            
            aircraftsJson[index++] = std::move(aircraftJson);
        
    }
    
    return aircraftsJson;
}
void FlightManager::addFlight(const crow::json::rvalue& flightData) {
    try {
        // Extract all required fields from JSON
        std::string id = flightData["id"].s();
        std::string src = flightData["src"].s();
        std::string dest = flightData["dest"].s();
        std::string datetime = flightData["datetime"].s();
        std::string ac = flightData["ac"].s();
        std::string gate = flightData["gate"].s();
        std::string runway = flightData["runway"].s();
        std::string status = flightData["status"].s();
        std::string basePrice = flightData["basePrice"].s();
        bool dbSuccess = insertFlightAndUpdateAircraft(
            id, src, dest, datetime, ac, 
            gate, runway, status, std::stod(basePrice)
        );

        if (!dbSuccess) {
            throw std::runtime_error("Failed to insert flight into database");
        }

        // Create new flight using the constructor order you specified
        Flight newFlight(id, src, dest, datetime, ac, gate, runway, status, basePrice);

        // Add to flight map
        flightMap[id] = newFlight;

        // Update aircraft status to 'assigned'
        if (aircraftMap.find(ac) != aircraftMap.end()) {
            aircraftMap[ac].avail = "assigned";
        }

        std::cout << "Successfully added flight: " << id << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error adding flight: " << e.what() << std::endl;
        throw; // Re-throw to handle in the API endpoint
    }
}
crow::json::wvalue ResourceManager::gatesAndRunways() {
    crow::json::wvalue response;

    crow::json::wvalue gatesJson;
    for (const auto& [gateNo, flight] : gates) {
        if (flight.id.empty()) {
            gatesJson[std::to_string(gateNo)] = nullptr;
        } else {
            crow::json::wvalue flightJson;
            flightJson["id"] = flight.id;
            flightJson["src"] = flight.src;
            flightJson["dest"] = flight.dest;
            flightJson["datetime"] = flight.datetime;
            flightJson["status"] = flight.status;
            gatesJson[std::to_string(gateNo)] = std::move(flightJson);
        }
    }

    crow::json::wvalue runwaysJson;
    for (const auto& [runwayNo, flight] : runways) {
        if (flight.id.empty()) {
            runwaysJson[std::to_string(runwayNo)] = nullptr;
        } else {
            crow::json::wvalue flightJson;
            flightJson["id"] = flight.id;
            flightJson["src"] = flight.src;
            flightJson["dest"] = flight.dest;
            flightJson["datetime"] = flight.datetime;
            flightJson["status"] = flight.status;
            runwaysJson[std::to_string(runwayNo)] = std::move(flightJson);
        }
    }

    response["gates"] = std::move(gatesJson);
    response["runways"] = std::move(runwaysJson);
    return response;
}
