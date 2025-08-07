# ✈️ SkyFleet - Aviation Control System

An intelligent and modular flight management system designed to streamline flight scheduling, aircraft allocation, baggage handling, passenger ticketing, and real-time flight monitoring for airlines.

---

## 🚀 Project Overview

SkyFleet Aviation Control aims to automate and optimize various aspects of airline operations, addressing key issues such as:

- Inaccurate scheduling  
- Inefficient aircraft and crew assignment  
- Poor real-time monitoring  
- Resource wastage  
- Passenger dissatisfaction  

By implementing an object-oriented approach and applying software engineering principles, the system enhances operational efficiency and the passenger experience.

---

## 🧩 Features

### ✅ Major Use Cases

1. **Flight Scheduling & Management**
   - Create, update, and cancel flight schedules
   - Assign aircraft based on availability and maintenance status
   - Real-time status tracking of all flights

2. **Passenger & Ticket Management**
   - Book, modify, or cancel tickets
   - Automated seat allocation and price computation
   - Boarding pass generation and check-in status update

3. **Baggage Tracking & Handling**
   - Register and track baggage throughout the flight lifecycle

4. **Crew & Staff Management**
   - Assign crew to flights based on availability and compliance
   - Track schedules and duty hours

### 🛠 Minor Use Cases

- Aircraft Maintenance & Safety Checks  
- Gate & Runway Assignment  
- Flight Seat Matrix with Pricing  
- Real-time Flight Status Updates  

---

## 🏗️ Architecture & Design

### 🔁 Architecture Pattern: **Model-View-Controller (MVC)**

- **Model**: Manages flight data, passengers, baggage, etc.
- **View**: Console / UI outputs for visualizing flight data
- **Controller**: Orchestrates input flow and connects user requests to data models

### 💡 Design Principles

- **SRP (Single Responsibility)**  
- **OCP (Open/Closed)**  
- **LSP (Liskov Substitution)**  
- **ISP (Interface Segregation)**  
- **DIP (Dependency Inversion)**  

### 🎯 Design Patterns Used

| Pattern     | Description |
|-------------|-------------|
| **Strategy**  | Pricing strategies like EconomyPricing and BusinessPricing |
| **Observer**  | Notify passengers about flight updates (delays, cancellations) |
| **Singleton** | Ensure only one instance of managers like `FlightManager` |
| **Factory**   | Create flight objects with validation and modular instantiation |

---

## 💻 UI Showcase

Below are screenshots showcasing various components of the SkyFleet system:

### 🔹 Flight Scheduling Interface
![Flight Scheduling](screenshots/1.png)

### 🔹 Passenger & Ticket Booking Module
![Passenger Ticketing](screenshots/2.png)

### 🔹 Crew Assignment & Management
![Crew Management](screenshots/3.png)

### 🔹 Baggage Tracking Panel
![Baggage Tracking](screenshots/4.png)

### 🔹 Aircraft Assignment and Maintenance
![Aircraft Maintenance](screenshots/5.png)

### 🔹 Real-Time Flight Status Dashboard
![Flight Status Dashboard](screenshots/6.png)

> _📂 Place all images in the `/screenshots/` directory. Use `.png` format (or adjust extension in markdown accordingly)._

---

## 👨‍💻 Team & Contributions

| Member            | Modules & Patterns Worked On                  |
|-------------------|-----------------------------------------------|
| **Aniruddha Seshu**  | Passenger modules, Observer Pattern          |
| **Madhusudana M**    | Flight management, Strategy Pattern          |
| **Manish P K**        | Resource management, Factory Pattern         |
| **Priyam Roy**       | Crew assignment, Singleton Pattern           |

---

## 📎 Report

A detailed report outlining the problem statement, design approach, use cases, diagrams, and individual contributions can be found here: [`Report_Template.pdf`](./Report_Template.pdf)

---

## 📍 Getting Started

### Prerequisites

- C++17 compiler  
- [Crow C++ Web Framework](https://github.com/CrowCpp/Crow)  
- MySQL or supported database  


