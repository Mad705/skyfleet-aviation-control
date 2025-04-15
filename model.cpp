#include <mysqlx/xdevapi.h>
#include <vector>
#include <string>
#include <iostream>
#include <sstream>


using namespace mysqlx;
using namespace std;

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
void displayTable(vector<vector<std::string>> data){
    for (const auto& row : data) {
        for (const auto& val : row) {
            cout << val << "    ";
        }
        cout << endl;
    }
    cout << endl;
};
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
int main() {
    try {
        // Connect to MySQL Server with X Protocol
        Session session("localhost", 33060, "root", "teNma!511");
        cout << " Connected to MySQL using X DevAPI!" << endl;
        auto result1=session.sql("SELECT * FROM skyfleet.flight").execute();
        auto result2=session.sql("SELECT * FROM skyfleet.crew").execute();
        auto result3=session.sql("SELECT * FROM skyfleet.person").execute();
        //RowResult result = flightTable.select("*").execute();
        vector<vector<std::string>> data1 = convertTo2DVector(result1);
        vector<vector<std::string>> data2 = convertTo2DVector(result2);
        vector<vector<std::string>> data3 = convertTo2DVector(result3);
       

        cout<<login("1","pass123","passenger");


    
        session.close();
    } catch (const mysqlx::Error &err) {
        cerr << " Error: " << err.what() << endl;
    } catch (exception &ex) {
        cerr << " STD Exception: " << ex.what() << endl;
    } catch (...) {
        cerr << " Unknown error!" << endl;
    }
    return 0;
}
