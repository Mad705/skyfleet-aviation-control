#include "crow_all.h"
#include <iostream>
#include "model.h"
#include<string>

using namespace std;
//g++ -o backend controller.cpp -I/opt/homebrew/Cellar/asio/1.30.2/include/ -std=c++17 -pthread
using namespace crow;
int main() {
    crow::App<crow::CORSHandler> app;

    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
        .origin("*")
        .methods("POST"_method, "GET"_method);

    CROW_ROUTE(app, "/").methods(HTTPMethod::POST)([](const crow::request& req) {
        auto body = json::load(req.body);
        
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
