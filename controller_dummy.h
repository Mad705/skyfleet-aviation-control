#ifndef CONTROLLER_H
#define CONTROLLER_H // Added include guard

#include<iostream>
#include<string>
#include<vector>
#include<map>
#include<unordered_map> // Needed for unordered_map
#include<iomanip>
#include "model.h" // Assuming model.h contains fetchData, fetchcrew, etc.

using namespace std;

// Forward declarations (still useful for pointers/references in declarations)
class Flight;
class Passenger;
class Ticket;
class FlightManager;
class Datarepo;
class ResourceManager;
class Aircraft; // Added forward declaration
class Crew;     // Added forward declaration
class Baggage;  // Added forward declaration

// Function declarations (assuming they are defined elsewhere, e.g., model.cpp or controller.cpp)
// Make sure these functions are actually defined somewhere the linker can find.
vector<vector<std::string>> fetchData(const std::string& tableName);
vector<vector<std::string>> fetchcrew();
vector<vector<std::string>> fetchpass();
void displayTable(const vector<vector<std::string>>& data); // Added declaration based on usage in controller.cpp
int login(const std::string& username, const std::string& password, const std::string& role); // Added declaration based on usage

// --- Components used by Flight and Managers ---

// Strategy Pattern for Pricing
class PricingStrategy {
public:
    virtual double calculatePrice(double basePrice) = 0;
    virtual ~PricingStrategy() = default; // Add virtual destructor
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
        if(strategy) return strategy->calculatePrice(basePrice);
        return 0.0; // Or handle null strategy case appropriately
    }
};

// Observer Pattern
class Observer {
public:
    virtual void update(const std::string& status) = 0;
    virtual ~Observer() = default; // Add virtual destructor
};


// Base Data Classes
class Aircraft {
    public:
        std::string id, name, model;
        int capacity = 0; // Initialize
        std::string avail;
        Aircraft(){} // Default constructor
        Aircraft(const std::string& a, const std::string& b, const std::string& c, const std::string& d, const std::string& e)
            : id(a), name(b), model(c), avail(e)
        {
            try {
                capacity = stoi(d);
            } catch (const std::invalid_argument& err) {
                std::cerr << "Error: Invalid capacity value '" << d << "' for aircraft ID " << a << ". Setting capacity to 0. Details: " << err.what() << std::endl;
                capacity = 0;
            } catch (const std::out_of_range& err) {
                std::cerr << "Error: Capacity value '" << d << "' for aircraft ID " << a << " is out of range. Setting capacity to 0. Details: " << err.what() << std::endl;
                capacity = 0;
            }
        }

        void update_status(const std::string& new_status) {
            avail = new_status;
        }
    };

class Baggage {
    public:
        std::string id, status,flight_id,owner_id;
        double height = 0.0, width = 0.0, weight = 0.0; // Initialize
        Baggage(){} // Default constructor
        Baggage(const std::string& a, const std::string& b, const std::string& c, const std::string& d, const std::string& e,const std::string& f,const std::string& g)
          : id(a), status(g), owner_id(b), flight_id(f)
        {
            try {
                height = stod(c);
                width = stod(d);
                weight = stod(e);
            } catch (const std::exception& err) { // Catch specific exceptions
                 std::cerr << "Error parsing baggage dimensions/weight for ID " << a << ". Setting to 0. Details: " << err.what() << std::endl;
                height = width = weight = 0.0;
            }
        }
        void getBaggageDetails() const { // Make const
            cout << "Baggage ID: " << id << ", Status: " << status << ", Owner: " << owner_id << ", Flight: " << flight_id << endl;
        }
    };

class Person {
    public:
        std::string id, name;
        int age = 0; // Initialize
        std::string country, role;

        virtual void getDetails() const {
            std::cout << "ID       : " << id << "\n"
                      << "Name     : " << name << "\n"
                      << "Age      : " << age << "\n"
                      << "Country  : " << country << "\n"
                      << "Role     : " << role << "\n";
        }

        virtual ~Person() = default; // virtual destructor for proper cleanup
    };

class Crew : public Person {
    public:
        std::string availability, crewRole,flight_id;
        Crew(){} // Default constructor
        Crew(const std::string& _id, const std::string& _name,
            const std::string& _age, const std::string& _country, const std::string& _role,
            const std::string& _availability, const std::string& _crewRole,const std::string& _flight_id)
       {
           id = _id;
           name = _name;
           country = _country;
           role = _role; // Should likely always be "Crew" or similar
           availability = _availability;
           crewRole = _crewRole;
           flight_id=_flight_id;
           try {
               age = std::stoi(_age);
           } catch (const std::invalid_argument& err) {
               std::cerr << "Error: Invalid age value '" << _age << "' for crew member ID " << _id << ". Setting age to 0. Details: " << err.what() << std::endl;
               age = 0;
           } catch (const std::out_of_range& err) {
               std::cerr << "Error: Age value '" << _age << "' for crew member ID " << _id << " is out of range. Setting age to 0. Details: " << err.what() << std::endl;
               age = 0;
           }
       }
        void updateAvail(const std::string& new_status) {
            availability = new_status;
        }

        void getDetails() const override {
            std::cout << "\n======= Crew Member Details =======\n";
            // Person::getDetails(); // Calling base class method is good practice
             cout << "ID       : " << id << "\n"
                      << "Name     : " << name << "\n"
                      << "Age      : " << age << "\n"
                      << "Country  : " << country << "\n"
                      << "Role     : " << role << "\n" // Role from Person base
                      << "Crew Role: " << crewRole << "\n" // Specific crew role
                      << "Flight ID: " << flight_id << "\n"
                      << "Avail.   : " << availability << "\n";
            std::cout << "===================================\n";
        }
    };

class Ticket {
    public:
        std::string id, datetime, seatNumber;
        double price = 0.0; // Initialize
        std::string flight_id;
        std::string passenger_id;

        Ticket(){} // Default constructor
        Ticket(std::string _id, std::string _datetime, std::string _seatNumber, std::string _price,
               std::string _flight_id, std::string _passenger_id)
            : id(_id), datetime(_datetime), seatNumber(_seatNumber),
              flight_id(_flight_id), passenger_id(_passenger_id)
        {
             try {
                 price = stod(_price);
             } catch (const std::exception& err) {
                 std::cerr << "Error parsing ticket price '" << _price << "' for ticket ID " << _id << ". Setting price to 0. Details: " << err.what() << std::endl;
                 price = 0.0;
             }
        }

              void getTicketDetails() const { // Make const
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


// Passenger (inherits Person, Observer; uses Ticket, Baggage)
// Definition comes after Person, Observer, Ticket, Baggage
class Passenger : public Person, public Observer {
private:
    vector<Ticket> ticketList;
    vector<Baggage> baggageList;
    int wallet = 0; // Initialize

public:
    Passenger(){} // Default constructor
    Passenger(const std::string _id, const std::string _name, std::string _age,
              const std::string _country, std::string _walletAmount)
    {
        id = _id;
        name = _name;
        country = _country;
        role = "Passenger"; // Set role explicitly
        try {
            age = stoi(_age);
        } catch (const std::exception& err) {
            std::cerr << "Error parsing passenger age '" << _age << "' for ID " << _id << ". Setting to 0. Details: " << err.what() << std::endl;
            age = 0;
        }
        try {
            wallet = stoi(_walletAmount);
        } catch (const std::exception& err) {
             std::cerr << "Error parsing passenger wallet '" << _walletAmount << "' for ID " << _id << ". Setting to 0. Details: " << err.what() << std::endl;
            wallet = 0;
        }
    }

    void addBaggage(const Baggage& b) { // Pass by const reference
        baggageList.push_back(b);
    }
    void addTicket(const Ticket& t){ // Pass by const reference
        ticketList.push_back(t);
    }
    // void cancelBooking(Flight* fl) {} // Definition requires Flight definition
    void addMoneyToWallet(int money) { wallet += money; }

    void update(const std::string& status) override {
        cout << "Passenger " << name << " (ID: " << id << ") notified: Flight status changed to " << status << endl;
    }

     // Override getDetails for Passenger specific info if needed
     void getDetails() const override {
         std::cout << "\n======= Passenger Details =======\n";
         Person::getDetails(); // Call base class implementation
         std::cout << "Wallet   : $" << wallet << "\n";
         std::cout << "Tickets  : " << ticketList.size() << "\n";
         std::cout << "Baggage Items: " << baggageList.size() << "\n";
         std::cout << "===============================\n";
     }

     // Need getters if wallet, tickets, baggage are needed externally
     int getWallet() const { return wallet; }
     const vector<Ticket>& getTickets() const { return ticketList; }
     const vector<Baggage>& getBaggage() const { return baggageList; }
};


// Subject for Observer Pattern (used by Flight)
class FlightSubject {
    private:
        vector<Observer*> observers;
        std::string flight_status; // Renamed to avoid conflict with Flight's status member
    public:
        virtual ~FlightSubject() = default; // Add virtual destructor

        void attach(Observer* o) {
            if (o) observers.push_back(o);
        }

        // Detach observer if needed (optional)
        void detach(Observer* o) {
            observers.erase(std::remove(observers.begin(), observers.end(), o), observers.end());
        }

        void setSubjectStatus(const std::string& newStatus) { // Renamed method
            flight_status = newStatus;
            notifyAll();
        }

        const std::string& getSubjectStatus() const { // Getter for status
            return flight_status;
        }

    protected: // Make notifyAll protected or private if only called internally
        void notifyAll() {
            cout << "Notifying " << observers.size() << " observers about status: " << flight_status << endl; // Debugging
            for (auto* o : observers) {
                if (o) o->update(flight_status);
            }
        }
    };


// --- Manager Classes Definitions ---
// Must come BEFORE Flight class definition

class FlightManager {
private:
    // Private constructor for Singleton
    FlightManager() {}
    // Prevent copying
    FlightManager(const FlightManager&) = delete;
    FlightManager& operator=(const FlightManager&) = delete;

    // Static instance holder
    static FlightManager instance;

public:
    // Public access method
    static FlightManager& getInstance() {
        return instance;
    }

    // Member data
    // Use unordered_map for potentially faster lookups if order doesn't matter
    unordered_map<std::string, Flight> flightMap;
    unordered_map<std::string, Aircraft> aircraftMap;

    // Member functions
    void loadAircraftData() {
        vector<vector<std::string>> aircraftData = fetchData("aircraft"); // Assumes fetchData is defined
        aircraftMap.clear(); // Clear existing data if reloading
        for (const auto& row : aircraftData) {
            if (row.size() >= 9) { // Basic check for enough columns
                Aircraft ac(row[0], row[1], row[2], row[7], row[8]); // Indices based on original code
                aircraftMap[row[0]] = ac; // Uses Aircraft copy assignment
            } else {
                 std::cerr << "Warning: Skipping malformed aircraft data row. Expected >= 9 columns, got " << row.size() << std::endl;
            }
        }
         cout << "Loaded " << aircraftMap.size() << " aircraft." << endl;
    }

    void loadFlights(){
        vector<vector<std::string>> flData = fetchData("flight"); // Assumes fetchData is defined
        flightMap.clear(); // Clear existing data if reloading
        cout << "Loading flights..." << endl;
        for (const auto& row : flData) {
             if (row.size() >= 9) { // Basic check
                // Use emplace instead of operator[] then assignment to avoid default constructor need
                // Pass arguments directly to Flight constructor
                auto result = flightMap.emplace(
                    std::piecewise_construct, // Allows constructing key and value separately
                    std::forward_as_tuple(row[0]), // Construct key (string)
                    std::forward_as_tuple(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]) // Construct value (Flight)
                );

                if (result.second) { // Check if emplace was successful (new element inserted)
                    Flight& new_fl = result.first->second; // Get reference to the newly inserted flight
                    cout << "  Loaded Flight ID: " << new_fl.id << " Status: " << new_fl.status << endl;
                    // Load related data only if the flight is not just 'Scheduled' (as per original logic)
                    // Check status AFTER constructing the flight
                    if (new_fl.status != "Scheduled") {
                         cout << "    Loading associated data for Flight ID: " << new_fl.id << endl;
                        new_fl.loadbaggage();
                        new_fl.loadcrewmem();
                        new_fl.loadpass();
                    }
                } else {
                     std::cerr << "Warning: Duplicate Flight ID found, skipping row for ID: " << row[0] << std::endl;
                }

             } else {
                  std::cerr << "Warning: Skipping malformed flight data row. Expected >= 9 columns, got " << row.size() << std::endl;
             }
        }
        cout << "Finished loading " << flightMap.size() << " flights." << endl;
    }

    // Declare other methods if they exist (implement them in .cpp)
    // void addFlight(Flight* fl); // Example declaration
    // void addAircraft(Aircraft* ac); // Example declaration
    // void displayFlights(); // Example declaration
};


class ResourceManager {
    private:
        ResourceManager() {} // private constructor
        ResourceManager(const ResourceManager&) = delete;
        ResourceManager& operator=(const ResourceManager&) = delete;
        static ResourceManager instance; // instance object

    public:
        map<int, Flight*> gates;    // Using map for ordered gates/runways?
        map<int, Flight*> runways;
        map<std::string, Crew> crewMap; // Crew ID to Crew object

        static ResourceManager& getInstance() {
            return instance;
        }

        void loadCrewData() {
            vector<vector<std::string>> crewData = fetchcrew(); // Assumes fetchcrew exists
            crewMap.clear();
            for (const auto& row : crewData) {
                 if (row.size() >= 10) { // Check columns
                    // Indices based on original code: 0:id, 1:name, 3:age, 4:country, 5:role(Person), 7:availability, 8:crewRole, 9:flight_id
                    Crew crewMember(row[0], row[1], row[3], row[4], row[5], row[7], row[8], row[9]);
                    crewMap[row[0]] = crewMember; // Use crew ID as key
                 } else {
                     std::cerr << "Warning: Skipping malformed crew data row. Expected >= 10 columns, got " << row.size() << std::endl;
                 }
            }
             cout << "Loaded " << crewMap.size() << " crew members." << endl;
        }

        // Declare other methods (implement in .cpp)
        // void assignGate(int gateNo, Flight* fl) ;
        // void assignRunway(int runwayNo, Flight* fl) ;
        // void assignCrew(const Crew& c); // Maybe assign by ID?
    };


class Datarepo{
    private:
        Datarepo() {} // private constructor
        Datarepo(const Datarepo&) = delete;
        Datarepo& operator=(const Datarepo&) = delete;
        static Datarepo instance; // instance object

    public:
        // Use unordered_map if order doesn't matter and performance is key
        unordered_map<std::string,Ticket> ticketMap; // Ticket ID to Ticket
        unordered_map<std::string, Baggage> baggageMap; // Baggage ID to Baggage
        unordered_map<std::string, Passenger> passengerMap; // Passenger ID to Passenger

        static Datarepo& getInstance() {
            return instance;
        }

        void loadTicketData(){
            vector<vector<std::string>> ticketData = fetchData("ticket");
            ticketMap.clear();
            for (const auto& row : ticketData) {
                if (row.size() >= 6) { // Check columns
                    // Indices: 0:id, 5:datetime, 3:seatNumber, 4:price, 2:flight_id, 1:passenger_id
                    Ticket ticket(row[0], row[5], row[3], row[4], row[2], row[1]);
                    ticketMap[row[0]] = ticket;
                } else {
                     std::cerr << "Warning: Skipping malformed ticket data row. Expected >= 6 columns, got " << row.size() << std::endl;
                }
            }
             cout << "Loaded " << ticketMap.size() << " tickets." << endl;
        }

        void loadBaggageData(){
            vector<vector<std::string>> baggageData = fetchData("baggage");
            baggageMap.clear();
            for (const auto& row : baggageData) {
                 if (row.size() >= 7) { // Check columns
                    // Indices: 0:id, 1:owner_id, 2:height, 3:width, 4:weight, 5:flight_id, 6:status
                    Baggage baggage(row[0], row[1], row[2], row[3], row[4], row[5], row[6]);
                    baggageMap[row[0]] = baggage;
                 } else {
                     std::cerr << "Warning: Skipping malformed baggage data row. Expected >= 7 columns, got " << row.size() << std::endl;
                 }
            }
             cout << "Loaded " << baggageMap.size() << " baggage items." << endl;
        }

        void loadpassData(){
            vector<vector<std::string>> passData = fetchpass(); // Assumes fetchpass exists
            passengerMap.clear();
            for (const auto& row : passData) {
                 if (row.size() >= 5) { // Check columns
                    // Indices: 0:id, 1:name, 2:age, 3:country, 4:wallet
                    Passenger ps(row[0], row[1], row[2], row[3], row[4]);
                    passengerMap[row[0]] = ps;
                 } else {
                     std::cerr << "Warning: Skipping malformed passenger data row. Expected >= 5 columns, got " << row.size() << std::endl;
                 }
            }
             cout << "Loaded " << passengerMap.size() << " passengers." << endl;
        }
    };

// Define the static instances AFTER the class definitions
FlightManager FlightManager::instance;
ResourceManager ResourceManager::instance;
Datarepo Datarepo::instance;


// --- Flight Class Definition ---
// Comes AFTER dependencies (Managers, Aircraft, Crew, Passenger, Baggage, FlightSubject)

class Flight : public FlightSubject {
public:
    std::string id, src, dest, datetime, status;
    int basePrice = 0; // Initialize
    // Use vector<vector<int>> for seat pricing
    vector<vector<int>> seatPricing; // Resized in constructor
    // Store pointers to Passenger objects (managed by Datarepo)
    vector<vector<Passenger*>> passengerList; // Resized in constructor
    Aircraft ac; // Holds a copy of an Aircraft object
    map<std::string, Crew> crewMap; // Crew Role (string) to Crew object copy
    vector<Baggage> baggageList; // Holds copies of Baggage objects
    std::string gate, runway; // Should these be int? Initialize if needed

    // *** ADDED Default Constructor - Needed for map::operator[] ***
    // If you switch loadFlights to use emplace, this might not be strictly necessary,
    // but doesn't hurt if a default Flight state makes sense.
    Flight() = default;


    // Main Constructor
    Flight(const std::string& _id, const std::string& _src, const std::string& _dest, const std::string& _datetime, std::string _ac_id, std::string _gate, std::string _runway, std::string _status, std::string _basePrice)
        : id(_id), src(_src), dest(_dest), datetime(_datetime), status(_status), gate(_gate), runway(_runway)
    {
        try {
            basePrice = stoi(_basePrice);
        } catch (const std::exception& err) {
            std::cerr << "Error parsing base price '" << _basePrice << "' for flight ID " << _id << ". Setting to 0. Details: " << err.what() << std::endl;
            basePrice = 0;
        }

        // --- Now we can safely use the Managers ---
        FlightManager& fm = FlightManager::getInstance();
        if (fm.aircraftMap.count(_ac_id)) { // Use count for safer check
            ac = fm.aircraftMap.at(_ac_id); // Use .at() for checked access (throws if not found)
        } else {
            std::cerr << "Error: Aircraft ID '" << _ac_id << "' not found in FlightManager for Flight '" << _id << "'! Flight will have default Aircraft." << std::endl;
            ac = Aircraft(); // Assign a default-constructed aircraft
        }

        // Setup pricing strategies (These should probably be static or shared resources)
        EconomyPricing economy;
        PremiumPricing premium;
        BusinessPricing business;
        FirstPricing first;

        // Resize seat/passenger grids
        seatPricing.resize(10, vector<int>(6, 0));
        passengerList.resize(10, vector<Passenger*>(6, nullptr)); // Initialize with nullptr

        for (int row = 0; row < 10; row++) {
            for (int col = 0; col < 6; col++) {
                PricingStrategy* strategy = nullptr; // Initialize to null

                if (row < 3)         strategy = &first;    // Rows 0–2: First Class
                else if (row < 5)    strategy = &business; // Rows 3–4: Business
                else if (row < 7)    strategy = &premium;  // Rows 5–6: Premium Economy
                else                 strategy = &economy;  // Rows 7–9: Economy

                SeatBooking booking(strategy); // Pass pointer
                seatPricing[row][col] = booking.getFinalPrice(basePrice);
            }
        }

        // Gate/Runway: Original code had -1, but type is string. Clarify intent.
        // gate = "-1"; // Example if string is intended
        // runway = "-1"; // Example if string is intended
    }

    // --- Member Functions using Managers (Now safe to define here) ---

    void loadbaggage(){
        Datarepo& dm = Datarepo::getInstance();
        baggageList.clear(); // Clear previous baggage for this flight
        for(auto const& [baggageId, baggageObj] : dm.baggageMap){ // Use structured binding
            if(id == baggageObj.flight_id){ // Compare with flight's ID
                baggageList.push_back(baggageObj); // Adds a copy
            }
        }
         cout << "  Flight " << id << ": Loaded " << baggageList.size() << " baggage items." << endl;
    }

    void loadpass(){
        Datarepo& dm = Datarepo::getInstance();
        // Clear existing passenger pointers (don't delete Passenger objects themselves)
        for(auto& row : passengerList) {
            std::fill(row.begin(), row.end(), nullptr);
        }

        int passengersLoaded = 0;
        for(auto const& [ticketId, ticketObj] : dm.ticketMap){
            if(id == ticketObj.flight_id){ // Check if ticket is for this flight
                std::string pass_id = ticketObj.passenger_id;
                std::string seatno = ticketObj.seatNumber;

                // Basic validation for seat format (e.g., "A0", "C5")
                if (seatno.length() >= 2 && std::isalpha(seatno[0]) && std::isdigit(seatno[1])) {
                     int j = seatno[1] - '0'; // Column index (0-9)
                     int i = toupper(seatno[0]) - 'A'; // Row index (A=0, B=1, ...)

                     // Bounds check for seat matrix
                     if (i >= 0 && i < passengerList.size() && j >= 0 && j < passengerList[i].size()) {
                        // Check if passenger exists in the central passenger map
                        if (dm.passengerMap.count(pass_id)) {
                             Passenger* p1 = &dm.passengerMap.at(pass_id); // Get pointer to the passenger
                             if(passengerList[i][j] == nullptr) { // Check if seat is already taken
                                 passengerList[i][j] = p1;
                                 passengersLoaded++;
                                 // Optionally attach passenger as observer here
                                 // this->attach(p1); // Attach passenger to this flight subject
                             } else {
                                 std::cerr << "Warning: Seat " << seatno << " on Flight " << id << " already occupied by Passenger "
                                           << passengerList[i][j]->id << ". Cannot assign Passenger " << pass_id << "." << std::endl;
                             }
                         } else {
                             std::cerr << "Warning: Passenger ID '" << pass_id << "' for ticket '" << ticketId << "' not found in Datarepo for Flight " << id << "." << std::endl;
                         }
                     } else {
                          std::cerr << "Warning: Seat '" << seatno << "' (parsed as row=" << i << ", col=" << j << ") is out of bounds for Flight " << id << "." << std::endl;
                     }
                 } else {
                      std::cerr << "Warning: Invalid or incomplete seat format '" << seatno << "' for ticket '" << ticketId << "' on Flight " << id << "." << std::endl;
                 }
            }
        }
         cout << "  Flight " << id << ": Loaded " << passengersLoaded << " passengers into seats." << endl;
    }

    void loadcrewmem(){
        ResourceManager& rm = ResourceManager::getInstance();
        crewMap.clear(); // Clear previous crew for this flight
        int crewLoaded = 0;
        for(auto const& [crewId, crewObj] : rm.crewMap){
            if(id == crewObj.flight_id){ // Check if crew member is assigned to this flight
                if (!crewObj.crewRole.empty()) {
                    crewMap[crewObj.crewRole] = crewObj; // Assign copy, using role as key
                    crewLoaded++;
                } else {
                     std::cerr << "Warning: Crew member ID '" << crewId << "' assigned to Flight " << id << " has an empty crewRole." << std::endl;
                }
            }
        }
         cout << "  Flight " << id << ": Loaded " << crewLoaded << " crew members." << endl;
    }

    // Update flight status and notify observers
    void updateStatus(std::string newStatus) {
        status = newStatus;
        cout << "Flight " << id << " status updated to: " << status << endl;
        setSubjectStatus(status); // Notify observers via FlightSubject base
    }

    void displaySeatMatrixPricePass() const { // Make const
        std::cout << "\n===== Seat Matrix for Flight " << id << " (Src: " << src << ", Dest: " << dest << ", Status: " << status << ") =====" << std::endl;
        std::cout << "     "; // Initial padding

        // Print column headers (A-F for 6 columns)
        for (int j = 0; j < 6; ++j) {
             // Adjust setw for potentially longer passenger IDs + price
            std::cout << std::setw(18) << std::left << static_cast<char>('A' + j);
        }
        std::cout << std::endl;
        std::cout << "   +" << std::string(18 * 6, '-') << "+" << std::endl; // Separator line

        for (int i = 0; i < 10; ++i) { // Assuming 10 rows
            std::cout << std::setw(2) << std::right << i << " |"; // Print row number

            for (int j = 0; j < 6; ++j) { // Assuming 6 columns
                std::cout << std::left << "[";
                std::cout << "$" << std::setw(4) << std::right << seatPricing[i][j]; // Print price

                if (passengerList[i][j] != nullptr) {
                    // Print Passenger ID - ensure enough width
                    std::cout << " P:" << std::setw(8) << std::left << passengerList[i][j]->id << "]";
                } else {
                    // No passenger, print "Empty" - ensure consistent width
                    std::cout << " " << std::setw(9) << std::left << "Empty" << " ]"; // Note extra space before closing bracket
                }
                 std::cout << std::left; // Reset alignment
            }
            std::cout << std::endl;
        }
        std::cout << "   +" << std::string(18 * 6, '-') << "+" << std::endl; // Footer separator line
        std::cout << "=========================================================================" << std::endl;
    }

    void displayBaggageList() const; // Declare only, implement in .cpp if complex
    void displayCrew() const;       // Declare only, implement in .cpp if complex
};


// --- Factory Pattern Placeholders (if needed) ---

class FlightFactory {
    // ... potentially methods to create Flight objects ...
};

class TicketFactory {
    // ... potentially methods to create Ticket objects ...
};


#endif // CONTROLLER_H