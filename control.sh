clang++ controller.cpp -std=c++17 -pthread \
  -I. \
  -I/opt/homebrew/Cellar/asio/1.30.2/include/ \
  -I/opt/homebrew/opt/mysql-connector-c++/include \
  -L/opt/homebrew/opt/mysql-connector-c++/lib \
  -lmysqlcppconnx \
  -o backend