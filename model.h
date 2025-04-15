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
vector<vector<std::string>> fetchData(std::string tableName) {
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