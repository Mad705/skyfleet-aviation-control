#include "crow_all.h"
#include <iostream>

int main() {
    crow::App<crow::CORSHandler> app;

    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
        .origin("*")
        .methods("POST"_method, "GET"_method);

    CROW_ROUTE(app, "/")([]() {
        return "Welcome to the Crow C++ API!";
    });

    CROW_ROUTE(app, "/square").methods(crow::HTTPMethod::POST)([](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body || !body.has("number")) {
            return crow::response(400, "Invalid Input");
        }

        int num = body["number"].i();
        int result = num * num;

        crow::json::wvalue response;
        response["input"] = num;
        response["output"] = result;

        return crow::response(200, response);
    });

    // ✅ Bind to all interfaces (Mac fix)
    app.bindaddr("0.0.0.0").port(5000).multithreaded().run();
}
