#include "crow_all.h"
#include <iostream>
#include "controller.h"
#include<string>
#include<vector>
#include<map>
#include<iomanip>

using namespace std;
//g++ -o backend controller.cpp -I/opt/homebrew/Cellar/asio/1.30.2/include/ -std=c++17 -pthread
using namespace crow;
int main() {
    ResourceManager& rm = ResourceManager::getInstance();
    FlightManager& fm = FlightManager::getInstance();
    Datarepo& dm = Datarepo::getInstance();
    

    rm.loadCrewData();
    fm.loadAircraftData();
    dm.loadBaggageData();
    dm.loadTicketData();
    dm.loadpassData();
    fm.loadflights();
    rm.loadGR();
    fm.flightMap.erase("NULL");
    //fm.flightMap["FL002"].displaySeatMatrixPricePass();
    crow::App<crow::CORSHandler> app;
    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
        .origin("*")
        .methods("POST"_method, "GET"_method);
    vector<vector<std::string>> aircraft,baggage,crew;
    CROW_ROUTE(app, "/fetchdata").methods(HTTPMethod::POST)([](const crow::request& req) {
        auto body = json::load(req.body);
        std::string a=body["tableName"].s();
        vector<vector<std::string>> data=fetchData(a);
        displayTable(data);
        crow::json::wvalue response;
        for (size_t i = 0; i < data.size(); ++i) {
            for (size_t j = 0; j < data[i].size(); ++j) {
                response["data"][i][j] = data[i][j];
            }
        }
    
        return response;

    });
    CROW_ROUTE(app, "/api/flights/update-status").methods(crow::HTTPMethod::POST)(
        [&fm](const crow::request& req) {
            try {
                auto body = crow::json::load(req.body);
                if (!body) {
                    return crow::response(400, "Invalid JSON");
                }
    
                // Print the received JSON data
                std::cout << "\n=== Received Status Update Request ===\n";
                std::cout << "Flight ID: " << body["flightId"].s() << "\n";
                std::cout << "New Status: " << body["status"].s() << "\n";
                std::cout << "======================================\n\n";
                std::string fid=body["flightId"].s(),stat=body["status"].s();
                fm.flightMap[fid].updateStatus(stat);
                updateFlightStatus(fid,stat);
                // Return empty success response
                return crow::response(200);
    
            } catch (const std::exception& e) {
                std::cerr << "Error processing request: " << e.what() << "\n";
                return crow::response(500);
            }
        }
    );
    CROW_ROUTE(app, "/api/flights/create").methods(crow::HTTPMethod::POST)(
        [&fm](const crow::request& req) {
            try {
                auto body = crow::json::load(req.body);
                if (!body) {
                    return crow::response(400, "Invalid JSON");
                }
    
                // Print the received flight data to console
                std::cout << "\nReceived new flight data:\n";
                std::cout << "ID: " << body["id"].s() << "\n";
                std::cout << "Source: " << body["src"].s() << "\n";
                std::cout << "Destination: " << body["dest"].s() << "\n";
                std::cout << "Datetime: " << body["datetime"].s() << "\n";
                std::cout << "Aircraft: " << body["ac"].s() << "\n";
                std::cout << "Base Price: " << body["basePrice"].s() << "\n";
                std::cout << " Gate: " << body["gate"].s() << "\n";
                std::cout << " Runway: " << body["runway"].s() << "\n";
                std::cout << "status : " << body["status"].s() << "\n";
                            fm.addFlight(body);

                // For now, just return success - you'll implement the actual creation later
                crow::json::wvalue response;
                response["message"] = "Flight data received successfully";
                response["flight_id"] = body["id"].s();
                return crow::response(200, response);
    
            } catch (const std::exception& e) {
                std::cerr << "Error processing flight creation: " << e.what() << "\n";
                return crow::response(500, "Internal server error");
            }
        }
    );
    CROW_ROUTE(app, "/api/aircrafts/available").methods(crow::HTTPMethod::GET)(
        [&fm](const crow::request& req) {
            return fm.getAvailableAircrafts();
        }
    );
    CROW_ROUTE(app, "/api/aircrafts/all").methods(crow::HTTPMethod::GET)(
        [&fm](const crow::request& req) {
            return fm.getAllAircrafts();
        }
    );
    CROW_ROUTE(app, "/api/crew/all").methods(crow::HTTPMethod::GET)(
        [&rm](const crow::request& req) {
            cout<<rm.getAllCrews().dump()<<endl;
            return rm.getAllCrews();
        }
    );
    CROW_ROUTE(app, "/api/gr").methods(crow::HTTPMethod::GET)(
        [&rm](const crow::request& req) {
            return rm.gatesAndRunways();
        }
    );
    CROW_ROUTE(app, "/api/dashboard/flights").methods(crow::HTTPMethod::GET)([&fm]() {
        crow::json::wvalue response;
        
        // Safely get flight count
        size_t totalFlights = 0;
        size_t scheduledFlights = 0;
        size_t activeFlights = 0;
        
        try {
            totalFlights = fm.flightMap.size();
            
            // Build flights array
            int index = 0;
            for ( auto& pair : fm.flightMap) {
                try {
                    // Skip invalid flights
                    if (pair.second.id.empty()) {
                        CROW_LOG_WARNING << "Skipping flight with empty ID";
                        continue;
                    }
                    
                    response["flights"][index] = pair.second.getFlightDetails();
                    index++;
                    
                    // Count statuses
                    if (pair.second.status == "Scheduled") scheduledFlights++;
                    else if (pair.second.status != "Completed") activeFlights++;
                    
                } catch (const std::exception& e) {
                    CROW_LOG_ERROR << "Error processing flight " << pair.first << ": " << e.what();
                    continue;
                }
            }
            
            
            return crow::response(200, response);
            
        } catch (const std::exception& e) {
            CROW_LOG_CRITICAL << "Dashboard endpoint failed: " << e.what();
            return crow::response(500, "Internal server error");
        }
    });
    CROW_ROUTE(app, "/api/assign/flights").methods(crow::HTTPMethod::GET)([&fm]() {
        crow::json::wvalue response;
        
        // Safely get flight count
        size_t totalFlights = 0;
        size_t scheduledFlights = 0;
        size_t activeFlights = 0;
        
        try {
            totalFlights = fm.flightMap.size();
            
            // Build flights array
            int index = 0;
            for ( auto& pair : fm.flightMap) {
                try {
                    // Skip invalid flights
                    if (pair.second.id.empty()) {
                        CROW_LOG_WARNING << "Skipping flight with empty ID";
                        continue;
                    }
                    if(pair.second.status=="Scheduled"){
                    response["flights"][index] = pair.second.getFlightDetails();
                    index++;}
                    
                    
                } catch (const std::exception& e) {
                    CROW_LOG_ERROR << "Error processing flight " << pair.first << ": " << e.what();
                    continue;
                }
            }
            
            
            return crow::response(200, response);
            
        } catch (const std::exception& e) {
            CROW_LOG_CRITICAL << "Dashboard endpoint failed: " << e.what();
            return crow::response(500, "Internal server error");
        }
    });
    CROW_ROUTE(app, "/api/flights/seat-matrix").methods(crow::HTTPMethod::GET)(
        [&fm](const crow::request& req) {
            return fm.getAllFlightsSeatMatrix();
        }
    );
    CROW_ROUTE(app, "/api/assign/crews").methods(crow::HTTPMethod::GET)(
        [&rm](const crow::request& req) {
            return rm.getAvailCrews();
        }
    );
    CROW_ROUTE(app, "/api/assign/assignments").methods(crow::HTTPMethod::POST)([&fm, &rm](const crow::request& req) {
        try {
          // Parse JSON body
          auto body = crow::json::load(req.body);
          if (!body) {
            CROW_LOG_ERROR << "Invalid JSON in request body";
            std::cerr << "Invalid JSON in request body\n";
            return crow::response(400, "Invalid JSON");
          }
      
          // Print the JSON to console
          std::cout << "\nReceived new assignment data:\n";
          std::cout << "Flight ID: " << body["flightId"].s() << "\n";
          std::cout << "Pilot ID: " << body["pilotId"].s() << "\n";
          std::cout << "Copilot ID: " << body["copilotId"].s() << "\n";
          std::cout << "Attendant IDs: ";
          for (const auto& id : body["attendantIds"]) {
            std::cout << id.s() << " ";
          }
          std::cout << "\nGround Staff IDs: ";
          for (const auto& id : body["groundStaffIds"]) {
            std::cout << id.s() << " ";
          }
          std::cout << "\n";
      
        

      
         
          
          
       
      
       
      
          // Return success response
          crow::json::wvalue response;
          response["message"] = "Assignment created successfully";
          return crow::response(200, response);
        } catch (const std::exception& e) {
          CROW_LOG_ERROR << "Error processing assignment: " << e.what();
          std::cerr << "Error processing assignment: " << e.what() << "\n";
          return crow::response(500, "Internal server error");
        }
      });
    CROW_ROUTE(app, "/api/login").methods(crow::HTTPMethod::POST)([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        std::string a=body["username"].s(),b=body["password"].s(),c=body["role"].s();
        int result=login(a,b,c);
        crow::json::wvalue response;
        if(result){
            response["message"]="Successfull login , Welcome ";
            return crow::response(200, response);
        }
        response["message"]="Login failed";
            return crow::response(400, response);
    });

    // ✅ Bind to all interfaces (Mac fix)
    app.bindaddr("0.0.0.0").port(5000).multithreaded().run();
}
