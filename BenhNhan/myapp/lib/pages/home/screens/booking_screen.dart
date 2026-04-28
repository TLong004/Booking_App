import 'package:flutter/material.dart';
import 'package:myapp/pages/home/screens/profile_screen.dart';

class BookingScreen extends StatefulWidget {
  final Map<String, dynamic> doctor;

  const BookingScreen({super.key, required this.doctor});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  String? selectedService;
  int selectedDateIndex = 2; 
  String selectedTime = "11:00 AM";

  // Dữ liệu dịch vụ
  final List<Map<String, String>> services = [
    {"name": "Khám tổng quát", "price": "200.000đ"},
    {"name": "Tư vấn chuyên sâu", "price": "500.000đ"},
    {"name": "Nhổ răng khôn", "price": "1.500.000đ"},
  ];

  // Dữ liệu ngày
  final List<Map<String, String>> dates = [
    {"day": "T2", "date": "15"},
    {"day": "T3", "date": "16"},
    {"day": "T4", "date": "17"},
    {"day": "T5", "date": "18"},
    {"day": "T6", "date": "19"},
    {"day": "T7", "date": "20"},
  ];

  // Dữ liệu giờ (Morning & Afternoon)
  final List<String> morningSlots = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
  final List<String> afternoonSlots = ["1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM"];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Đặt lịch hẹn", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. CHỌN DỊCH VỤ
            const Text("Chọn dịch vụ", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            _buildServiceDropdown(),

            const SizedBox(height: 25),
            const Text("Tháng 12, 2025", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),

            // 2. CHỌN NGÀY (Ngang)
            SizedBox(
              height: 80,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: dates.length,
                itemBuilder: (context, index) {
                  bool isSelected = selectedDateIndex == index;
                  return GestureDetector(
                    onTap: () => setState(() => selectedDateIndex = index),
                    child: Container(
                      width: 65,
                      margin: const EdgeInsets.only(right: 12),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF00B4D8) : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isSelected ? const Color(0xFF00B4D8) : Colors.transparent, width: 2),
                        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4)],
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(dates[index]['day']!, style: TextStyle(color: isSelected ? Colors.white70 : Colors.grey, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 5),
                          Text(dates[index]['date']!, style: TextStyle(color: isSelected ? Colors.white : Colors.black, fontSize: 16, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 25),

            // 3. CHỌN GIỜ (Morning)
            const Text("Buổi sáng", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            _buildTimeGrid(morningSlots),

            const SizedBox(height: 25),

            // 4. CHỌN GIỜ (Afternoon)
            const Text("Buổi chiều", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            _buildTimeGrid(afternoonSlots),

            const SizedBox(height: 100), // Khoảng trống cho nút confirm
          ],
        ),
      ),
      bottomSheet: _buildConfirmButton(),
    );
  }

  Widget _buildServiceDropdown() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 15),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: selectedService,
          hint: const Text("Chọn dịch vụ khám"),
          isExpanded: true,
          items: services.map((s) {
            return DropdownMenuItem(
              value: s['name'],
              child: Text("${s['name']} (${s['price']})"),
            );
          }).toList(),
          onChanged: (val) => setState(() => selectedService = val),
        ),
      ),
    );
  }

  Widget _buildTimeGrid(List<String> slots) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 2.2,
      ),
      itemCount: slots.length,
      itemBuilder: (context, index) {
        String time = slots[index];
        bool isSelected = selectedTime == time;
        // Giả lập một số khung giờ đã bị đặt (màu xám nhạt)
        bool isBooked = time == "8:30 AM" || time == "11:30 AM" || time == "3:00 PM";

        return GestureDetector(
          onTap: isBooked ? null : () => setState(() => selectedTime = time),
          child: Container(
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF00B4D8) : Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: isSelected ? const Color(0xFF00B4D8) : Colors.transparent, width: 2),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 4)],
            ),
            child: Text(
              time,
              style: TextStyle(
                color: isBooked ? Colors.grey[300] : (isSelected ? Colors.white : Colors.black87),
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildConfirmButton() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
      decoration: const BoxDecoration(color: Colors.white),
      child: ElevatedButton(
        onPressed: (selectedService == null) ? null : () {
          // Chuyển sang màn hình Chọn hồ sơ bệnh nhân và truyền dữ liệu đặt lịch
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => SelectProfileScreen(
                bookingData: {
                  'doctor': widget.doctor,
                  'service': selectedService,
                  'date': dates[selectedDateIndex],
                  'time': selectedTime,
                },
              ),
            ),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF00B4D8), // Màu xanh cyan chủ đạo
          minimumSize: const Size(double.infinity, 55),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        ),
        child: const Text("Xác nhận", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      ),
    );
  }
}