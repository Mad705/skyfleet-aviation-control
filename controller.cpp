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
    fm.flightMap["FL002"].displaySeatMatrixPricePass();
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
