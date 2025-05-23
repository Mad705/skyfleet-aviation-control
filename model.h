#include <mysqlx/xdevapi.h>
#include <vector>
#include <stdexcept>  
#include <string>
#include <iostream>
#include <sstream>


using namespace mysqlx;
using namespace std;
int login(std::string username,std::string password , std::string role){
    Session session("localhost", 33060, "root", "teNma!511");
    std::string query = "SELECT * FROM skyfleet.person WHERE person_id = ? AND password = ? AND role = ?";
    auto result = session.sql(query)
                        .bind(username, password, role)
                        .execute();
    if (result.count() > 0) {
        return 1;
    }
    return 0;
                    
}
vector<vector<std::string>> convertTo2DVector(RowResult& result) {
    vector<vector<std::string>> tableData;

    for (Row row : result) {
        vector<std::string> rowData;

        for (int i = 0; i < row.colCount(); ++i) {
            Value val = row[i];

            if (val.isNull()) {
                rowData.push_back("NULL");
            } else {
                // Handle as string if already string, otherwise convert to string
                try {
                    if (val.getType() == Value::Type::STRING) {
                        rowData.push_back(val.get<std::string>());
                    } else if (val.getType() == Value::Type::INT64) {
                        rowData.push_back(std::to_string(val.get<int64_t>()));
                    } else if (val.getType() == Value::Type::UINT64) {
                        rowData.push_back(std::to_string(val.get<uint64_t>()));
                    } else if (val.getType() == Value::Type::FLOAT) {
                        rowData.push_back(std::to_string(val.get<float>()));
                    } else if (val.getType() == Value::Type::DOUBLE) {
                        rowData.push_back(std::to_string(val.get<double>()));
                    } else if (val.getType() == Value::Type::BOOL) {
                        rowData.push_back(val.get<bool>() ? "true" : "false");
                    } else {
                        rowData.push_back("[Unsupported Type]");
                    }
                } catch (...) {
                    rowData.push_back("[Error]");
                }
            }
        }

        tableData.push_back(rowData);
    }

    return tableData;
}
vector<vector<std::string>> fetchData(std::string tableName) {
    vector<vector<std::string>> sample;
    try {
        // Basic input validation
        if (tableName.find('\'') != std::string::npos || 
            tableName.find(';') != std::string::npos) {
            throw std::invalid_argument("Invalid table name");
        }

        Session session("localhost", 33060, "root", "teNma!511");
        std::string query = "SELECT * FROM skyfleet." + tableName;

        auto result = session.sql(query).execute();
        
        return convertTo2DVector(result);  // assuming this exists
    } catch (const mysqlx::Error& err) {
        std::cerr << "MySQL Error: " << err.what() << std::endl;
    } catch (const std::exception& ex) {
        std::cerr << "Standard Exception: " << ex.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown error occurred while fetching data." << std::endl;
    }
    return sample;
}
vector<vector<std::string>> fetchcrew() {
    vector<vector<std::string>> sample;
    try {

        Session session("localhost", 33060, "root", "teNma!511");
        std::string query = "SELECT * FROM skyfleet.person join skyfleet.crew on person.person_id=crew.crew_id" ;

        auto result = session.sql(query).execute();
        
        return convertTo2DVector(result);  // assuming this exists
    } catch (const mysqlx::Error& err) {
        std::cerr << "MySQL Error: " << err.what() << std::endl;
    } catch (const std::exception& ex) {
        std::cerr << "Standard Exception: " << ex.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown error occurred while fetching data." << std::endl;
    }
    return sample;
}
vector<vector<std::string>> fetchpass() {
    vector<vector<std::string>> sample;
    try {

        Session session("localhost", 33060, "root", "teNma!511");
        std::string query = "SELECT * FROM skyfleet.person join skyfleet.customer on person.person_id=customer.customer_id" ;

        auto result = session.sql(query).execute();
        
        return convertTo2DVector(result);  // assuming this exists
    } catch (const mysqlx::Error& err) {
        std::cerr << "MySQL Error: " << err.what() << std::endl;
    } catch (const std::exception& ex) {
        std::cerr << "Standard Exception: " << ex.what() << std::endl;
    } catch (...) {
        std::cerr << "Unknown error occurred while fetching data." << std::endl;
    }
    return sample;
}
void displayTable(vector<vector<std::string>> data){
    for (const auto& row : data) {
        for (const auto& val : row) {
            cout << val << "    ";
        }
        cout << endl;
    }
    cout << endl;
};
bool insertFlightAndUpdateAircraft(
    const std::string& flight_id,
    const std::string& src,
    const std::string& dest,
    const std::string& datetime,
    const std::string& aircraft_id,
    const std::string& gate_number,
    const std::string& runway_number,
    const std::string& status,
    double base_price
) {
    try {
        Session session("localhost", 33060, "root", "teNma!511");
        
        // Start transaction
        session.startTransaction();
        
        // Insert flight
        std::string insertFlightQuery = 
            "INSERT INTO skyfleet.flight (flight_id, src, dest, datetime, aircraft_id, "
            "gate_number, runway_number, status, base_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        session.sql(insertFlightQuery)
            .bind(flight_id, src, dest, datetime, aircraft_id, 
                  gate_number, runway_number, status, base_price)
            .execute();
        
        // Update aircraft status
        std::string updateAircraftQuery = 
            "UPDATE skyfleet.aircraft SET availability = 'assigned' WHERE aircraft_id = ?";
        
        session.sql(updateAircraftQuery)
            .bind(aircraft_id)
            .execute();
        
        // Commit transaction
        session.commit();
        
        return true;
    } catch (const mysqlx::Error& err) {
        std::cerr << "MySQL Error: " << err.what() << std::endl;
        return false;
    } catch (const std::exception& ex) {
        std::cerr << "Standard Exception: " << ex.what() << std::endl;
        return false;
    } catch (...) {
        std::cerr << "Unknown error occurred while inserting flight." << std::endl;
        return false;
    }
}
void updateFlightStatus(std::string flightId, std::string newStatus) {
    try {
        // Create session (consider using connection pooling in production)
        mysqlx::Session session("localhost", 33060, "root", "teNma!511");
        
        // Start transaction
        session.startTransaction();
        
        // Update flight status
        std::string updateQuery = 
            "UPDATE skyfleet.flight SET status = ? WHERE flight_id = ?";
        
        session.sql(updateQuery)
            .bind(newStatus, flightId)
            .execute();
        
        // Commit transaction
        session.commit();
        
        std::cout << "Successfully updated flight " << flightId 
                  << " to status: " << newStatus << std::endl;
    
    } catch (const mysqlx::Error& err) {
        std::cerr << "MySQL Error: " << err.what() << std::endl;
        // Transaction will be automatically rolled back when session is destroyed
        throw; // Consider rethrowing or handling the error appropriately
    } catch (const std::exception& ex) {
        std::cerr << "Standard Exception: " << ex.what() << std::endl;
        throw;
    } catch (...) {
        std::cerr << "Unknown error occurred while updating flight status." << std::endl;
        throw;
    }
}