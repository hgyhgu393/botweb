const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = "./data.json";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(".")); // ให้บริการไฟล์ index.html

// อ่านข้อมูล
function readData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

// เขียนข้อมูล
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API: ดึงข้อมูล
app.get("/api/data", (req, res) => {
    const data = readData();
    res.json(data);
});

// API: อัปเดตข้อมูล (Admin)
app.post("/api/update", (req, res) => {
    const { codeName, codeValue, systemOpen, password } = req.body;
    const ADMIN_PASSWORD = "123456"; // เปลี่ยนรหัสผ่านที่นี่

    if(password !== ADMIN_PASSWORD) {
        return res.status(403).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    const data = readData();
    if(codeName !== undefined) data.codeName = codeName;
    if(codeValue !== undefined) data.codeValue = codeValue;
    if(systemOpen !== undefined) data.systemOpen = systemOpen;

    writeData(data);
    res.json({ message: "บันทึกเรียบร้อย" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
