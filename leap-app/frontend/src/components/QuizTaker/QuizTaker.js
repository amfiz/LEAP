import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './QuizTaker.css';
import logo from '../../assests/logo.png';

// Badge configuration
const BADGE_LEVELS = {
  BRONZE: { name: 'Bronze', minScore: 0, color: '#CD7F32' },
  SILVER: { name: 'Silver', minScore: 50, color: '#C0C0C0' },
  GOLD: { name: 'Gold', minScore: 70, color: '#FFD700' },
  DIAMOND: { name: 'Diamond', minScore: 90, color: '#B9F2FF' },
  PLATINUM: { name: 'Platinum', minScore: 95, color: '#E5E4E2' }
};

// Difficulty levels
const DIFFICULTY_LEVELS = {
  EASY: { name: 'Easy', maxAvgScore: 50 },
  MEDIUM: { name: 'Medium', maxAvgScore: 80 },
  HARD: { name: 'Hard', maxAvgScore: 101 } // 101 to include 100
};
// Sample questions (replace with your actual imports)
// In production, you would import your question lists
const sampleQuestions = {
  computer: {
    easy: [
       {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of the following is an input device?",
        "option_a": "Monitor",
        "option_b": "Keyboard",
        "option_c": "Printer",
        "option_d": "Speaker",
        "correct_answer": "B",
        "explanation": "Keyboard is an input device used to enter data into the computer."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of these is used for permanent storage?",
        "option_a": "RAM",
        "option_b": "ROM",
        "option_c": "Hard drive",
        "option_d": "Cache",
        "correct_answer": "C",
        "explanation": "Hard drive is used for permanent storage of data."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which binary number is equal to decimal 5?",
        "option_a": "101",
        "option_b": "110",
        "option_c": "100",
        "option_d": "111",
        "correct_answer": "A",
        "explanation": "Binary 101 equals decimal 5."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which type of software is an operating system?",
        "option_a": "Application",
        "option_b": "Utility",
        "option_c": "System software",
        "option_d": "Driver",
        "correct_answer": "C",
        "explanation": "Operating systems are system software."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which device connects a computer to the internet?",
        "option_a": "Switch",
        "option_b": "Router",
        "option_c": "USB",
        "option_d": "HDMI",
        "correct_answer": "B",
        "explanation": "Router connects computers to the internet."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What is the full form of CPU?",
        "option_a": "Central Power Unit",
        "option_b": "Central Processing Unit",
        "option_c": "Computer Process Unit",
        "option_d": "Control Program Unit",
        "correct_answer": "B",
        "explanation": "CPU stands for Central Processing Unit."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What is the purpose of RAM?",
        "option_a": "Long-term storage",
        "option_b": "Temporary memory",
        "option_c": "Backup",
        "option_d": "Compress data",
        "correct_answer": "B",
        "explanation": "RAM is used for temporary memory while a computer is running."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which is an example of output?",
        "option_a": "Joystick",
        "option_b": "Webcam",
        "option_c": "Monitor",
        "option_d": "Microphone",
        "correct_answer": "C",
        "explanation": "Monitor displays output from the computer."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which number system uses digits 0 and 1?",
        "option_a": "Decimal",
        "option_b": "Octal",
        "option_c": "Hexadecimal",
        "option_d": "Binary",
        "correct_answer": "D",
        "explanation": "Binary uses only digits 0 and 1."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which file format is commonly used for text documents?",
        "option_a": ".jpg",
        "option_b": ".exe",
        "option_c": ".doc",
        "option_d": ".mp3",
        "correct_answer": "C",
        "explanation": ".doc is a common text document file format."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of the following is a storage device?",
        "option_a": "Monitor",
        "option_b": "Speaker",
        "option_c": "Flash drive",
        "option_d": "Keyboard",
        "correct_answer": "C",
        "explanation": "Flash drive is a portable storage device."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What does GUI stand for?",
        "option_a": "Graph User Interface",
        "option_b": "General Unit Interface",
        "option_c": "Graphical User Interface",
        "option_d": "General Utility Input",
        "correct_answer": "C",
        "explanation": "GUI stands for Graphical User Interface."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which is an example of software?",
        "option_a": "RAM",
        "option_b": "Keyboard",
        "option_c": "Operating system",
        "option_d": "Hard disk",
        "correct_answer": "C",
        "explanation": "Operating system is software."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which number system is based on 16 digits?",
        "option_a": "Decimal",
        "option_b": "Binary",
        "option_c": "Octal",
        "option_d": "Hexadecimal",
        "correct_answer": "D",
        "explanation": "Hexadecimal is based on 16 digits (0-9 and A-F)."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of the following is a high-level language?",
        "option_a": "Machine code",
        "option_b": "Python",
        "option_c": "Assembly",
        "option_d": "Binary",
        "correct_answer": "B",
        "explanation": "Python is a high-level programming language."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which part of the computer carries out instructions?",
        "option_a": "RAM",
        "option_b": "CPU",
        "option_c": "Monitor",
        "option_d": "USB",
        "correct_answer": "B",
        "explanation": "CPU executes instructions."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which device is used to display information?",
        "option_a": "Scanner",
        "option_b": "Microphone",
        "option_c": "Speaker",
        "option_d": "Monitor",
        "correct_answer": "D",
        "explanation": "Monitor displays output information."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What is a common use of barcodes?",
        "option_a": "Drawing images",
        "option_b": "Web development",
        "option_c": "Identifying products",
        "option_d": "Typing documents",
        "correct_answer": "C",
        "explanation": "Barcodes are used to identify products."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which language is directly understood by the CPU?",
        "option_a": "Assembly",
        "option_b": "Python",
        "option_c": "Machine code",
        "option_d": "Java",
        "correct_answer": "C",
        "explanation": "Machine code is directly understood by the CPU."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of the following is an example of cloud storage?",
        "option_a": "SSD",
        "option_b": "Google Drive",
        "option_c": "USB",
        "option_d": "DVD",
        "correct_answer": "B",
        "explanation": "Google Drive is a cloud storage service."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which is an example of secondary storage?",
        "option_a": "RAM",
        "option_b": "Cache",
        "option_c": "Hard disk",
        "option_d": "Register",
        "correct_answer": "C",
        "explanation": "Hard disk is a secondary storage device."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which device allows you to move a pointer on screen?",
        "option_a": "Monitor",
        "option_b": "Mouse",
        "option_c": "Speaker",
        "option_d": "Microphone",
        "correct_answer": "B",
        "explanation": "Mouse is used to move the pointer."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which software helps to detect and remove viruses?",
        "option_a": "IDE",
        "option_b": "Antivirus",
        "option_c": "Compiler",
        "option_d": "Translator",
        "correct_answer": "B",
        "explanation": "Antivirus software detects and removes viruses."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What is the basic unit of data in computing?",
        "option_a": "Byte",
        "option_b": "Bit",
        "option_c": "Word",
        "option_d": "Nibble",
        "correct_answer": "B",
        "explanation": "Bit is the basic unit of data."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which port is used for video output?",
        "option_a": "USB",
        "option_b": "HDMI",
        "option_c": "Audio jack",
        "option_d": "LAN",
        "correct_answer": "B",
        "explanation": "HDMI port is used for video output."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of the following uses touch to input data?",
        "option_a": "Scanner",
        "option_b": "Trackpad",
        "option_c": "Barcode",
        "option_d": "Webcam",
        "correct_answer": "B",
        "explanation": "Trackpad uses touch to input data."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which of these can store the largest amount of data?",
        "option_a": "DVD",
        "option_b": "CD",
        "option_c": "Blu-ray",
        "option_d": "Floppy Disk",
        "correct_answer": "C",
        "explanation": "Blu-ray stores more data than DVD and CD."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What does BIOS stand for?",
        "option_a": "Binary Input Output System",
        "option_b": "Basic Internal Output Setup",
        "option_c": "Basic Input Output System",
        "option_d": "Booting Integrated OS",
        "correct_answer": "C",
        "explanation": "BIOS stands for Basic Input Output System."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "What happens when you press CTRL+S?",
        "option_a": "Opens file",
        "option_b": "Closes window",
        "option_c": "Saves file",
        "option_d": "Deletes file",
        "correct_answer": "C",
        "explanation": "CTRL+S saves the current file."
    },
    {
        "subject": "computer",
        "difficulty": "easy",
        "question": "Which component holds all the internal parts of a computer?",
        "option_a": "Monitor",
        "option_b": "Case",
        "option_c": "Motherboard",
        "option_d": "Power cable",
        "correct_answer": "B",
        "explanation": "The case houses all the internal components."
    }
    ],
    medium: [
         {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What is the hexadecimal equivalent of binary 1111?",
        "option_a": "F",
        "option_b": "E",
        "option_c": "D",
        "option_d": "C",
        "correct_answer": "A",
        "explanation": "Binary 1111 equals 15 in decimal, which is F in hexadecimal."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which logic gate outputs 1 only if both inputs are 1?",
        "option_a": "OR",
        "option_b": "AND",
        "option_c": "NOT",
        "option_d": "NAND",
        "correct_answer": "B",
        "explanation": "AND gate outputs 1 only if both inputs are 1."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these is NOT an advantage of solid-state drives (SSD)?",
        "option_a": "Faster access time",
        "option_b": "Lower power consumption",
        "option_c": "No moving parts",
        "option_d": "Cheaper than HDD",
        "correct_answer": "D",
        "explanation": "SSD is generally more expensive than HDD, not cheaper."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "In computer networks, what does IP stand for?",
        "option_a": "Internal Program",
        "option_b": "Integrated Protocol",
        "option_c": "Internet Protocol",
        "option_d": "Instant Processing",
        "correct_answer": "C",
        "explanation": "IP stands for Internet Protocol."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these is a primary function of the ALU?",
        "option_a": "Store instructions",
        "option_b": "Control input/output",
        "option_c": "Perform arithmetic and logic",
        "option_d": "Manage system clock",
        "correct_answer": "C",
        "explanation": "ALU performs arithmetic and logic operations."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which component is responsible for executing arithmetic operations in the CPU?",
        "option_a": "Control Unit",
        "option_b": "Cache",
        "option_c": "ALU",
        "option_d": "Register",
        "correct_answer": "C",
        "explanation": "ALU executes arithmetic operations."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these binary numbers is equal to the decimal number 201?",
        "option_a": "11001001",
        "option_b": "11001000",
        "option_c": "11000011",
        "option_d": "11111001",
        "correct_answer": "A",
        "explanation": "11001001 in binary equals 201 in decimal."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which method is used to verify data after transmission?",
        "option_a": "Parity check",
        "option_b": "Buffering",
        "option_c": "Bandwidth check",
        "option_d": "Encapsulation",
        "correct_answer": "A",
        "explanation": "Parity check helps verify data integrity."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which device converts digital signals to analog signals and vice versa?",
        "option_a": "NIC",
        "option_b": "Modem",
        "option_c": "Switch",
        "option_d": "Router",
        "correct_answer": "B",
        "explanation": "Modem modulates and demodulates signals."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which is a benefit of using hexadecimal numbers in computing?",
        "option_a": "Takes less memory",
        "option_b": "Human-readable binary representation",
        "option_c": "Faster processor speed",
        "option_d": "Improved encryption",
        "correct_answer": "B",
        "explanation": "Hexadecimal is a compact human-readable form of binary."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What does a NOT logic gate do?",
        "option_a": "Outputs 1 for 1",
        "option_b": "Inverts the input",
        "option_c": "Outputs 1 for both 1s",
        "option_d": "Outputs 0 for different inputs",
        "correct_answer": "B",
        "explanation": "NOT gate inverts the input signal."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What is the role of a translator in programming?",
        "option_a": "Designs the program",
        "option_b": "Executes each line directly",
        "option_c": "Converts high-level to machine code",
        "option_d": "Stores all variables",
        "correct_answer": "C",
        "explanation": "Translator converts code to machine understandable form."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which compression method permanently loses some data?",
        "option_a": "Lossy",
        "option_b": "Lossless",
        "option_c": "ZIP",
        "option_d": "RLE",
        "correct_answer": "A",
        "explanation": "Lossy compression removes some data permanently."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What is a MAC address used for?",
        "option_a": "Identifying memory",
        "option_b": "Accessing websites",
        "option_c": "Identifying hardware on a network",
        "option_d": "Encrypting data",
        "correct_answer": "C",
        "explanation": "MAC address uniquely identifies network hardware."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of the following is an IDE feature?",
        "option_a": "HDMI port",
        "option_b": "Code editor",
        "option_c": "Flash memory",
        "option_d": "Encryption",
        "correct_answer": "B",
        "explanation": "IDE includes a code editor for programming."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What is the function of the MAR in the CPU?",
        "option_a": "Stores data temporarily",
        "option_b": "Holds current instruction",
        "option_c": "Stores address of data",
        "option_d": "Stores results",
        "correct_answer": "C",
        "explanation": "MAR holds the address for data access."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of the following is an error detection method?",
        "option_a": "Bit stuffing",
        "option_b": "Cyclic redundancy check",
        "option_c": "Packet filtering",
        "option_d": "Buffer overflow",
        "correct_answer": "B",
        "explanation": "CRC is used for error detection in data transmission."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What is the purpose of a truth table?",
        "option_a": "Store instructions",
        "option_b": "Convert binary",
        "option_c": "Show all logic gate outcomes",
        "option_d": "Execute code",
        "correct_answer": "C",
        "explanation": "Truth tables show all possible logic gate outputs."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which device controls the flow of data in a network?",
        "option_a": "Mouse",
        "option_b": "Switch",
        "option_c": "Printer",
        "option_d": "Webcam",
        "correct_answer": "B",
        "explanation": "Switch manages data traffic in a network."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these is a test data type used to check unusual input?",
        "option_a": "Standard",
        "option_b": "Normal",
        "option_c": "Abnormal",
        "option_d": "Midpoint",
        "correct_answer": "C",
        "explanation": "Abnormal test data is used to test edge cases."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What does HTML stand for?",
        "option_a": "Hyper Tool Markup Language",
        "option_b": "HyperText Markup Language",
        "option_c": "High Text Multi Language",
        "option_d": "High Transfer Machine Language",
        "correct_answer": "B",
        "explanation": "HTML stands for HyperText Markup Language."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What is the purpose of the Control Unit?",
        "option_a": "Stores memory",
        "option_b": "Connects to external devices",
        "option_c": "Directs operations in the CPU",
        "option_d": "Inputs instructions",
        "correct_answer": "C",
        "explanation": "Control Unit directs CPU operations."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which device uses biometric input?",
        "option_a": "Webcam",
        "option_b": "Fingerprint scanner",
        "option_c": "Microphone",
        "option_d": "Touchpad",
        "correct_answer": "B",
        "explanation": "Fingerprint scanner uses biometric data."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which logic gate outputs 1 when inputs differ?",
        "option_a": "OR",
        "option_b": "AND",
        "option_c": "XOR",
        "option_d": "NAND",
        "correct_answer": "C",
        "explanation": "XOR outputs 1 when inputs are different."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "What does SQL stand for?",
        "option_a": "Structured Query Logic",
        "option_b": "Software Query Language",
        "option_c": "Structured Query Language",
        "option_d": "System Quality Language",
        "correct_answer": "C",
        "explanation": "SQL stands for Structured Query Language."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these is an application of AI?",
        "option_a": "ROM",
        "option_b": "Antivirus",
        "option_c": "Self-driving cars",
        "option_d": "USB",
        "correct_answer": "C",
        "explanation": "Self-driving cars use AI technologies."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these represents a single row in a database?",
        "option_a": "Table",
        "option_b": "Field",
        "option_c": "Record",
        "option_d": "Attribute",
        "correct_answer": "C",
        "explanation": "A record is a single row in a database table."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of these is a relational database advantage?",
        "option_a": "More redundancy",
        "option_b": "Less secure",
        "option_c": "Data consistency",
        "option_d": "Manual searching",
        "correct_answer": "C",
        "explanation": "Relational databases promote data consistency."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which of the following performs automatic input detection?",
        "option_a": "Microphone",
        "option_b": "Keyboard",
        "option_c": "Sensor",
        "option_d": "Joystick",
        "correct_answer": "C",
        "explanation": "Sensors perform automatic input detection."
    },
    {
        "subject": "computer",
        "difficulty": "medium",
        "question": "Which logic gate has output 0 only when both inputs are 1?",
        "option_a": "NOR",
        "option_b": "NAND",
        "option_c": "AND",
        "option_d": "XOR",
        "correct_answer": "B",
        "explanation": "NAND outputs 0 only when both inputs are 1."
    }
    ],
    hard: [
        {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which algorithm uses divide-and-conquer and has average-case time complexity of O(n log n)?",
        "option_a": "Bubble Sort",
        "option_b": "Insertion Sort",
        "option_c": "Merge Sort",
        "option_d": "Linear Search",
        "correct_answer": "C",
        "explanation": "Merge Sort uses divide-and-conquer approach with O(n log n) time complexity."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of the following is a feature of object-oriented programming?",
        "option_a": "Recursion",
        "option_b": "Inheritance",
        "option_c": "Structured design",
        "option_d": "Variables",
        "correct_answer": "B",
        "explanation": "Inheritance is a core feature of object-oriented programming."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What does the term 'pseudocode' refer to?",
        "option_a": "Actual programming code",
        "option_b": "Flowchart",
        "option_c": "Human-readable algorithm",
        "option_d": "Compiler output",
        "correct_answer": "C",
        "explanation": "Pseudocode is a human-readable description of an algorithm."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of the following is true about high-level programming languages?",
        "option_a": "Hard to debug",
        "option_b": "Machine-dependent",
        "option_c": "Easier for humans to understand",
        "option_d": "Requires no compiler",
        "correct_answer": "C",
        "explanation": "High-level languages are designed to be easier to read and write for humans."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "In a bubble sort, what is the worst-case time complexity?",
        "option_a": "O(n)",
        "option_b": "O(n log n)",
        "option_c": "O(n²)",
        "option_d": "O(log n)",
        "correct_answer": "C",
        "explanation": "Bubble sort has worst-case time complexity O(n²)."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What is the function of a compiler in a programming environment?",
        "option_a": "Runs the code line by line",
        "option_b": "Translates and executes simultaneously",
        "option_c": "Converts whole code to machine code at once",
        "option_d": "Stores variables in memory",
        "correct_answer": "C",
        "explanation": "A compiler translates the whole program into machine code before execution."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of the following best describes lossless compression?",
        "option_a": "Reduces file size with data loss",
        "option_b": "Permanently removes image pixels",
        "option_c": "Maintains data integrity after compression",
        "option_d": "Converts audio to mono format",
        "correct_answer": "C",
        "explanation": "Lossless compression allows original data to be perfectly reconstructed."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which gate has the output 0 only when both inputs are 1?",
        "option_a": "NOR",
        "option_b": "XOR",
        "option_c": "NAND",
        "option_d": "AND",
        "correct_answer": "C",
        "explanation": "NAND gate outputs 0 only when both inputs are 1."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What is the decimal equivalent of the two’s complement binary number 11101100?",
        "option_a": "-20",
        "option_b": "-22",
        "option_c": "-36",
        "option_d": "-45",
        "correct_answer": "B",
        "explanation": "The two's complement 11101100 represents -22 in decimal."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "In relational databases, a primary key must be:",
        "option_a": "Empty",
        "option_b": "A duplicate",
        "option_c": "Unique and not null",
        "option_d": "Foreign",
        "correct_answer": "C",
        "explanation": "Primary key uniquely identifies each record and cannot be null."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of the following is an example of an interrupt?",
        "option_a": "Scheduled update check",
        "option_b": "CPU fetch cycle",
        "option_c": "Saving a file",
        "option_d": "Cache memory lookup",
        "correct_answer": "A",
        "explanation": "Scheduled update check is an interrupt event."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "The most suitable data structure to store a list of student grades is:",
        "option_a": "Variable",
        "option_b": "Array",
        "option_c": "Constant",
        "option_d": "Loop",
        "correct_answer": "B",
        "explanation": "Array is used to store multiple values of the same type."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What does IDE stand for in programming?",
        "option_a": "Integrated Data Environment",
        "option_b": "Interactive Development Editor",
        "option_c": "Integrated Development Environment",
        "option_d": "Interactive Debugging Engine",
        "correct_answer": "C",
        "explanation": "IDE stands for Integrated Development Environment."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which operation is performed by a logic shift to the left?",
        "option_a": "Multiply by 2",
        "option_b": "Divide by 2",
        "option_c": "Add 1",
        "option_d": "Subtract 1",
        "correct_answer": "A",
        "explanation": "Left shift multiplies a binary number by 2."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What is the purpose of test data in program development?",
        "option_a": "To find programming language",
        "option_b": "To generate sample questions",
        "option_c": "To check program validity",
        "option_d": "To display binary codes",
        "correct_answer": "C",
        "explanation": "Test data checks if program behaves correctly."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of the following is not a valid form of test data?",
        "option_a": "Normal",
        "option_b": "Extreme",
        "option_c": "Abnormal",
        "option_d": "Recursive",
        "correct_answer": "D",
        "explanation": "Recursive is not a type of test data."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of these is a symmetric encryption algorithm?",
        "option_a": "AES",
        "option_b": "RSA",
        "option_c": "SHA",
        "option_d": "ECC",
        "correct_answer": "A",
        "explanation": "AES is a symmetric key encryption algorithm."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What is the purpose of the control unit in the CPU?",
        "option_a": "Perform calculations",
        "option_b": "Store addresses",
        "option_c": "Manage execution of instructions",
        "option_d": "Fetch data from cache",
        "correct_answer": "C",
        "explanation": "Control Unit manages execution of instructions."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "In a trace table, which of the following is recorded?",
        "option_a": "Binary conversions",
        "option_b": "Code compilation steps",
        "option_c": "Variable changes during dry runs",
        "option_d": "Execution time",
        "correct_answer": "C",
        "explanation": "Trace tables record variable changes during dry runs."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of these is an example of validation in data entry?",
        "option_a": "Rechecking answers",
        "option_b": "Re-entering the same value",
        "option_c": "Range check",
        "option_d": "Data recovery",
        "correct_answer": "C",
        "explanation": "Range check validates if input lies within allowed limits."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "The function of an accumulator in CPU is to:",
        "option_a": "Store current instruction",
        "option_b": "Hold intermediate results",
        "option_c": "Control execution flow",
        "option_d": "Display errors",
        "correct_answer": "B",
        "explanation": "Accumulator holds intermediate calculation results."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "What is pseudocode used for?",
        "option_a": "Compiling the program",
        "option_b": "Designing logic before coding",
        "option_c": "Displaying graphical outputs",
        "option_d": "Storing compiled files",
        "correct_answer": "B",
        "explanation": "Pseudocode helps design algorithm logic."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "In binary addition, 1 + 1 + 1 equals:",
        "option_a": "11",
        "option_b": "01 (carry 1)",
        "option_c": "0 (carry 1)",
        "option_d": "1 (carry 1)",
        "correct_answer": "D",
        "explanation": "Binary addition 1+1+1 equals 1 with a carry of 1."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which language type is closer to human language?",
        "option_a": "Machine language",
        "option_b": "Assembly language",
        "option_c": "High-level language",
        "option_d": "Microcode",
        "correct_answer": "C",
        "explanation": "High-level languages resemble human language."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of these is an error detection method in transmission?",
        "option_a": "Half duplex",
        "option_b": "Parity check",
        "option_c": "Fiber optics",
        "option_d": "Ethernet",
        "correct_answer": "B",
        "explanation": "Parity check detects transmission errors."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which type of test is done after combining all modules?",
        "option_a": "Unit testing",
        "option_b": "Integration testing",
        "option_c": "Syntax testing",
        "option_d": "Validation testing",
        "correct_answer": "B",
        "explanation": "Integration testing tests combined modules."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which register holds the address of the next instruction?",
        "option_a": "MAR",
        "option_b": "MDR",
        "option_c": "PC",
        "option_d": "ACC",
        "correct_answer": "C",
        "explanation": "PC (Program Counter) holds the next instruction address."
    },
    {
        "subject": "computer",
        "difficulty": "hard",
        "question": "Which of these best describes a logic circuit?",
        "option_a": "Flowchart",
        "option_b": "Graph",
"option_c": "Diagram of logic gates",
"option_d": "Binary value table",
"correct_answer": "C",
"explanation": "Logic circuits are represented by diagrams of logic gates."
},
{
"subject": "computer",
"difficulty": "hard",
"question": "Which is an example of a loop in pseudocode?",
"option_a": "WHILE … DO",
"option_b": "IF … THEN",
"option_c": "INPUT …",
"option_d": "PRINT …",
"correct_answer": "A",
"explanation": "WHILE … DO is a loop construct in pseudocode."
},
{
"subject": "computer",
"difficulty": "hard",
"question": "What is the final output of a NOT gate when input is 1?",
"option_a": "0",
"option_b": "1",
"option_c": "2",
"option_d": "Undefined",
"correct_answer": "A",
"explanation": "NOT gate outputs 0 when input is 1."
}
    ]
  },
  english: {
    easy: [
        {
        "subject": "english",
        "difficulty": "easy",
        "question": "What does a noun describe?",
        "option_a": "An action",
        "option_b": "A place",
        "option_c": "A name of a person, place or thing",
        "option_d": "A sound",
        "correct_answer": "C",
        "explanation": "A noun names a person, place, thing, or idea."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is a synonym for 'happy'?",
        "option_a": "Angry",
        "option_b": "Sad",
        "option_c": "Joyful",
        "option_d": "Scared",
        "correct_answer": "C",
        "explanation": "'Joyful' is a synonym for 'happy'."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "Which of these is a descriptive word?",
        "option_a": "Run",
        "option_b": "Quickly",
        "option_c": "Blue",
        "option_d": "Dog",
        "correct_answer": "C",
        "explanation": "'Blue' is an adjective describing something."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is a paragraph?",
        "option_a": "A full stop",
        "option_b": "A new idea in writing",
        "option_c": "A capital letter",
        "option_d": "A sentence",
        "correct_answer": "B",
        "explanation": "A paragraph expresses a new idea or point."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What type of writing tells a story?",
        "option_a": "Descriptive",
        "option_b": "Narrative",
        "option_c": "Report",
        "option_d": "Article",
        "correct_answer": "B",
        "explanation": "Narrative writing tells a story."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is the first step before writing an essay?",
        "option_a": "Drawing",
        "option_b": "Reading",
        "option_c": "Planning",
        "option_d": "Editing",
        "correct_answer": "C",
        "explanation": "Planning is essential before writing an essay."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is an adjective?",
        "option_a": "A describing word",
        "option_b": "A verb",
        "option_c": "A noun",
        "option_d": "A preposition",
        "correct_answer": "A",
        "explanation": "An adjective describes a noun or pronoun."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is a summary?",
        "option_a": "A long description",
        "option_b": "A list of words",
        "option_c": "A short version of a text",
        "option_d": "A poem",
        "correct_answer": "C",
        "explanation": "A summary is a brief version of the main points."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What punctuation ends a question?",
        "option_a": "Full stop",
        "option_b": "Comma",
        "option_c": "Question mark",
        "option_d": "Colon",
        "correct_answer": "C",
        "explanation": "A question mark ends a question."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What does the word \"structure\" in writing mean?",
        "option_a": "Spelling",
        "option_b": "Word choice",
        "option_c": "Paragraph organization",
        "option_d": "Handwriting",
        "correct_answer": "C",
        "explanation": "\"Structure\" refers to how paragraphs are organized."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is a narrative's main feature?",
        "option_a": "A poem",
        "option_b": "A story with characters and events",
        "option_c": "A diagram",
        "option_d": "A table",
        "correct_answer": "B",
        "explanation": "Narratives are stories with characters and events."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "Which is a purpose of descriptive writing?",
        "option_a": "Explain a fact",
        "option_b": "Describe in detail",
        "option_c": "Argue a point",
        "option_d": "Summarize ideas",
        "correct_answer": "B",
        "explanation": "Descriptive writing aims to describe something in detail."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "A “passage” in a comprehension test is a:",
        "option_a": "Poem",
        "option_b": "Paragraph",
        "option_c": "Group of text to read",
        "option_d": "Essay",
        "correct_answer": "C",
        "explanation": "A passage is a group of text for reading."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "In English, 'they’re' is short for:",
        "option_a": "They were",
        "option_b": "They are",
        "option_c": "There",
        "option_d": "Their",
        "correct_answer": "B",
        "explanation": "'They’re' is a contraction of 'They are'."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is a synonym for 'difficult'?",
        "option_a": "Easy",
        "option_b": "Complex",
        "option_c": "Soft",
        "option_d": "Clear",
        "correct_answer": "B",
        "explanation": "'Complex' is a synonym for 'difficult'."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "'She laughed loudly.' – 'laughed' is a:",
        "option_a": "Adverb",
        "option_b": "Verb",
        "option_c": "Adjective",
        "option_d": "Noun",
        "correct_answer": "B",
        "explanation": "'Laughed' is the action (verb) in the sentence."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is the purpose of a conclusion in writing?",
        "option_a": "Start a new idea",
        "option_b": "Expand a point",
        "option_c": "End and summarize",
        "option_d": "Show anger",
        "correct_answer": "C",
        "explanation": "A conclusion summarizes and ends the writing."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "Which of these is a feature of a letter?",
        "option_a": "Caption",
        "option_b": "Salutation",
        "option_c": "Chapter",
        "option_d": "Title",
        "correct_answer": "B",
        "explanation": "A salutation is a greeting in a letter."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "The tone of writing refers to:",
        "option_a": "Page size",
        "option_b": "Mood of the writer",
        "option_c": "Font type",
        "option_d": "Layout",
        "correct_answer": "B",
        "explanation": "Tone means the mood or attitude of the writer."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "A report is usually:",
        "option_a": "Fiction",
        "option_b": "Dialogue",
        "option_c": "Factual",
        "option_d": "Poetic",
        "correct_answer": "C",
        "explanation": "Reports are factual, based on real information."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What does 'audience' mean in writing?",
        "option_a": "People who perform",
        "option_b": "Readers or listeners",
        "option_c": "Characters",
        "option_d": "Vocabulary",
        "correct_answer": "B",
        "explanation": "Audience refers to readers or listeners."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What punctuation shows ownership?",
        "option_a": ".",
        "option_b": ",",
        "option_c": "?",
        "option_d": "’",
        "correct_answer": "D",
        "explanation": "The apostrophe (’) shows possession or ownership."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "Which is not a sentence?",
        "option_a": "I am here.",
        "option_b": "Running fast.",
        "option_c": "She laughed.",
        "option_d": "We went home.",
        "correct_answer": "B",
        "explanation": "'Running fast.' is a phrase, not a complete sentence."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "The word “forlorn” is closest in meaning to:",
        "option_a": "Joyful",
        "option_b": "Lonely",
        "option_c": "Angry",
        "option_d": "Fast",
        "correct_answer": "B",
        "explanation": "'Forlorn' means lonely or abandoned."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is a “first-person” narrative?",
        "option_a": "Using ‘you’",
        "option_b": "Using ‘he/she’",
        "option_c": "Using ‘I/we’",
        "option_d": "Using ‘they’",
        "correct_answer": "C",
        "explanation": "First-person uses 'I' or 'we' to tell the story."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What’s the function of a summary?",
        "option_a": "Expand ideas",
        "option_b": "Introduce stories",
        "option_c": "Condense text",
        "option_d": "Confuse readers",
        "correct_answer": "C",
        "explanation": "Summaries condense the main points."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "Which is an informal word for 'father'?",
        "option_a": "Parent",
        "option_b": "Dad",
        "option_c": "Guardian",
        "option_d": "Male",
        "correct_answer": "B",
        "explanation": "'Dad' is a common informal term for father."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What should you avoid in formal writing?",
        "option_a": "Clear ideas",
        "option_b": "Informal slang",
        "option_c": "Good grammar",
        "option_d": "Facts",
        "correct_answer": "B",
        "explanation": "Informal slang should be avoided in formal writing."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What helps improve vocabulary?",
        "option_a": "Skipping reading",
        "option_b": "Watching TV only",
        "option_c": "Reading varied texts",
        "option_d": "Only writing",
        "correct_answer": "C",
        "explanation": "Reading diverse materials helps improve vocabulary."
    },
    {
        "subject": "english",
        "difficulty": "easy",
        "question": "What is 'persuasive writing'?",
        "option_a": "Writing a story",
        "option_b": "Describing a scene",
        "option_c": "Convincing others",
        "option_d": "Giving definitions",
        "correct_answer": "C",
        "explanation": "Persuasive writing aims to convince readers."
    }
    ],
    medium: [
        {
        "subject": "english",
        "difficulty": "medium",
        "question": "What is the main purpose of a summary?",
        "option_a": "To list points",
        "option_b": "To retell creatively",
        "option_c": "To condense key ideas",
        "option_d": "To explain vocabulary",
        "correct_answer": "C",
        "explanation": "A summary condenses the main ideas of a text."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "What does the term “implicit meaning” refer to?",
        "option_a": "The obvious idea",
        "option_b": "Hidden or suggested meaning",
        "option_c": "A question",
        "option_d": "A summary",
        "correct_answer": "B",
        "explanation": "Implicit meaning is the hidden or suggested meaning not directly stated."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "Which statement is true about active reading?",
        "option_a": "Skipping to find keywords",
        "option_b": "Passive scanning",
        "option_c": "Engaging deeply with the text",
        "option_d": "Memorizing sentences",
        "correct_answer": "C",
        "explanation": "Active reading involves deeply engaging with the text."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "In comprehension, a ‘distractor’ is:",
        "option_a": "A correct answer",
        "option_b": "An unrelated option",
        "option_c": "A synonym",
        "option_d": "A keyword",
        "correct_answer": "B",
        "explanation": "Distractors are incorrect options meant to mislead."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "What is the effect of emotive language in persuasive writing?",
        "option_a": "Gives facts",
        "option_b": "Adds emotion and appeals",
        "option_c": "Makes it boring",
        "option_d": "Adds irrelevant detail",
        "correct_answer": "B",
        "explanation": "Emotive language adds emotional appeal to persuade readers."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "What’s the purpose of paragraphing in writing?",
        "option_a": "To make it longer",
        "option_b": "For visual effect",
        "option_c": "To separate ideas clearly",
        "option_d": "For decoration",
        "correct_answer": "C",
        "explanation": "Paragraphs help separate and organize ideas clearly."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "Which tone suits a formal letter?",
        "option_a": "Sarcastic",
        "option_b": "Friendly and humorous",
        "option_c": "Serious and respectful",
        "option_d": "Playful",
        "correct_answer": "C",
        "explanation": "Formal letters use a serious and respectful tone."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "The word “register” in writing refers to:",
        "option_a": "Font type",
        "option_b": "Audience engagement",
        "option_c": "Level of formality",
        "option_d": "Heading style",
        "correct_answer": "C",
        "explanation": "Register refers to the level of formality in writing."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "Skimming a text helps to:",
        "option_a": "Read every word",
        "option_b": "Analyze sentence structure",
        "option_c": "Get the overall idea quickly",
        "option_d": "Find metaphors",
        "correct_answer": "C",
        "explanation": "Skimming quickly gives a general overview of the text."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "Why is a topic sentence important in a paragraph?",
        "option_a": "It ends the paragraph",
        "option_b": "It explains punctuation",
        "option_c": "It introduces the main idea",
        "option_d": "It describes characters",
        "correct_answer": "C",
        "explanation": "Topic sentences introduce the main idea of the paragraph."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "A complex sentence contains:",
        "option_a": "One idea",
        "option_b": "A list",
        "option_c": "At least one dependent clause",
        "option_d": "Only questions",
        "correct_answer": "C",
        "explanation": "Complex sentences include at least one dependent clause."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "In descriptive writing, what is the main aim?",
        "option_a": "To argue",
        "option_b": "To narrate",
        "option_c": "To explain",
        "option_d": "To paint a vivid picture",
        "correct_answer": "D",
        "explanation": "Descriptive writing paints vivid images with words."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "How do connectives help in writing?",
        "option_a": "Add humor",
        "option_b": "Link ideas smoothly",
        "option_c": "Break up sentences",
        "option_d": "Add emotion",
        "correct_answer": "B",
        "explanation": "Connectives link ideas and sentences smoothly."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "When writing to persuade, what is most important?",
        "option_a": "Neutral tone",
        "option_b": "Clear sequence",
        "option_c": "Balanced arguments",
        "option_d": "Strong opinion and support",
        "correct_answer": "D",
        "explanation": "Persuasive writing relies on strong opinions backed with support."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "The phrase “The wind howled” is an example of:",
        "option_a": "Simile",
        "option_b": "Personification",
        "option_c": "Hyperbole",
        "option_d": "Onomatopoeia",
        "correct_answer": "B",
        "explanation": "Personification gives human qualities to non-human things."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "What makes a directed writing response strong?",
        "option_a": "Creative storytelling",
        "option_b": "Inclusion of personal feelings only",
        "option_c": "Coverage of task and relevant format",
        "option_d": "Use of rhymes",
        "correct_answer": "C",
        "explanation": "Strong directed writing covers the task fully and uses the right format."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "Which sentence is grammatically correct?",
        "option_a": "Him go to school.",
        "option_b": "They walks fast.",
        "option_c": "She plays well.",
        "option_d": "Me runs fast.",
        "correct_answer": "C",
        "explanation": "'She plays well.' is grammatically correct."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "The writer’s ‘audience’ is:",
        "option_a": "Their teacher",
        "option_b": "The people they write for",
        "option_c": "The people mentioned",
        "option_d": "The characters",
        "correct_answer": "B",
        "explanation": "Audience means those the writer is addressing."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "“You’ll regret this!” is an example of what tone?",
        "option_a": "Sarcastic",
        "option_b": "Threatening",
        "option_c": "Formal",
        "option_d": "Neutral",
        "correct_answer": "B",
        "explanation": "The phrase expresses a threatening tone."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "What should you check last before submitting writing?",
        "option_a": "Word count",
        "option_b": "Punctuation, spelling, grammar",
        "option_c": "Font size",
        "option_d": "The title font",
        "correct_answer": "B",
        "explanation": "Proofreading punctuation, spelling, and grammar is the final step."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "Which of these is typical of narrative writing?",
        "option_a": "Dialogue and conflict",
        "option_b": "Instructions and directions",
        "option_c": "Bullet points",
        "option_d": "Statistics",
        "correct_answer": "A",
        "explanation": "Narrative writing often includes dialogue and conflict."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "In summaries, lifting full sentences means:",
        "option_a": "Using your own words",
        "option_b": "Copying exactly from text",
        "option_c": "Adding examples",
        "option_d": "Explaining deeply",
        "correct_answer": "B",
        "explanation": "Lifting means copying text word-for-word, which is discouraged."
    },
    {
        "subject": "english",
        "difficulty": "medium",
        "question": "The phrase “shattered dreams” is best described as:",
        "option_a": "Simile",
        "option_b": "Fact",
            "option_c": "Metaphor",
    "option_d": "Idiom",
    "correct_answer": "C",
    "explanation": "\"Shattered dreams\" is a metaphor."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "Which of these is a strong transition for contrast?",
    "option_a": "Therefore",
    "option_b": "Furthermore",
    "option_c": "On the other hand",
    "option_d": "Because",
    "correct_answer": "C",
    "explanation": "\"On the other hand\" is used to show contrast."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "A factual report must:",
    "option_a": "Use dialogue",
    "option_b": "Be imaginative",
    "option_c": "Be objective and clear",
    "option_d": "Contain suspense",
    "correct_answer": "C",
    "explanation": "Factual reports are clear and objective."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "In writing, a “hook” refers to:",
    "option_a": "A punctuation mark",
    "option_b": "The first sentence to grab attention",
    "option_c": "A summary",
    "option_d": "A character",
    "correct_answer": "B",
    "explanation": "A hook grabs reader's attention at the start."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "What is the benefit of varying sentence lengths?",
    "option_a": "Confuse the reader",
    "option_b": "Maintain interest and rhythm",
    "option_c": "Add detail",
    "option_d": "Keep it short",
    "correct_answer": "B",
    "explanation": "Varying sentence lengths keeps writing engaging."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "Which best shows formal register?",
    "option_a": "Gonna see ya",
    "option_b": "Dear Sir or Madam",
    "option_c": "Hey buddy!",
    "option_d": "Lemme go!",
    "correct_answer": "B",
    "explanation": "Formal writing uses polite and formal phrases like 'Dear Sir or Madam'."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "A good summary avoids:",
    "option_a": "Repetition",
    "option_b": "Condensing",
    "option_c": "Rephrasing",
    "option_d": "Main ideas",
    "correct_answer": "A",
    "explanation": "Summaries should avoid unnecessary repetition."
},
{
    "subject": "english",
    "difficulty": "medium",
    "question": "Which of these best describes the effect of rhetorical questions?",
    "option_a": "Make the reader answer aloud",
    "option_b": "Confuse the reader",
    "option_c": "Emphasize a point",
    "option_d": "End the essay",
    "correct_answer": "C",
    "explanation": "Rhetorical questions emphasize points and engage readers."
}
    ],
    hard: [
         {
        "subject": "english",
        "difficulty": "hard",
        "question": "What does the phrase “a cocoon of copper wires” suggest in the text?",
        "option_a": "Decoration",
        "option_b": "Restriction",
        "option_c": "Global connectivity",
        "option_d": "Isolation",
        "correct_answer": "C",
        "explanation": "The phrase suggests global connectivity through copper wires."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Why might a writer use irony?",
        "option_a": "To confuse readers",
        "option_b": "To express ideas clearly",
        "option_c": "To emphasize through contrast",
        "option_d": "To describe emotions",
        "correct_answer": "C",
        "explanation": "Irony emphasizes a point through contrast."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Which device is used in “the sun smiled down”?",
        "option_a": "Simile",
        "option_b": "Alliteration",
        "option_c": "Personification",
        "option_d": "Oxymoron",
        "correct_answer": "C",
        "explanation": "Personification gives human qualities to the sun."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "A writer’s attitude in a text is known as their:",
        "option_a": "Argument",
        "option_b": "Tone",
        "option_c": "Register",
        "option_d": "Summary",
        "correct_answer": "B",
        "explanation": "Tone refers to the writer’s attitude."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "In reading, inferring means:",
        "option_a": "Quoting",
        "option_b": "Copying",
        "option_c": "Deducing from clues",
        "option_d": "Defining directly",
        "correct_answer": "C",
        "explanation": "Inferring is deducing meaning from clues in the text."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "How do sub-headings help the reader?",
        "option_a": "Confuse them",
        "option_b": "Add pictures",
        "option_c": "Organize content clearly",
        "option_d": "Add humor",
        "correct_answer": "C",
        "explanation": "Sub-headings organize content clearly."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Which phrase shows a writer’s bias?",
        "option_a": "“It was reported”",
        "option_b": "“Statistics show”",
        "option_c": "“Obviously, they were wrong”",
        "option_d": "“According to experts”",
        "correct_answer": "C",
        "explanation": "The word 'Obviously' indicates bias."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Which is a structural feature in writing?",
        "option_a": "Metaphor",
        "option_b": "Heading",
        "option_c": "Alliteration",
        "option_d": "Imagery",
        "correct_answer": "B",
        "explanation": "Headings are structural elements organizing text."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Why might a writer repeat words in a paragraph?",
        "option_a": "To waste space",
        "option_b": "To avoid new ideas",
        "option_c": "To emphasize a key point",
        "option_d": "To show confusion",
        "correct_answer": "C",
        "explanation": "Repetition is used for emphasis."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "“The mountains stabbed the sky” is an example of:",
        "option_a": "Hyperbole",
        "option_b": "Simile",
        "option_c": "Metaphor",
        "option_d": "Personification",
        "correct_answer": "C",
        "explanation": "This is a metaphor describing mountains dramatically."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Which question type requires inference?",
        "option_a": "Define this word",
        "option_b": "List two facts",
        "option_c": "Why do you think...?",
        "option_d": "What is the title?",
        "correct_answer": "C",
        "explanation": "Inference questions ask for reasoning beyond facts."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "“The silence was deafening” is an example of:",
        "option_a": "Simile",
        "option_b": "Oxymoron",
        "option_c": "Alliteration",
        "option_d": "Hyperbole",
        "correct_answer": "B",
        "explanation": "Oxymoron combines contradictory terms."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Which quote best shows tension?",
        "option_a": "He walked calmly",
        "option_b": "Her pulse raced as the door creaked open",
        "option_c": "She smiled warmly",
        "option_d": "It was quiet",
        "correct_answer": "B",
        "explanation": "The quote shows physical signs of tension."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What does 'evaluate' mean in reading?",
        "option_a": "Copy information",
        "option_b": "Add emotion",
        "option_c": "Judge effectiveness and quality",
        "option_d": "Draw pictures",
        "correct_answer": "C",
        "explanation": "Evaluate means to judge how good or effective something is."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Which feature is typical of persuasive text?",
        "option_a": "Dialogue",
        "option_b": "Balanced viewpoint",
        "option_c": "Biased language",
        "option_d": "Historical events",
        "correct_answer": "C",
        "explanation": "Persuasive texts often use biased language to influence."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "A writer uses a rhetorical question to:",
        "option_a": "Get an answer",
        "option_b": "End the paragraph",
        "option_c": "Make a reader think",
        "option_d": "Distract the reader",
        "correct_answer": "C",
        "explanation": "Rhetorical questions provoke thought rather than an answer."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "“The boy bolted like lightning” uses:",
        "option_a": "Simile",
        "option_b": "Hyperbole",
        "option_c": "Metaphor",
        "option_d": "Personification",
        "correct_answer": "A",
        "explanation": "This is a simile comparing speed using 'like'."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What makes a viewpoint reliable?",
        "option_a": "Use of bias",
        "option_b": "Emotive language",
        "option_c": "Use of evidence",
        "option_d": "Personal opinion",
        "correct_answer": "C",
        "explanation": "Reliable viewpoints are supported by evidence."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "The phrase “in the nick of time” means:",
        "option_a": "With a large delay",
        "option_b": "Just before it was too late",
        "option_c": "After it ended",
        "option_d": "At random",
        "correct_answer": "B",
        "explanation": "The phrase means just at the last possible moment."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What is the effect of short sentences in a tense scene?",
        "option_a": "Slow down pace",
        "option_b": "Add humor",
        "option_c": "Increase tension and urgency",
        "option_d": "Add details",
        "correct_answer": "C",
        "explanation": "Short sentences speed up the pace and increase tension."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "How does setting influence a narrative?",
        "option_a": "Decides ending",
        "option_b": "Adds statistics",
        "option_c": "Shapes mood and action",
        "option_d": "Determines essay length",
        "correct_answer": "C",
        "explanation": "Setting affects the mood and events in a story."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What makes a conclusion effective?",
        "option_a": "Adds new ideas",
        "option_b": "Repeats body paragraphs",
        "option_c": "Summarizes and reinforces key points",
        "option_d": "Tells a joke",
        "correct_answer": "C",
        "explanation": "Good conclusions summarize and reinforce main ideas."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What is an example of visual imagery?",
        "option_a": "He roared in anger",
        "option_b": "The crimson sunset bathed the valley",
        "option_c": "The scent was sharp",
        "option_d": "The taste was bitter",
        "correct_answer": "B",
        "explanation": "Visual imagery appeals to sight."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Why is figurative language used?",
        "option_a": "To be formal",
        "option_b": "To confuse",
        "option_c": "To create vivid images",
        "option_d": "To be objective",
        "correct_answer": "C",
        "explanation": "Figurative language creates vivid, imaginative pictures."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What is the purpose of a counter-argument in persuasive writing?",
        "option_a": "To support the main view",
        "option_b": "To show weakness",
        "option_c": "To ignore other views",
        "option_d": "To strengthen by addressing opposition",
        "correct_answer": "D",
        "explanation": "Counter-arguments acknowledge opposition to strengthen the main argument."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "In writing, coherence means:",
        "option_a": "Good handwriting",
        "option_b": "Clear logical flow of ideas",
        "option_c": "Using hard words",
        "option_d": "Writing in one paragraph",
        "correct_answer": "B",
        "explanation": "Coherence is the clear, logical connection between ideas."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "How do parenthetical commas affect meaning?",
        "option_a": "Add speed",
        "option_b": "Add jokes",
        "option_c": "Add extra non-essential info",
        "option_d": "End paragraphs",
        "correct_answer": "C",
        "explanation": "Parenthetical commas add extra, non-essential information."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "Why would a writer use repetition?",
        "option_a": "To add noise",
        "option_b": "For clarity",
        "option_c": "For emphasis",
        "option_d": "To make it longer",
        "correct_answer": "C",
        "explanation": "Repetition emphasizes key points."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "What is satire often used for?",
        "option_a": "Serious facts",
        "option_b": "Emotional appeal",
        "option_c": "Criticize using humor",
        "option_d": "Personal stories",
        "correct_answer": "C",
        "explanation": "Satire criticizes subjects humorously."
    },
    {
        "subject": "english",
        "difficulty": "hard",
        "question": "A contrast between what is expected and what occurs is:",
        "option_a": "Hyperbole",
        "option_b": "Simile",
        "option_c": "Irony",
        "option_d": "Allegory",
        "correct_answer": "C",
        "explanation": "Irony involves unexpected contrasts."
    }
    ]
  },
  physics: {
    easy: [
        {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which physical quantity is measured in meters?",
        "option_a": "Mass",
        "option_b": "Force",
        "option_c": "Time",
        "option_d": "Distance",
        "correct_answer": "D",
        "explanation": "Distance is measured in meters in the SI system."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "The SI unit of force is:",
        "option_a": "Newton",
        "option_b": "Pascal",
        "option_c": "Watt",
        "option_d": "Joule",
        "correct_answer": "A",
        "explanation": "Newton is the SI unit of force."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What is the formula for speed?",
        "option_a": "Distance × Time",
        "option_b": "Distance / Time",
        "option_c": "Time / Distance",
        "option_d": "Speed / Time",
        "correct_answer": "B",
        "explanation": "Speed = Distance divided by Time."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which of the following is a scalar quantity?",
        "option_a": "Force",
        "option_b": "Acceleration",
        "option_c": "Speed",
        "option_d": "Velocity",
        "correct_answer": "C",
        "explanation": "Speed is a scalar quantity; velocity is a vector."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "A body falls freely under gravity. What is its acceleration?",
        "option_a": "9.8 m/s²",
        "option_b": "10 m/s",
        "option_c": "0 m/s²",
        "option_d": "1 m/s²",
        "correct_answer": "A",
        "explanation": "Acceleration due to gravity is approximately 9.8 m/s²."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What is the SI unit of pressure?",
        "option_a": "N/m",
        "option_b": "N/m²",
        "option_c": "Pa",
        "option_d": "Both B and C",
        "correct_answer": "D",
        "explanation": "Pressure is measured in pascals (Pa), equivalent to N/m²."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What does a speed-time graph show?",
        "option_a": "Acceleration",
        "option_b": "Displacement",
        "option_c": "Work done",
        "option_d": "Energy",
        "correct_answer": "A",
        "explanation": "The gradient of a speed-time graph represents acceleration."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which instrument measures temperature?",
        "option_a": "Barometer",
        "option_b": "Thermometer",
        "option_c": "Manometer",
        "option_d": "Ammeter",
        "correct_answer": "B",
        "explanation": "Thermometer measures temperature."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which state of matter has no fixed shape or volume?",
        "option_a": "Solid",
        "option_b": "Liquid",
        "option_c": "Gas",
        "option_d": "Plasma",
        "correct_answer": "C",
        "explanation": "Gases have no fixed shape or volume."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which of these is a good conductor of heat?",
        "option_a": "Wood",
        "option_b": "Air",
        "option_c": "Metal",
        "option_d": "Plastic",
        "correct_answer": "C",
        "explanation": "Metals are good conductors of heat."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which device is used to measure electric current?",
        "option_a": "Voltmeter",
        "option_b": "Ammeter",
        "option_c": "Thermometer",
        "option_d": "Galvanometer",
        "correct_answer": "B",
        "explanation": "Ammeter measures electric current."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "The basic unit of time is:",
        "option_a": "Minute",
        "option_b": "Hour",
        "option_c": "Second",
        "option_d": "Millisecond",
        "correct_answer": "C",
        "explanation": "The second is the basic SI unit of time."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "A force of 10 N acts on a body. What is the mass if acceleration is 2 m/s²?",
        "option_a": "5 kg",
        "option_b": "20 kg",
        "option_c": "2 kg",
        "option_d": "10 kg",
        "correct_answer": "A",
        "explanation": "Using F = ma, mass = force/acceleration = 10/2 = 5 kg."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which method reduces parallax error?",
        "option_a": "Taking average readings",
        "option_b": "Using precise instruments",
        "option_c": "Placing eye directly above the scale",
        "option_d": "Measuring quickly",
        "correct_answer": "C",
        "explanation": "Parallax error is minimized by viewing the scale directly from above."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "The formula for density is:",
        "option_a": "Volume × Mass",
        "option_b": "Mass / Volume",
        "option_c": "Weight / Mass",
        "option_d": "Volume / Weight",
        "correct_answer": "B",
        "explanation": "Density = Mass divided by Volume."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What is the unit of electric charge?",
        "option_a": "Volt",
        "option_b": "Ampere",
        "option_c": "Ohm",
        "option_d": "Coulomb",
        "correct_answer": "D",
        "explanation": "Coulomb is the unit of electric charge."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which instrument uses oscillations to measure time?",
        "option_a": "Stopwatch",
        "option_b": "Clock",
        "option_c": "Thermometer",
        "option_d": "Both A and B",
        "correct_answer": "D",
        "explanation": "Both stopwatches and clocks use oscillations for time measurement."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which of the following quantities is a vector?",
        "option_a": "Time",
        "option_b": "Speed",
        "option_c": "Distance",
        "option_d": "Velocity",
        "correct_answer": "D",
        "explanation": "Velocity has both magnitude and direction, making it a vector."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "The boiling point of water at sea level is:",
        "option_a": "0°C",
        "option_b": "50°C",
        "option_c": "100°C",
        "option_d": "212°C",
        "correct_answer": "C",
        "explanation": "Water boils at 100°C at sea level."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What is the function of a fuse in an electrical circuit?",
        "option_a": "Reduce voltage",
        "option_b": "Increase current",
        "option_c": "Break the circuit in case of overload",
        "option_d": "Store current",
        "correct_answer": "C",
        "explanation": "Fuse protects the circuit by breaking it during overload."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which wave does not require a medium to travel?",
        "option_a": "Sound",
        "option_b": "Water",
        "option_c": "Light",
        "option_d": "Seismic",
        "correct_answer": "C",
        "explanation": "Light is an electromagnetic wave and can travel in vacuum."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which of these is not a renewable energy source?",
        "option_a": "Solar",
        "option_b": "Wind",
        "option_c": "Coal",
        "option_d": "Hydroelectric",
        "correct_answer": "C",
        "explanation": "Coal is a non-renewable fossil fuel."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What is the purpose of an insulator?",
        "option_a": "Conduct electricity",
        "option_b": "Prevent current leakage",
        "option_c": "Store energy",
        "option_d": "Generate voltage",
        "correct_answer": "B",
        "explanation": "Insulators prevent current leakage by resisting electrical flow."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "What happens to pressure if area increases (force constant)?",
        "option_a": "Increases",
        "option_b": "Decreases",
        "option_c": "Remains same",
        "option_d": "Doubles",
        "correct_answer": "B",
        "explanation": "Pressure = Force / Area, so pressure decreases if area increases."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "How does heat transfer in a solid?",
        "option_a": "Radiation",
        "option_b": "Convection",
        "option_c": "Conduction",
        "option_d": "Evaporation",
        "correct_answer": "C",
        "explanation": "Heat is transferred in solids mainly by conduction."
    },
    {
        "subject": "physics",
        "difficulty": "easy",
        "question": "Which of the following uses electromagnetic induction?",
        "option_a": "Generator",
        "option_b": "Battery",
        "option_c": "Switch",
        "option_d": "Capacitor",
        "correct_answer": "A",
        "explanation":"Generators produce electricity via electromagnetic induction."
},
{
"subject": "physics",
"difficulty": "easy",
"question": "The resistance of a wire depends on:",
"option_a": "Length",
"option_b": "Thickness",
"option_c": "Material",
"option_d": "All of the above",
"correct_answer": "D",
"explanation": "Resistance depends on length, thickness, and material."
},
{
"subject": "physics",
"difficulty": "easy",
"question": "What energy change takes place in an electric motor?",
"option_a": "Electrical to sound",
"option_b": "Electrical to mechanical",
"option_c": "Mechanical to electrical",
"option_d": "Chemical to electrical",
"correct_answer": "B",
"explanation": "Electric motors convert electrical energy to mechanical energy."
},
{
"subject": "physics",
"difficulty": "easy",
"question": "What is the unit of energy?",
"option_a": "Newton",
"option_b": "Volt",
"option_c": "Watt",
"option_d": "Joule",
"correct_answer": "D",
"explanation": "Joule is the SI unit of energy."
},
{
"subject": "physics",
"difficulty": "easy",
"question": "What is the acceleration of an object at rest?",
"option_a": "0 m/s²",
"option_b": "9.8 m/s²",
"option_c": "1 m/s²",
"option_d": "100 m/s²",
"correct_answer": "A",
"explanation": "An object at rest has zero acceleration."
}
    ],
    medium: [
         {
        "subject": "physics",
        "difficulty": "medium",
        "question": "A car travels 300 m in 20 s. What is its average speed?",
        "option_a": "15 m/s",
        "option_b": "20 m/s",
        "option_c": "25 m/s",
        "option_d": "30 m/s",
        "correct_answer": "B",
        "explanation": "Average speed = Distance / Time = 300 / 20 = 15 m/s."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "A body moves in a circle at constant speed. Its velocity is:",
        "option_a": "Constant",
        "option_b": "Zero",
        "option_c": "Changing",
        "option_d": "Decreasing",
        "correct_answer": "C",
        "explanation": "Though speed is constant, direction changes, so velocity changes."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "The gradient of a distance–time graph gives:",
        "option_a": "Acceleration",
        "option_b": "Displacement",
        "option_c": "Speed",
        "option_d": "Velocity",
        "correct_answer": "C",
        "explanation": "Gradient of distance-time graph gives speed."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "What does the area under a speed–time graph represent?",
        "option_a": "Acceleration",
        "option_b": "Displacement",
        "option_c": "Distance travelled",
        "option_d": "Final speed",
        "correct_answer": "C",
        "explanation": "Area under a speed-time graph gives distance."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "A block weighs 40 N and has a mass of 8 kg. What is the gravitational field strength?",
        "option_a": "5 N/kg",
        "option_b": "9.8 N/kg",
        "option_c": "8 N/kg",
        "option_d": "40 N/kg",
        "correct_answer": "A",
        "explanation": "Gravitational field strength = Weight / Mass = 40 / 8 = 5 N/kg."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which graph shows non-uniform acceleration?",
        "option_a": "A straight line distance–time graph",
        "option_b": "A curved speed–time graph",
        "option_c": "A straight line speed–time graph",
        "option_d": "A horizontal speed–time graph",
        "correct_answer": "B",
        "explanation": "Curved speed-time graph shows changing acceleration."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "What is the pressure exerted by a 200 N force on an area of 0.5 m²?",
        "option_a": "50 Pa",
        "option_b": "100 Pa",
        "option_c": "200 Pa",
        "option_d": "400 Pa",
        "correct_answer": "D",
        "explanation": "Pressure = Force / Area = 200 / 0.5 = 400 Pa."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which property of a thermistor decreases as temperature increases?",
        "option_a": "Voltage",
        "option_b": "Resistance",
        "option_c": "Power",
        "option_d": "Current",
        "correct_answer": "B",
        "explanation": "Thermistors have resistance that decreases as temperature increases."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which method is best to find volume of an irregular object?",
        "option_a": "Micrometer screw gauge",
        "option_b": "Measuring cylinder",
        "option_c": "Meter rule",
        "option_d": "Vernier calipers",
        "correct_answer": "B",
        "explanation": "Measuring cylinder helps measure displaced volume."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "The moment of a force is defined as:",
        "option_a": "Force × distance from pivot",
        "option_b": "Mass × acceleration",
        "option_c": "Pressure × volume",
        "option_d": "Work done ÷ time",
        "correct_answer": "A",
        "explanation": "Moment = Force × perpendicular distance from pivot."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "An object has an initial velocity of 10 m/s and accelerates at 2 m/s² for 5 s. What is the final velocity?",
        "option_a": "10 m/s",
        "option_b": "15 m/s",
        "option_c": "20 m/s",
        "option_d": "25 m/s",
        "correct_answer": "D",
        "explanation": "Final velocity = u + at = 10 + 2×5 = 20 m/s."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which of these is a non-contact force?",
        "option_a": "Tension",
        "option_b": "Friction",
        "option_c": "Magnetic",
        "option_d": "Normal reaction",
        "correct_answer": "C",
        "explanation": "Magnetic force acts at a distance without contact."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "In a lever, the load is 40 N, the effort is 20 N, and the effort arm is twice the load arm. The lever is:",
        "option_a": "Balanced",
        "option_b": "In equilibrium",
        "option_c": "Efficient",
        "option_d": "Mechanical advantage = 2",
        "correct_answer": "D",
        "explanation": "Effort arm being double gives a mechanical advantage of 2."
    },
        {
        "subject": "physics",
        "difficulty": "medium",
        "question": "The turning effect of a force is called:",
        "option_a": "Momentum",
        "option_b": "Moment",
        "option_c": "Acceleration",
        "option_d": "Pressure",
        "correct_answer": "B",
        "explanation": "Turning effect of a force is known as moment."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which formula gives kinetic energy?",
        "option_a": "mgh",
        "option_b": "½mv²",
        "option_c": "F × d",
        "option_d": "P × t",
        "correct_answer": "B",
        "explanation": "Kinetic energy is calculated using the formula ½mv²."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which of the following affects the rate of evaporation?",
        "option_a": "Surface area",
        "option_b": "Temperature",
        "option_c": "Wind",
        "option_d": "All of the above",
        "correct_answer": "D",
        "explanation": "Evaporation rate increases with surface area, temperature, and wind."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "If a wave has frequency 100 Hz and wavelength 2 m, its speed is:",
        "option_a": "50 m/s",
        "option_b": "100 m/s",
        "option_c": "200 m/s",
        "option_d": "0.5 m/s",
        "correct_answer": "C",
        "explanation": "Wave speed = Frequency × Wavelength = 100 × 2 = 200 m/s."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which electromagnetic wave has the shortest wavelength?",
        "option_a": "Radio wave",
        "option_b": "X-ray",
        "option_c": "Infrared",
        "option_d": "Microwave",
        "correct_answer": "B",
        "explanation": "X-rays have shorter wavelengths than other options listed."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "When light passes from air to glass, it:",
        "option_a": "Speeds up and bends away from normal",
        "option_b": "Slows down and bends toward the normal",
        "option_c": "Remains unchanged",
        "option_d": "Disperses",
        "correct_answer": "B",
        "explanation": "Light slows down and bends toward the normal in glass."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "A current of 2 A flows for 3 minutes. What is the charge transferred?",
        "option_a": "6 C",
        "option_b": "60 C",
        "option_c": "360 C",
        "option_d": "180 C",
        "correct_answer": "C",
        "explanation": "Charge = Current × Time = 2 × 180 = 360 C."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "What is the resistance of a wire if voltage = 6V and current = 0.5 A?",
        "option_a": "12 Ω",
        "option_b": "3 Ω",
        "option_c": "9 Ω",
        "option_d": "1 Ω",
        "correct_answer": "A",
        "explanation": "Resistance = Voltage / Current = 6 / 0.5 = 12 Ω."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "An electric heater transfers 6000 J in 2 minutes. What is the power?",
        "option_a": "300 W",
        "option_b": "50 W",
        "option_c": "100 W",
        "option_d": "200 W",
        "correct_answer": "A",
        "explanation": "Power = Energy / Time = 6000 / 120 = 50 W."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "The function of a transformer is to:",
        "option_a": "Convert AC to DC",
        "option_b": "Step up or down voltage",
        "option_c": "Store current",
        "option_d": "Measure energy",
        "correct_answer": "B",
        "explanation": "Transformers increase or decrease AC voltage."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "A radioactive substance has a half-life of 5 hours. How much remains after 10 hours?",
        "option_a": "1/2",
        "option_b": "1/3",
        "option_c": "1/4",
        "option_d": "1/8",
        "correct_answer": "C",
        "explanation": "Two half-lives = 1/2 × 1/2 = 1/4 remaining."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which radiation is most penetrating?",
        "option_a": "Alpha",
        "option_b": "Beta",
        "option_c": "Gamma",
        "option_d": "Neutron",
        "correct_answer": "C",
        "explanation": "Gamma rays penetrate most materials deeply."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "The main energy conversion in a solar panel is:",
        "option_a": "Chemical → Electrical",
        "option_b": "Heat → Light",
        "option_c": "Light → Electrical",
        "option_d": "Sound → Light",
        "correct_answer": "C",
        "explanation": "Solar panels convert light energy into electrical energy."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which instrument displays sound waveforms?",
        "option_a": "Oscilloscope",
        "option_b": "Thermometer",
        "option_c": "Voltmeter",
        "option_d": "Signal generator",
        "correct_answer": "A",
        "explanation": "Oscilloscopes show graphical representations of sound waves."
    },
    {
        "subject": "physics",
        "difficulty": "medium",
        "question": "Which planet has the highest surface gravity?",
        "option_a": "Earth",
        "option_b": "Mars",
        "option_c": "Jupiter",
        "option_d": "Venus",
        "correct_answer": "C",
        "explanation": "Jupiter has the highest gravity among the planets listed."
    }
    ],
    hard: [
        {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A body is thrown vertically upward with a velocity of 20 m/s. What is its maximum height? (Take g = 10 m/s²)",
        "option_a": "20 m",
        "option_b": "10 m",
        "option_c": "30 m",
        "option_d": "40 m",
        "correct_answer": "D",
        "explanation": "Use h = v² / 2g = 400 / 20 = 40 m."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "An object accelerates uniformly from rest to 30 m/s in 6 s. Find the total distance covered.",
        "option_a": "180 m",
        "option_b": "90 m",
        "option_c": "60 m",
        "option_d": "150 m",
        "correct_answer": "A",
        "explanation": "s = 0.5 × (u + v) × t = 0.5 × 30 × 6 = 180 m."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A force of 10 N stretches a spring by 2 cm. What is the spring constant?",
        "option_a": "50 N/m",
        "option_b": "500 N/m",
        "option_c": "100 N/m",
        "option_d": "200 N/m",
        "correct_answer": "B",
        "explanation": "k = F / x = 10 / 0.02 = 500 N/m."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "If a lever has an effort arm of 0.2 m and load arm of 0.05 m, what is its mechanical advantage?",
        "option_a": "2",
        "option_b": "3",
        "option_c": "4",
        "option_d": "5",
        "correct_answer": "D",
        "explanation": "MA = effort arm / load arm = 0.2 / 0.05 = 4."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A 2 kg object moving at 4 m/s collides with a stationary 3 kg object. If they stick together, find their velocity after collision.",
        "option_a": "2.0 m/s",
        "option_b": "1.6 m/s",
        "option_c": "1.6 m/s",
        "option_d": "1.2 m/s",
        "correct_answer": "C",
        "explanation": "Momentum conserved: v = (2×4 + 3×0)/5 = 1.6 m/s."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "Which factor will NOT affect the pressure at a given depth in a liquid?",
        "option_a": "Density",
        "option_b": "Gravity",
        "option_c": "Depth",
        "option_d": "Shape of container",
        "correct_answer": "D",
        "explanation": "Pressure depends on depth, density, gravity; not container shape."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A hydraulic press has a small piston of 5 cm² area and a large piston of 50 cm². If 100 N is applied on the small piston, what is the force on the large piston?",
        "option_a": "500 N",
        "option_b": "1000 N",
        "option_c": "50 N",
        "option_d": "100 N",
        "correct_answer": "B",
        "explanation": "Force on large piston = 100 × (50 / 5) = 1000 N."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A block slides down a ramp losing 200 J of gravitational potential energy but gaining only 150 J of kinetic energy. What happened to the rest?",
        "option_a": "Reflected",
        "option_b": "Stored",
        "option_c": "Lost as heat",
        "option_d": "Used to accelerate",
        "correct_answer": "C",
        "explanation": "50 J lost as heat due to friction."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A heat engine receives 1000 J and does 300 J of useful work. Its efficiency is:",
        "option_a": "70%",
        "option_b": "30%",
        "option_c": "300%",
        "option_d": "3%",
        "correct_answer": "B",
        "explanation": "Efficiency = (300/1000) × 100 = 30%."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "Which has the lowest specific heat capacity?",
        "option_a": "Water",
        "option_b": "Copper",
        "option_c": "Aluminium",
        "option_d": "Lead",
        "correct_answer": "D",
        "explanation": "Lead has lower specific heat capacity than others."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A liquid cools faster in a windy room because of:",
        "option_a": "Conduction",
        "option_b": "Radiation",
        "option_c": "Convection",
        "option_d": "Evaporation",
        "correct_answer": "D",
        "explanation": "Wind increases evaporation, speeding cooling."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A wave has frequency 5 Hz and wavelength 3 m. What is its time period?",
        "option_a": "0.2 s",
        "option_b": "3 s",
        "option_c": "0.6 s",
        "option_d": "1.5 s",
        "correct_answer": "A",
        "explanation": "Time period T = 1 / frequency = 1 / 5 = 0.2 s."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A lens forms a real image that is inverted and smaller than the object. The lens is:",
        "option_a": "Concave",
        "option_b": "Convex",
        "option_c": "Plane",
        "option_d": "Biconcave",
        "correct_answer": "B",
        "explanation": "Convex lenses form real, inverted, smaller images."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "Which change will increase the speed of sound in air?",
        "option_a": "Lower pressure",
        "option_b": "Lower temperature",
        "option_c": "Higher temperature",
        "option_d": "High humidity",
        "correct_answer": "C",
        "explanation": "Higher temperature increases sound speed."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A 60 W lamp operates for 10 minutes. How much energy does it use?",
        "option_a": "600 J",
        "option_b": "36000 J",
        "option_c": "6000 J",
        "option_d": "3600 J",
        "correct_answer": "B",
        "explanation": "Energy = Power × Time = 60 × 600 = 36000 J."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "The electric current in a circuit is 0.2 A. How many electrons pass a point in 10 seconds? (e = 1.6 × 10⁻¹⁹ C)",
        "option_a": "1.25 × 10²⁰",
        "option_b": "3.2 × 10¹⁹",
        "option_c": "1.25 × 10¹⁹",
        "option_d": "3.2 × 10²⁰",
        "correct_answer": "A",
        "explanation": "Charge Q = I × t = 0.2 × 10 = 2 C; Number of electrons = Q / e = 2 / 1.6e-19 = 1.25e20."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A wire of length L and resistance R is stretched to twice its length. Its new resistance is:",
        "option_a": "R",
        "option_b": "2R",
        "option_c": "4R",
        "option_d": "0.5R",
        "correct_answer": "C",
        "explanation": "Resistance varies as (length)^2; doubling length quadruples resistance."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "What is the potential difference across a 100 Ω resistor carrying 0.25 A?",
        "option_a": "4 V",
        "option_b": "25 V",
        "option_c": "50 V",
        "option_d": "75 V",
        "correct_answer": "B",
        "explanation": "V = IR = 0.25 × 100 = 25 V."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A battery has 12 V and supplies 2 A for 5 hours. What is the energy transferred?",
        "option_a": "120 J",
        "option_b": "432000 J",
        "option_c": "1200 J",
        "option_d": "864000 J",
        "correct_answer": "B",
        "explanation": "Energy = V × I × t = 12 × 2 × 18000 = 432000 J."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "Which coil arrangement gives maximum electromagnetic induction?",
        "option_a": "Fewer turns, strong magnet",
        "option_b": "More turns, weak magnet",
        "option_c": "More turns, strong magnet, rapid movement",
        "option_d": "Iron core with no movement",
        "correct_answer": "C",
        "explanation": "More turns, stronger magnet, and faster movement increase induction."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A step-down transformer has 4000 turns in the primary and 200 in the secondary. If the primary voltage is 240 V, what is the secondary voltage?",
        "option_a": "12 V",
        "option_b": "20 V",
        "option_c": "12 V",
        "option_d": "40 V",
        "correct_answer": "C",
        "explanation": "Vs = Vp × (Ns/Np) = 240 × (200/4000) = 12 V."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "A cathode ray is deflected in an electric field. What does this show?",
        "option_a": "It is light",
        "option_b": "It has mass and charge",
        "option_c": "It is sound",
        "option_d": "It is magnetic",
        "correct_answer": "B",
        "explanation": "Deflection shows cathode rays have mass and charge."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "Alpha particles are used in smoke detectors because they:",
        "option_a": "Ionize air easily",
        "option_b": "Penetrate deeply",
        "option_c": "Are magnetic",
        "option_d": "Cause fusion",
        "correct_answer": "A",
        "explanation": "Alpha particles ionize air, enabling smoke detection."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "Which nuclear reaction involves splitting of a nucleus?",
        "option_a": "Fusion",
        "option_b": "Alpha decay",
        "option_c": "Fission",
        "option_d": "Beta decay",
        "correct_answer": "C",
        "explanation": "Fission is the splitting of a nucleus."
    },
    {
        "subject": "physics",
        "difficulty": "hard",
        "question": "The half-life of a substance is 1 hour. What percentage remains after 3 hours?",
        "option_a": "75%",
        "option_b": "25%",
        "option_c": "12.5%",
"option_d": "50%",
"correct_answer": "C",
"explanation": "After 3 half-lives: (1/2)^3 = 1/8 = 12.5%."
},
{
"subject": "physics",
"difficulty": "hard",
"question": "What protects astronauts from cosmic rays?",
"option_a": "Water tank",
"option_b": "Solar panels",
"option_c": "Lead shielding",
"option_d": "Magnetic boots",
"correct_answer": "C",
"explanation": "Lead shielding protects against cosmic rays."
},
{
"subject": "physics",
"difficulty": "hard",
"question": "Why do satellites stay in orbit?",
"option_a": "No gravity in space",
"option_b": "Their speed balances gravity",
"option_c": "Earth repels them",
"option_d": "Due to solar wind",
"correct_answer": "B",
"explanation": "Satellites stay in orbit because their speed balances gravitational pull."
},
{
"subject": "physics",
"difficulty": "hard",
"question": "Which statement is true about geostationary satellites?",
"option_a": "They orbit once every 12 hours",
"option_b": "They move over different points on Earth",
"option_c": "Their orbit lies above the poles",
"option_d": "They stay above the same point on the equator",
"correct_answer": "D",
"explanation": "Geostationary satellites stay above the same point on the equator."
},
{
"subject": "physics",
"difficulty": "hard",
"question": "The red shift observed in distant galaxies shows:",
"option_a": "Universe is shrinking",
"option_b": "Galaxies are stationary",
"option_c": "Universe is expanding",
"option_d": "Galaxies are rotating",
"correct_answer": "C",
"explanation": "Red shift indicates the universe is expanding."
},
{
"subject": "physics",
"difficulty": "hard",
"question": "Which principle supports the Big Bang theory?",
"option_a": "Conduction",
"option_b": "Law of reflection",
"option_c": "Cosmic microwave background radiation",
"option_d": "Conservation of momentum",
"correct_answer": "C",
"explanation": "Cosmic microwave background radiation supports the Big Bang theory."
}
    ]
  }
};

const QuizTaker = () => {
  const { logout } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState([]);
  const [currentBadge, setCurrentBadge] = useState(BADGE_LEVELS.BRONZE);
  const [currentDifficulty, setCurrentDifficulty] = useState('easy');
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [avgScore, setAvgScore] = useState(0);

  // Load quiz history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('quizHistory');
    if (storedHistory) {
      const parsedHistory = JSON.parse(storedHistory);
      setQuizHistory(parsedHistory);
    }
  }, []);

  // Update badge and difficulty level whenever quiz history changes
  useEffect(() => {
    if (quizHistory.length > 0) {
      updateBadgeAndDifficulty();
    }
  }, [quizHistory]);

  // Calculate average score and determine badge and difficulty level
  const updateBadgeAndDifficulty = () => {
    const totalScore = quizHistory.reduce((sum, quiz) => sum + (quiz.score / quiz.maxScore * 100), 0);
    const calculatedAvgScore = totalScore / quizHistory.length;
    setAvgScore(calculatedAvgScore);
    
    // Update badge based on average score
    let newBadge = BADGE_LEVELS.BRONZE;
    
    if (calculatedAvgScore >= BADGE_LEVELS.PLATINUM.minScore) {
      newBadge = BADGE_LEVELS.PLATINUM;
    } else if (calculatedAvgScore >= BADGE_LEVELS.DIAMOND.minScore) {
      newBadge = BADGE_LEVELS.DIAMOND;
    } else if (calculatedAvgScore >= BADGE_LEVELS.GOLD.minScore) {
      newBadge = BADGE_LEVELS.GOLD;
    } else if (calculatedAvgScore >= BADGE_LEVELS.SILVER.minScore) {
      newBadge = BADGE_LEVELS.SILVER;
    }
    
    setCurrentBadge(newBadge);
    
    // Update difficulty level based on average score
    let newDifficulty = 'easy';
    
    if (calculatedAvgScore > DIFFICULTY_LEVELS.MEDIUM.maxAvgScore) {
      newDifficulty = 'hard';
    } else if (calculatedAvgScore > DIFFICULTY_LEVELS.EASY.maxAvgScore) {
      newDifficulty = 'medium';
    }
    
    setCurrentDifficulty(newDifficulty);
    
    console.log(`Updated badge to ${newBadge.name} and difficulty to ${newDifficulty} based on avg score ${calculatedAvgScore.toFixed(1)}%`);
  };

  // Start a new quiz with the selected subject
  const startQuiz = () => {
    if (!selectedSubject) return;
    
    // Get questions based on the current difficulty level
    const availableQuestions = sampleQuestions[selectedSubject][currentDifficulty] || [];
    
    // If not enough questions available for the current difficulty, fallback to easier ones
    let questionsToUse = [...availableQuestions];
    if (questionsToUse.length < 10 && currentDifficulty === 'hard') {
      questionsToUse = [...questionsToUse, ...sampleQuestions[selectedSubject].medium];
    }
    if (questionsToUse.length < 10 && (currentDifficulty === 'hard' || currentDifficulty === 'medium')) {
      questionsToUse = [...questionsToUse, ...sampleQuestions[selectedSubject].easy];
    }
    
    // Randomly select 10 questions or all if less than 10 are available
    const selectedQuestions = questionsToUse.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    setCurrentQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizStarted(true);
    setQuizCompleted(false);
    setSelectedAnswer('');
    setShowExplanation(false);
  };

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    if (answeredQuestions.includes(currentQuestionIndex)) return;
    setSelectedAnswer(option);
  };

  // Submit answer and move to next question or complete quiz
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answeredQuestions.includes(currentQuestionIndex)) return;
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 10);
    }
    
    setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);
    setShowExplanation(true);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedAnswer('');
      setShowExplanation(false);
    } else {
      completeQuiz();
    }
  };

  // Complete the quiz and save results
  const completeQuiz = () => {
    const quizResult = {
      subject: selectedSubject,
      difficulty: currentDifficulty,
      score: score,
      maxScore: currentQuestions.length * 10,
      date: new Date().toISOString()
    };
    
    const updatedHistory = [...quizHistory, quizResult];
    setQuizHistory(updatedHistory);
    localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    
    setQuizCompleted(true);
    setQuizStarted(false);
  };

  // Reset and start a new quiz
  const handleNewQuiz = () => {
    setSelectedSubject('');
    setQuizStarted(false);
    setQuizCompleted(false);
  };

  // Render the current question
  const renderCurrentQuestion = () => {
    if (!currentQuestions.length) return null;
    
    const question = currentQuestions[currentQuestionIndex];
    const isAnswered = answeredQuestions.includes(currentQuestionIndex);
    const isCorrect = isAnswered && selectedAnswer === question.correct_answer;
    
    return (
      <div className="question-container">
        <div className="question-progress">
          Question {currentQuestionIndex + 1} of {currentQuestions.length}
        </div>
        <div className="question-text">
          {question.question}
        </div>
        <div className="options-container">
          {['A', 'B', 'C', 'D'].map((option) => (
            <div 
              key={option}
              className={`option ${selectedAnswer === option ? 'selected' : ''} 
                       ${isAnswered && option === question.correct_answer ? 'correct' : ''}
                       ${isAnswered && selectedAnswer === option && option !== question.correct_answer ? 'incorrect' : ''}`}
              onClick={() => handleAnswerSelect(option)}
            >
              <span className="option-letter">{option}</span>
              <span className="option-text">{question[`option_${option.toLowerCase()}`]}</span>
            </div>
          ))}
        </div>
        
        {showExplanation && (
          <div className="explanation">
            <h4>{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h4>
            <p>{question.explanation}</p>
          </div>
        )}
        
        <div className="quiz-actions">
          {!isAnswered ? (
            <button 
              className="submit-btn"
              disabled={!selectedAnswer}
              onClick={handleSubmitAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <button 
              className="next-btn"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render quiz results
  const renderQuizResults = () => {
    if (!quizCompleted) return null;
    
    const lastQuiz = quizHistory[quizHistory.length - 1];
    const percentage = (lastQuiz.score / lastQuiz.maxScore) * 100;
    
    return (
      <div className="quiz-results">
        <h2 style={{color: "black" }}>Quiz Completed!</h2>
        <div className="score-display">
          <div className="score-circle" style={{background: `conic-gradient(${currentBadge.color} ${percentage}%, #f0f0f0 0)`}}>
            <span className="score-value"style={{color: "black" }} >{percentage.toFixed(0)}%</span>
          </div>
        </div>
        <div className="result-details">
          <p style={{color: "white" }}><strong>Subject:</strong > {lastQuiz.subject}</p>
          <p style={{color: 'white' }}><strong>Difficulty:</strong> {lastQuiz.difficulty}</p>
          <p style={{color: 'white' }}><strong>Score:</strong> {lastQuiz.score} out of {lastQuiz.maxScore}</p>
          <p style={{color: 'white' }}><strong>Current Badge:</strong> <span className="badge-name" style={{color: currentBadge.color}}>{currentBadge.name}</span></p>
          <p style={{color: 'white' }}><strong>Overall Average:</strong> {avgScore.toFixed(1)}%</p>
          <p style={{color: 'white' }}><strong>Next Quiz Difficulty:</strong> <span className="difficulty-name">{currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}</span></p>
        </div>
        <button className="new-quiz-btn" onClick={handleNewQuiz}>
          Take Another Quiz
        </button>
      </div>
    );
  };

  // Render subject selection
  const renderSubjectSelection = () => {
    if (quizStarted || quizCompleted) return null;
    
    return (
      <div className="subject-selection">
        <h2>Select a Subject</h2>
        <div className="subject-options">
          {['computer', 'english', 'physics'].map(subject => (
            <div 
              key={subject}
              className={`subject-card ${selectedSubject === subject ? 'selected' : ''}`}
              onClick={() => setSelectedSubject(subject)}
            >
              <div className="subject-icon">
                {subject === 'computer' && '💻'}
                {subject === 'english' && '📚'}
                {subject === 'physics' && '⚛️'}
              </div>
              <div className="subject-name">
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </div>
            </div>
          ))}
        </div>
        <button 
          className="start-quiz-btn"
          disabled={!selectedSubject}
          onClick={startQuiz}
        >
          Start Quiz
        </button>
      </div>
    );
  };

  return (
    <div className="quiz-page">
      <header className="app-header">
                      <img src={logo} alt="LEAP Logo" className="app-logo" />
                      <div className="header-content">
                        <h1 style={{ color: 'white' }}> Take exam with us and get your badge! </h1>
                        <div className="header-links">
                        <Link to="/dashboard" className="nav-link dashboard-link" style={{ backgroundColor: ' #BA8E23' }}>Dashboard</Link>
                          <Link to="/practice-quiz" className="nav-link practice-link">Practice Quiz</Link>
                          <Link to="/quiz-taker" className="nav-link exam-link">Take Exam</Link>
                          <Link 
              to="/flash-cards" 
              className="nav-link exam-link" 
              style={{ backgroundColor: 'purple' }}
            >
              Create Flash Cards
            </Link>
                          <button onClick={logout} className="logout-btn">Logout</button>
                        </div>
                      </div>
                    </header>
      
      <div className="quiz-taker-container">
        <div className="quiz-taker-sidebar">
          <div className="badge-display">
            <h3>{currentUser?.username || 'Student'}'s Badge</h3>
            <div className="badge" style={{backgroundColor: currentBadge.color, color:"black"}}>
              {currentBadge.name}
            </div>
          </div>
          <div className="difficulty-display">
            <h3>Current Difficulty</h3>
            <div className="difficulty-level">
              {currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1)}
            </div>
          </div>
          <div className="history-summary">
            <h3>Quiz History</h3>
            <p>Total Quizzes: {quizHistory.length}</p>
            {quizHistory.length > 0 && (
              <p>Average Score: {avgScore.toFixed(1)}%</p>
            )}
          </div>
        </div>
        <div className="quiz-taker-main">
          {renderSubjectSelection()}
          {quizStarted && renderCurrentQuestion()}
          {quizCompleted && renderQuizResults()}
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;